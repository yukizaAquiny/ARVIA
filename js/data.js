/**
 * ============================================================================
 * DATA PEMBELAJARAN (MOCK DATABASE)
 * Menyediakan materi video edukasi, buku digital (e-book) dengan navigasi bab,
 * tautan e-book langsung, dan kuis pilihan ganda 10 pertanyaan per materi.
 * ============================================================================
 */

const LEARNING_MATERIALS = [
  {
    id: "materi-1",
    number: "Materi 1",
    tag: "Web Development",
    title: "Dasar Pemrograman Web & HTML Modern",
    shortDesc: "Pelajari pondasi dasar pembangunan website modern mulai dari struktur semantik HTML5, integrasi gaya CSS3, hingga pemahaman arsitektur web responsif.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,

    // --- 1. Video Pembelajaran ---
    video: {
      title: "Pengenalan Dasar HTML5 & Struktur Web Modern",
      embedUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
      description: "Video ini menjelaskan bagaimana web bekerja, anatomi dasar tag HTML5 semantik, hubungan antara struktur HTML dan styling CSS, serta cara menyusun dokumen web yang ramah mesin pencari (SEO friendly).",
      keyPoints: [
        "Memahami fungsi tag dasar: <header>, <nav>, <main>, <section>, <footer>.",
        "Pentingnya menggunakan tag semantik demi aksesibilitas dan optimasi SEO.",
        "Cara menghubungkan file CSS dan JavaScript ke dalam dokumen HTML.",
        "Konsep Viewport meta tag untuk mendukung perangkat ponsel pintar (mobile)."
      ]
    },

    // --- 2. Buku / E-Book Panduan Digital ---
    book: {
      title: "Buku Panduan: Fondasi Web Modern untuk Pemula",
      ebookBadge: "E-Book HTML5 & Modern Web",
      ebookUrl: "https://books.google.co.id/books?hl=id&lr=&id=itUvEAAAQBAJ&oi=fnd&pg=PA11&dq=dasar+pemrograman&ots=PuE7RuNp0T&sig=QkbuOBdTn84RNoySPmdnCsWL4&redir_esc=y#v=onepage&q=dasar%20pemrograman&f=false",
      ebookLabel: "Buka E-Book Referensi Lengkap (MDN Web Docs)",
      description: "Modul e-book komprehensif mengenai dasar-dasar HTML5, penataan semantik, dan teknik pembuatan website responsif.",
      chapters: [
        {
          id: "bab-1",
          title: "Bab 1: Pengantar World Wide Web",
          content: `
            <h2>Bab 1: Pengantar World Wide Web</h2>
            <p>World Wide Web (WWW) adalah sistem informasi global yang memungkinkan dokumen dan sumber daya web lainnya diakses melalui protokol internet. Setiap kali Anda membuka peramban web dan memasukkan URL, peramban mengirimkan permintaan HTTP/HTTPS ke server web, yang kemudian merespons dengan berkas dokumen.</p>
            <div class="book-callout">
              <strong>Catatan Penting:</strong> Tiga pilar utama teknologi web sisi klien (frontend) adalah <strong>HTML</strong> (struktur konten), <strong>CSS</strong> (tata letak dan visualisasi), dan <strong>JavaScript</strong> (interaktivitas dan logika).
            </div>
            <h3>Struktur Dasar Dokumen HTML5</h3>
            <p>HTML (HyperText Markup Language) menggunakan sistem penandaan elemen dengan tanda kurung siku (tag). Dokumen modern selalu diawali dengan deklarasi tipe dokumen <code>&lt;!DOCTYPE html&gt;</code>.</p>
            <p>Di dalam elemen <code>&lt;head&gt;</code>, kita menyimpan metadata seperti judul halaman, pengaturan karakter UTF-8, dan link ke berkas stylesheet. Sedangkan elemen <code>&lt;body&gt;</code> menampung seluruh konten visual yang dilihat langsung oleh pengguna.</p>
          `
        },
        {
          id: "bab-2",
          title: "Bab 2: Tag Semantik & Struktur Halaman",
          content: `
            <h2>Bab 2: Tag Semantik & Struktur Halaman</h2>
            <p>Sebelum HTML5, banyak pengembang menggunakan tag generik <code>&lt;div class="header"&gt;</code> atau <code>&lt;div class="footer"&gt;</code>. Praktik modern sangat menekankan penggunaan tag semantik yang bermakna.</p>
            <h3>Daftar Tag Semantik Populer:</h3>
            <ul>
              <li><strong>&lt;header&gt;:</strong> Menampung logo, navigasi utama, atau pengantar halaman.</li>
              <li><strong>&lt;nav&gt;:</strong> Wadah khusus tautan navigasi antarmuka.</li>
              <li><strong>&lt;main&gt;:</strong> Area konten utama yang unik untuk halaman tersebut.</li>
              <li><strong>&lt;article&gt;:</strong> Konten mandiri yang dapat didistribusikan secara terpisah (misalnya artikel berita atau postingan blog).</li>
              <li><strong>&lt;section&gt;:</strong> Pengelompokan bagian konten yang memiliki topik serupa.</li>
              <li><strong>&lt;footer&gt;:</strong> Bagian kaki halaman yang berisi hak cipta atau kontak.</li>
            </ul>
            <div class="book-callout">
              <strong>Manfaat Semantik:</strong> Mempermudah perayap mesin pencari (SEO) memahami hierarki informasi dan memfasilitasi pembaca layar (screen reader) bagi pengguna disabilitas.
            </div>
          `
        },
        {
          id: "bab-3",
          title: "Bab 3: Fondasi Tampilan Responsif",
          content: `
            <h2>Bab 3: Fondasi Tampilan Responsif</h2>
            <p>Di era modern, lebih dari 60% lalu lintas web berasal dari perangkat telepon pintar dan tablet. Oleh karena itu, membangun website yang dapat menyesuaikan diri dengan aneka resolusi layar adalah keharusan mutlak.</p>
            <h3>Prinsip Desain Responsif:</h3>
            <p>1. <strong>Viewport Meta Tag:</strong> Menginstruksikan peramban agar menyamakan lebar jendela dengan lebar layar fisik perangkat melalui <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code>.</p>
            <p>2. <strong>Fluid Grid & Flexbox/CSS Grid:</strong> Menggunakan satuan relatif seperti persentase (%), fr, rem, atau viewport width (vw) daripada ukuran piksel mati.</p>
            <p>3. <strong>Media Queries:</strong> Menerapkan aturan CSS bersyarat tergantung pada lebar layar pengguna (misalnya untuk layar di bawah 768px).</p>
          `
        }
      ]
    },

    // --- 3. Kuis Pilihan Ganda (10 Pertanyaan) ---
    quiz: [
      {
        id: 1,
        question: "Apa fungsi utama dari deklarasi <!DOCTYPE html> pada baris pertama sebuah dokumen web?",
        options: {
          A: "Memberi tahu browser agar merender halaman menggunakan standar HTML5 modern",
          B: "Menghubungkan dokumen HTML secara otomatis dengan file JavaScript",
          C: "Mengenkripsi konten web agar aman dari serangan peretas siber",
          D: "Menentukan bahasa pemrograman server-side yang digunakan backend"
        },
        correctAnswer: "A",
        explanation: "Deklarasi <!DOCTYPE html> berfungsi memberitahu browser bahwa dokumen ini menggunakan standar HTML5 terbaru dan mencegah browser masuk ke mode rendering kuno (quirks mode)."
      },
      {
        id: 2,
        question: "Apa?",
        options: {
          A: "Memberih",
          B: "Mem",
          C: "Mengenkripsi konten web agar aman dari serangan peretas siber",
          D: "Menentukan bahasa pemrograman server-side yang digunakan backend"
        },
        correctAnswer: "A",
        explanation: "Deklarasi <!DOCTYPE html> berfungsi memberitahu browser bahwa dokumen ini menggunakan standar HTML5 terbaru dan mencegah browser masuk ke mode rendering kuno (quirks mode)."
      },
      {
        id: 3,
        question: "Apa fungsi utama dari deklarasi <!DOCTYPE html> pada baris pertama sebuah dokumen web?",
        options: {
          A: "Memberi tahu browser agar merender halaman menggunakan standar HTML5 modern",
          B: "Menghubungkan dokumen HTML secara otomatis dengan file JavaScript",
          C: "Mengenkripsi konten web agar aman dari serangan peretas siber",
          D: "Menentukan bahasa pemrograman server-side yang digunakan backend"
        },
        correctAnswer: "A",
        explanation: "Deklarasi <!DOCTYPE html> berfungsi memberitahu browser bahwa dokumen ini menggunakan standar HTML5 terbaru dan mencegah browser masuk ke mode rendering kuno (quirks mode)."
      },
      {
        id: 4,
        question: "Mengapa penggunaan tag semantik lebih disukai dibandingkan penggunaan tag generik <div> secara berlebihan?",
        options: {
          A: "Otomatis memperkecil ukuran file gambar di halaman web",
          B: "Meningkatkan aksesibilitas bagi screen reader dan mempermudah perayapan mesin pencari (SEO)",
          C: "Menghilangkan keharusan menulis aturan CSS stylesheet",
          D: "Menaikkan kecepatan bandwidth internet pengguna secara instan"
        },
        correctAnswer: "B",
        explanation: "Tag semantik memberikan makna struktural yang jelas, membantu mesin pencari mengindeks halaman dengan lebih baik dan mempermudah alat bantu pembaca layar (screen reader) bagi penyandang disabilitas."
      },
      {
        id: 5,
        question: "Apa tujuan utama dari tag <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> dalam elemen <head>?",
        options: {
          A: "Mengaktifkan tema gelap (dark mode) secara otomatis pada peramban",
          B: "Mengatur skala dan lebar tampilan agar responsif menyesuaikan ukuran layar perangkat mobile",
          C: "Mempercepat pemuatan font eksternal dari CDN",
          D: "Menyimpan data otentikasi sesi ke dalam browser cookie"
        },
        correctAnswer: "B",
        explanation: "Viewport meta tag memberitahu browser mobile agar menyamakan lebar viewport dengan lebar layar fisik perangkat, menjadi dasar utama pembuatan website responsif."
      },
      {
        id: 6,
        question: "Manakah sintaks yang paling benar untuk menghubungkan berkas stylesheet CSS eksternal ke dalam dokumen HTML?",
        options: {
          A: "<style src=\"style.css\"></style>",
          B: "<link rel=\"stylesheet\" href=\"style.css\">",
          C: "<script type=\"text/css\" src=\"style.css\"></script>",
          D: "<css href=\"style.css\">"
        },
        correctAnswer: "B",
        explanation: "Sintaks standar yang direkomendasikan adalah menggunakan elemen <link rel=\"stylesheet\" href=\"style.css\"> yang diletakkan di dalam bagian <head>."
      },
      {
        id: 7,
        question: "Apa perbedaan mendasar antara elemen block-level (seperti <div> atau <p>) dengan elemen inline (seperti <span> atau <a>)?",
        options: {
          A: "Elemen block memulai baris baru dan mengambil lebar penuh yang tersedia, sedangkan elemen inline hanya selebar kontennya",
          B: "Elemen inline tidak dapat diubah warnanya menggunakan CSS",
          C: "Elemen block hanya dapat menampung teks pendek dan tidak boleh diisi tag lain",
          D: "Elemen inline otomatis merender teks menjadi huruf tebal dan miring"
        },
        correctAnswer: "A",
        explanation: "Elemen block-level selalu diawali pada baris baru dan memanjang memenuhi lebar kontainernya, sedangkan elemen inline berada sejajar dalam baris teks dan lebarnya sesuai isi kontennya."
      },
      {
        id: 8,
        question: "Atribut manakah yang wajib dicantumkan pada tag <img> untuk menyediakan deskripsi gambar saat gagal dimuat dan demi aksesibilitas?",
        options: {
          A: "title",
          B: "alt",
          C: "caption",
          D: "description"
        },
        correctAnswer: "B",
        explanation: "Atribut 'alt' (alternative text) menyajikan teks deskriptif jika gambar gagal dimuat dan dibacakan oleh pembaca layar (screen reader) bagi pengguna tuna netra."
      },
      {
        id: 9,
        question: "Apa fungsi utama dari deklarasi <!DOCTYPE html> pada baris pertama sebuah dokumen web?",
        options: {
          A: "Memberi tahu browser agar merender halaman menggunakan standar HTML5 modern",
          B: "Menghubungkan dokumen HTML secara otomatis dengan file JavaScript",
          C: "Mengenkripsi konten web agar aman dari serangan peretas siber",
          D: "Menentukan bahasa pemrograman server-side yang digunakan backend"
        },
        correctAnswer: "A",
        explanation: "Deklarasi <!DOCTYPE html> berfungsi memberitahu browser bahwa dokumen ini menggunakan standar HTML5 terbaru dan mencegah browser masuk ke mode rendering kuno (quirks mode)."
      },
      {
        id: 10,
        question: "Atribut formulir HTML5 manakah yang memastikan bahwa pengguna tidak boleh mengosongkan input sebelum formulir dikirim?",
        options: {
          A: "disabled",
          B: "readonly",
          C: "required",
          D: "mandatory"
        },
        correctAnswer: "C",
        explanation: "Atribut 'required' pada elemen input mewajibkan kolom tersebut diisi terlebih dahulu sebelum form dapat disubmit secara valid."
      }
    ]
  },

  {
    id: "materi-2",
    number: "Materi 2",
    tag: "UI/UX Design",
    title: "Prinsip UI/UX Design & Desain Interaktif",
    shortDesc: "Kuasai cara merancang antarmuka pengguna yang bersih, estetis, mudah digunakan, serta memahami teori hierarki visual, kontras warna, dan pengalaman pengguna (UX).",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`,

    // --- 1. Video Pembelajaran ---
    video: {
      title: "Dasar Hierarki Visual dan Desain Antarmuka Modern",
      embedUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
      description: "Memahami bagaimana mata pengguna memindai layar (pola F dan pola Z), pemanfaatan ruang kosong (whitespace), konsistensi ukuran tipografi, dan perancangan tombol Call-to-Action (CTA) yang efektif.",
      keyPoints: [
        "Pemanfaatan Whitespace (Negative Space) agar tampilan tidak sesak dan mata pengguna nyaman.",
        "Teori Hierarki Tipografi: Perbedaan tegas antara Heading 1, Subtitle, dan Body Text.",
        "Psikologi Warna & Kontras: Memilih palet yang memenuhi standar WCAG keterbacaan.",
        "Pemberian umpan balik instan (Micro-interactions) pada tombol dan status form."
      ]
    },

    // --- 2. Buku / E-Book Panduan Digital ---
    book: {
      title: "Buku Panduan: Esensi Desain UI/UX yang Human-Centered",
      ebookBadge: "E-Book UI/UX Design Guide",
      ebookUrl: "https://books.google.co.id/books?hl=id&lr=&id=itUvEAAAQBAJ&oi=fnd&pg=PA11&dq=dasar+pemrograman&ots=PuE7RuNp0T&sig=lKQkbuOBdTn84RNoySPmdnCsWL4&redir_esc=y#v=onepage&q=dasar%20pemrograman&f=false",
      ebookLabel: "Buka E-Book Referensi Lengkap (Interaction Design)",
      description: "Panduan lengkap merancang produk digital yang ramah pengguna, berpegang pada prinsip hierarki visual, konsistensi antarmuka, dan aksesibilitas standar industri.",
      chapters: [
        {
          id: "bab-1",
          title: "Bab 1: Memahami Perbedaan UI dan UX",
          content: `
            <h2>Bab 1: Memahami Perbedaan UI dan UX</h2>
            <p>Sering kali istilah UI (User Interface) dan UX (User Experience) tertukar. Meskipun saling berhubungan erat, keduanya memiliki fokus yang berbeda dalam siklus pengembangan produk digital.</p>
            <p><strong>UI (User Interface)</strong> berfokus pada elemen visual yang dilihat dan disentuh oleh pengguna: warna tombol, jenis tipografi, ilustrasi, bentuk kartu, dan tata letak grafis.</p>
            <p><strong>UX (User Experience)</strong> berfokus pada alur proses, kemudahan penggunaan (usability), dan perasaan pengguna saat menyelesaikan tujuannya di dalam sistem.</p>
            <div class="book-callout">
              <strong>Analogi:</strong> Jika sebuah mobil dianalogikan sebagai produk web, maka mesin, transmisi gigi, dan kenyamanan suspensi adalah UX. Sedangkan warna cat, bentuk dashboard, lampu LED, dan tekstur setir adalah UI.
            </div>
          `
        },
        {
          id: "bab-2",
          title: "Bab 2: Hukum Hierarki Visual & Whitespace",
          content: `
            <h2>Bab 2: Hukum Hierarki Visual & Whitespace</h2>
            <p>Pengguna di internet jarang membaca teks kata demi kata; mereka melakukan pemindaian (scanning). Desainer UI bertanggung jawab membimbing mata pengguna menuju informasi terpenting terlebih dahulu.</p>
            <h3>Teknik Menciptakan Hierarki Visual:</h3>
            <ul>
              <li><strong>Ukuran dan Bobot Font:</strong> Judul harus jauh lebih menonjol dibandingkan teks isi.</li>
              <li><strong>Kontras Warna:</strong> Tombol utama (Primary Action) harus kontras dengan latar belakang.</li>
              <li><strong>Whitespace (Ruang Negatif):</strong> Memberikan ruang hening di sekitar elemen penting agar tidak terjadi kelelahan visual (cognitive overload).</li>
              <li><strong>Proximity (Kedekatan):</strong> Elemen yang saling terkait harus dikelompokkan secara berdekatan.</li>
            </ul>
          `
        },
        {
          id: "bab-3",
          title: "Bab 3: Desain Aksesibel & Responsif",
          content: `
            <h2>Bab 3: Desain Aksesibel & Responsif</h2>
            <p>Desain yang baik adalah desain yang dapat digunakan oleh semua orang, termasuk mereka yang memiliki keterbatasan penglihatan atau menggunakan perangkat dengan layar kecil.</p>
            <p>Pedoman Standar Aksesibilitas Konten Web (WCAG) merekomendasikan rasio kontras teks minimal <strong>4.5:1</strong> terhadap warna latar belakang untuk teks ukuran standar.</p>
            <p>Selain itu, target sentuhan (touch target) pada layar ponsel pintar minimal harus berukuran <strong>44x44 piksel</strong> agar jari pengguna dapat menekannya dengan mudah tanpa salah klik.</p>
          `
        }
      ]
    },

    // --- 3. Kuis Pilihan Ganda (10 Pertanyaan) ---
    quiz: [
      {
        id: 1,
        question: "Apakah fokus utama dari User Experience (UX) Design dibandingkan dengan User Interface (UI) Design?",
        options: {
          A: "Menentukan warna gradien dan efek bayangan kartu",
          B: "Meneliti kebutuhan, kemudahan alur proses, dan kepuasan pengguna saat menggunakan sistem",
          C: "Menulis kode CSS stylesheet seefisien mungkin",
          D: "Memilih font berbayar yang paling unik untuk logo"
        },
        correctAnswer: "B",
        explanation: "UX berfokus pada pemahaman pengguna, arsitektur informasi, alur navigasi, kemudahan penyelesaian tugas, dan kepuasan pengalaman secara menyeluruh."
      },
      {
        id: 2,
        question: "Apa fungsi utama dari 'Whitespace' (ruang negatif) dalam tata letak desain antarmuka UI?",
        options: {
          A: "Menghemat ruang agar halaman web terlihat padat dan sesak",
          B: "Memberi jeda visual pada mata pengguna, mempertegas hierarki, dan mencegah kejenuhan visual",
          C: "Tempat khusus untuk meletakkan iklan banner promosi",
          D: "Hanya tanda bahwa desainer belum selesai menggambar ilustrasi"
        },
        correctAnswer: "B",
        explanation: "Whitespace membantu mengarahkan fokus mata pengguna ke konten utama, memberikan ruang bernapas visual, dan menciptakan tata letak yang bersih dan profesional."
      },
      {
        id: 3,
        question: "Berapa rasio kontras warna minimum yang disarankan oleh standar WCAG 2.1 AA untuk teks berukuran normal?",
        options: {
          A: "1.5:1",
          B: "2:1",
          C: "4.5:1",
          D: "10:1"
        },
        correctAnswer: "C",
        explanation: "Standar WCAG 2.1 AA menetapkan rasio kontras minimal 4.5:1 untuk teks normal agar mudah dibaca pengguna dengan daya lihat rendah atau di layar silau."
      },
      {
        id: 4,
        question: "Prinsip desain 'Proximity' dalam Hukum Gestalt menyatakan bahwa:",
        options: {
          A: "Elemen yang diletakkan saling berdekatan akan dipersepsikan sebagai satu kelompok yang memiliki keterkaitan informasi",
          B: "Semua tombol harus memiliki bentuk lingkaran sempurna",
          C: "Warna tombol aksi harus selalu berwarna merah terang",
          D: "Gambar harus selalu diletakkan di sisi sebelah kanan halaman"
        },
        correctAnswer: "A",
        explanation: "Hukum kedekatan (Proximity) membantu pengguna mengelompokkan informasi secara instan tanpa perlu membaca panduan manual."
      },
      {
        id: 5,
        question: "Berapa ukuran target sentuh (touch target) minimal yang disarankan panduan Material Design dan iOS untuk antarmuka mobile?",
        options: {
          A: "10 x 10 piksel",
          B: "20 x 20 piksel",
          C: "44 x 44 hingga 48 x 48 piksel",
          D: "100 x 100 piksel"
        },
        correctAnswer: "C",
        explanation: "Rekomendasi dari Apple Human Interface & Google Material Design adalah sekitar 44x44 hingga 48x48 piksel agar nyaman disentuh ibu jari tanpa salah pencet."
      },
      {
        id: 6,
        question: "Pola pemindaian mata pengguna (reading pattern) yang paling umum ketika membaca halaman web berbasis banyak teks adalah:",
        options: {
          A: "Pola Huruf F (F-Shape Pattern)",
          B: "Pola Huruf O (Circular Pattern)",
          C: "Pola Garis Lurus Bawah",
          D: "Pola Acak (Random Scan)"
        },
        correctAnswer: "A",
        explanation: "Riset Nielsen Norman Group menunjukkan pengguna membaca teks di web mengikuti pola F: membaca baris atas secara horizontal, lalu turun sedikit dan membaca lebih pendek, kemudian memindai vertikal ke bawah."
      },
      {
        id: 7,
        question: "Apa yang dimaksud dengan 'Micro-interaction' dalam desain antarmuka digital?",
        options: {
          A: "Sistem server berskala jutaan pengguna bersamaan",
          B: "Umpan balik visual/audio kecil dan halus saat pengguna melakukan interaksi (misalnya tombol berubah warna atau ikon bergetar)",
          C: "Tampilan antarmuka yang berukuran sangat kecil di bawah 100 piksel",
          D: "Teknik memadatkan database relasional"
        },
        correctAnswer: "B",
        explanation: "Micro-interactions adalah detail interaktif kecil (animasi hover tombol, suara centang sukses, loader putar) yang memberikan umpan balik langsung dan membuat produk terasa hidup."
      },
      {
        id: 8,
        question: "Elemen Call-To-Action (CTA) pada sebuah antarmuka pengguna dirancang dengan tujuan utama untuk:",
        options: {
          A: "Menampilkan teks hak cipta pembuat website di bagian footer",
          B: "Mengarahkan perhatian dan memandu pengguna melakukan aksi penting yang diinginkan (seperti mendaftar atau membeli)",
          C: "Memperlambat kecepatan pengguna agar berada lebih lama di website",
          D: "Menyembunyikan informasi penting agar website terlihat misterius"
        },
        correctAnswer: "B",
        explanation: "Tombol Call to Action (CTA) seperti 'Mulai Belajar Sekarang' dibuat kontras dan menonjol untuk memandu aksi utama yang diharapkan dari pengguna."
      },
      {
        id: 9,
        question: "Hukum Hick (Hick's Law) dalam prinsip interaksi pengguna menyatakan bahwa:",
        options: {
          A: "Waktu yang dibutuhkan untuk mengambil keputusan akan meningkat seiring dengan bertambahnya jumlah dan kompleksitas pilihan",
          B: "Warna latar belakang aplikasi web harus selalu menggunakan warna putih polos",
          C: "Navigasi aplikasi harus disembunyikan di dalam menu rahasia",
          D: "Pengguna selalu membaca seluruh paragraf dengan cermat dari awal sampai akhir"
        },
        correctAnswer: "A",
        explanation: "Hick's Law membuktikan bahwa semakin banyak pilihan yang disodorkan kepada pengguna, semakin lama waktu yang dibutuhkan untuk memutuskan. Maka menu harus ringkas dan terfokus."
      },
      {
        id: 10,
        question: "Metode pengujian pengguna yang membandingkan performa dua variasi desain tampilan yang berbeda (Versi A vs Versi B) disebut:",
        options: {
          A: "Waterfall Testing",
          B: "A/B Testing (Split Testing)",
          C: "Load Testing",
          D: "Unit Testing"
        },
        correctAnswer: "B",
        explanation: "A/B testing adalah eksperimen kuantitatif di mana dua versi desain diuji kepada dua kelompok pengguna secara acak untuk melihat versi mana yang menghasilkan tingkat konversi atau kepuasan terbaik."
      }
    ]
  },

  {
    id: "materi-3",
    number: "Materi 3",
    tag: "Artificial Intelligence",
    title: "Kecerdasan Buatan (AI) & Masa Depan Teknologi",
    shortDesc: "Kenali konsep dasar Artificial Intelligence, cara kerja Machine Learning, Large Language Model (LLM), serta dampaknya terhadap inovasi dunia pendidikan masa kini.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v1a3 3 0 0 1 3 3v1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v1a3 3 0 0 1-3 3v1a4 4 0 0 1-8 0v-1a3 3 0 0 1-3-3v-1a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2v-1a3 3 0 0 1 3-3V6a4 4 0 0 1 4-4z"></path><circle cx="9" cy="11" r="1"></circle><circle cx="15" cy="11" r="1"></circle><path d="M10 16h4"></path></svg>`,

    // --- 1. Video Pembelajaran ---
    video: {
      title: "Bagaimana Machine Learning & AI Generatif Bekerja",
      embedUrl: "https://www.youtube.com/embed/ukzFI9rgwfU",
      description: "Penjelasan komprehensif namun mudah dipahami mengenai perbedaan antara pemrograman konvensional dan machine learning, bagaimana model dilatih menggunakan data, dan cara kerja jaringan saraf tiruan (neural networks).",
      keyPoints: [
        "Perbedaan mendasar: Aturan + Data vs Data + Jawaban yang menghasilkan Pola.",
        "Kategori utama: Supervised Learning, Unsupervised Learning, dan Reinforcement Learning.",
        "Evolusi kecerdasan buatan dari sistem pakar hingga Transformer & Generative AI.",
        "Pentingnya etika kecerdasan buatan, privasi data, dan bias algoritma."
      ]
    },

    // --- 2. Buku / E-Book Panduan Digital ---
    book: {
      title: "Buku Panduan: Fondasi Kecerdasan Buatan & Machine Learning",
      ebookBadge: "E-Book AI & Machine Learning",
      ebookUrl: "https://books.google.co.id/books?hl=id&lr=&id=itUvEAAAQBAJ&oi=fnd&pg=PA11&dq=dasar+pemrograman&ots=PuE7RuNp0T&sig=lKQkbuOBdTn84RNoySPmdnCsWL4&redir_esc=y#v=onepage&q=dasar%20pemrograman&f=false",
      ebookLabel: "Buka E-Book Referensi Lengkap (Google ML Guide)",
      description: "Buku pegangan interaktif mengenai dasar-dasar kecerdasan buatan, jenis-jenis pembelajaran mesin, jaringan saraf dalam, dan etika implementasi AI masa depan.",
      chapters: [
        {
          id: "bab-1",
          title: "Bab 1: Apa Sebenarnya Kecerdasan Buatan?",
          content: `
            <h2>Bab 1: Apa Sebenarnya Kecerdasan Buatan?</h2>
            <p>Kecerdasan Buatan (Artificial Intelligence / AI) adalah cabang ilmu komputer yang bertujuan menciptakan mesin atau perangkat lunak yang mampu meniru fungsi kognitif manusia, seperti belajar, bernalar, memecahkan masalah, dan memahami bahasa alami.</p>
            <h3>Tiga Lapisan Konsep AI:</h3>
            <ul>
              <li><strong>Artificial Intelligence (AI):</strong> Konsep luas dari sistem cerdas yang mampu bertindak rasional.</li>
              <li><strong>Machine Learning (ML):</strong> Cabang AI yang memungkinkan komputer belajar langsung dari data tanpa perlu diprogram secara eksplisit untuk setiap skenario.</li>
              <li><strong>Deep Learning (DL):</strong> Bagian dari ML yang menggunakan arsitektur jaringan saraf tiruan berlapis (Deep Neural Networks) untuk menganalisis data kompleks seperti gambar, audio, dan teks.</li>
            </ul>
            <div class="book-callout">
              <strong>Kutipan:</strong> "Machine learning adalah sains melatih komputer agar dapat bertindak tanpa diprogram secara eksplisit." — Arthur Samuel
            </div>
          `
        },
        {
          id: "bab-2",
          title: "Bab 2: Tipe-Tipe Machine Learning",
          content: `
            <h2>Bab 2: Tipe-Tipe Machine Learning</h2>
            <p>Secara umum, terdapat tiga paradigma utama pembelajaran mesin:</p>
            <h3>1. Supervised Learning (Pembelajaran Terarah)</h3>
            <p>Algoritma dilatih menggunakan dataset yang telah memiliki label (jawaban yang benar). Contoh: Mengidentifikasi email spam berdasarkan ribuan contoh email yang telah ditandai sebagai spam atau bukan spam.</p>
            <h3>2. Unsupervised Learning (Pembelajaran Tak Terarah)</h3>
            <p>Data yang diberikan tidak memiliki label. Komputer bertugas menemukan pola tersembunyi atau melakukan klasterisasi (clustering). Contoh: Mengelompokkan pelanggan e-commerce berdasarkan pola belanjanya.</p>
            <h3>3. Reinforcement Learning (Pembelajaran Penguatan)</h3>
            <p>Agen belajar melalui uji coba (trial and error) di dalam lingkungan tertentu dengan mekanisme hadiah (reward) dan penalti (punishment). Contoh: AI yang belajar bermain catur atau mengendalikan robot berjalan.</p>
          `
        },
        {
          id: "bab-3",
          title: "Bab 3: AI Generatif & Dampaknya bagi Pendidikan",
          content: `
            <h2>Bab 3: AI Generatif & Dampaknya bagi Pendidikan</h2>
            <p>AI Generatif menggunakan model bahasa besar (Large Language Models / LLM) yang dilatih pada miliaran kalimat untuk menghasilkan teks, gambar, suara, atau kode program baru yang orisinal.</p>
            <p>Dalam bidang media pembelajaran interaktif, AI membuka peluang pembelajaran yang disesuaikan secara personal (personalized learning). Setiap siswa dapat memperoleh bimbingan belajar dengan ritme kecepatan mereka masing-masing.</p>
            <div class="book-callout">
              <strong>Tantangan Etika:</strong> Pemanfaatan AI harus diimbangi dengan integritas akademik, verifikasi fakta (mencegah halusinasi AI), dan perlindungan hak privasi siswa.
            </div>
          `
        }
      ]
    },

    // --- 3. Kuis Pilihan Ganda (10 Pertanyaan) ---
    quiz: [
      {
        id: 1,
        question: "Metode Machine Learning di mana komputer dilatih menggunakan dataset yang sudah memiliki label jawaban yang benar disebut:",
        options: {
          A: "Supervised Learning (Pembelajaran Terarah)",
          B: "Unsupervised Learning (Pembelajaran Tak Terarah)",
          C: "Reinforcement Learning (Pembelajaran Penguatan)",
          D: "Manual Data Entry"
        },
        correctAnswer: "A",
        explanation: "Supervised Learning menggunakan data berlabel sehingga model dapat belajar memetakan fitur masukan ke label target yang benar."
      },
      {
        id: 2,
        question: "Manakah contoh penerapan nyata dari paradigma Reinforcement Learning?",
        options: {
          A: "Mengelompokkan data pelanggan toko swalayan berdasarkan kota asal",
          B: "Agen AI belajar mengemudikan kendaraan otonom melalui simulasi hadiah (reward) dan penalti (punishment)",
          C: "Menghitung rata-rata nilai ujian siswa di lembar spreadsheet",
          D: "Menyimpan foto keluarga ke dalam hard disk komputer"
        },
        correctAnswer: "B",
        explanation: "Reinforcement learning bertumpu pada konsep agen yang mengambil tindakan mandiri di dalam lingkungan dinamis untuk memaksimalkan akumulasi hadiah (reward)."
      },
      {
        id: 3,
        question: "Apa kepanjangan dari singkatan LLM dalam konteks teknologi Artificial Intelligence modern?",
        options: {
          A: "Linear Logic Machine",
          B: "Large Language Model",
          C: "Linked Learning Module",
          D: "Low Latency Memory"
        },
        correctAnswer: "B",
        explanation: "LLM (Large Language Model) adalah model kecerdasan buatan berbasis arsitektur Transformer yang dilatih dengan volume data teks masif untuk memahami dan menghasilkan bahasa alami."
      },
      {
        id: 4,
        question: "Istilah ketika model AI menghasilkan informasi yang terdengar meyakinkan namun sebenarnya fiktif, keliru, atau salah fakta disebut:",
        options: {
          A: "Overfitting",
          B: "Underfitting",
          C: "Halusinasi AI (Hallucination)",
          D: "Cross Validation"
        },
        correctAnswer: "C",
        explanation: "Halusinasi AI adalah fenomena di mana model bahasa besar mengarang informasi yang terdengar fasih dan masuk akal namun tidak memiliki dasar fakta yang valid."
      },
      {
        id: 5,
        question: "Bagian dari Machine Learning yang menggunakan jaringan saraf tiruan berlapis dalam (Multi-layer Neural Network) disebut:",
        options: {
          A: "Deep Learning",
          B: "Surface Coding",
          C: "Linear Regression",
          D: "Binary Search"
        },
        correctAnswer: "A",
        explanation: "Deep Learning memanfaatkan banyak lapisan tersembunyi (deep neural network layers) untuk mengekstraksi representasi data tingkat tinggi secara otomatis."
      },
      {
        id: 6,
        question: "Arsitektur jaringan saraf tiruan yang merevolusi AI generatif modern dan menjadi pondasi utama model seperti GPT dan Gemini adalah:",
        options: {
          A: "Arsitektur Transformer dengan mekanisme Self-Attention",
          B: "Arsitektur Decision Tree sederhana",
          C: "Arsitektur Relational Database",
          D: "Arsitektur Client-Server konvensional"
        },
        correctAnswer: "A",
        explanation: "Arsitektur Transformer (diperkenalkan dalam paper 'Attention Is All You Need' oleh tim Google) memungkinkan pemrosesan sekuens teks secara paralel dengan mekanisme Self-Attention."
      },
      {
        id: 7,
        question: "Apa yang dimaksud dengan fenomena 'Overfitting' pada model Machine Learning?",
        options: {
          A: "Model gagal berjalan karena komputer kehabisan daya baterai",
          B: "Model terlalu menghafal data latih secara detail hingga kehilangan kemampuan untuk memprediksi data baru yang belum pernah dilihat",
          C: "Model mampu memprediksi semua hal di dunia secara sempurna tanpa cacat",
          D: "Model menghapus dataset yang tersimpan di server secara tidak sengaja"
        },
        correctAnswer: "B",
        explanation: "Overfitting terjadi ketika model memiliki akurasi sangat tinggi pada data latih (training data) tetapi performanya buruk saat dihadapkan pada data baru di dunia nyata karena terlalu kaku menghafal pola derau."
      },
      {
        id: 8,
        question: "Manakah contoh nyata penerapan Unsupervised Learning dalam industri teknologi modern?",
        options: {
          A: "Pengelompokan (Clustering) segmen pelanggan e-commerce berdasarkan kemiripan pola belanja tanpa label awal",
          B: "Deteksi email spam di mana seluruh email telah dilabeli 'Spam' dan 'Bukan Spam'",
          C: "Sistem pengenal wajah yang sudah diberi foto dan nama pemilik",
          D: "Aplikasi konversi mata uang rupiah ke dolar"
        },
        correctAnswer: "A",
        explanation: "Unsupervised learning tidak menggunakan label target awal; algoritma mencari pola dan mengelompokkan data berdasarkan kemiripan fitur secara mandiri (misalnya K-Means clustering)."
      },
      {
        id: 9,
        question: "Proses melatih lebih lanjut model dasar AI (Foundation Model) menggunakan data spesifik domain tertentu agar mahir pada topik khusus disebut:",
        options: {
          A: "Data Scraping",
          B: "Fine-Tuning",
          C: "Overclocking",
          D: "Format Factory"
        },
        correctAnswer: "B",
        explanation: "Fine-Tuning adalah teknik penyesuaian bobot parameter model fondasi yang sudah terlatih menggunakan dataset domain khusus (misal terminologi medis, hukum, atau pendidikan) agar akurasinya lebih tinggi."
      },
      {
        id: 10,
        question: "Dalam implementasi kecerdasan buatan di dunia pendidikan, manakah pertimbangan etika yang paling krusial?",
        options: {
          A: "Menolak kehadiran seluruh teknologi baru secara permanen",
          B: "Perlindungan privasi data siswa, pencegahan bias algoritma, dan menjaga integritas akademik",
          C: "Menggantikan seluruh tenaga pengajar manusia dengan robot dalam semalam",
          D: "Mewajibkan siswa hanya menggunakan komputer generasi lama"
        },
        correctAnswer: "B",
        explanation: "Penerapan AI dalam pendidikan menuntut penjagaan privasi data pelajar, penghindaran bias algoritmik, serta menjaga integritas kejujuran akademik siswa saat mengerjakan tugas evaluasi."
      }
    ]
  }
];

