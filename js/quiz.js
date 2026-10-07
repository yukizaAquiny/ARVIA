/**
 * ============================================================================
 * MANAJER KUIS INTERAKTIF (QUIZ CONTROLLER)
 * Mengelola seleksi jawaban pilihan ganda, validasi kelengkapan soal,
 * koreksi dan penilaian instan, mode peninjauan (review), dan penyimpanan skor.
 * ============================================================================
 */

const QuizManager = {
  currentQuestions: [],
  userAnswers: {},       // Format: { [questionId]: "A" | "B" | "C" | "D" }
  isSubmitted: false,
  lastResult: null,
  activeMaterial: null,

  // --- Timer ---
  timerInterval: null,
  timerSeconds: 0,
  attemptStartTime: 0,
  TIMER_DURATION: 10 * 60, // 10 menit

  getSessionKey(materialId) {
    const user = window.StorageService?.getCurrentUser();
    return `arvia_quiz_session_${user?.id || "guest"}_${materialId || "default"}`;
  },

  escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  },

  /**
   * Menyiapkan quiz berdasarkan materi yang dipilih (Timer 10 menit dengan anti-refresh reset)
   */
  initQuiz(material) {
    this.activeMaterial = material;
    this.currentQuestions = material && material.quiz ? material.quiz : [];
    this.isSubmitted = false;
    this.lastResult = null;

    // Periksa apakah ada sesi pengerjaan kuis yang sedang berlangsung di sessionStorage
    const sessionKey = this.getSessionKey(material?.id);
    let savedSession = null;
    try {
      const raw = sessionStorage.getItem(sessionKey);
      if (raw) savedSession = JSON.parse(raw);
    } catch (e) {}

    if (savedSession?.submitted && savedSession.result) {
      this.attemptStartTime = savedSession.startTime || Date.now();
      this.userAnswers = savedSession.userAnswers || {};
      this.isSubmitted = true;
      this.lastResult = savedSession.result;
      this.renderQuizUI();
      this.currentQuestions.forEach(question => {
        const choice = this.userAnswers[question.id];
        const radio = document.getElementById(`opt-${question.id}-${choice}`);
        if (radio) radio.checked = true;
        if (choice) document.getElementById(`opt-label-${question.id}-${choice}`)?.classList.add("selected");
        this.applyQuestionReviewStyle(question, choice, choice === question.correctAnswer);
      });
      document.querySelectorAll('#quiz-questions-list input[type="radio"]').forEach(radio => radio.disabled = true);
      const submitButton = document.getElementById("btn-submit-quiz");
      const resultButton = document.getElementById("btn-view-score");
      if (submitButton) submitButton.disabled = true;
      if (resultButton) { resultButton.disabled = false; resultButton.classList.remove("btn-secondary"); resultButton.classList.add("btn-primary"); }
      this.updateProgressBar();
      return;
    }

    if (savedSession && savedSession.startTime) {
      this.attemptStartTime = savedSession.startTime;
      const elapsed = Math.floor((Date.now() - savedSession.startTime) / 1000);
      const remaining = Math.max(0, (savedSession.duration || this.TIMER_DURATION) - elapsed);
      this.userAnswers = savedSession.userAnswers || {};

      this.renderQuizUI();
      // Pulihkan pilihan radio yang tersimpan
      Object.entries(this.userAnswers).forEach(([qId, val]) => {
        const radio = document.getElementById(`opt-${qId}-${val}`);
        if (radio) radio.checked = true;
        const lbl = document.getElementById(`opt-label-${qId}-${val}`);
        if (lbl) lbl.classList.add("selected");
      });
      this.updateProgressBar();

      if (remaining <= 0) {
        // Waktu habis saat direfresh
        this.timerSeconds = 0;
        this._updateTimerDisplay();
        this._forceSubmit();
        return;
      } else {
        this.timerSeconds = remaining;
      }
    } else {
      this.userAnswers = {};
      this.timerSeconds = this.TIMER_DURATION;
      this.attemptStartTime = Date.now();
      try {
        sessionStorage.setItem(sessionKey, JSON.stringify({
          startTime: this.attemptStartTime,
          duration: this.TIMER_DURATION,
          userAnswers: {}
        }));
      } catch (e) {}
      this.renderQuizUI();
    }

    this.startTimer();

    // Jalankan backsound musik kuis secara otomatis saat mulai
    if (window.QuizAudioManager) {
      window.QuizAudioManager.start(material && material.id);
    }
  },

  /**
   * Memulai hitung mundur 10 menit
   */
  startTimer() {
    this.stopTimer(); // Hentikan timer lama jika ada
    this._updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (this.isSubmitted) {
        this.stopTimer();
        return;
      }
      this.timerSeconds = Math.max(0, Math.ceil((this.attemptStartTime + this.TIMER_DURATION * 1000 - Date.now()) / 1000));
      this._updateTimerDisplay();

      if (this.timerSeconds <= 0) {
        this.stopTimer();
        // Auto-submit saat waktu habis (Section O)
        if (!this.isSubmitted) {
          if (window.App && window.App.showToast) {
            window.App.showToast(
              "Waktu Pengerjaan Habis!",
              "Waktu 10 menit telah berakhir. Jawaban yang telah Anda kerjakan otomatis disimpan.",
              "warning"
            );
          }
          this._forceSubmit();
        }
      }
    }, 1000);
  },

  /**
   * Menghentikan timer
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  /**
   * Memperbarui tampilan timer di DOM
   */
  _updateTimerDisplay() {
    const timerEl = document.getElementById("quiz-timer-display");
    if (!timerEl) return;
    const secs = Math.max(0, this.timerSeconds);
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    timerEl.textContent = formatted;

    // Warna merah jika sisa <= 2 menit
    const timerWrap = document.getElementById("quiz-timer-wrap");
    if (timerWrap) {
      if (secs <= 120) {
        timerWrap.classList.add("timer-urgent");
      } else {
        timerWrap.classList.remove("timer-urgent");
      }
    }
  },

  /**
   * Force-submit: isi semua jawaban kosong lalu panggil logika submit tanpa validasi
   */
  _forceSubmit() {
    if (this.isSubmitted) return;

    let correctCount = 0;
    const totalQuestions = this.currentQuestions.length;

    this.currentQuestions.forEach(q => {
      const userChoice = this.userAnswers[q.id] || null;
      const isCorrect = userChoice !== null && userChoice === q.correctAnswer;
      if (isCorrect) correctCount++;
      this.applyQuestionReviewStyle(q, userChoice, isCorrect);
    });

    const incorrectCount = totalQuestions - correctCount;
    const rawScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const finalScore = Math.round(rawScore);
    const percentage = `${finalScore}%`;

    let statusText = "";
    let statusClass = "";
    if (finalScore >= 70) {
      statusText = "Selamat! Nilai Anda memenuhi standar.";
      statusClass = "status-passed";
    } else if (finalScore >= 50) {
      statusText = "Nilai Anda masih dalam kategori standar.";
      statusClass = "status-standard";
    } else {
      statusText = "Nilai Anda belum memenuhi standar. Disarankan melakukan pembelajaran ulang.";
      statusClass = "status-failed";
    }

    this.isSubmitted = true;
    this.stopTimer();

    this.lastResult = {
      materialId: this.activeMaterial.id,
      materialTitle: this.activeMaterial.title,
      score: finalScore,
      correctCount,
      incorrectCount,
      totalQuestions,
      percentage,
      statusText,
      statusClass,
      answers: this.buildAnswerDetails()
    };
    this.lastResult.durationSeconds = Math.max(0, Math.min(this.TIMER_DURATION, Math.floor((Date.now() - this.attemptStartTime) / 1000)));
    this.lastResult.occurredAt = new Date().toISOString();

    this.persistSubmittedSession();

    window.StorageService.saveQuizHistory(this.lastResult);
    window.StorageService.markLearningActivity(this.activeMaterial.id, "quiz");

    if (window.QuizAudioManager) window.QuizAudioManager.stop();

    const allRadios = document.querySelectorAll('#quiz-questions-list input[type="radio"]');
    allRadios.forEach(radio => radio.disabled = true);

    const btnSubmitEl = document.getElementById("btn-submit-quiz");
    const btnViewScoreEl = document.getElementById("btn-view-score");
    if (btnSubmitEl) {
      btnSubmitEl.disabled = true;
      btnSubmitEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Waktu Habis`;
    }
    if (btnViewScoreEl) {
      btnViewScoreEl.disabled = false;
      btnViewScoreEl.classList.remove("btn-secondary");
      btnViewScoreEl.classList.add("btn-primary");
    }
  },

  persistSubmittedSession() {
    if (!this.activeMaterial || !this.lastResult) return;
    try {
      sessionStorage.setItem(this.getSessionKey(this.activeMaterial.id), JSON.stringify({
        startTime: this.attemptStartTime,
        duration: this.TIMER_DURATION,
        userAnswers: this.userAnswers,
        submitted: true,
        result: this.lastResult
      }));
    } catch (error) {
      console.warn("Hasil kuis tidak dapat disimpan pada sesi ini.", error);
    }
  },

  /**
   * Merender daftar soal kuis ke dalam DOM
   */
  renderQuizUI() {
    const quizTitleEl = document.getElementById("quiz-material-title");
    const quizContainerEl = document.getElementById("quiz-questions-list");
    const btnSubmitEl = document.getElementById("btn-submit-quiz");
    const btnViewScoreEl = document.getElementById("btn-view-score");
    const progressFillEl = document.getElementById("quiz-progress-fill");

    if (quizTitleEl && this.activeMaterial) {
      quizTitleEl.textContent = `Kuis: ${this.activeMaterial.title}`;
    }

    if (progressFillEl) {
      progressFillEl.style.width = "0%";
      const progressTrack = progressFillEl.parentElement;
      if (progressTrack) {
        progressTrack.setAttribute("aria-valuemax", String(this.currentQuestions.length));
        progressTrack.setAttribute("aria-valuenow", "0");
      }
    }
    const progressLabel = document.getElementById("quiz-progress-label");
    if (progressLabel) progressLabel.textContent = `0 dari ${this.currentQuestions.length} soal dijawab`;

    // Set status tombol bawah: Selesai aktif, Lihat Score dinonaktifkan sampai kuis diselesaikan
    if (btnSubmitEl) {
      btnSubmitEl.disabled = false;
      btnSubmitEl.style.display = "inline-flex";
      btnSubmitEl.type = "button";
      btnSubmitEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Periksa Jawaban`;
    }
    if (btnViewScoreEl) {
      btnViewScoreEl.disabled = true;
      btnViewScoreEl.type = "button";
      btnViewScoreEl.classList.add("btn-secondary");
      btnViewScoreEl.classList.remove("btn-primary");
    }

    if (!quizContainerEl) return;
    quizContainerEl.innerHTML = "";

    // Generate setiap kartu soal
    this.currentQuestions.forEach((q, index) => {
      const qCard = document.createElement("div");
      qCard.className = "question-card";
      qCard.id = `question-card-${q.id}`;

      const optionsKeys = Object.keys(q.options || {});
      let optionsHtml = "";

      optionsKeys.forEach(optKey => {
        const optText = q.options[optKey] || "";
        optionsHtml += `
          <label class="quiz-option-label" data-question-id="${q.id}" data-option="${optKey}" id="opt-label-${q.id}-${optKey}">
            <input type="radio" name="question-${q.id}" value="${optKey}">
            <span class="option-badge">${optKey}</span>
            <span class="option-text">${this.escapeHtml(optText)}</span>
          </label>
        `;
      });

      qCard.innerHTML = `
        <div class="question-text">${this.escapeHtml(q.question)}</div>
        <div class="quiz-options-list">
          ${optionsHtml}
        </div>
        <div class="quiz-answer-feedback" id="feedback-${q.id}"></div>
      `;

      quizContainerEl.appendChild(qCard);
      qCard.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener("change", () => this.handleOptionSelect(q.id, radio.value));
      });
    });
  },

  /**
   * Menangani saat pengguna memilih opsi jawaban
   */
  handleOptionSelect(questionId, selectedOption) {
    if (this.isSubmitted) return; // Kunci jika sudah disubmit

    this.userAnswers[questionId] = selectedOption;

    // Hapus highlight peringatan jika sebelumnya ada
    const cardEl = document.getElementById(`question-card-${questionId}`);
    if (cardEl) {
      cardEl.classList.remove("unanswered-alert");
    }

    // Perbarui style kartu opsi
    const question = this.currentQuestions.find(item => String(item.id) === String(questionId));
    const optionsKeys = Object.keys(question?.options || {});
    optionsKeys.forEach(key => {
      const lbl = document.getElementById(`opt-label-${questionId}-${key}`);
      if (lbl) {
        if (key === selectedOption) {
          lbl.classList.add("selected");
        } else {
          lbl.classList.remove("selected");
        }
      }
    });

    // Simpan progres jawaban ke sessionStorage agar saat refresh tidak hilang
    if (this.activeMaterial) {
      try {
        const sessionKey = this.getSessionKey(this.activeMaterial.id);
        const raw = sessionStorage.getItem(sessionKey);
        if (raw) {
          const session = JSON.parse(raw);
          session.userAnswers = this.userAnswers;
          sessionStorage.setItem(sessionKey, JSON.stringify(session));
        }
      } catch (e) {}
    }

    // Update progress bar
    this.updateProgressBar();
  },

  /**
   * Memperbarui bilah progres pengerjaan
   */
  updateProgressBar() {
    const answeredCount = Object.keys(this.userAnswers).length;
    const total = this.currentQuestions.length;
    const pct = total > 0 ? (answeredCount / total) * 100 : 0;
    const progressFillEl = document.getElementById("quiz-progress-fill");
    if (progressFillEl) {
      progressFillEl.style.width = `${pct}%`;
      const progressTrack = progressFillEl.parentElement;
      if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(Math.round(pct)));
    }
    const progressLabel = document.getElementById("quiz-progress-label");
    if (progressLabel) progressLabel.textContent = `${answeredCount} dari ${total} soal dijawab`;
  },

  /**
   * Memeriksa apakah seluruh soal telah dijawab
   */
  buildAnswerDetails() {
    return this.currentQuestions.map(question => {
      const selectedOption = this.userAnswers[question.id] || "";
      const selectedAnswer = selectedOption ? question.options?.[selectedOption] || selectedOption : "Tidak dijawab";
      const correctAnswer = question.options?.[question.correctAnswer] || question.correctAnswer;
      return {
        questionId: question.id,
        questionText: question.question,
        selectedOption,
        selectedAnswer,
        correctOption: question.correctAnswer,
        correctAnswer,
        isCorrect: selectedOption === question.correctAnswer,
        explanation: question.explanation || ""
      };
    });
  },

  validateAllAnswered() {
    const unansweredIds = [];
    this.currentQuestions.forEach(q => {
      if (!this.userAnswers[q.id]) {
        unansweredIds.push(q.id);
      }
    });
    return unansweredIds;
  },

  /**
   * Tombol "Selesai" ditekan: Validasi, pemeriksaan, skor, dan indikator jawaban
   */
  submitQuiz() {
    if (this.isSubmitted) return;
    if (!this.currentQuestions.length) {
      if (window.App?.showToast) window.App.showToast("Quiz belum tersedia", "Belum ada soal untuk materi ini.", "error");
      return;
    }

    // 1. Validasi seluruh soal
    const unanswered = this.validateAllAnswered();
    if (unanswered.length > 0) {
      // Highlight soal yang belum dijawab
      unanswered.forEach(id => {
        const cardEl = document.getElementById(`question-card-${id}`);
        if (cardEl) cardEl.classList.add("unanswered-alert");
      });

      // Scroll ke soal pertama yang belum terjawab
      const firstUnansweredEl = document.getElementById(`question-card-${unanswered[0]}`);
      if (firstUnansweredEl) {
        firstUnansweredEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      if (window.App && window.App.showToast) {
        window.App.showToast(
          "Peringatan Quiz",
          `Masih ada ${unanswered.length} soal yang belum Anda jawab. Silakan periksa kembali sebelum menyelesaikan kuis.`,
          "error"
        );
      }
      return;
    }

    // 2. Hitung jumlah benar, salah, dan nilai
    let correctCount = 0;
    const totalQuestions = this.currentQuestions.length;

    this.currentQuestions.forEach(q => {
      const userChoice = this.userAnswers[q.id];
      const isCorrect = userChoice === q.correctAnswer;
      if (isCorrect) correctCount++;

      // Terapkan indikator visual langsung pada halaman quiz (Review Mode)
      this.applyQuestionReviewStyle(q, userChoice, isCorrect);
    });

    const incorrectCount = totalQuestions - correctCount;
    // Nilai skala 0 - 100
    const rawScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const finalScore = Math.round(rawScore);
    const percentage = `${finalScore}%`;

    // Tentukan kategori status:
    let statusText = "";
    let statusClass = "";

    if (finalScore >= 70) {
      statusText = "Selamat! Nilai Anda memenuhi standar.";
      statusClass = "status-passed";
    } else if (finalScore >= 50) {
      statusText = "Nilai Anda masih dalam kategori standar.";
      statusClass = "status-standard";
    } else {
      statusText = "Nilai Anda belum memenuhi standar. Disarankan melakukan pembelajaran ulang atau revisi materi.";
      statusClass = "status-failed";
    }

    this.isSubmitted = true;

    this.lastResult = {
      materialId: this.activeMaterial.id,
      materialTitle: this.activeMaterial.title,
      score: finalScore,
      correctCount: correctCount,
      incorrectCount: incorrectCount,
      totalQuestions: totalQuestions,
      percentage: percentage,
      statusText: statusText,
      statusClass: statusClass,
      answers: this.buildAnswerDetails()
    };
    this.lastResult.durationSeconds = Math.max(0, Math.min(this.TIMER_DURATION, Math.floor((Date.now() - this.attemptStartTime) / 1000)));
    this.lastResult.occurredAt = new Date().toISOString();

    this.persistSubmittedSession();

    // 3. Simpan riwayat ke StorageService
    window.StorageService.saveQuizHistory(this.lastResult);
    window.StorageService.markLearningActivity(this.activeMaterial.id, "quiz");

    // Hentikan timer dan backsound musik setelah kuis selesai disubmit
    this.stopTimer();
    if (window.QuizAudioManager) {
      window.QuizAudioManager.stop();
    }

    // 4. Nonaktifkan radio button agar tidak diubah lagi
    const allRadios = document.querySelectorAll('#quiz-questions-list input[type="radio"]');
    allRadios.forEach(radio => radio.disabled = true);

    // 5. Update tombol aksi: Matikan 'Selesai', Aktifkan 'Lihat Score'
    const btnSubmitEl = document.getElementById("btn-submit-quiz");
    const btnViewScoreEl = document.getElementById("btn-view-score");

    if (btnSubmitEl) {
      btnSubmitEl.disabled = true;
      btnSubmitEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Jawaban Diperiksa`;
    }

    if (btnViewScoreEl) {
      btnViewScoreEl.disabled = false;
      btnViewScoreEl.classList.remove("btn-secondary");
      btnViewScoreEl.classList.add("btn-primary");
    }

    if (window.App && window.App.showToast) {
      window.App.showToast(
        "Kuis Selesai Diperiksa",
        `Skor Anda: ${finalScore}/100 (${correctCount} Benar, ${incorrectCount} Salah). Anda dapat meninjau jawaban di bawah atau menekan tombol 'Lihat Score'.`,
        "success"
      );
    }
  },

  /**
   * Menerapkan warna hijau/merah pada kartu dan opsi jawaban
   */
  applyQuestionReviewStyle(question, userChoice, isCorrect) {
    const cardEl = document.getElementById(`question-card-${question.id}`);
    const feedbackEl = document.getElementById(`feedback-${question.id}`);

    if (cardEl) {
      cardEl.classList.add("reviewed");
      cardEl.classList.add(isCorrect ? "reviewed-correct" : "reviewed-incorrect");
    }

    // Beri tanda pada opsi yang dipilih & kunci jawaban
    const optionsKeys = Object.keys(question.options || {});
    optionsKeys.forEach(key => {
      const lbl = document.getElementById(`opt-label-${question.id}-${key}`);
      if (!lbl) return;

      if (key === question.correctAnswer) {
        lbl.classList.add("is-correct-answer");
      }
      if (key === userChoice && !isCorrect) {
        lbl.classList.add("is-wrong-selection");
      }
    });

    // Tampilkan penjelasan
    if (feedbackEl) {
      feedbackEl.className = `quiz-answer-feedback ${isCorrect ? "feedback-correct" : "feedback-wrong"}`;
      feedbackEl.innerHTML = `
        <strong>${isCorrect ? "Jawaban Anda Benar!" : `Jawaban Anda Belum Tepat (Kunci Jawaban: ${question.correctAnswer})`}</strong><br>
        ${this.escapeHtml(question.explanation)}
      `;
    }
  },

  /**
   * Buka halaman score
   */
  viewScore() {
    this.stopTimer();
    if (window.QuizAudioManager) {
      window.QuizAudioManager.stop();
    }
    if (!this.lastResult) return;
    window.AppRouter.navigateTo("score");
  }
};
/**
 * ============================================================================
 * MANAJER AUDIO BACKSOUND KUIS (QUIZ AUDIO MANAGER)
 * Mengelola pemutaran lagu latar belakang saat pelaksanaan kuis, pengatur volume,
 * tombol jeda/bisu (mute/unmute), animasi equalizer, dan fallback Web Audio API.
 * ============================================================================
 */
const QuizAudioManager = {
  audioEl: null,
  isPlaying: false,
  isMuted: false,
  currentVolume: 0.3,
  audioCtx: null,
  synthTimer: null,
  synthGain: null,
  isBound: false,
  tracks: [
    { name: "Cherish", src: "asset/Bubblegum,mp3" },
    { name: "Bubble Gum", src: "asset/Magnetic.mp3" },
    { name: "Magnetic ", src: "asset/Cherish.mp3" }
  ],
  remainingTracks: [],
  lastTrackSrc: "",
  currentTrackName: "",

  init() {
    this.audioEl = document.getElementById("quizMusic");
    if (this.audioEl) {
      this.audioEl.volume = this.currentVolume;
    }
    this.bindUI();
  },

  bindUI() {
    if (this.isBound) return;
    const toggleBtn = document.getElementById("btn-toggle-quiz-music");
    const volumeSlider = document.getElementById("quiz-volume-slider");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => this.toggle());
    }

    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        this.setVolume(val / 100);
      });
    }

    this.isBound = true;
  },

  /**
   * Mulai memutar backsound kuis
   */
  start(materialId) {
    this.init();
    if (materialId) this.selectTrack();
    if (this.isMuted) return;

    if (!this.audioEl) {
      this.audioEl = document.getElementById("quizMusic");
    }

    if (this.audioEl) {
      this.audioEl.volume = this.currentVolume;
      const playPromise = this.audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          this.updateUI(true);
        }).catch(err => {
          console.warn("Autoplay audio browser terblokir sebelum interaksi pengguna, memasang pendengar klik:", err);
          // Bila dibatasi kebijakan autoplay browser, pasang trigger satu kali klik pada dokumen
          const startOnInteraction = () => {
            if (window.AppRouter && window.AppRouter.currentView === "quiz" && !this.isMuted) {
              if (this.audioEl) {
                this.audioEl.play().then(() => {
                  this.isPlaying = true;
                  this.updateUI(true);
                }).catch(() => {
                  this.startSynth();
                });
              } else {
                this.startSynth();
              }
            }
            document.removeEventListener("click", startOnInteraction);
            document.removeEventListener("touchstart", startOnInteraction);
          };
          document.addEventListener("click", startOnInteraction, { once: true });
          document.addEventListener("touchstart", startOnInteraction, { once: true });

          // Mulai synthesizer fallback
          this.startSynth();
        });
      }
    } else {
      this.startSynth();
    }
  },

  selectTrack() {
    if (!this.audioEl || !this.tracks.length) return;
    if (!this.remainingTracks.length) {
      this.remainingTracks = [...this.tracks];
      for (let i = this.remainingTracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.remainingTracks[i], this.remainingTracks[j]] = [this.remainingTracks[j], this.remainingTracks[i]];
      }
      if (this.remainingTracks.length > 1 && this.remainingTracks[0].src === this.lastTrackSrc) {
        [this.remainingTracks[0], this.remainingTracks[1]] = [this.remainingTracks[1], this.remainingTracks[0]];
      }
    }
    const track = this.remainingTracks.shift();
    this.lastTrackSrc = track.src;
    this.currentTrackName = track.name;
    this.audioEl.src = track.src;
    this.audioEl.load();
  },

  /**
   * Menghentikan pemutaran backsound kuis
   */
  stop() {
    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.stopSynth();
    this.isPlaying = false;
    this.updateUI(false);
  },

  /**
   * Tombol Mute / Unmute
   */
  toggle() {
    if (this.isPlaying) {
      this.isMuted = true;
      this.stop();
      this.updateUI(false);
      if (window.App && window.App.showToast) {
        window.App.showToast("Backsound Kuis", "Musik latar kuis disenyapkan.", "info");
      }
    } else {
      this.isMuted = false;
      this.start();
      if (window.App && window.App.showToast) {
        window.App.showToast("Backsound Kuis", "Musik latar kuis diaktifkan kembali.", "success");
      }
    }
  },

  /**
   * Mengatur volume backsound kuis (0.0 sampai 1.0)
   */
  setVolume(vol) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.currentVolume;
    }
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.setValueAtTime(this.currentVolume * 0.15, this.audioCtx.currentTime);
    }
    const valDisplay = document.getElementById("quiz-volume-val");
    if (valDisplay) {
      valDisplay.textContent = `${Math.round(this.currentVolume * 100)}%`;
    }
    if (this.currentVolume === 0) {
      this.updateUI(false);
    } else if (!this.isPlaying && !this.isMuted) {
      this.start();
    }
  },

  /**
   * Sinkronisasi status antarmuka widget musik
   */
  updateUI(playing) {
    const btnText = document.getElementById("btn-music-toggle-text");
    const iconPlaying = document.getElementById("icon-music-playing");
    const iconMuted = document.getElementById("icon-music-muted");

    if (btnText) {
      btnText.textContent = playing ? "Musik Aktif" : "Musik Mati";
    }

    if (iconPlaying && iconMuted) {
      if (playing) {
        iconPlaying.style.display = "inline";
        iconMuted.style.display = "none";
      } else {
        iconPlaying.style.display = "none";
        iconMuted.style.display = "inline";
      }
    }
  },

  /**
   * Web Audio API Synthesizer (Fallback mandiri jika audio berkas terkendala)
   */
  startSynth() {
    if (this.synthTimer) return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      this.synthGain = this.audioCtx.createGain();
      this.synthGain.gain.setValueAtTime(this.currentVolume * 0.12, this.audioCtx.currentTime);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

      this.synthGain.connect(filter);
      filter.connect(this.audioCtx.destination);

      const chordProgression = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 392.00]  // G6
      ];

      let chordIndex = 0;
      const playNextChord = () => {
        if (!this.isPlaying || !this.audioCtx) return;
        const freqs = chordProgression[chordIndex % chordProgression.length];
        chordIndex++;
        const now = this.audioCtx.currentTime;

        freqs.forEach((f, idx) => {
          const osc = this.audioCtx.createOscillator();
          const noteGain = this.audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now);

          noteGain.gain.setValueAtTime(0, now);
          noteGain.gain.linearRampToValueAtTime(0.08, now + 0.6);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

          osc.connect(noteGain);
          noteGain.connect(this.synthGain);

          osc.start(now + (idx * 0.08));
          osc.stop(now + 4.0);
        });
      };

      this.isPlaying = true;
      this.updateUI(true);
      playNextChord();
      this.synthTimer = setInterval(playNextChord, 4000);
    } catch (e) {
      console.warn("Web Audio API synth tidak dapat diinisialisasi:", e);
    }
  },

  stopSynth() {
    if (this.synthTimer) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
  }
};

window.QuizAudioManager = QuizAudioManager;
window.QuizManager = QuizManager;
