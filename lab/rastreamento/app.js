// Rastrei.me — recommendation engine
// Each rule returns an exam object if it applies for the given profile.
// Sources: INCA, Ministério da Saúde, USPSTF, SBC/SBD/SBU.

const EXAMS = [
  // ----- Cardiovascular & metabólico -----
  {
    id: "blood-pressure",
    name: "Aferição de pressão arterial",
    category: "Cardiovascular",
    icon: "♥",
    appliesTo: ({ age }) => age >= 18,
    frequency: ({ risks }) =>
      risks.has("hypertension") ? "A cada consulta" : "Pelo menos 1x por ano",
    description:
      "Hipertensão é silenciosa e o principal fator de risco para AVC e infarto. Medir é simples, rápido e gratuito no SUS.",
  },
  {
    id: "cholesterol",
    name: "Perfil lipídico (colesterol)",
    category: "Cardiovascular",
    icon: "♥",
    appliesTo: ({ age, sex, risks }) =>
      age >= 35 || (age >= 20 && (risks.has("family-heart") || risks.has("diabetes") || risks.has("smoker") || risks.has("obesity"))),
    frequency: () => "A cada 5 anos (mais frequente se houver alteração)",
    description:
      "Avalia colesterol total, LDL, HDL e triglicerídeos. Essencial para estimar risco cardiovascular ao longo da vida.",
  },
  {
    id: "glucose",
    name: "Glicemia de jejum",
    category: "Endócrino",
    icon: "⚗",
    appliesTo: ({ age, risks }) =>
      age >= 35 || risks.has("obesity") || risks.has("hypertension") || risks.has("diabetes"),
    frequency: ({ risks }) =>
      risks.has("diabetes") ? "Conforme orientação médica" : "A cada 3 anos",
    description:
      "Detecta diabetes e pré-diabetes antes dos sintomas. Indicada também para quem tem sobrepeso ou hipertensão, em qualquer idade.",
  },
  {
    id: "bmi",
    name: "Avaliação de IMC e circunferência abdominal",
    category: "Geral",
    icon: "⚖",
    appliesTo: ({ age }) => age >= 18,
    frequency: () => "Anualmente",
    description:
      "Acompanhar peso e medidas é a forma mais simples de mapear risco metabólico e cardiovascular ao longo do tempo.",
  },

  // ----- Câncer -----
  {
    id: "cervix",
    name: "Papanicolau (citologia cervical)",
    category: "Câncer",
    icon: "✱",
    appliesTo: ({ age, sex }) => sex === "female" && age >= 25 && age <= 64,
    frequency: () => "A cada 3 anos, após 2 exames anuais normais",
    description:
      "Rastreia câncer de colo do útero. Recomendado pelo INCA para todas as mulheres de 25 a 64 anos com vida sexual ativa ou prévia.",
  },
  {
    id: "mammography",
    name: "Mamografia bilateral",
    category: "Câncer",
    icon: "✱",
    appliesTo: ({ age, sex, risks }) =>
      sex === "female" && (age >= 50 || (age >= 40 && risks.has("family-cancer"))),
    frequency: ({ age, risks }) =>
      risks.has("family-cancer") && age < 50 ? "Anualmente (risco aumentado)" : "A cada 2 anos",
    description:
      "Rastreia câncer de mama. INCA recomenda para mulheres de 50 a 69 anos; início mais cedo em casos de histórico familiar.",
  },
  {
    id: "colorectal",
    name: "Rastreamento de câncer colorretal",
    category: "Câncer",
    icon: "✱",
    appliesTo: ({ age }) => age >= 45 && age <= 75,
    frequency: () => "Pesquisa de sangue oculto anual ou colonoscopia a cada 10 anos",
    description:
      "Pode ser feito por pesquisa de sangue oculto nas fezes (anual) ou colonoscopia (a cada 10 anos). Detecta lesões antes de virarem câncer.",
  },
  {
    id: "lung",
    name: "Tomografia de tórax de baixa dose",
    category: "Câncer",
    icon: "✱",
    appliesTo: ({ age, risks }) => age >= 50 && age <= 80 && risks.has("smoker"),
    frequency: () => "Anualmente, enquanto houver indicação",
    description:
      "Rastreia câncer de pulmão em fumantes ou ex-fumantes pesados (≥20 maços/ano). Reduz mortalidade comprovadamente.",
  },
  {
    id: "prostate",
    name: "Conversa sobre rastreamento de próstata (PSA)",
    category: "Câncer",
    icon: "✱",
    appliesTo: ({ age, sex, risks }) =>
      sex === "male" && (age >= 50 || (age >= 45 && risks.has("family-cancer"))),
    frequency: () => "Decisão compartilhada com o médico",
    description:
      "PSA e exame clínico podem ser oferecidos a homens entre 50–69 anos (ou 45+ com histórico familiar). É uma decisão individualizada — converse com seu médico.",
  },

  // ----- Infecções e ISTs -----
  {
    id: "hiv-sti",
    name: "Testes de HIV, sífilis e hepatites B/C",
    category: "Infecciosas",
    icon: "⊕",
    appliesTo: ({ age, risks }) => age >= 18 && (risks.has("sexually-active") || age >= 18),
    frequency: ({ risks }) =>
      risks.has("sexually-active") ? "Anualmente" : "Pelo menos 1x na vida adulta",
    description:
      "Testes rápidos e gratuitos no SUS. Diagnóstico precoce muda completamente o prognóstico de todas essas infecções.",
  },

  // ----- Idosos / específicos -----
  {
    id: "bone-density",
    name: "Densitometria óssea",
    category: "Ortopédico",
    icon: "◇",
    appliesTo: ({ age, sex }) =>
      (sex === "female" && age >= 65) || (sex === "male" && age >= 70),
    frequency: () => "A cada 2 anos (ou conforme avaliação)",
    description:
      "Avalia osteoporose e risco de fraturas. Indicada para mulheres a partir de 65 anos e homens a partir de 70.",
  },
  {
    id: "aaa",
    name: "Ultrassom de aorta abdominal",
    category: "Cardiovascular",
    icon: "♥",
    appliesTo: ({ age, sex, risks }) =>
      sex === "male" && age >= 65 && age <= 75 && risks.has("smoker"),
    frequency: () => "Uma única vez",
    description:
      "Rastreio de aneurisma de aorta abdominal. Indicado para homens de 65–75 anos que já fumaram alguma vez na vida.",
  },
  {
    id: "vision",
    name: "Avaliação oftalmológica (incluindo glaucoma)",
    category: "Sensorial",
    icon: "◉",
    appliesTo: ({ age }) => age >= 40,
    frequency: () => "A cada 2 anos",
    description:
      "A partir dos 40 anos cresce o risco de glaucoma, catarata e degeneração macular — todas tratáveis quando detectadas cedo.",
  },
  {
    id: "dental",
    name: "Avaliação odontológica",
    category: "Geral",
    icon: "☉",
    appliesTo: () => true,
    frequency: () => "A cada 6 a 12 meses",
    description:
      "Saúde bucal está ligada à saúde cardiovascular e geral. Consultas periódicas previnem cárie, doença periodontal e câncer de boca.",
  },
  {
    id: "vaccines",
    name: "Atualização do calendário vacinal do adulto",
    category: "Geral",
    icon: "+",
    appliesTo: ({ age }) => age >= 18,
    frequency: () => "Revisão anual (gripe sempre, tétano a cada 10 anos)",
    description:
      "Inclui influenza anual, dT/dTpa a cada 10 anos, hepatite B, HPV (até 45 anos) e, para idosos, pneumocócica e herpes-zóster.",
  },
];

