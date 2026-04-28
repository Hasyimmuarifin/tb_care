// ── Supabase config ──────────────────────────────────────────────────────
const SUPABASE_URL = "https://antcymqnftoxyqbsddkk.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudGN5bXFuZnRveHlxYnNkZGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTE2MDUsImV4cCI6MjA5Mjc4NzYwNX0.XV7TKCnjroz2OT8OnwTFx6Z2eIJk_WOmxZ09cik6UPo";
const TABLE = "quiz_results";

let chartInstance = null;

async function fetchData() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?select=*&order=taken_at.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function gradeOf(score) {
  if (score === 10) return "Perfect";
  if (score >= 6) return "Good";
  if (score >= 3) return "Fair";
  return "Keep Trying";
}

function renderStats(data) {
  const total = data.length;
  const perfect = data.filter(
    (d) => (d.grade || gradeOf(d.score)) === "Perfect",
  ).length;
  const good = data.filter(
    (d) => (d.grade || gradeOf(d.score)) === "Good",
  ).length;
  const fair = data.filter(
    (d) => (d.grade || gradeOf(d.score)) === "Fair",
  ).length;

  animateCount("st-total", total);
  animateCount("st-perfect", perfect);
  animateCount("st-good", good);
  animateCount("st-fair", fair);

  renderChart(perfect, good, fair, total - perfect - good - fair);
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  const start = 0,
    duration = 800;
  const startTime = performance.now();
  function update(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(start + (target - start) * ease);
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function renderChart(perfect, good, fair, other) {
  const ctx = document.getElementById("barChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  const total = perfect + good + fair + other || 1;
  const pctP = ((perfect / total) * 100).toFixed(1);
  const pctG = ((good / total) * 100).toFixed(1);
  const pctF = ((fair / total) * 100).toFixed(1);
  const pctO = ((other / total) * 100).toFixed(1);

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "🏆 Perfect\n(10/10)",
        "⭐ Good\n(6–9/10)",
        "💪 Fair\n(3–5/10)",
        "📚 Keep Trying\n(0–2/10)",
      ],
      datasets: [
        {
          label: "Jumlah Peserta",
          data: [perfect, good, fair, other],
          backgroundColor: [
            "rgba(14,207,176,0.75)",
            "rgba(247,201,72,0.75)",
            "rgba(255,91,107,0.75)",
            "rgba(167,139,250,0.5)",
          ],
          borderColor: [
            "rgba(14,207,176,1)",
            "rgba(247,201,72,1)",
            "rgba(255,91,107,1)",
            "rgba(167,139,250,0.8)",
          ],
          borderWidth: 2,
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0f2236",
          borderColor: "rgba(14,207,176,0.3)",
          borderWidth: 1,
          titleColor: "#e8f4f2",
          bodyColor: "#7ea8a0",
          padding: 14,
          callbacks: {
            label(ctx) {
              const val = ctx.parsed.y;
              const ptcs = [pctP, pctG, pctF, pctO][ctx.dataIndex];
              return `  ${val} peserta (${ptcs}%)`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#7ea8a0",
            font: { family: "'DM Sans', sans-serif", size: 11 },
          },
          grid: { color: "rgba(14,207,176,0.05)" },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#7ea8a0",
            stepSize: 1,
            font: { family: "'DM Sans', sans-serif", size: 11 },
          },
          grid: { color: "rgba(14,207,176,0.07)" },
        },
      },
    },
  });
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  );
}

function renderTable(data) {
  const container = document.getElementById("table-container");
  const recent = data.slice(0, 20);

  if (recent.length === 0) {
    container.innerHTML =
      '<div class="empty-state">Belum ada peserta yang menyelesaikan kuis.</div>';
    return;
  }

  const rows = recent
    .map((d, i) => {
      const grade = d.grade || gradeOf(d.score);
      const gradeCls = ["Perfect", "Good", "Fair"].includes(grade)
        ? `grade-${grade}`
        : "grade-other";
      return `<tr>
        <td style="color:var(--muted);font-size:0.8rem">${i + 1}</td>
        <td class="name-cell">${escapeHtml(d.name || "—")}</td>
        <td class="score-cell" style="color:var(--teal)">${d.score}/10</td>
        <td><span class="grade-badge ${gradeCls}">${grade}</span></td>
        <td class="date-cell">${formatDate(d.taken_at)}</td>
      </tr>`;
    })
    .join("");

  container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Skor</th>
            <th>Kategori</th>
            <th>Waktu</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadData() {
  const btn = document.getElementById("refresh-btn");
  btn.classList.add("spinning");
  btn.disabled = true;

  try {
    const data = await fetchData();
    renderStats(data);
    renderTable(data);
  } catch (e) {
    document.getElementById("table-container").innerHTML =
      `<div class="empty-state">⚠️ Gagal memuat data: ${e.message}<br><small>Periksa konfigurasi Supabase dan pastikan tabel <code>quiz_results</code> tersedia.</small></div>`;
    console.error(e);
  } finally {
    btn.classList.remove("spinning");
    btn.disabled = false;
  }
}

// Initial load
loadData();