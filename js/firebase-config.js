/**
 * ============================================================================
 * FIREBASE CONFIGURATION & SERVICE LAYER
 * Menginisialisasi Firebase Web SDK (Modular):
 * - Firebase Authentication (Siswa)
 * - Cloud Firestore (Profil, Hasil Kuis, Log Aktivitas)
 * - Firebase Analytics
 * ============================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Konfigurasi resmi Firebase Project mediabelajar-cad02
const firebaseConfig = {
  apiKey: "AIzaSyD3ba7C81VKDCvXdnkXDWMFPvPLmA8gba0",
  authDomain: "mediabelajar-cad02.firebaseapp.com",
  projectId: "mediabelajar-cad02",
  storageBucket: "mediabelajar-cad02.firebasestorage.app",
  messagingSenderId: "164207909564",
  appId: "1:164207909564:web:42eeb640474dbd475a0eb9",
  measurementId: "G-6MV08HETTC"
};

// Inisialisasi Firebase App, Auth, dan Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics bersifat opsional. Muat setelah Auth siap agar kegagalan Analytics,
// misalnya karena pemblokir iklan atau jaringan, tidak menghentikan login.
let analytics = null;
async function initializeAnalytics() {
  try {
    const { getAnalytics, isSupported } = await import(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js"
    );
    if (await isSupported()) {
      analytics = getAnalytics(app);
      console.info("Firebase Analytics aktif.");
    }
  } catch (error) {
    console.info("Firebase Analytics tidak tersedia; autentikasi tetap aktif.", error);
  }
}

/**
 * Konversi error Firebase ke bahasa Indonesia yang ramah pengguna
 */
export function mapFirebaseError(code, defaultMessage = "Terjadi kesalahan. Silakan coba lagi.") {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email atau kata sandi yang Anda masukkan salah.";
    case "auth/email-already-in-use":
      return "Email ini sudah terdaftar. Silakan gunakan email lain atau login.";
    case "auth/weak-password":
      return "Kata sandi terlalu lemah. Gunakan minimal 6 karakter kombinasi.";
    case "auth/invalid-email":
      return "Format alamat email tidak valid.";
    case "auth/user-disabled":
      return "Akun pengguna ini telah dinonaktifkan oleh administrator.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat lagi.";
    case "auth/network-request-failed":
      return "Koneksi internet bermasalah. Periksa jaringan Anda dan coba lagi.";
    case "auth/operation-not-allowed":
      return "Metode autentikasi Email/Password belum diaktifkan di Firebase Console.";
    default:
      return defaultMessage || "Terjadi kesalahan autentikasi.";
  }
}

// Menunggu status auth awal
let resolveAuthReady;
const authReadyPromise = new Promise((resolve) => {
  resolveAuthReady = resolve;
});

let initialCheckDone = false;

onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    try {
      // Ambil profil dari Firestore jika ada
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);
      const profile = userSnap.exists() ? userSnap.data() : {};

      const existing = window.StorageService?.getCurrentUser() || {};
      const isSameAccount = existing.id === firebaseUser.uid;
      const role = profile.role || (isSameAccount ? existing.role : "student");

      const hasStudentSession = window.StorageService?.hasStudentSession(firebaseUser.uid);
      const isStudentProfile = profile.role === "student";
      if (window.StorageService && role === "student" && (hasStudentSession || isStudentProfile)) {
        window.StorageService.setCurrentUser({
          id: firebaseUser.uid,
          name: profile.name || firebaseUser.displayName || (isSameAccount ? existing.name : "") || (firebaseUser.email ? firebaseUser.email.split("@")[0] : "Pengguna"),
          email: firebaseUser.email,
          role,
          profilePhoto: profile.profilePhoto || firebaseUser.photoURL || (isSameAccount ? existing.profilePhoto : "") || ""
        });
      } else if (window.StorageService) {
        // Hanya sesi yang dimulai dari form mahasiswa yang dipulihkan di portal mahasiswa.
        window.StorageService.setCurrentUser(null);
      }
    } catch (e) {
      console.warn("Gagal membaca profil Firestore saat auth state change:", e);
      const existing = window.StorageService?.getCurrentUser();
      if (window.StorageService && existing && existing.id !== firebaseUser.uid) {
        window.StorageService.setCurrentUser(null);
      }
    }
  } else if (window.StorageService) {
    window.StorageService.setCurrentUser(null);
  }

  if (!initialCheckDone) {
    initialCheckDone = true;
    if (resolveAuthReady) resolveAuthReady(firebaseUser);
  }
});