// ---------- Form handling ----------
const form = document.getElementById("screening-form");
const resultsSection = document.getElementById("results");
const resultsList = document.getElementById("results-list");
const resultsSummary = document.getElementById("results-summary");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const age = parseInt(document.getElementById("age").value, 10);
  const sex = document.getElementById("sex").value;
  const risks = new Set(
    Array.from(document.querySelectorAll('input[name="risk"]:checked')).map((el) => el.value)
  );

  if (Number.isNaN(age) || age < 0 || age > 120 || !sex) {
    alert("Por favor, informe sua idade e sexo biológico.");
    return;
  }

  const profile = { age, sex, risks };
  const recommendations = EXAMS.filter((exam) => {
    try {
      return exam.appliesTo(profile);
    } catch {
      return false;
    }
  });

  renderResults(recommendations, profile);
});

form.addEventListener("reset", () => {
  resultsSection.hidden = true;
  resultsList.innerHTML = "";
});

function renderResults(recs, profile) {
  resultsList.innerHTML = "";

  if (recs.length === 0) {
    resultsList.innerHTML = `
      <div class="empty-state">
        Não encontramos recomendações específicas para o perfil informado.
        Mantenha consultas de rotina anuais com seu médico de confiança.
      </div>
    `;
  } else {
    // Group by category for nicer ordering
    const ordered = [...recs].sort((a, b) => a.category.localeCompare(b.category));
    for (const exam of ordered) {
      const card = document.createElement("article");
      card.className = "exam-card";
      card.innerHTML = `
        <div class="exam-icon" aria-hidden="true">${exam.icon}</div>
        <div>
          <h4>${exam.name}</h4>
          <span class="exam-frequency">${exam.frequency(profile)}</span>
          <p>${exam.description}</p>
          <span class="exam-category">${exam.category}</span>
        </div>
      `;
      resultsList.appendChild(card);
    }
  }

  const sexLabel = profile.sex === "female" ? "feminino" : "masculino";
  resultsSummary.textContent = `Encontramos ${recs.length} recomendaç${
    recs.length === 1 ? "ão" : "ões"
  } para uma pessoa de ${profile.age} anos, sexo biológico ${sexLabel}.`;

  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}
