/**
 * ============================================================================
 * TEACHER PORTAL — FIREBASE ISOLATED INSTANCE
 * Menggunakan instance Firebase App TERPISAH ("teacher-portal") agar
 * sesi autentikasi guru tidak bercampur dengan sesi mahasiswa.
 * ============================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Konfigurasi Firebase (sama dengan project utama)
const firebaseConfig = {
  apiKey: "AIzaSyD3ba7C81VKDCvXdnkXDWMFPvPLmA8gba0",
  authDomain: "mediabelajar-cad02.firebaseapp.com",
  projectId: "mediabelajar-cad02",
  storageBucket: "mediabelajar-cad02.firebasestorage.app",
  messagingSenderId: "164207909564",
  appId: "1:164207909564:web:42eeb640474dbd475a0eb9"
};

// ── Instance TERPISAH untuk portal guru ───────────────────────────────────
// Nama "teacher-portal" membuat auth state guru independen dari portal mahasiswa.
// Ini mencegah login mahasiswa di tab lain mempengaruhi sesi guru.
const teacherApp = initializeApp(firebaseConfig, "teacher-portal");
const auth = getAuth(teacherApp);
const db = getFirestore(teacherApp);

// Konversi kode error Firebase ke pesan Indonesia
function mapError(code, fallback = "Terjadi kesalahan. Silakan coba lagi.") {
  const map = {
    "auth/invalid-credential": "Email atau kata sandi yang Anda masukkan salah.",
    "auth/user-not-found": "Email atau kata sandi yang Anda masukkan salah.",
    "auth/wrong-password": "Email atau kata sandi yang Anda masukkan salah.",
    "auth/invalid-email": "Format alamat email tidak valid.",
    "auth/user-disabled": "Akun ini telah dinonaktifkan oleh administrator.",
    "auth/too-many-requests": "Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat.",
    "auth/network-request-failed": "Koneksi internet bermasalah. Periksa jaringan Anda."
  };
  return map[code] || fallback;
}

const TeacherFirebase = {
  auth,
  db,

  // Tunggu hingga status auth awal diketahui
  async waitForAuthReady() {
    return new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        unsub();
        resolve(user);
      });
    });
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  // Ambil profil guru (hanya jika role === 'teacher')
  async getTeacherProfile() {
    const user = auth.currentUser;
    if (!user) return null;
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().role === "teacher") {
        return { id: user.uid, ...snap.data() };
      }
    } catch (e) {
      console.warn("[TeacherFirebase] getTeacherProfile error:", e);
    }
    return null;
  },

  // Login guru — hanya izinkan akun dengan role 'teacher'
  async loginTeacher(email, password) {
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const snap = await getDoc(doc(db, "users", credential.user.uid));
      if (!snap.exists() || snap.data().role !== "teacher") {
        await signOut(auth);
        return {
          success: false,
          message: "Akun ini tidak memiliki akses guru. Pastikan role 'teacher' sudah diset di Firestore untuk UID: " + credential.user.uid
        };
      }
      console.log("[TeacherFirebase] Login guru berhasil. UID:", credential.user.uid);
      return {
        success: true,
        user: {
          id: credential.user.uid,
          name: snap.data().name || "Guru",
          email: credential.user.email,
          role: "teacher"
        }
      };
    } catch (error) {
      console.error("[TeacherFirebase] Login error:", error);
      return { success: false, message: mapError(error.code, "Tidak dapat masuk ke portal guru.") };
    }
  },

  // Verifikasi role guru langsung dari server (hindari cache)
  async verifyTeacherRole() {
    const user = auth.currentUser;
    if (!user) throw new Error("Tidak ada sesi login aktif. Silakan login ulang.");
    const snap = await getDocFromServer(doc(db, "users", user.uid));
    if (!snap.exists()) throw new Error(`Dokumen profil tidak ditemukan untuk UID: ${user.uid}`);
    const role = snap.data().role;
    console.log(`[TeacherFirebase] verifyTeacherRole — UID: ${user.uid}, role: '${role}'`);
    if (role !== "teacher") {
      throw new Error(`Role akun adalah '${role}', bukan 'teacher'. Pastikan field role di dokumen users/${user.uid} bernilai 'teacher' di Firestore Console.`);
    }
    return true;
  },

  // Data dashboard guru
  async getTeacherDashboardData() {
    const usersSnapshot = await getDocs(query(collection(db, "users"), where("role", "==", "student"), limit(500)));
    const students = usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const eventSnapshot = await getDocs(query(collection(db, "activity_events"), orderBy("timestamp", "desc"), limit(500)));
    const events = eventSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const scoreSnapshot = await getDocs(query(collection(db, "quiz_results"), orderBy("timestamp", "desc"), limit(500)));
    const quizResults = scoreSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return { students, events, quizResults };
  },

  // Override materi pembelajaran
  async getMaterialOverrides() {
    const snapshot = await getDocs(collection(db, "material_overrides"));
    return Object.fromEntries(snapshot.docs.map(d => [d.id, d.data()]));
  },

  async saveMaterialOverride(materialId, materialData) {
    await this.verifyTeacherRole();
    await setDoc(doc(db, "material_overrides", materialId), {
      ...materialData,
      materialId,
      updatedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return { success: true };
  },

  // Override soal kuis
  async getQuizOverrides() {
    const snapshot = await getDocs(collection(db, "quiz_overrides"));
    return Object.fromEntries(snapshot.docs.map(d => [d.id, d.data()]));
  },

  async saveQuizOverride(materialId, questions) {
    await this.verifyTeacherRole();
    await setDoc(doc(db, "quiz_overrides", materialId), {
      materialId,
      questions,
      updatedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return { success: true };
  },

  async logout() {
    await signOut(auth);
  }
};

export default TeacherFirebase;
