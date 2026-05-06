// Ano no rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Renderiza calendário completo ----------
const calendarGrid = document.getElementById("calendar-grid");
CALENDAR_GROUPS.forEach((group) => {
  const card = document.createElement("div");
  card.className = "cal-card";
  card.innerHTML = `
    <h3>${group.title}</h3>
    <p class="cal-age">${group.age}</p>
    <ul>
      ${group.vaccines.map((v) => `<li>${v}</li>`).join("")}
    </ul>
  `;
  calendarGrid.appendChild(card);
});

// ---------- Calculadora ----------
const form = document.getElementById("vaccine-form");
const ageInput = document.getElementById("age");
const ageUnit = document.getElementById("age-unit");
const resultsEl = document.getElementById("results");
const resultsList = document.getElementById("results-list");
const resultsTitle = document.getElementById("results-title");
const resetBtn = document.getElementById("reset-btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const ageValue = parseInt(ageInput.value, 10);
  if (isNaN(ageValue) || ageValue < 0) return;

  const ageInMonths = ageUnit.value === "years" ? ageValue * 12 : ageValue;
  const conditions = Array.from(
    form.querySelectorAll('input[name="condition"]:checked')
  ).map((c) => c.value);

  const matched = VACCINES.filter((v) => {
    // Vacinas condicionais (ex: gestante)
    if (v.condition) {
      return conditions.includes(v.condition);
    }
    return ageInMonths >= v.minMonths && ageInMonths <= v.maxMonths;
  });

  renderResults(matched, ageValue, ageUnit.value);
});

resetBtn.addEventListener("click", () => {
  form.reset();
  resultsEl.hidden = true;
  ageInput.focus();
  window.scrollTo({
    top: document.getElementById("calculadora").offsetTop - 80,
    behavior: "smooth",
  });
});

function renderResults(vaccines, age, unit) {
  resultsEl.hidden = false;
  const unitLabel = unit === "years"
    ? (age === 1 ? "ano" : "anos")
    : (age === 1 ? "mês" : "meses");

  resultsTitle.textContent = `${vaccines.length} vacina${vaccines.length === 1 ? "" : "s"} recomendada${vaccines.length === 1 ? "" : "s"} para ${age} ${unitLabel}`;

  if (vaccines.length === 0) {
    resultsList.innerHTML = `
      <div class="empty">
        Nenhuma vacina específica encontrada para essa idade.
        Consulte um profissional de saúde para uma avaliação personalizada.
      </div>
    `;
  } else {
    resultsList.innerHTML = vaccines
      .map(
        (v) => `
      <article class="vaccine-card">
        <h4>${v.name}</h4>
        <p>${v.description}</p>
        <div class="vaccine-meta">
          ${(v.tags || []).map((t) => `<span class="chip">${t}</span>`).join("")}
          ${v.recurring === "annual" ? '<span class="chip chip-accent">Anual</span>' : ""}
        </div>
      </article>
    `
      )
      .join("");
  }

  // Scroll suave até o resultado
  setTimeout(() => {
    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}
