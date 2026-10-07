/**
 * ============================================================================
 * SISTEM NAVIGASI & ROUTING (VIEW MANAGER)
 * Mengatur pergantian halaman secara mulus (SPA), pelacakan riwayat (history),
 * dan tombol "Kembali" di pojok kanan bawah.
 * Tidak ada auth guard — semua halaman dapat diakses bebas.
 * ============================================================================
 */

const syncStudentHeader = () => {
  document.getElementById("site-header")?.classList.toggle("is-scrolled", window.scrollY > 32);
};

window.addEventListener("scroll", syncStudentHeader, { passive: true });
syncStudentHeader();

const AppRouter = {
  currentView: "home",
  previousView: null,
  historyStack: [],
  activeMaterialId: "materi-1", // Default materi terpilih

  /**
   * Pindah ke view tertentu
   * @param {string} viewId - ID tampilan target ('home', 'method', 'video', 'book', 'quiz', 'score', 'profile')
   * @param {object} options - Opsi tambahan { materialId, replace, fromBack }
   */
  navigateTo(viewId, options = {}) {
    const { materialId, replace = false, fromBack = false } = options;

    // Simpan materi yang sedang aktif jika ada
    if (materialId) {
      this.activeMaterialId = materialId;
    }

    // Rekam aktivitas jika FirebaseAuthService tersedia
    const currentUser = window.StorageService?.getCurrentUser();
    if (currentUser && window.StorageService && typeof window.StorageService.recordServerEvent === "function") {
      window.StorageService.recordServerEvent(`access:${viewId}`, materialId || this.activeMaterialId);
    }

    // Kelola riwayat (History Stack) untuk tombol "Kembali"
    if (!fromBack && !replace && this.currentView && this.currentView !== viewId) {
      const learningViews = ["home", "method", "video", "book", "quiz", "score", "profile"];
      if (learningViews.includes(this.currentView)) {
        this.historyStack.push({
          viewId: this.currentView,
          materialId: this.activeMaterialId
        });
      }
    }

    this.previousView = this.currentView;
    this.currentView = viewId;

    // Perbarui hash di URL agar ramah browser (dukung bookmark)
    window.location.hash = `#${viewId}`;

    // Jalankan perenderan tampilan
    this.renderView(viewId, options);

    // Scroll otomatis ke bagian paling atas halaman setiap ganti view
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  /**
   * Fungsi untuk tombol "Kembali" di kanan bawah
   */
  goBack() {
    if (this.historyStack.length > 0) {
      const prev = this.historyStack.pop();
      this.navigateTo(prev.viewId, {
        materialId: prev.materialId,
        fromBack: true
      });
    } else {
      this.navigateTo(window.StorageService?.getCurrentUser() ? "home" : "login", { fromBack: true });
    }
  },

  /**
   * Menampilkan elemen view yang sesuai dan menyembunyikan yang lainnya
   */
  renderView(viewId, options = {}) {
    // Kelola audio kuis: matikan jika meninggalkan halaman kuis
    if (viewId !== "quiz" && window.QuizAudioManager) {
      window.QuizAudioManager.stop();
    }

    const signedIn = Boolean(window.StorageService?.getCurrentUser());
    if (["home", "method", "video", "book", "quiz", "score", "profile"].includes(viewId) && !signedIn) {
      viewId = "login";
      options = { replace: true };
    }

    // 1. Sembunyikan semua section view
    const allViews = document.querySelectorAll(".view-section");
    allViews.forEach(sec => sec.classList.remove("active"));

    // 2. Tampilkan view yang aktif
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
      targetSection.classList.add("active");
    } else {
      console.warn(`Section view-${viewId} tidak ditemukan!`);
    }

    // 3. Header siswa hanya tampil setelah login.
    const headerEl = document.getElementById("site-header");
    if (headerEl) {
      headerEl.classList.toggle("hidden", ["login", "register"].includes(viewId));
      this.updateHeaderActiveState(viewId);
    }

    const user = window.StorageService?.getCurrentUser();
    const nameEl = document.getElementById("header-user-name-text");
    const avatarEl = document.getElementById("header-user-avatar-initial");
    if (nameEl) nameEl.textContent = user?.name || "Pengguna";
    if (avatarEl) avatarEl.textContent = user?.name?.charAt(0)?.toUpperCase() || "U";

    // 4. Kelola Tombol "Kembali" di Pojok Kanan Bawah
    const backBtnContainer = document.getElementById("global-back-button-container");
    const viewsWithBackButton = ["method", "video", "book", "quiz"];

    if (backBtnContainer) {
      if (viewsWithBackButton.includes(viewId)) {
        backBtnContainer.style.display = "block";
      } else {
        backBtnContainer.style.display = "none";
      }
    }

    // 5. Trigger update data spesifik halaman yang bersangkutan
    if (window.App && typeof window.App.onViewChanged === "function") {
      window.App.onViewChanged(viewId, this.activeMaterialId, options);
    }
  },

  /**
   * Update indikator menu navigasi (Home vs Profil)
   */
  updateHeaderActiveState(viewId) {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => link.classList.remove("active"));

    if (["home", "method", "video", "book", "quiz", "score"].includes(viewId)) {
      const homeLink = document.getElementById("nav-link-home");
      if (homeLink) homeLink.classList.add("active");
    } else if (viewId === "profile") {
      const profileLink = document.getElementById("nav-link-profile");
      if (profileLink) profileLink.classList.add("active");
    }
  }
};

window.AppRouter = AppRouter;