const FirebaseAuthService = {
  app,
  auth,
  db,
  get analytics() {
    return analytics;
  },

  async waitForAuthReady() {
    return authReadyPromise;
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  async getTeacherProfile() {
    const user = auth.currentUser;
    if (!user) return null;
    const profile = await getDoc(doc(db, "users", user.uid));
    return profile.exists() && profile.data().role === "teacher" ? { id: user.uid, ...profile.data() } : null;
  },

  /**
   * Verifikasi apakah akun saat ini benar-benar punya role 'teacher' di Firestore.
   * Menggunakan getDocFromServer() agar selalu baca data TERBARU dari server,
   * tidak terpengaruh cache lokal Firestore yang bisa mengembalikan role lama.
   */
  async verifyTeacherRole() {
    const user = auth.currentUser;
    if (!user) throw new Error("Tidak ada sesi login aktif. Silakan login ulang.");
    // Paksa baca dari server (bukan cache) agar role selalu akurat
    const snap = await getDocFromServer(doc(db, "users", user.uid));
    if (!snap.exists()) throw new Error(`Dokumen profil untuk UID ${user.uid} tidak ditemukan di Firestore.`);
    const role = snap.data().role;
    console.log(`[verifyTeacherRole] UID: ${user.uid}, role dari server: '${role}'`);
    if (role !== "teacher") throw new Error(`Role akun adalah '${role}', bukan 'teacher'. Pastikan field role di dokumen users/${user.uid} bernilai 'teacher' di Firestore Console.`);
    return true;
  },

  async loginTeacher(email, password) {
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const profile = await getDoc(doc(db, "users", credential.user.uid));
      if (!profile.exists() || profile.data().role !== "teacher") {
        await signOut(auth);
        return { success: false, message: "Akun ini tidak memiliki akses guru. Pastikan role di Firestore diset ke 'teacher'." };
      }
      return { success: true, user: { id: credential.user.uid, name: profile.data().name || "Guru", email: credential.user.email, role: "teacher" } };
    } catch (error) {
      return { success: false, message: mapFirebaseError(error.code, "Tidak dapat masuk ke portal guru.") };
    }
  },

  async getTeacherDashboardData() {
    const usersSnapshot = await getDocs(query(collection(db, "users"), where("role", "==", "student"), limit(500)));
    const students = usersSnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    const eventSnapshot = await getDocs(query(collection(db, "activity_events"), orderBy("timestamp", "desc"), limit(500)));
    const events = eventSnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    const scoreSnapshot = await getDocs(query(collection(db, "quiz_results"), orderBy("timestamp", "desc"), limit(500)));
    const quizResults = scoreSnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    return { students, events, quizResults };
  },

  async getMaterialOverrides() {
    const snapshot = await getDocs(collection(db, "material_overrides"));
    return Object.fromEntries(snapshot.docs.map(item => [item.id, item.data()]));
  },

  async saveMaterialOverride(materialId, materialData) {
    // Verifikasi role sebelum menulis agar error lebih jelas
    await this.verifyTeacherRole();
    await setDoc(doc(db, "material_overrides", materialId), {
      ...materialData,
      materialId,
      updatedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return { success: true };
  },

  async getQuizOverrides() {
    const snapshot = await getDocs(collection(db, "quiz_overrides"));
    return Object.fromEntries(snapshot.docs.map(item => [item.id, item.data()]));
  },

  async saveQuizOverride(materialId, questions) {
    // Verifikasi role sebelum menulis agar error lebih jelas
    await this.verifyTeacherRole();
    await setDoc(doc(db, "quiz_overrides", materialId), {
      materialId,
      questions,
      updatedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return { success: true };
  },

  /**
   * Login Siswa dengan Email & Password
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Ambil data profil dari Firestore
      let userRole = "student";
      let userName = user.displayName || email.split("@")[0];
      let profilePhoto = user.photoURL || "";

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          userRole = data.role || "student";
          if (data.name) userName = data.name;
          if (data.profilePhoto) profilePhoto = data.profilePhoto;
          // Perbarui waktu login terakhir
          await updateDoc(userDocRef, { lastLogin: new Date().toISOString() });
        } else {
          // Jika belum ada di Firestore, buatkan dokumen profil
          await setDoc(userDocRef, {
            id: user.uid,
            name: userName,
            email: user.email,
            role: "student",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn("Sinkronisasi Firestore profil saat login:", err);
      }

      if (userRole !== "student") {
        await signOut(auth);
        if (window.StorageService) window.StorageService.setCurrentUser(null);
        return {
          success: false,
          code: "auth/unauthorized-role",
          message: "Akun ini tidak memiliki akses ke portal mahasiswa."
        };
      }

      const userData = {
        id: user.uid,
        name: userName,
        email: user.email,
        role: userRole,
        profilePhoto
      };

      if (window.StorageService) {
        window.StorageService.setCurrentUser(userData);
      }

      // Catat log aktivitas login siswa
      this.recordEvent("login", "").catch(() => {});

      return {
        success: true,
        user: userData,
        message: "Login berhasil!"
      };
    } catch (error) {
      console.error("Firebase Auth Login Error:", error);
      return {
        success: false,
        code: error.code,
        message: mapFirebaseError(error.code)
      };
    }
  },

  /**
   * Registrasi Siswa Baru
   */
  async register(name, email, password) {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      try {
        await updateProfile(user, { displayName: name });
      } catch (profileError) {
        console.warn("Gagal update displayName Firebase:", profileError);
      }

      const userData = {
        id: user.uid,
        name,
        email: cleanEmail,
        role: "student",
        profilePhoto: ""
      };

      // Simpan dokumen profil ke Firestore
      try {
        const now = new Date().toISOString();
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          name,
          email: cleanEmail,
          role: "student",
          createdAt: now,
          lastLogin: now
        });
      } catch (firestoreErr) {
        console.warn("Gagal membuat user doc Firestore:", firestoreErr);
      }

      if (window.StorageService) {
        window.StorageService.setCurrentUser(userData);
      }

      // Catat log aktivitas registrasi
      this.recordEvent("register", "").catch(() => {});

      return {
        success: true,
        user: userData,
        message: "Akun berhasil dibuat!"
      };
    } catch (error) {
      console.error("Firebase Auth Register Error:", error);
      return {
        success: false,
        code: error.code,
        message: mapFirebaseError(error.code)
      };
    }
  },

  /**
   * Logout dari Firebase
   */
  async logout() {
    try {
      await signOut(auth);
      if (window.StorageService) {
        window.StorageService.setCurrentUser(null);
      }
      return { success: true };
    } catch (error) {
      console.error("Firebase Logout Error:", error);
      if (window.StorageService) {
        window.StorageService.setCurrentUser(null);
      }
      return { success: false, message: error.message };
    }
  },

  /**
   * Kirim Email Reset Kata Sandi
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        success: true,
        message: `Tautan reset kata sandi telah dikirim ke ${email}. Silakan periksa kotak masuk atau spam email Anda.`
      };
    } catch (error) {
      console.error("Firebase Reset Password Error:", error);
      return {
        success: false,
        code: error.code,
        message: mapFirebaseError(error.code)
      };
    }
  },

  /**
   * Catat Event Aktivitas Siswa ke Firestore (activity_events)
   */
  async recordEvent(type, materialId = "") {
    try {
      const user = auth.currentUser;
      const cached = window.StorageService?.getCurrentUser() || {};
      const payload = {
        userId: user ? user.uid : (cached.id || "guest"),
        userName: (user && user.displayName) || cached.name || "Siswa",
        userEmail: (user && user.email) || cached.email || "guest@belajar.id",
        eventType: type,
        materialId: materialId || "",
        occurredAt: new Date().toISOString(),
        timestamp: serverTimestamp()
      };
      await addDoc(collection(db, "activity_events"), payload);
    } catch (err) {
      console.warn("Gagal menyimpan aktivitas ke Firestore:", err.message);
    }
  },

  /**
   * Simpan Hasil Kuis Siswa ke Firestore (quiz_results)
   */
  async saveQuizResult(quizData) {
    try {
      const user = auth.currentUser;
      const cached = window.StorageService?.getCurrentUser() || {};
      const payload = {
        userId: user ? user.uid : (cached.id || "guest"),
        userName: (user && user.displayName) || cached.name || "Siswa",
        userEmail: (user && user.email) || cached.email || "guest@belajar.id",
        materialId: quizData.materialId || "",
        materialTitle: quizData.materialTitle || "",
        score: Number(quizData.score || 0),
        correctCount: Number(quizData.correctCount || 0),
        incorrectCount: Number(quizData.incorrectCount || 0),
        totalQuestions: Number(quizData.totalQuestions || 0),
        percentage: Number(String(quizData.percentage || 0).replace("%", "")) || 0,
        statusText: quizData.statusText || "",
        statusClass: quizData.statusClass || "",
        durationSeconds: Number(quizData.durationSeconds || 0),
        answers: Array.isArray(quizData.answers) ? quizData.answers : [],
        occurredAt: quizData.occurredAt || new Date().toISOString(),
        timestamp: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, "quiz_results"), payload);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.warn("Gagal menyimpan hasil kuis ke Firestore:", err.message);
      return { success: false, error: err.message };
    }
  }
};

window.FirebaseAuthService = FirebaseAuthService;
window.dispatchEvent(new Event("arvia:firebase-ready"));
initializeAnalytics();
export default FirebaseAuthService;
