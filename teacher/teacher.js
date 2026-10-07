import TeacherFirebase from "./teacher-firebase.js";
const FirebaseAuthService = TeacherFirebase;


const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const dateLabel = value => {
  if (!value) return "—";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
};
const setRows = (id, html, empty, columns) => {
  const target = document.getElementById(id);
  target.innerHTML = html || `<tr><td class="empty-cell" colspan="${columns}">${empty}</td></tr>`;
};

let dashboard = { students: [], events: [], quizResults: [] };
let selectedStudentId = "";

async function loadDashboard() {
  const error = $("#teacher-load-error");
  error.hidden = true;
  try {
    dashboard = await FirebaseAuthService.getTeacherDashboardData();
    renderDashboard();
  } catch (err) {
    console.error("Gagal memuat dashboard guru:", err);
    error.textContent = "Data dashboard tidak dapat dimuat. Pastikan akun guru memiliki izin baca di Firestore dan indeks kueri telah tersedia.";
    error.hidden = false;
  }
}

function renderDashboard() {
  const { students, events, quizResults } = dashboard;
  $("#total-students").textContent = students.length;
  $("#total-activities").textContent = events.length;
  $("#total-quizzes").textContent = quizResults.length;
  $("#students-count").textContent = `${students.length} mahasiswa`;
  $("#recent-students").innerHTML = students.slice(0, 6).map(row => `<article class="student-mini-card"><span class="student-avatar" aria-hidden="true">${escapeHTML((row.name || "M").charAt(0).toUpperCase())}</span><div class="student-mini-info"><strong>${escapeHTML(row.name || "Mahasiswa")}</strong><small>Mahasiswa terdaftar</small></div></article>`).join("") || `<p class="empty-note">Belum ada mahasiswa terdaftar.</p>`;
  $("#students-directory").innerHTML = students.map(row => `<article class="directory-row"><span class="directory-name">${escapeHTML(row.name || "Mahasiswa")}</span><button class="student-action" data-student-id="${escapeHTML(row.id)}" type="button">Lihat Aktivitas</button></article>`).join("") || `<p class="empty-note">Belum ada mahasiswa terdaftar.</p>`;
  setRows("results-table", quizResults.map(row => `<tr><td><strong>${escapeHTML(row.userName || "Mahasiswa")}</strong><small class="result-email">${escapeHTML(row.userEmail || "")}</small></td><td>${escapeHTML(row.materialTitle || "—")}</td><td><strong>${Number(row.score ?? row.percentage ?? 0)} (${Number(row.percentage || row.score || 0)}%)</strong></td><td>${Number(row.correctCount || 0)} benar / ${Number(row.incorrectCount || 0)} salah</td><td>${dateLabel(row.timestamp || row.occurredAt)}</td><td><button class="student-action" data-result-id="${escapeHTML(row.id)}" type="button">Lihat Detail</button></td></tr>`).join(""), "Belum ada hasil kuis.", 6);
}

