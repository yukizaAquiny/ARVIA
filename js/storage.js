/**
 * Local storage and Firebase integration for student accounts, quiz history,
 * and learning progress.
 */

const STORAGE_KEYS = {
  CURRENT_USER: "edukreatif_current_user",
  STUDENT_SESSION_UID: "arvia_student_session_uid",
  USERS_LIST: "edukreatif_users",
  QUIZ_HISTORY: "edukreatif_quiz_history",
  LEARNING_PROGRESS: "edukreatif_learning_progress",
  LAST_ACTIVITY: "edukreatif_last_activity"
};

const StorageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS_LIST)) localStorage.setItem(STORAGE_KEYS.USERS_LIST, "[]");
    if (!localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY)) localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, "[]");
  },

  async getBrowserAccountEmail() {
    try {
      if (window.chrome?.identity?.getProfileUserInfo) {
        return await new Promise((resolve) => {
          try {
            window.chrome.identity.getProfileUserInfo((profile) => {
              const email = profile?.email ? String(profile.email).trim() : "";
              if (email) {
                localStorage.setItem("arvia_browser_profile_email", email);
              }
              resolve(email || "");
            });
          } catch (error) {
            resolve("");
          }
        });
      }
    } catch (error) {
      console.info("Chrome profile email tidak tersedia:", error);
    }

    const storedEmail = localStorage.getItem("arvia_browser_profile_email") || "";
    if (storedEmail) return storedEmail;

    const fallbackEmail = "browser-user@local-device";
    localStorage.setItem("arvia_browser_profile_email", fallbackEmail);
    return fallbackEmail;
  },

  async ensureAutoStudentSession() {
    const current = this.getCurrentUser();
    if (current && current.role === "student") {
      return current;
    }

    const browserEmail = (await this.getBrowserAccountEmail()) || "browser-user@local-device";
    const user = {
      id: `browser-${btoa(unescape(encodeURIComponent(browserEmail))).replace(/[^a-zA-Z0-9]/g, "").slice(0, 24) || "browser-user"}`,
      name: browserEmail.split("@")[0] || "Pengguna Browser",
      email: browserEmail,
      role: "student",
      profilePhoto: ""
    };

    this.setCurrentUser(user);
    return user;
  },

  getRegisteredUsers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS_LIST) || "[]"); }
    catch (error) { console.error("Gagal membaca daftar pengguna lokal:", error); return []; }
  },

  getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || "null"); }
    catch (error) { console.error("Gagal membaca sesi pengguna:", error); return null; }
  },

  hasStudentSession(userId) {
    return Boolean(userId) && localStorage.getItem(STORAGE_KEYS.STUDENT_SESSION_UID) === userId;
  },

  async waitForAuthService() {
    if (window.FirebaseAuthService) return window.FirebaseAuthService;
    if (window.FirebaseAuthLoadError) return null;

    await new Promise(resolve => {
      const finish = () => {
        clearTimeout(timeoutId);
        window.removeEventListener("arvia:firebase-ready", finish);
        window.removeEventListener("arvia:firebase-load-error", finish);
        resolve();
      };
      const timeoutId = window.setTimeout(finish, 15000);
      window.addEventListener("arvia:firebase-ready", finish, { once: true });
      window.addEventListener("arvia:firebase-load-error", finish, { once: true });
    });

    return window.FirebaseAuthService || null;
  },

  getAuthUnavailableMessage() {
    return window.FirebaseAuthLoadError || "Firebase belum termuat. Periksa koneksi internet dan buka halaman melalui alamat HTTP/HTTPS, bukan file lokal.";
  },

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_SESSION_UID);
      return;
    }
    const role = user.role || "student";
    if (role !== "student") {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_SESSION_UID);
      return;
    }
    const saved = this.getRegisteredUsers().find(item => item.email === user.email);
    const safeUser = {
      id: user.id || user.uid,
      name: user.name || user.displayName || (user.email ? user.email.split("@")[0] : "Pengguna"),
      email: user.email,
      role,
      profilePhoto: user.profilePhoto || (saved && saved.profilePhoto) || ""
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    localStorage.setItem(STORAGE_KEYS.STUDENT_SESSION_UID, safeUser.id);
  },

  async restoreServerSession() {
    if (!window.FirebaseAuthService?.waitForAuthReady) return;
    await window.FirebaseAuthService.waitForAuthReady();
    const fbUser = window.FirebaseAuthService.getCurrentUser();
    if (!fbUser) { this.setCurrentUser(null); return; }
    const cached = this.getCurrentUser();
    if (!cached || cached.id !== fbUser.uid || cached.role !== "student" || !this.hasStudentSession(fbUser.uid)) {
      this.setCurrentUser(null);
      return;
    }
    this.setCurrentUser({
      id: fbUser.uid,
      name: fbUser.displayName || cached.name || (fbUser.email ? fbUser.email.split("@")[0] : "Pengguna"),
      email: fbUser.email,
      role: "student",
      profilePhoto: fbUser.photoURL || cached.profilePhoto || ""
    });
  },

  async syncMaterialOverrides() {
    try {
      const service = window.FirebaseAuthService;
      if (!service) return;

      const materials = window.LEARNING_MATERIALS || [];

      // 1. Sync Material Overrides (Judul, deskripsi, video, ebook)
      if (typeof service.getMaterialOverrides === "function") {
        const overrides = await service.getMaterialOverrides();
        Object.entries(overrides || {}).forEach(([id, patch]) => {
          const material = materials.find(item => item.id === id);
          if (!material || !patch) return;
          ["title", "shortDesc", "tag"].forEach(key => {
            if (typeof patch[key] === "string" && patch[key].trim()) material[key] = patch[key];
          });
          ["video", "book"].forEach(key => {
            if (patch[key] && typeof patch[key] === "object") material[key] = { ...material[key], ...patch[key] };
          });
          if (Array.isArray(patch.quiz) && patch.quiz.length > 0) material.quiz = patch.quiz;
        });
      }

      // 2. Sync Quiz Overrides (Kuis yang diubah/ditambah guru dari tab kuis)
      if (typeof service.getQuizOverrides === "function") {
        const quizOverrides = await service.getQuizOverrides();
        Object.entries(quizOverrides || {}).forEach(([id, patch]) => {
          const material = materials.find(item => item.id === id);
          if (!material || !patch || !Array.isArray(patch.questions)) return;
          material.quiz = patch.questions.map((q, idx) => ({
            id: q.id ?? (idx + 1),
            question: q.question || "",
            options: {
              A: q.optionA ?? q.options?.A ?? "",
              B: q.optionB ?? q.options?.B ?? "",
              C: q.optionC ?? q.options?.C ?? "",
              D: q.optionD ?? q.options?.D ?? ""
            },
            correctAnswer: q.correctAnswer || "A",
            explanation: q.explanation || ""
          }));
        });
      }
    } catch (error) {
      console.info("Pembaruan materi/kuis tersimpan tidak dapat dimuat saat ini:", error?.message);
    }
  },

  async login(email, password) {
    const authService = await this.waitForAuthService();
    if (!authService) return { success: false, message: this.getAuthUnavailableMessage() };
    return authService.login(email, password);
  },

  async register(name, email, password) {
    const authService = await this.waitForAuthService();
    if (!authService) return { success: false, message: this.getAuthUnavailableMessage() };
    return authService.register(name, email, password);
  },

  async logout() {
    if (!window.FirebaseAuthService) { this.setCurrentUser(null); return { success: true }; }
    return window.FirebaseAuthService.logout();
  },

  async resetPassword(email) {
    const authService = await this.waitForAuthService();
    if (!authService) return { success: false, message: this.getAuthUnavailableMessage() };
    return authService.resetPassword(email);
  },

  recordServerEvent(type, materialId = "") {
    window.FirebaseAuthService?.recordEvent?.(type, materialId).catch(() => {});
  },

  saveQuizHistory(result) {
    const history = this.getUserQuizHistory();
    history.unshift({ ...result, email: this.getCurrentUser()?.email || "" });
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history.slice(0, 500)));
    window.FirebaseAuthService?.saveQuizResult?.(result).catch(() => {});
  },

  getUserQuizHistory(email) {
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY) || "[]");
      const targetEmail = email || this.getCurrentUser()?.email;
      return targetEmail ? history.filter(item => !item.email || item.email === targetEmail) : history;
    } catch (error) { console.error("Gagal membaca riwayat kuis:", error); return []; }
  },

  getUserLearningProgress() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEARNING_PROGRESS) || "{}");
      const userId = this.getCurrentUser()?.id;
      return userId ? (data[userId] || {}) : {};
    } catch (error) { console.error("Gagal membaca progres belajar:", error); return {}; }
  },

  markLearningActivity(materialId, activity) {
    const userId = this.getCurrentUser()?.id;
    if (!userId || !materialId || !activity) return;
    let data = {};
    try { data = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEARNING_PROGRESS) || "{}"); } catch {}
    data[userId] ||= {};
    data[userId][materialId] ||= [];
    if (!data[userId][materialId].includes(activity)) data[userId][materialId].push(activity);
    localStorage.setItem(STORAGE_KEYS.LEARNING_PROGRESS, JSON.stringify(data));
    this.setLastActivity({ materialId, activity, timestamp: Date.now() });
  },

  setLastActivity(activity) {
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, JSON.stringify(activity));
  },

  getLastActivity() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || "null"); }
    catch { return null; }
  },

  updateProfilePhoto(profilePhoto) {
    const current = this.getCurrentUser();
    if (!current) return false;
    current.profilePhoto = profilePhoto;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(current));
    const users = this.getRegisteredUsers();
    const index = users.findIndex(user => user.id === current.id || user.email === current.email);
    if (index >= 0) { users[index].profilePhoto = profilePhoto; localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users)); }
    return true;
  }
};

window.StorageService = StorageService;
StorageService.init();