const MATERIAL_META = {
  "materi-1": ["Dasar Pemrograman Web & HTML Modern", "Web Programming", "Pelajari struktur halaman, elemen HTML modern, dan semantik web."],
  "materi-2": ["CSS Modern & Desain Responsif", "Web Programming", "Atur tampilan, tata letak, dan responsivitas halaman web."],
  "materi-3": ["JavaScript & Pemrograman Interaktif", "Web Programming", "Bangun perilaku interaktif dengan JavaScript dan DOM."]
};
LEARNING_MATERIALS.forEach((material) => {
  const meta = MATERIAL_META[material.id];
  if (meta) [material.title, material.tag, material.shortDesc] = meta;
  const courseResources = {
    "materi-1": {
      video: ["HTML Tutorial for Beginners: HTML Crash Course", "https://www.youtube.com/embed/UB1O30fR-EE", "Mengenal struktur dokumen HTML dan elemen yang membentuk halaman web.", ["Kerangka dokumen HTML", "Elemen teks dan tautan", "Semantik dan struktur halaman"]],
      ebookTitle: "Panduan HTML Modern", source: "https://books.google.co.id/books?hl=id&lr=&id=itUvEAAAQBAJ&oi=fnd&pg=PA11&dq=dasar+pemrograman&ots=PuE7RuNp0T&sig=lKQkbuOBdTn84RNoySPmdnCsWL4&redir_esc=y#v=onepage&q=dasar%20pemrograman&f=false"
    },
    "materi-2": {
      video: ["CSS Tutorial - Zero to Hero", "https://www.youtube.com/embed/1PnVor36_40", "Belajar aturan CSS, box model, tata letak, dan teknik responsif.", ["Selector dan deklarasi CSS", "Box model", "Flexbox dan responsive design"]],
      ebookTitle: "Panduan CSS dan Tata Letak Responsif", source: "https://books.google.co.id/books?hl=id&lr=&id=itUvEAAAQBAJ&oi=fnd&pg=PA11&dq=dasar+pemrograman&ots=PuE7RuNp0T&sig=lKQkbuOBdTn84RNoySPmdnCsWL4&redir_esc=y#v=onepage&q=dasar%20pemrograman&f=false"
    },
    "materi-3": {
      video: ["JavaScript Tutorial for Beginners", "https://www.youtube.com/embed/W6NZfCO5SIk", "Dasar JavaScript dari variabel dan fungsi hingga interaksi dengan halaman web.", ["Variabel dan tipe data", "Kondisi, perulangan, dan fungsi", "DOM dan event"]],
      ebookTitle: "Panduan JavaScript Interaktif", source: "https://books.google.co.id/books?hl=id&lr=&id=itUvEAAAQBAJ&oi=fnd&pg=PA11&dq=dasar+pemrograman&ots=PuE7RuNp0T&sig=lKQkbuOBdTn84RNoySPmdnCsWL4&redir_esc=y#v=onepage&q=dasar%20pemrograman&f=false"
    }
  };
  const resource = courseResources[material.id];
  if (resource) {
    material.video = { title: resource.video[0], embedUrl: resource.video[1], description: resource.video[2], keyPoints: resource.video[3] };
    material.book = {
      title: resource.ebookTitle,
      ebookBadge: material.title,
      ebookUrl: resource.source,
      ebookLabel: "Buka referensi di MDN Web Docs",
      description: `Ringkasan konsep penting untuk ${material.title}.`,
    };
    const quizBank = {
      "materi-1": [
        ["Elemen mana yang menampung konten utama unik pada halaman?", { A: "<main>", B: "<aside>", C: "<footer>", D: "<head>" }, "A", "<main> menandai konten utama halaman dan umumnya digunakan satu kali.", "Semantic HTML"],
        ["Atribut apa yang memberi teks alternatif pada gambar?", { A: "title", B: "alt", C: "srcset", D: "name" }, "B", "Atribut alt menyediakan alternatif tekstual dan membantu aksesibilitas.", "Link dan Image"],
        ["Atribut apa yang mencegah form dikirim saat input wajib masih kosong?", { A: "checked", B: "disabled", C: "required", D: "placeholder" }, "C", "Atribut required mengaktifkan validasi bawaan untuk field yang wajib diisi.", "Form"],
        ["Elemen mana yang paling tepat untuk judul utama halaman?", { A: "<h1>", B: "<strong>", C: "<title>", D: "<label>" }, "A", "<h1> adalah heading tingkat tertinggi pada konten halaman.", "Heading dan Paragraph"],
        ["Elemen apa yang digunakan untuk membuat tautan ke halaman lain?", { A: "<link>", B: "<a>", C: "<href>", D: "<navlink>" }, "B", "Elemen <a> dengan atribut href membuat hyperlink.", "Link dan Image"],
        ["Elemen mana yang membuat daftar berurutan dengan nomor?", { A: "<ul>", B: "<dl>", C: "<ol>", D: "<li>" }, "C", "<ol> menampilkan ordered list; setiap itemnya ditulis dengan <li>.", "List"],
        ["Pasangan elemen tabel mana yang mewakili satu baris dan satu sel data?", { A: "<tr> dan <td>", B: "<th> dan <table>", C: "<tbody> dan <thead>", D: "<row> dan <cell>" }, "A", "<tr> membentuk baris tabel dan <td> berisi sel data pada baris itu.", "Table"],
        ["Bagaimana menghubungkan label ke input dengan benar?", { A: "label name sama dengan input id", B: "label for sama dengan input id", C: "label href sama dengan input name", D: "input alt sama dengan label id" }, "B", "Nilai for pada label harus sama dengan id pada input agar keduanya terhubung.", "Form"],
        ["Elemen mana yang berisi navigasi utama situs?", { A: "<nav>", B: "<aside>", C: "<figure>", D: "<address>" }, "A", "<nav> menandai bagian yang berisi tautan navigasi penting.", "Semantic HTML"],
        ["Elemen apa yang menandai paragraf teks?", { A: "<p>", B: "<para>", C: "<text>", D: "<bodytext>" }, "A", "Elemen <p> digunakan untuk sebuah paragraf.", "Heading dan Paragraph"]
      ],
      "materi-2": [
        ["Bagian box model yang berada di antara content dan border adalah ...", { A: "margin", B: "padding", C: "outline", D: "gap" }, "B", "Padding adalah ruang di dalam border yang mengelilingi content.", "Box Model"],
        ["Properti Flexbox apa yang mengatur perataan sepanjang sumbu utama?", { A: "align-items", B: "justify-content", C: "flex-wrap", D: "position" }, "B", "justify-content mengatur distribusi item di sepanjang main axis.", "Flexbox"],
        ["Fitur CSS apa yang menerapkan aturan berdasarkan lebar viewport?", { A: "pseudo-class", B: "keyframes", C: "media query", D: "attribute selector" }, "C", "Media query memungkinkan gaya berbeda diterapkan sesuai kondisi viewport.", "Responsive Design"],
        ["Selector mana yang memilih semua elemen dengan class card?", { A: "#card", B: ".card", C: "card()", D: "*card" }, "B", "Selector class ditulis dengan titik diikuti nama class.", "CSS Selector"],
        ["Properti apa yang mengubah warna teks?", { A: "font-color", B: "text-color", C: "color", D: "foreground" }, "C", "Properti color mengatur warna foreground teks.", "Color dan Typography"],
        ["Properti apa yang mengatur jarak di luar border elemen?", { A: "padding", B: "margin", C: "line-height", D: "outline" }, "B", "Margin adalah ruang di luar border yang memisahkan elemen dari sekitarnya.", "Box Model"],
        ["Deklarasi apa yang menjadikan sebuah container flex container?", { A: "position: flex", B: "display: flex", C: "flex: display", D: "layout: row" }, "B", "display: flex mengaktifkan tata letak Flexbox pada container.", "Flexbox"],
        ["Properti CSS Grid apa yang mendefinisikan ukuran kolom?", { A: "grid-template-columns", B: "grid-auto-flow", C: "column-count", D: "flex-basis" }, "A", "grid-template-columns menentukan track kolom pada grid.", "CSS Grid"],
        ["Properti apa yang mengatur jarak antar-item pada Flexbox atau Grid?", { A: "gap", B: "space", C: "margin-inside", D: "padding-between" }, "A", "gap memberi jarak di antara item pada layout Flexbox maupun Grid.", "CSS Grid"],
        ["Apa tujuan pendekatan responsive design?", { A: "Mengunci lebar halaman", B: "Menyesuaikan tata letak dengan perangkat dan viewport", C: "Menghapus stylesheet pada ponsel", D: "Mengganti HTML dengan gambar" }, "B", "Desain responsif membuat konten tetap dapat digunakan pada berbagai ukuran layar.", "Responsive Design"]
      ],
      "materi-3": [
        ["Kata kunci mana yang tepat untuk nilai yang tidak akan ditetapkan ulang?", { A: "var", B: "let", C: "const", D: "static" }, "C", "const membuat binding yang tidak dapat ditetapkan ulang.", "Variable"],
        ["Metode DOM apa yang memilih elemen berdasarkan selector CSS pertama yang cocok?", { A: "getElementsByName", B: "querySelector", C: "createElement", D: "append" }, "B", "querySelector mengembalikan kecocokan pertama dari selector CSS.", "DOM"],
        ["Operator mana yang membandingkan nilai dan tipe data secara ketat?", { A: "=", B: "==", C: "===", D: ":=" }, "C", "Operator === membandingkan nilai tanpa melakukan konversi tipe.", "Conditional"],
        ["Tipe data dari nilai true adalah ...", { A: "String", B: "Boolean", C: "Number", D: "Object" }, "B", "true dan false adalah nilai bertipe Boolean.", "Data Type"],
        ["Pernyataan apa yang menjalankan blok ketika kondisi bernilai benar?", { A: "if", B: "repeat", C: "select", D: "when" }, "A", "Pernyataan if menjalankan blok berdasarkan hasil kondisi.", "Conditional"],
        ["Loop apa yang cocok untuk mengulang kode sejumlah iterasi tertentu?", { A: "for", B: "switch", C: "try", D: "import" }, "A", "Loop for umum digunakan saat inisialisasi, kondisi, dan perubahan iterasi dapat ditentukan.", "Loop"],
        ["Kata kunci apa yang mengirim nilai dari sebuah function?", { A: "yield", B: "return", C: "break", D: "export" }, "B", "return mengakhiri pemanggilan fungsi dan dapat mengirim nilai kembali.", "Function"],
        ["Apa hasil document.querySelector('.card')?", { A: "Semua class card sebagai array", B: "Elemen pertama yang cocok atau null", C: "Nama class card", D: "Elemen baru" }, "B", "querySelector menghasilkan elemen pertama yang cocok, atau null jika tidak ada.", "DOM"],
        ["Properti apa yang mengubah teks elemen tanpa membaca HTML sebagai markup?", { A: "innerHTML", B: "textContent", C: "outerHTML", D: "styleText" }, "B", "textContent membaca atau mengubah konten tekstual sebuah node.", "DOM"],
        ["Parameter pertama addEventListener untuk menangani klik adalah ...", { A: "'press'", B: "'submit'", C: "'click'", D: "'changeText'" }, "C", "Nama event klik pada DOM adalah click.", "Event"]
      ]
    };
    material.quiz = quizBank[material.id].map(([question, options, correctAnswer, explanation, relatedTopic], index) => ({
      id: index + 1, question, options, correctAnswer, explanation, relatedTopic
    }));
  }
});