function openStudentActivity(studentId) {
  const student = dashboard.students.find(item => item.id === studentId);
  if (!student) return;
  selectedStudentId = studentId;
  $("#selected-student-name").textContent = student.name || "Aktivitas mahasiswa";
  const events = dashboard.events.filter(item => item.userId === studentId);
  setRows("selected-student-activity-table", events.map(row => `<tr><td><span class="event-pill">${escapeHTML(row.eventType || "Aktivitas")}</span></td><td>${escapeHTML(row.materialId || "—")}</td><td>${dateLabel(row.timestamp || row.occurredAt)}</td></tr>`).join(""), "Belum ada aktivitas tercatat untuk mahasiswa ini.", 3);
  $("#student-activity-detail").hidden = false;
  $("#student-activity-detail").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openQuizDetails(resultId) {
  const result = dashboard.quizResults.find(item => item.id === resultId);
  if (!result) return;
  $("#quiz-detail-title").textContent = result.materialTitle || "Detail Jawaban Quiz";
  $("#quiz-detail-student").textContent = `${result.userName || "Mahasiswa"} · Nilai ${Number(result.score ?? result.percentage ?? 0)} · ${dateLabel(result.timestamp || result.occurredAt)}`;
  const answers = Array.isArray(result.answers) ? result.answers : [];
  $("#quiz-answer-details").innerHTML = answers.length ? answers.map((answer, index) => `<article class="answer-detail ${answer.isCorrect ? "answer-correct" : "answer-wrong"}"><div class="answer-detail-top"><span class="answer-number">Soal ${index + 1}</span><span class="answer-status">${answer.isCorrect ? "Benar" : "Perlu ditinjau"}</span></div><h3>${escapeHTML(answer.questionText || answer.question || "Soal")}</h3><p><strong>Jawaban mahasiswa:</strong> ${escapeHTML(answer.selectedAnswer || answer.userAnswerText || answer.selectedOption || "Tidak dijawab")}</p><p><strong>Jawaban benar:</strong> ${escapeHTML(answer.correctAnswer || answer.correctAnswerText || answer.correctOption || "—")}</p>${answer.explanation ? `<p class="answer-explanation"><strong>Penjelasan:</strong> ${escapeHTML(answer.explanation)}</p>` : ""}</article>`).join("") : `<div class="teacher-notice">Rincian jawaban tidak tersedia untuk kuis ini. Jawaban per soal mulai tersimpan pada pengiriman kuis setelah fitur detail diaktifkan.</div>`;
  $("#quiz-detail-dialog").showModal();
}

function setupMaterialEditor() {
  const materials = window.LEARNING_MATERIALS || [];
  const selector = $("#material-select");
  selector.innerHTML = materials.map(material => `<option value="${escapeHTML(material.id)}">${escapeHTML(`${material.number || "Materi"}: ${material.title}`)}</option>`).join("");
  let overrides = {};
  const fields = {
    title: "#edit-title", shortDesc: "#edit-description", videoTitle: "#edit-video-title",
    videoUrl: "#edit-video-url", videoDescription: "#edit-video-description", bookTitle: "#edit-book-title", bookUrl: "#edit-book-url"
  };
  const readOverrides = async () => {
    try { overrides = await FirebaseAuthService.getMaterialOverrides(); }
    catch (error) {
      $("#editor-save-status").textContent = "Aturan Firestore belum mengizinkan guru membaca data materi tersimpan. Form terisi dari materi dasar.";
      $("#editor-save-status").classList.add("save-warning");
    }
  };
  const fill = () => {
    const material = materials.find(item => item.id === selector.value);
    if (!material) return;
    const saved = overrides[material.id] || {};
    $(fields.title).value = saved.title ?? material.title ?? "";
    $(fields.shortDesc).value = saved.shortDesc ?? material.shortDesc ?? "";
    $(fields.videoTitle).value = saved.video?.title ?? material.video?.title ?? "";
    $(fields.videoUrl).value = saved.video?.embedUrl ?? material.video?.embedUrl ?? "";
    $(fields.videoDescription).value = saved.video?.description ?? material.video?.description ?? "";
    $(fields.bookTitle).value = saved.book?.title ?? material.book?.title ?? "";
    $(fields.bookUrl).value = saved.book?.ebookUrl ?? material.book?.ebookUrl ?? "";
  };
  selector.addEventListener("change", fill);
  $("#material-editor-form").addEventListener("submit", async event => {
    event.preventDefault();
    const material = materials.find(item => item.id === selector.value);
    if (!material) return;
    const button = $("#save-material-button");
    const status = $("#editor-save-status");
    button.disabled = true;
    status.textContent = "Menyimpan materi…";
    status.classList.remove("save-warning");
    const patch = {
      title: $(fields.title).value.trim(),
      shortDesc: $(fields.shortDesc).value.trim(),
      video: { ...(overrides[material.id]?.video || material.video || {}), title: $(fields.videoTitle).value.trim(), embedUrl: $(fields.videoUrl).value.trim(), description: $(fields.videoDescription).value.trim() },
      book: { ...(overrides[material.id]?.book || material.book || {}), title: $(fields.bookTitle).value.trim(), ebookUrl: $(fields.bookUrl).value.trim() }
    };
    try {
      await FirebaseAuthService.saveMaterialOverride(material.id, patch);
      overrides[material.id] = patch;
      status.textContent = "Perubahan materi berhasil disimpan.";
    } catch (error) {
      console.error("Gagal menyimpan perubahan materi:", error);
      // Tampilkan pesan error asli agar lebih mudah didiagnosis
      status.textContent = error.message || "Firestore menolak penyimpanan. Periksa role akun di Firestore Console.";
      status.classList.add("save-warning");
    } finally { button.disabled = false; }
  });
  readOverrides().finally(fill);
}

function setupQuizEditor() {
  const materials = window.LEARNING_MATERIALS || [];
  const materialSelect = $("#quiz-material-select");
  const container = $("#quiz-questions-container");
  const statusEl = $("#quiz-save-status");

  materialSelect.innerHTML = materials.map(m =>
    `<option value="${escapeHTML(m.id)}">${escapeHTML(`${m.number || "Materi"}: ${m.title}`)}</option>`
  ).join("");

  let quizOverrides = {};
  let currentQuestions = [];

  const loadQuizOverrides = async () => {
    try { quizOverrides = await FirebaseAuthService.getQuizOverrides(); }
    catch (e) { console.warn("Gagal baca quiz overrides:", e); }
  };

  const getBaseQuestions = (materialId) => {
    const material = materials.find(m => m.id === materialId);
    return (material?.quiz || []).map(q => ({
      id: q.id,
      question: q.question || "",
      optionA: q.options?.A || "",
      optionB: q.options?.B || "",
      optionC: q.options?.C || "",
      optionD: q.options?.D || "",
      correctAnswer: q.correctAnswer || "A",
      explanation: q.explanation || ""
    }));
  };

  const buildQuestionCard = (q, index) => {
    const opts = ["A","B","C","D"];
    return `<article class="quiz-question-card data-card" data-index="${index}"><div class="quiz-question-header"><span class="quiz-question-num">Soal ${index + 1}</span><button class="quiz-delete-btn subtle-button" data-delete="${index}" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>Hapus</button></div><div class="quiz-question-body"><label class="form-group form-span-all"><span class="form-label">Pertanyaan</span><textarea class="form-input" rows="2" data-field="question">${escapeHTML(q.question)}</textarea></label><div class="quiz-options-grid">${opts.map(l => `<label class="form-group"><span class="form-label"><span class="option-badge">${l}</span> Pilihan ${l}</span><input class="form-input" data-field="option${l}" value="${escapeHTML(q[`option${l}`] || "")}"></label>`).join("")}</div><div class="quiz-answer-row"><label class="form-group"><span class="form-label">Jawaban Benar</span><select class="form-input" data-field="correctAnswer">${opts.map(l => `<option value="${l}"${q.correctAnswer===l?" selected":""}>${l}</option>`).join("")}</select></label><label class="form-group" style="flex:3"><span class="form-label">Penjelasan</span><input class="form-input" data-field="explanation" value="${escapeHTML(q.explanation || "")}"></label></div></div></article>`;
  };

  const renderQuestions = () => {
    if (currentQuestions.length === 0) {
      container.innerHTML = `<div class="quiz-empty-state"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg><p>Belum ada soal. Klik "Tambah Soal" untuk membuat soal baru.</p></div>`;
      return;
    }
    container.innerHTML = currentQuestions.map((q, i) => buildQuestionCard(q, i)).join("");
  };

  const readCurrentData = () => {
    currentQuestions = currentQuestions.map((q, i) => {
      const card = container.querySelector(`[data-index="${i}"]`);
      if (!card) return q;
      return {
        ...q,
        question: card.querySelector("[data-field='question']")?.value?.trim() || q.question,
        optionA: card.querySelector("[data-field='optionA']")?.value?.trim() || q.optionA,
        optionB: card.querySelector("[data-field='optionB']")?.value?.trim() || q.optionB,
        optionC: card.querySelector("[data-field='optionC']")?.value?.trim() || q.optionC,
        optionD: card.querySelector("[data-field='optionD']")?.value?.trim() || q.optionD,
        correctAnswer: card.querySelector("[data-field='correctAnswer']")?.value || q.correctAnswer,
        explanation: card.querySelector("[data-field='explanation']")?.value?.trim() || q.explanation
      };
    });
  };

  const loadMaterialQuiz = () => {
    const id = materialSelect.value;
    const override = quizOverrides[id];
    if (override?.questions?.length) {
      currentQuestions = override.questions.map((q, i) => ({
        id: q.id ?? (i + 1),
        question: q.question || "",
        optionA: q.optionA || "",
        optionB: q.optionB || "",
        optionC: q.optionC || "",
        optionD: q.optionD || "",
        correctAnswer: q.correctAnswer || "A",
        explanation: q.explanation || ""
      }));
    } else {
      currentQuestions = getBaseQuestions(id);
    }
    statusEl.textContent = "";
    statusEl.className = "";
    renderQuestions();
  };

  materialSelect.addEventListener("change", loadMaterialQuiz);

  container.addEventListener("click", e => {
    const delBtn = e.target.closest("[data-delete]");
    if (!delBtn) return;
    readCurrentData();
    const index = parseInt(delBtn.dataset.delete, 10);
    currentQuestions.splice(index, 1);
    currentQuestions = currentQuestions.map((q, i) => ({ ...q, id: i + 1 }));
    renderQuestions();
  });

  $("#quiz-add-question").addEventListener("click", () => {
    readCurrentData();
    currentQuestions.push({
      id: currentQuestions.length + 1,
      question: "", optionA: "", optionB: "", optionC: "", optionD: "",
      correctAnswer: "A", explanation: ""
    });
    renderQuestions();
    container.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#quiz-save-all").addEventListener("click", async () => {
    readCurrentData();
    const materialId = materialSelect.value;
    const saveBtn = $("#quiz-save-all");
    saveBtn.disabled = true;
    statusEl.textContent = "Menyimpan soal…";
    statusEl.className = "";
    try {
      await FirebaseAuthService.saveQuizOverride(materialId, currentQuestions);
      quizOverrides[materialId] = { questions: currentQuestions };
      statusEl.textContent = `✓ ${currentQuestions.length} soal berhasil disimpan.`;
      statusEl.className = "quiz-status-success";
    } catch (err) {
      console.error("Gagal menyimpan quiz:", err);
      const code = err?.code || err?.message || "unknown";
      if (code.includes("permission-denied") || code.includes("PERMISSION_DENIED")) {
        statusEl.textContent = "Akses ditolak Firestore. Pastikan akun ini memiliki role 'teacher' di database.";
      } else if (code.includes("unavailable") || code.includes("network")) {
        statusEl.textContent = "Koneksi ke Firestore gagal. Periksa koneksi internet.";
      } else {
        statusEl.textContent = `Gagal menyimpan (${code}). Buka Console browser untuk detail.`;
      }
      statusEl.className = "quiz-status-error";
    } finally {
      saveBtn.disabled = false;
    }
  });

  loadQuizOverrides().finally(loadMaterialQuiz);
}

$("#teacher-login-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = $("#teacher-login-submit");
  const error = $("#teacher-login-error");
  button.disabled = true;
  error.textContent = "";
  const result = await FirebaseAuthService.loginTeacher($("#teacher-email").value, $("#teacher-password").value);
  button.disabled = false;
  if (!result.success) { error.textContent = result.message; return; }
  $("#teacher-login-panel").hidden = true;
  $("#teacher-dashboard").hidden = false;
  $("#teacher-user-controls").hidden = false;
  $("#teacher-header-name").textContent = result.user.name || "Pengajar";
  $("#teacher-avatar").textContent = (result.user.name || "G").charAt(0).toUpperCase();
  $("#teacher-welcome").textContent = `Selamat datang, ${result.user.name}. Berikut ringkasan aktivitas kelas.`;
  await loadDashboard();
  setupMaterialEditor();
  setupQuizEditor();
});

