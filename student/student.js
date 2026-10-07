/**
 * ============================================================================
 * MAIN APPLICATION CONTROLLER
 * Menghubungkan seluruh modul UI, event listener, rendering dinamis setiap halaman,
 * serta notifikasi toast.
 * Menangani autentikasi siswa, navigasi, dan tampilan pembelajaran.
 * ============================================================================
 */

const App = {
  /**
   * Inisialisasi awal saat dokumen selesai dimuat
   */
  async init() {
    // Tunggu Firebase agar sesi siswa dapat dipulihkan.
    if (!window.FirebaseAuthService && !window.FirebaseAuthLoadError) {
      await new Promise(resolve => {
        const finish = () => {
          clearTimeout(timeoutId);
          window.removeEventListener("arvia:firebase-ready", finish);
          window.removeEventListener("arvia:firebase-load-error", finish);
          resolve();
        };
        const timeoutId = window.setTimeout(finish, 8000);
        window.addEventListener("arvia:firebase-ready", finish, { once: true });
        window.addEventListener("arvia:firebase-load-error", finish, { once: true });
      });
    }

    await window.StorageService.restoreServerSession();
    await window.StorageService.syncMaterialOverrides();

    this.bindAuthForms();
    this.bindGlobalNavigation();
    this.setupInitialRoute();
  },

  /**
   * Menentukan halaman awal berdasarkan status login dan URL hash
   */
  setupInitialRoute() {
    const hash = window.location.hash.replace("#", "");
    const user = window.StorageService.getCurrentUser();
    const validViews = ["home", "method", "video", "book", "quiz", "score", "profile"];
    if (!user) {
      window.AppRouter.navigateTo(hash === "register" ? "register" : "login", { replace: true });
    } else if (hash && validViews.includes(hash)) {
      window.AppRouter.navigateTo(hash);
    } else {
      window.AppRouter.navigateTo("home");
    }
  },

  bindAuthForms() {
    const showError = (id, message) => {
      const el = document.getElementById(id);
      if (el) el.textContent = message || "";
    };
    const loginForm = document.getElementById("form-login");
    loginForm?.addEventListener("submit", async event => {
      event.preventDefault();
      const button = document.getElementById("btn-login-submit");
      button.disabled = true;
      const result = await window.StorageService.login(
        document.getElementById("login-email").value,
        document.getElementById("login-password").value
      );
      button.disabled = false;
      if (!result.success) {
        this.showToast("Login gagal", result.message || "Periksa email dan password Anda.", "danger");
        return;
      }
      window.AppRouter.navigateTo("home", { replace: true });
    });

    const registerForm = document.getElementById("form-register");
    registerForm?.addEventListener("submit", async event => {
      event.preventDefault();
      const name = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;
      const confirmation = document.getElementById("register-password-confirm").value;
      if (password.length < 6) return this.showToast("Password belum valid", "Gunakan minimal 6 karakter.", "warning");
      if (password !== confirmation) return this.showToast("Password tidak sama", "Ulangi password dengan benar.", "warning");
      const button = document.getElementById("btn-register-submit");
      button.disabled = true;
      const result = await window.StorageService.register(name, email, password);
      button.disabled = false;
      if (!result.success) {
        this.showToast("Pendaftaran gagal", result.message || "Periksa data akun Anda.", "danger");
        return;
      }
      window.AppRouter.navigateTo("home", { replace: true });
    });

    document.getElementById("link-to-register")?.addEventListener("click", event => {
      event.preventDefault(); window.AppRouter.navigateTo("register");
    });
    document.getElementById("link-to-login")?.addEventListener("click", event => {
      event.preventDefault(); window.AppRouter.navigateTo("login");
    });
    document.getElementById("link-forgot-password")?.addEventListener("click", async event => {
      event.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      if (!email) return this.showToast("Email diperlukan", "Isi email Anda terlebih dahulu.", "warning");
      const result = await window.StorageService.resetPassword(email);
      this.showToast(result.success ? "Email reset dikirim" : "Reset password gagal", result.message, result.success ? "success" : "danger");
    });
    document.getElementById("btn-logout")?.addEventListener("click", async () => {
      await window.StorageService.logout();
      window.AppRouter.navigateTo("login", { replace: true });
    });
    document.getElementById("user-header-profile")?.addEventListener("click", () => window.AppRouter.navigateTo("profile"));
  },

  /**
   * Event listener navigasi global (Navbar, Back Button, Mobile Menu)
   */
  bindGlobalNavigation() {
    // Tombol Kembali di Pojok Kanan Bawah
    const globalBackBtn = document.getElementById("global-btn-back");
    if (globalBackBtn) {
      globalBackBtn.addEventListener("click", () => {
        window.AppRouter.goBack();
      });
    }

    // Tombol Home di Navbar
    const navHome = document.getElementById("nav-link-home");
    if (navHome) {
      navHome.addEventListener("click", (e) => {
        e.preventDefault();
        window.AppRouter.navigateTo("home");
        this.closeMobileMenu();
      });
    }

    // Tombol Profil di Navbar
    const navProfile = document.getElementById("nav-link-profile");
    if (navProfile) {
      navProfile.addEventListener("click", (e) => {
        e.preventDefault();
        window.AppRouter.navigateTo("profile");
        this.closeMobileMenu();
      });
    }

    // Brand Link Click -> ke Home
    const brandLink = document.getElementById("header-brand-link");
    if (brandLink) {
      brandLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.AppRouter.navigateTo("home");
      });
    }

    // Mobile Hamburger Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mainNav = document.getElementById("main-nav");
    if (mobileMenuBtn && mainNav) {
      mobileMenuBtn.addEventListener("click", () => {
        mainNav.classList.toggle("open");
      });
    }

    // Tombol Berbentuk Rumah (Home) di Halaman Score
    const btnScoreHome = document.getElementById("btn-score-home");
    if (btnScoreHome) {
      btnScoreHome.addEventListener("click", () => {
        window.AppRouter.navigateTo("home");
      });
    }
  },

  closeMobileMenu() {
    const mainNav = document.getElementById("main-nav");
    if (mainNav) mainNav.classList.remove("open");
  },

  /**
   * Dipanggil otomatis oleh router setiap kali halaman berpindah
   */
  onViewChanged(viewId, activeMaterialId, options = {}) {
    const currentMaterial = window.LEARNING_MATERIALS.find(m => m.id === activeMaterialId) || window.LEARNING_MATERIALS[0];

    switch (viewId) {
      case "home":
        this.renderHomeView();
        break;
      case "method":
        this.renderMethodView(currentMaterial, options);
        break;
      case "video":
        this.renderVideoView(currentMaterial);
        break;
      case "book":
        this.renderBookView(currentMaterial, options);
        break;
      case "quiz":
        this.renderQuizView(currentMaterial);
        break;
      case "score":
        this.renderScoreView();
        break;
      case "profile":
        this.renderProfileView();
        break;
    }
  },

  /**
   * 1. Render Halaman Home
   */
  renderHomeView() {
    const user = window.StorageService.getCurrentUser();
    const greetingText = document.getElementById("home-user-greeting");
    if (greetingText) {
      greetingText.textContent = user && user.name
        ? `Selamat datang, ${user.name}!`
        : "Selamat datang!";
    }

    const last = window.StorageService.getLastActivity();
    const lastMaterial = last && window.LEARNING_MATERIALS.find(item => item.id === last.materialId);
    const continueCard = document.getElementById("continue-learning-card");
    if (continueCard) {
      if (lastMaterial) {
        const destination = last.activity === "video" || last.activity === "book" || last.activity === "quiz" ? last.activity : "method";
        continueCard.innerHTML = `<div><span class="eyebrow">Lanjutkan Belajar</span><h3>${lastMaterial.title}</h3><p>Terakhir dibuka: ${last.activity === "video" ? "Video" : last.activity === "book" ? "E-book" : "Quiz"}</p></div><button class="btn btn-primary" type="button" id="continue-learning-btn">Lanjutkan</button>`;
        continueCard.querySelector("#continue-learning-btn").onclick = () => window.AppRouter.navigateTo(destination, { materialId: lastMaterial.id });
      } else {
        continueCard.innerHTML = `<div><span class="eyebrow">Mulai dari sini</span><h3>Mulai pembelajaran pertamamu</h3></div><button class="btn btn-primary" type="button" id="continue-learning-btn">Mulai Belajar</button>`;
        continueCard.querySelector("#continue-learning-btn").onclick = () => window.AppRouter.navigateTo("method", { materialId: window.LEARNING_MATERIALS[0].id });
      }
    }

    const container = document.getElementById("materials-cards-container");
    if (!container) return;

    container.innerHTML = "";

    window.LEARNING_MATERIALS.forEach(mat => {
      const card = document.createElement("div");
      card.className = "material-card";
      card.innerHTML = `
        <div>
          <div class="material-card-header">
            <span class="material-number-badge">${mat.number}</span>
            <div class="material-icon">${mat.icon}</div>
          </div>
          <h3 class="material-title">${mat.title}</h3>
          <p class="material-desc">${mat.shortDesc}</p>
        </div>
        <div class="material-card-footer">
          <span class="material-action-text">
            Mulai Belajar
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </span>
        </div>
      `;

      card.addEventListener("click", () => {
        window.AppRouter.navigateTo("method", { materialId: mat.id });
      });
      container.appendChild(card);
    });
  },

  /**
   * 2. Render Halaman Pemilihan Metode
   */
  renderMethodView(material, options = {}) {
    const chipEl = document.getElementById("method-material-chip");
    const titleEl = document.getElementById("method-material-title");

    if (chipEl) chipEl.textContent = `${material.number} • ${material.tag}`;
    if (titleEl) titleEl.textContent = material.title;

    // Pasang click listener untuk 3 kartu metode
    const cardVideo = document.getElementById("card-method-video");
    const cardBook = document.getElementById("card-method-book");
    const cardQuiz = document.getElementById("card-method-quiz");

    if (cardVideo) {
      cardVideo.onclick = () => window.AppRouter.navigateTo("video", { materialId: material.id });
    }

    if (cardBook) {
      const openEbook = () => {
        const ebookUrl = material.book && material.book.ebookUrl;
        if (!ebookUrl) return;
        window.open(ebookUrl, "_blank", "noopener,noreferrer");
        window.StorageService.markLearningActivity(material.id, "book");
      };
      cardBook.onclick = openEbook;
      cardBook.setAttribute("role", "link");
      cardBook.setAttribute("tabindex", "0");
      cardBook.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openEbook();
        }
      };
    }

    if (cardQuiz) {
      cardQuiz.onclick = () => window.AppRouter.navigateTo("quiz", { materialId: material.id });
    }
  },

  /**
   * 3. Render Halaman Video
   */
  renderVideoView(material) {
    window.StorageService.setLastActivity({ materialId: material.id, activity: "video", timestamp: Date.now() });
    const titleEl = document.getElementById("video-material-title");
    const iframeEl = document.getElementById("video-iframe-player");
    const descEl = document.getElementById("video-desc-text");
    const keypointsEl = document.getElementById("video-keypoints-list");
    const btnNextQuiz = document.getElementById("btn-video-to-quiz");
    if (titleEl) titleEl.textContent = `${material.number}: ${material.video.title}`;
    if (iframeEl) iframeEl.src = material.video.embedUrl;
    if (descEl) descEl.textContent = material.video.description;

    if (keypointsEl) {
      keypointsEl.innerHTML = "";
      material.video.keyPoints.forEach(point => {
        const li = document.createElement("li");
        li.textContent = point;
        keypointsEl.appendChild(li);
      });
    }

    if (btnNextQuiz) {
      btnNextQuiz.onclick = () => {
        window.AppRouter.navigateTo("quiz", { materialId: material.id });
      };
    }
  },

  /**
   * 4. Render Halaman E-Book dari tautan materi
   */
  renderBookView(material) {
    window.StorageService.setLastActivity({ materialId: material.id, activity: "book", timestamp: Date.now() });
    const titleEl = document.getElementById("book-material-title");
    const badgeEl = document.getElementById("book-section-badge");
    const externalLink = document.getElementById("book-external-link");
    const btnBookToQuizTop = document.getElementById("btn-book-to-quiz-top");
    const bookContentArea = document.getElementById("book-content-area");

    if (titleEl && material.book) titleEl.textContent = material.book.title;
    if (badgeEl && material.book) badgeEl.textContent = material.book.ebookBadge || "E-Book Digital Pembelajaran";
    if (externalLink && material.book) {
      externalLink.href = material.book.ebookUrl || "#";
      externalLink.title = material.book.ebookLabel || "Buka sumber e-book di tab baru";
    }
    if (btnBookToQuizTop) {
      btnBookToQuizTop.onclick = () => window.AppRouter.navigateTo("quiz", { materialId: material.id });
    }

    if (bookContentArea && material.book) {
      const embedUrl = material.book.embedUrl || material.book.ebookUrl;
      if (embedUrl) {
        const frame = document.createElement("iframe");
        frame.className = "ebook-embedded-frame";
        frame.title = material.book.title || "E-Book Pembelajaran";
        frame.src = embedUrl;
        frame.loading = "lazy";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frame.allowFullscreen = true;
        bookContentArea.replaceChildren(frame);
      } else {
        bookContentArea.innerHTML = `<div class="ebook-open-notice"><h2>${material.book.title}</h2><p>Materi e-book belum memiliki alamat sumber.</p></div>`;
      }
    }
  },

  /**
   * 5. Render Halaman Quiz
   */
  renderQuizView(material) {
    window.StorageService.setLastActivity({ materialId: material.id, activity: "quiz", timestamp: Date.now() });
    window.QuizManager.initQuiz(material);

    const btnSubmit = document.getElementById("btn-submit-quiz");
    const btnViewScore = document.getElementById("btn-view-score");

    if (btnSubmit) {
      btnSubmit.onclick = () => window.QuizManager.submitQuiz();
    }
    if (btnViewScore) {
      btnViewScore.onclick = () => window.QuizManager.viewScore();
    }
  },

  /**
   * 6. Render Halaman Score
   */
  renderScoreView() {
    const result = window.QuizManager.lastResult;
    if (!result) {
      // Jika user langsung membuka score tanpa quiz, arahkan ke home
      window.AppRouter.navigateTo("home");
      return;
    }

    const titleEl = document.getElementById("score-material-title");
    const numEl = document.getElementById("score-number-display");
    const correctEl = document.getElementById("score-correct-display");
    const wrongEl = document.getElementById("score-wrong-display");
    const pctEl = document.getElementById("score-pct-display");

    if (titleEl) titleEl.textContent = `Hasil Kuis: ${result.materialTitle}`;
    if (numEl) numEl.textContent = result.score;
    if (correctEl) correctEl.textContent = result.correctCount;
    if (wrongEl) wrongEl.textContent = result.incorrectCount;
    if (pctEl) pctEl.textContent = result.percentage;
  },

  /**
   * 7. Render Halaman Profil & Riwayat Quiz
   */
  renderProfileView() {
    const user = window.StorageService.getCurrentUser();

    const avatarInitial = document.getElementById("profile-avatar-initial");
    const nameEl = document.getElementById("profile-user-name");
    const emailEl = document.getElementById("profile-user-email");
    const statTotalQuiz = document.getElementById("profile-stat-total-quizzes");
    const statAvgScore = document.getElementById("profile-stat-avg-score");

    if (user) {
      if (avatarInitial) {
        avatarInitial.textContent = user.profilePhoto ? "" : (user.name ? user.name.charAt(0).toUpperCase() : "U");
        avatarInitial.style.backgroundImage = user.profilePhoto ? `url("${user.profilePhoto}")` : "";
        avatarInitial.classList.toggle("has-profile-photo", Boolean(user.profilePhoto));
      }
      if (nameEl) nameEl.textContent = user.name || "Pengguna";
      if (emailEl) emailEl.textContent = user.email || "";
    }

    const photoInput = document.getElementById("profile-photo-input");
    if (photoInput) {
      photoInput.onchange = () => {
        const file = photoInput.files && photoInput.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          this.showToast("Format tidak didukung", "Pilih file gambar untuk foto profil.", "warning");
          photoInput.value = "";
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          this.showToast("Ukuran foto terlalu besar", "Pilih foto dengan ukuran maksimal 2 MB.", "warning");
          photoInput.value = "";
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          window.StorageService.updateProfilePhoto(reader.result);
          this.renderProfileView();
          this.showToast("Foto profil diperbarui", "Foto profil berhasil disimpan.", "success");
        };
        reader.readAsDataURL(file);
      };
    }

    // Ambil riwayat kuis user
    const history = window.StorageService.getUserQuizHistory(user?.email);

    // Hitung rata-rata skor
    if (statTotalQuiz) statTotalQuiz.textContent = history.length;
    if (statAvgScore) {
      if (history.length > 0) {
        const sum = history.reduce((acc, curr) => acc + curr.score, 0);
        statAvgScore.textContent = Math.round(sum / history.length);
      } else {
        statAvgScore.textContent = "0";
      }
    }

    const tableBody = document.getElementById("history-table-body");
    const emptyState = document.getElementById("empty-history-state");
    const tableWrap = document.getElementById("history-table-wrapper");

    if (!tableBody || !emptyState || !tableWrap) return;

    if (history.length === 0) {
      tableWrap.style.display = "none";
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      tableWrap.style.display = "block";
      tableBody.innerHTML = "";

      history.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${item.materialTitle}</strong></td>
          <td style="color: var(--text-secondary); font-size: 0.85rem;">${item.date}</td>
          <td><span style="font-weight: 800; font-size: 1.1rem; color: var(--primary);">${item.score}</span></td>
          <td><span class="badge badge-success">${item.correctCount}</span></td>
          <td><span class="badge badge-danger">${item.incorrectCount}</span></td>
        `;
        tableBody.appendChild(tr);
      });
    }
  },

  /**
   * Tampilkan Toast Notifikasi
   */
  showToast(title, message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <h5>${title}</h5>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(toast);

    // Animasi masuk
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Otomatis hilang dalam 4.5 detik
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }
};

// Inisialisasi saat window dimuat
window.App = App;
window.addEventListener("DOMContentLoaded", () => {
  App.init();
});