// Ganti konten contoh lama dengan kurikulum jaringan komputer.
const networkingIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5"></circle><circle cx="5" cy="5" r="2"></circle><circle cx="19" cy="5" r="2"></circle><circle cx="5" cy="19" r="2"></circle><circle cx="19" cy="19" r="2"></circle><path d="m10.2 10.2-3.8-3.8m7.4 3.8 3.8-3.8m-7.4 7.4-3.8 3.8m7.4-3.8 3.8 3.8"></path></svg>`;
const networkingBookUrl = "https://www.netacad.com/courses/networking/networking-basics";
const makeQuiz = (rows) => rows.map(([question, options, correctAnswer, explanation, relatedTopic], index) => ({
  id: index + 1, question, options, correctAnswer, explanation, relatedTopic
}));

const NETWORKING_COURSE = {
  "materi-1": {
    title: "Dasar Jaringan Komputer dan Topologi",
    tag: "Jaringan Komputer",
    shortDesc: "Kenali cara perangkat saling terhubung, jenis jaringan LAN dan WAN, topologi, serta model komunikasi jaringan.",
    video: {
      title: "Pengenalan Dasar Jaringan Komputer",
      embedUrl: "https://www.youtube.com/embed/dlFyNDbzQwg",
      description: "Pengantar konsep jaringan komputer, manfaat jaringan, dan gambaran jalur belajar jaringan.",
      keyPoints: ["Pengertian dan manfaat jaringan komputer", "Perbedaan LAN, WAN, dan jaringan nirkabel", "Topologi jaringan dan peran perangkat penghubung", "Gambaran model OSI dan TCP/IP"]
    },
    book: {
      title: "Panduan Dasar Jaringan Komputer",
      ebookBadge: "Dasar Jaringan Komputer",
      ebookUrl: networkingBookUrl,
      ebookLabel: "Buka kursus Networking Basics dari Cisco Networking Academy",
      description: "Materi pengantar tentang komponen, media, dan protokol jaringan komputer."
    },
    quiz: makeQuiz([
      ["Apa tujuan utama jaringan komputer?", { A: "Menghubungkan perangkat agar dapat bertukar data dan berbagi sumber daya", B: "Mengubah semua perangkat menjadi server", C: "Menghapus kebutuhan sistem operasi", D: "Menyimpan data hanya di router" }, "A", "Jaringan menghubungkan perangkat untuk berkomunikasi dan berbagi sumber daya.", "Konsep jaringan"],
      ["Jaringan yang mencakup area terbatas seperti rumah, lab, atau gedung disebut ...", { A: "WAN", B: "LAN", C: "MAN", D: "PAN" }, "B", "LAN menghubungkan perangkat dalam wilayah geografis yang relatif terbatas.", "Jenis jaringan"],
      ["Jaringan yang menghubungkan perangkat atau jaringan dalam wilayah geografis luas disebut ...", { A: "PAN", B: "LAN", C: "WAN", D: "VLAN" }, "C", "WAN mencakup area luas dan dapat menghubungkan beberapa LAN.", "Jenis jaringan"],
      ["Pada topologi star, perangkat biasanya terhubung ke ...", { A: "Satu perangkat pusat seperti switch", B: "Dua cincin tertutup", C: "Setiap perangkat secara langsung ke semua perangkat lain", D: "Satu kabel tanpa titik pusat" }, "A", "Topologi star memakai perangkat pusat sebagai penghubung antarperangkat.", "Topologi"],
      ["Apa salah satu dampak jika switch pusat pada topologi star rusak?", { A: "Hanya alamat IP yang berubah", B: "Perangkat yang bergantung pada switch tersebut dapat kehilangan koneksi", C: "Jaringan otomatis berubah menjadi WAN", D: "Semua kabel menjadi nirkabel" }, "B", "Switch pusat merupakan titik penting pada topologi star; kerusakannya dapat mengganggu koneksi perangkat yang terhubung.", "Topologi"],
      ["Perangkat apa yang umumnya meneruskan frame di dalam LAN berdasarkan alamat MAC?", { A: "Switch", B: "Modem", C: "Repeater Wi-Fi", D: "DNS server" }, "A", "Switch mempelajari alamat MAC dan meneruskan frame ke port tujuan di LAN.", "Perangkat jaringan"],
      ["Model OSI memiliki berapa lapisan?", { A: "4", B: "5", C: "6", D: "7" }, "D", "Model referensi OSI terdiri dari tujuh lapisan.", "Model jaringan"],
      ["Lapisan OSI yang menangani pengalamatan logis dan routing adalah ...", { A: "Fisik", B: "Data Link", C: "Network", D: "Presentasi" }, "C", "Lapisan Network menangani pengalamatan logis dan pemilihan jalur paket.", "Model jaringan"],
      ["Pada model TCP/IP, protokol IP terutama bekerja pada lapisan ...", { A: "Application", B: "Transport", C: "Internet", D: "Physical" }, "C", "IP berada pada lapisan Internet dalam model TCP/IP.", "Model jaringan"],
      ["Data yang dikirim melintasi jaringan umumnya dibagi menjadi unit-unit yang disebut ...", { A: "Paket", B: "Folder", C: "Formulir", D: "Sel" }, "A", "Packet switching mengirimkan data dalam paket-paket yang dapat dirutekan melalui jaringan.", "Komunikasi data"]
    ])
  },
  "materi-2": {
    title: "Perangkat Jaringan dan Alamat IP",
    tag: "Jaringan Komputer",
    shortDesc: "Pelajari fungsi switch, router, access point, alamat IPv4, subnet mask, gateway, DHCP, dan DNS.",
    video: {
      title: "Perangkat Jaringan: Switch, Router, dan Access Point",
      embedUrl: "https://www.youtube.com/embed/4VePLL3oOvc",
      description: "Mengenal perangkat jaringan yang menghubungkan perangkat lokal ke jaringan lain dan internet.",
      keyPoints: ["Fungsi switch dalam LAN", "Fungsi router untuk menghubungkan jaringan berbeda", "Peran access point pada koneksi Wi-Fi", "Gambaran alamat IP dan layanan jaringan"]
    },
    book: {
      title: "Panduan Perangkat Jaringan dan Pengalamatan IP",
      ebookBadge: "Perangkat & Alamat IP",
      ebookUrl: networkingBookUrl,
      ebookLabel: "Buka kursus Networking Basics dari Cisco Networking Academy",
      description: "Referensi pengantar perangkat jaringan, IPv4, dan layanan konfigurasi jaringan."
    },
    quiz: makeQuiz([
      ["Perangkat yang meneruskan paket antarjaringan berdasarkan alamat IP adalah ...", { A: "Router", B: "Switch layer 2", C: "Hub", D: "Access point saja" }, "A", "Router memilih jalur dan meneruskan paket antarjaringan menggunakan informasi alamat IP.", "Router"],
      ["Switch Ethernet biasanya mempelajari alamat apa untuk meneruskan frame di LAN?", { A: "Alamat MAC", B: "Nama domain", C: "Nomor port TCP", D: "SSID" }, "A", "Switch menggunakan tabel alamat MAC untuk meneruskan frame ke tujuan di LAN.", "Switch"],
      ["Apa fungsi access point dalam jaringan nirkabel?", { A: "Menghubungkan klien Wi-Fi ke jaringan lokal", B: "Menerjemahkan nama domain menjadi IP", C: "Memberikan daya ke kabel listrik", D: "Mengganti fungsi semua router di internet" }, "A", "Access point menyediakan titik akses Wi-Fi dan menjembatani klien nirkabel ke jaringan.", "Access point"],
      ["Berapa panjang alamat IPv4?", { A: "16 bit", B: "32 bit", C: "64 bit", D: "128 bit" }, "B", "Alamat IPv4 memiliki panjang 32 bit dan biasa ditulis sebagai empat oktet desimal.", "IPv4"],
      ["Manakah contoh alamat IPv4 privat?", { A: "192.168.1.25", B: "8.8.8.8", C: "1.1.1.1", D: "203.0.113.8" }, "A", "192.168.1.25 berada dalam rentang privat 192.168.0.0/16.", "IPv4 privat"],
      ["Apa kegunaan subnet mask pada jaringan IPv4?", { A: "Membedakan bagian network dan host dari alamat IP", B: "Mengenkripsi kata sandi Wi-Fi", C: "Mengubah alamat MAC menjadi nama domain", D: "Mengukur panjang kabel" }, "A", "Subnet mask menunjukkan bagian alamat yang mengidentifikasi jaringan dan bagian yang mengidentifikasi host.", "Subnet mask"],
      ["Alamat default gateway pada komputer biasanya menunjuk ke ...", { A: "Router yang menjadi jalur keluar dari jaringan lokal", B: "Printer lokal", C: "Alamat broadcast Wi-Fi", D: "Server penyimpan kata sandi" }, "A", "Default gateway adalah router yang digunakan host untuk mencapai jaringan di luar subnet lokal.", "Gateway"],
      ["Layanan yang dapat memberikan alamat IP secara otomatis kepada klien adalah ...", { A: "DNS", B: "DHCP", C: "HTTP", D: "SSH" }, "B", "DHCP mengalokasikan konfigurasi IP secara otomatis kepada klien.", "DHCP"],
      ["Apa tugas utama DNS?", { A: "Menerjemahkan nama domain menjadi alamat IP", B: "Membagikan alamat MAC baru", C: "Mengenkripsi seluruh lalu lintas Wi-Fi", D: "Menghubungkan kabel ke switch" }, "A", "DNS membantu menemukan alamat IP yang terkait dengan nama domain.", "DNS"],
      ["Apa yang perlu berada dalam subnet yang sama agar host dapat berkomunikasi langsung pada jaringan lokal?", { A: "Network ID yang sama", B: "Nama pengguna yang sama", C: "Alamat MAC yang sama", D: "Port aplikasi yang sama" }, "A", "Host dalam subnet yang sama memiliki bagian network yang sama menurut subnet mask.", "Subnetting"]
    ])
  },
  "materi-3": {
    title: "Protokol, Keamanan, dan Troubleshooting Jaringan",
    tag: "Jaringan Komputer",
    shortDesc: "Pahami TCP, UDP, DNS, DHCP, NAT, firewall, keamanan Wi-Fi, dan langkah awal mendiagnosis gangguan jaringan.",
    video: {
      title: "Protokol Jaringan: TCP, UDP, DNS, DHCP, dan Lainnya",
      embedUrl: "https://www.youtube.com/embed/fTdGWVljEgQ",
      description: "Pengantar protokol yang membantu perangkat bertukar data dan menyediakan layanan jaringan.",
      keyPoints: ["Perbedaan komunikasi TCP dan UDP", "Peran DNS dan DHCP", "Gambaran NAT dan firewall", "Dasar diagnosis konektivitas jaringan"]
    },
    book: {
      title: "Panduan Protokol dan Keamanan Jaringan",
      ebookBadge: "Protokol & Keamanan",
      ebookUrl: networkingBookUrl,
      ebookLabel: "Buka kursus Networking Basics dari Cisco Networking Academy",
      description: "Referensi konsep protokol, keamanan dasar, dan pemecahan masalah jaringan."
    },
    quiz: makeQuiz([
      ["Ciri utama TCP adalah ...", { A: "Berorientasi koneksi dan memastikan pengiriman data secara andal", B: "Tidak menggunakan port", C: "Hanya digunakan untuk Wi-Fi", D: "Selalu lebih cepat karena tidak memeriksa data" }, "A", "TCP membangun koneksi dan menyediakan mekanisme pengurutan serta pengiriman ulang data.", "TCP"],
      ["UDP sering dipilih untuk aplikasi real-time karena ...", { A: "Memiliki overhead lebih rendah dan tidak menunggu koneksi andal", B: "Selalu mengenkripsi data", C: "Tidak memerlukan alamat IP", D: "Mengirim data hanya melalui kabel" }, "A", "UDP tidak membangun koneksi dan tidak menjamin pengiriman, sehingga overhead-nya lebih rendah.", "UDP"],
      ["Layanan apa yang biasanya dicari ketika pengguna mengetik nama situs seperti example.com?", { A: "DNS", B: "DHCP", C: "ARP", D: "NTP" }, "A", "DNS mencari alamat IP berdasarkan nama domain.", "DNS"],
      ["Apa fungsi NAT pada router rumah yang umum?", { A: "Menerjemahkan alamat privat agar beberapa perangkat dapat berbagi koneksi beralamat publik", B: "Mengganti DNS dengan DHCP", C: "Menyambungkan dua kabel fiber secara fisik", D: "Menaikkan kecepatan prosesor" }, "A", "NAT menerjemahkan alamat antara jaringan privat dan jaringan luar.", "NAT"],
      ["Apa fungsi dasar firewall?", { A: "Menyaring lalu lintas jaringan berdasarkan aturan keamanan", B: "Memberikan nama domain", C: "Membuat kabel jaringan", D: "Mengubah IPv4 menjadi IPv6 secara otomatis" }, "A", "Firewall mengizinkan atau memblokir lalu lintas berdasarkan kebijakan yang ditentukan.", "Firewall"],
      ["HTTPS melindungi komunikasi web dengan menggunakan ...", { A: "TLS", B: "DHCP", C: "ARP", D: "ICMP" }, "A", "HTTPS menggunakan TLS untuk melindungi komunikasi antara klien dan server.", "Keamanan protokol"],
      ["Apa praktik yang lebih aman untuk jaringan Wi-Fi rumah?", { A: "Gunakan WPA2 atau WPA3 dengan kata sandi kuat", B: "Biarkan jaringan terbuka tanpa kata sandi", C: "Gunakan kata sandi yang sama dengan nama Wi-Fi", D: "Nonaktifkan enkripsi" }, "A", "WPA2/WPA3 dan kata sandi kuat membantu melindungi akses ke jaringan Wi-Fi.", "Keamanan Wi-Fi"],
      ["Perintah ping umumnya digunakan untuk ...", { A: "Menguji keterjangkauan host dan perkiraan waktu respons", B: "Mengganti alamat IP host", C: "Menghapus konfigurasi router", D: "Mengubah nama domain" }, "A", "Ping mengirim pesan ICMP untuk membantu memeriksa keterjangkauan host dan waktu respons.", "Troubleshooting"],
      ["Alat traceroute atau tracert membantu melihat ...", { A: "Lompatan router yang dilewati menuju tujuan", B: "Semua kata sandi Wi-Fi di jaringan", C: "Isi berkas pada server tujuan", D: "Alamat MAC semua perangkat di internet" }, "A", "Traceroute memperlihatkan router perantara yang dilewati paket menuju tujuan.", "Troubleshooting"],
      ["Jika komputer mendapat alamat IP otomatis yang tidak sesuai jaringan, langkah awal yang masuk akal adalah memeriksa ...", { A: "Koneksi ke jaringan dan konfigurasi DHCP", B: "Ukuran monitor", C: "Versi aplikasi pengolah kata", D: "Warna kabel daya" }, "A", "Koneksi lokal dan layanan DHCP merupakan pemeriksaan awal saat konfigurasi IP otomatis bermasalah.", "Troubleshooting"]
    ])
  }
};

LEARNING_MATERIALS.forEach((material) => {
  const course = NETWORKING_COURSE[material.id];
  if (!course) return;
  material.title = course.title;
  material.tag = course.tag;
  material.shortDesc = course.shortDesc;
  material.icon = networkingIcon;
  material.video = course.video;
  material.book = course.book;
  material.quiz = course.quiz;
});

// Ekspor ke window agar dapat diakses oleh file JavaScript lainnya
window.LEARNING_MATERIALS = LEARNING_MATERIALS;