document.querySelectorAll(".teacher-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".teacher-tab").forEach(item => item.classList.toggle("active", item === tab));
  document.querySelectorAll(".dashboard-panel").forEach(panel => panel.classList.toggle("active", panel.id === `panel-${tab.dataset.panel}`));
}));
document.addEventListener("click", event => {
  const studentButton = event.target.closest("[data-student-id]");
  if (studentButton) openStudentActivity(studentButton.dataset.studentId);
  const resultButton = event.target.closest("[data-result-id]");
  if (resultButton) openQuizDetails(resultButton.dataset.resultId);
});
$("#close-student-detail").addEventListener("click", () => { $("#student-activity-detail").hidden = true; });
$("#close-quiz-detail").addEventListener("click", () => $("#quiz-detail-dialog").close());
$("#teacher-logout").addEventListener("click", async () => {
  await TeacherFirebase.logout();
  window.location.reload();
});

await FirebaseAuthService.waitForAuthReady();
const currentUser = FirebaseAuthService.getCurrentUser();
if (currentUser) {
  const profile = await FirebaseAuthService.getTeacherProfile?.();
  if (profile?.role === "teacher") {
    $("#teacher-login-panel").hidden = true;
    $("#teacher-dashboard").hidden = false;
    $("#teacher-user-controls").hidden = false;
    $("#teacher-header-name").textContent = profile.name || "Pengajar";
    $("#teacher-avatar").textContent = (profile.name || "G").charAt(0).toUpperCase();
    $("#teacher-welcome").textContent = `Selamat datang, ${profile.name || "Guru"}. Berikut ringkasan aktivitas kelas.`;
    await loadDashboard();
    setupMaterialEditor();
    setupQuizEditor();
  }
}
