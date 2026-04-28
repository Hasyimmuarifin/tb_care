  // ── Supabase config ──────────────────────────────────────────────────────
  const SUPABASE_URL = 'https://antcymqnftoxyqbsddkk.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudGN5bXFuZnRveHlxYnNkZGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTE2MDUsImV4cCI6MjA5Mjc4NzYwNX0.XV7TKCnjroz2OT8OnwTFx6Z2eIJk_WOmxZ09cik6UPo';
  const TABLE = 'quiz_results';

  async function saveScore(name, score, grade) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ name, score, grade, taken_at: new Date().toISOString() })
      });
      return res.ok;
    } catch(e) {
      console.error('Supabase error:', e);
      return false;
    }
  }

  // ── Questions ─────────────────────────────────────────────────────────────
  const questions = [
    {
      q: "Pernyataan berikut yang BENAR mengenai TBC yaitu...",
      opts: [
        { teks: "TBC merupakan penyakit yang diturunkan dari orang tua ke anak", benar: false },
        { teks: "TBC hanya terjadi pada orang dengan kondisi ekonomi rendah", benar: false },
        { teks: "Semua orang berisiko terkena TBC", benar: true }
      ]
    },
    {
      q: "Tuberkulosis (TBC) adalah penyakit yang disebabkan oleh...",
      opts: [
        { teks: "Kutukan dan faktor keturunan", benar: false },
        { teks: "Virus dan hanya menyerang anak-anak", benar: false },
        { teks: "Bakteri dan dapat menyerang paru-paru", benar: true }
      ]
    },
    {
      q: "Penularan penyakit TBC paling sering terjadi melalui...",
      opts: [
        { teks: "Kontak kulit secara langsung", benar: false },
        { teks: "Udara saat penderita TBC batuk atau bersin", benar: true },
        { teks: "Gigitan serangga dan hewan peliharaan", benar: false }
      ]
    },
    {
      q: "Salah satu gejala TBC pada orang dewasa adalah...",
      opts: [
        { teks: "Batuk kurang dari 3 hari dan sakit kepala", benar: false },
        { teks: "Batuk lebih dari 2 minggu disertai keringat malam", benar: true },
        { teks: "Demam tinggi mendadak selama 1 hari", benar: false }
      ]
    },
    {
      q: "Penderita TBC tidak boleh dijauhi dari masyarakat karena...",
      opts: [
        { teks: "Penderita hanya perlu diminta tidak keluar dari rumah sampai sembuh", benar: false },
        { teks: "Dapat membuat penderita takut berobat sehingga penularan bisa semakin luas", benar: true },
        { teks: "Penderita cukup beristirahat di rumah tanpa perlu menjalani pengobatan", benar: false }
      ]
    },
    {
      q: "TBC laten adalah kondisi ketika...",
      opts: [
        { teks: "Kuman TBC aktif dan mudah menular", benar: false },
        { teks: "Kuman TBC ada di tubuh tetapi tidak aktif dan tidak menular", benar: true },
        { teks: "Penderita mengalami batuk berat dan demam tinggi", benar: false }
      ]
    },
    {
      q: "Tujuan utama pemberian imunisasi BCG pada bayi adalah...",
      opts: [
        { teks: "Mencegah semua jenis infeksi paru-paru", benar: false },
        { teks: "Melindungi anak dari TBC, terutama bentuk TBC yang berat", benar: true },
        { teks: "Menyembuhkan TBC yang sudah diderita", benar: false }
      ]
    },
    {
      q: "Jika penderita TBC merasa sudah membaik sebelum obat habis, maka yang harus dilakukan adalah...",
      opts: [
        { teks: "Tetap melanjutkan obat sesuai anjuran tenaga kesehatan", benar: true },
        { teks: "Menghentikan obat karena sudah sembuh", benar: false },
        { teks: "Mengurangi dosis obat sedikit demi sedikit", benar: false }
      ]
    },
    {
      q: "Manakah yang BENAR mengenai TBC Sensitif Obat (SO)?",
      opts: [
        { teks: "TBC SO masih sensitif terhadap obat anti tuberkulosis, sedangkan TBC RO sudah kebal obat", benar: true },
        { teks: "Pengobatan TBC SO lebih lama dibandingkan TBC Resistan Obat (RO)", benar: false },
        { teks: "TBC SO tidak memerlukan pengobatan", benar: false }
      ]
    },
    {
      q: "Tujuan utama pemberian obat Terapi Pencegahan Tuberkulosis (TPT) adalah...",
      opts: [
        { teks: "Mengobati TBC aktif", benar: false },
        { teks: "Mencegah TBC aktif pada orang berisiko, seperti kontak serumah dengan pasien TBC atau ODHIV", benar: true },
        { teks: "Mengobati TBC Resistan Obat (RO)", benar: false }
      ]
    }
  ];

  const letters = ['A', 'B', 'C', 'D'];
  let current = 0, score = 0, answered = false;
  let userName = '';

  function startQuiz() {
    const val = document.getElementById('name-input').value.trim();
    if (!val) { document.getElementById('name-input').focus(); return; }
    userName = val;
    document.getElementById('name-overlay').classList.add('hidden');
    renderQuestion();
  }

  // Allow Enter key in name input
  document.getElementById('name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') startQuiz();
  });

  function renderQuestion() {
    answered = false;
    const q = questions[current];
    const total = questions.length;

    document.getElementById('q-count').textContent = `Soal ${current + 1} dari ${total}`;
    document.getElementById('q-score').textContent = `Skor: ${score}`;
    document.getElementById('progress-fill').style.width = `${((current + 1) / total) * 100}%`;
    document.getElementById('q-number').textContent = `Soal ${String(current + 1).padStart(2, '0')}`;
    document.getElementById('q-text').textContent = q.q;

    const fb = document.getElementById('feedback');
    fb.className = 'feedback';
    fb.querySelector('#fb-text').textContent = '';

    const btn = document.getElementById('btn-next');
    btn.classList.remove('show');
    document.getElementById('next-label').textContent = current === total - 1 ? 'Lihat Hasil' : 'Soal Berikutnya';

    const list = document.getElementById('options-list');
    list.innerHTML = '';

    q.opts.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'opt-btn';
      b.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${opt.teks}</span>`;
      b.onclick = () => selectAnswer(i, opt.benar);
      list.appendChild(b);
    });

    // Animate card
    const card = document.getElementById('quiz-card');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = 'slideIn 0.35s ease both';
  }

  function selectAnswer(idx, isCorrect) {
    if (answered) return;
    answered = true;

    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.disabled = true);

    const fb = document.getElementById('feedback');
    const icon = document.getElementById('fb-icon');
    const text = document.getElementById('fb-text');

    if (isCorrect) {
      btns[idx].classList.add('correct');
      score++;
      fb.className = 'feedback ok show';
      icon.textContent = '✓';
      text.textContent = 'Benar! Jawaban kamu tepat.';
      document.getElementById('q-score').textContent = `Skor: ${score}`;
    } else {
      btns[idx].classList.add('wrong');
      // Show correct
      const q = questions[current];
      q.opts.forEach((opt, i) => {
        if (opt.benar) btns[i].classList.add('reveal-correct');
      });
      fb.className = 'feedback bad show';
      icon.textContent = '✗';
      text.textContent = 'Kurang tepat. Perhatikan jawaban yang benar ya!';
    }

    document.getElementById('btn-next').classList.add('show');
  }

  function nextQuestion() {
    current++;
    if (current >= questions.length) {
      showResult();
    } else {
      renderQuestion();
    }
  }

  async function showResult() {
    document.getElementById('quiz-card').style.display = 'none';
    document.getElementById('progress-wrap').style.display = 'none';
    const rs = document.getElementById('result-screen');
    rs.classList.add('show');

    const total = questions.length;
    const pct = Math.round((score / total) * 100);

    document.getElementById('stat-benar').textContent = score;
    document.getElementById('stat-salah').textContent = total - score;
    document.getElementById('stat-pct').textContent = pct + '%';
    document.getElementById('result-score').textContent = `${score}/${total}`;

    let grade, icon, gradeCls;
    if (score === 10)      { grade = 'Perfect'; icon = '🏆'; gradeCls = 'grade-perfect'; }
    else if (score >= 6)   { grade = 'Good';    icon = '⭐'; gradeCls = 'grade-good'; }
    else if (score >= 3)   { grade = 'Fair';    icon = '💪'; gradeCls = 'grade-fair'; }
    else                   { grade = 'Keep Trying'; icon = '📚'; gradeCls = 'grade-other'; }

    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-grade').textContent = grade;
    document.getElementById('result-grade').className = `result-grade ${gradeCls}`;
    document.getElementById('result-subtitle').textContent = `Hai ${userName}, kuis selesai! Menyimpan hasilmu...`;

    const msg = document.getElementById('saving-msg');
    msg.textContent = '💾 Menyimpan skor ke database...';
    msg.classList.add('show');

    const ok = await saveScore(userName, score, grade);
    if (ok) {
      msg.textContent = '✅ Skor berhasil disimpan!';
      document.getElementById('result-subtitle').textContent = `Hai ${userName}, hasil kamu sudah tersimpan.`;
    } else {
      msg.textContent = '⚠️ Gagal menyimpan skor. Periksa koneksi atau konfigurasi Supabase.';
    }
  }