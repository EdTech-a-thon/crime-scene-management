import "./style.css";

type PackageType = "plastic" | "paper" | "hard";

interface Evidence {
  id: string;
  number: string;
  name: string;
  icon: string;
  description: string;
  correct: PackageType;
  x: number;
  y: number;
  success: string;
  failure: string;
}

const evidence: Evidence[] = [
  { id: "shirt", number: "01", name: "Bloodstained shirt", icon: "👕", description: "A damp cotton shirt with a dark red stain across the front.", correct: "paper", x: 57, y: 32, success: "Breathable paper lets moisture escape while protecting the biological stain.", failure: "Trapped moisture encouraged mold and bacterial growth, degrading DNA evidence." },
  { id: "knife", number: "02", name: "Kitchen knife", icon: "🔪", description: "A sharp eight-inch kitchen knife near the edge of the rug.", correct: "hard", x: 42, y: 66, success: "The rigid container immobilizes the blade and protects evidence and handlers.", failure: "The blade punctured its package, creating an injury risk and losing trace material." },
  { id: "casing", number: "03", name: "Cartridge casing", icon: "🟨", description: "A small brass casing found beside the coffee table.", correct: "plastic", x: 32, y: 52, success: "The dry casing remains contained and its markings stay protected.", failure: "The selected package did not securely contain this small, dry item." },
  { id: "hair", number: "04", name: "Hair strand", icon: "〰️", description: "A single dark strand visible on the pale sofa cushion.", correct: "plastic", x: 74, y: 32, success: "The sealed bag keeps this tiny, dry trace sample from being lost.", failure: "The strand was not securely contained and could be lost during transport." },
  { id: "phone", number: "05", name: "Mobile phone", icon: "📱", description: "A locked phone lying face-up beside the armchair.", correct: "plastic", x: 84, y: 62, success: "The phone remains isolated from loose debris during transport.", failure: "The device was not packaged according to the collection protocol." },
  { id: "fiber", number: "06", name: "Blue fiber", icon: "🧵", description: "A short blue fiber caught on the coffee table's rough edge.", correct: "plastic", x: 48, y: 46, success: "The small trace sample remains visible, dry, and contained.", failure: "Loose trace evidence could escape or transfer during handling." },
  { id: "shoe", number: "07", name: "Muddy shoe", icon: "👟", description: "A dry, mud-caked shoe abandoned close to the doorway.", correct: "plastic", x: 13, y: 75, success: "The dry shoe and its soil evidence remain together for transport.", failure: "Soil flakes may be lost or transferred without secure containment." },
  { id: "cup", number: "08", name: "Drinking cup", icon: "🥤", description: "A discarded cup that may hold fingerprints or saliva evidence.", correct: "plastic", x: 27, y: 29, success: "The cup remains isolated for controlled laboratory examination.", failure: "Contact and trace evidence are more vulnerable in this packaging." },
];

const packageLabels: Record<PackageType, string> = {
  plastic: "Plastic evidence bag",
  paper: "Paper evidence bag",
  hard: "Hard-sided container",
};

let selected: Evidence | null = null;
let pendingChoice: PackageType | null = null;
let choices = new Map<string, PackageType>();
let elapsed = 0;

const app = document.querySelector<HTMLDivElement>("#app")!;

function shell(content: string) {
  app.innerHTML = `
    <header class="topbar">
      <button class="brand" data-action="home" aria-label="Return to case briefing">
        <span class="brand-mark">ER</span><span><strong>EVIDENCE ROOM</strong><small>FORENSIC TRAINING UNIT</small></span>
      </button>
      <div class="case-stamp"><span>ACTIVE CASE</span><strong>24-071</strong></div>
    </header>${content}`;
  bindEvents();
}

function briefing() {
  shell(`<main class="briefing-page"><section class="briefing-card">
    <div class="briefing-kicker"><span>CASE BRIEF</span><span>07:42 HOURS</span></div>
    <div class="briefing-grid"><div>
      <p class="eyebrow">Training simulation 01</p><h1>THE RIVERSIDE<br>APARTMENT</h1>
      <p class="lead">The scene is secure. Your job is to find, collect, and package every item before it is transported to the laboratory.</p>
      <div class="objective"><span>01</span><div><strong>Your objective</strong><p>Collect 8 items. Choose packaging that protects each item and the evidence it may hold.</p></div></div>
      <button class="primary-button" data-action="start">ENTER THE SCENE <b>→</b></button>
    </div><aside class="dispatch-note"><div class="clip"></div><p class="mono-label">DISPATCH NOTES</p>
      <dl><div><dt>LOCATION</dt><dd>218 Riverside Ave.<br>Living room</dd></div><div><dt>CONDITIONS</dt><dd>Indoor / 72°F<br>Scene secured</dd></div><div><dt>YOUR ROLE</dt><dd>Forensic evidence<br>technician</dd></div></dl>
      <div class="tip"><strong>REMEMBER</strong><p>Your packaging decision can preserve evidence or destroy it.</p></div>
    </aside></div>
  </section></main>`);
}

function scene() {
  shell(`<main class="scene-layout"><section class="scene-column">
    <div class="scene-heading"><div><p class="eyebrow">Scene 01 / Living room</p><h1>COLLECT THE EVIDENCE</h1></div><div class="progress"><strong>${choices.size}<span>/8</span></strong><small>ITEMS SECURED</small></div></div>
    <div class="room" aria-label="Illustrated living room crime scene">
      <div class="window"><i></i><i></i><i></i><i></i></div><div class="floor-lines"></div><div class="sofa"><i></i><i></i><i></i></div><div class="armchair"></div><div class="rug"></div><div class="coffee-table"></div><div class="door"></div><div class="lamp">◯</div>
      ${evidence.map(item => `<button class="evidence-marker ${choices.has(item.id) ? "collected" : ""}" style="--x:${item.x}%;--y:${item.y}%" data-evidence="${item.id}" aria-label="Collect ${item.name}"><span class="pulse"></span><span class="evidence-icon">${item.icon}</span><span class="tag"><b>${choices.has(item.id) ? "✓" : item.number}</b>${item.name}</span></button>`).join("")}
      <div class="scene-tape">SCENE 24-071 &nbsp; • &nbsp; DO NOT CROSS &nbsp; • &nbsp; SCENE 24-071</div>
    </div><p class="scene-help"><span>◎</span> Select an evidence marker to inspect and package the item.</p>
  </section>${inventory()}</main>${selected ? modal(selected) : ""}`);
}

function inventory() {
  const complete = choices.size === evidence.length;
  return `<aside class="inventory"><div class="inventory-title"><div><p class="eyebrow">Chain of custody</p><h2>EVIDENCE LOG</h2></div><span>● LIVE</span></div>
    <div class="inventory-list">${evidence.map(item => { const choice = choices.get(item.id); return `<button data-evidence="${item.id}" class="inventory-item ${choice ? "secured" : ""}"><b>${choice ? "✓" : item.number}</b><span><strong>${item.name}</strong><small>${choice ? packageLabels[choice] : "Not yet collected"}</small></span></button>`; }).join("")}</div>
    <div class="inventory-footer"><button class="primary-button full" data-action="seal" ${complete ? "" : "disabled"}>SEAL &amp; TRANSPORT <b>→</b></button><p>${complete ? "All evidence collected. Ready for transport." : `${evidence.length - choices.size} items remain in the scene.`}</p></div>
  </aside>`;
}

function modal(item: Evidence) {
  const current = choices.get(item.id);
  pendingChoice = current ?? null;
  return `<div class="modal-backdrop" data-action="close"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button class="modal-close" data-action="close" aria-label="Close">×</button><div class="evidence-preview"><span>${item.icon}</span><b>EVIDENCE<br>${item.number}</b></div>
    <div class="modal-content"><p class="eyebrow">Examine item</p><h2 id="modal-title">${item.name}</h2><p class="item-description">${item.description}</p>
      <div class="field-note"><strong>FIELD OBSERVATION</strong><span>Select the safest packaging for transport.</span></div>
      <fieldset><legend>CHOOSE A CONTAINER</legend>
        ${packageOption("plastic", "▱", "Sealed, clear polyethylene", current)}
        ${packageOption("paper", "▰", "Breathable kraft paper", current)}
        ${packageOption("hard", "▣", "Rigid, puncture resistant", current)}
      </fieldset>
      <button class="primary-button full" data-action="package" ${current ? "" : "disabled"}>${current ? "UPDATE EVIDENCE LOG" : "ADD TO EVIDENCE LOG"} <b>→</b></button><p class="delayed-note">Results stay sealed until the evidence reaches the lab.</p>
    </div></section></div>`;
}

function packageOption(type: PackageType, icon: string, detail: string, current?: PackageType) {
  return `<label class="package-choice ${current === type ? "chosen" : ""}"><input type="radio" name="package" value="${type}" ${current === type ? "checked" : ""}><span class="package-icon">${icon}</span><span><strong>${packageLabels[type]}</strong><small>${detail}</small></span><i>○</i></label>`;
}

function timeView() {
  const correct = evidence.filter(item => choices.get(item.id) === item.correct).length;
  shell(`<main class="time-page">
    <section class="transport-header"><div><p class="eyebrow">Evidence transport / Lab intake</p><h1>WHAT HAPPENS OVER TIME?</h1><p>The evidence is sealed. Advance the clock to observe how your packaging decisions affect each item.</p></div><div class="clock"><span>ELAPSED TIME</span><strong>${String(elapsed).padStart(2, "0")}:00</strong><small>HOURS</small></div></section>
    <section class="timeline"><div class="timeline-track"><span style="width:${elapsed === 0 ? 0 : elapsed === 24 ? 50 : 100}%"></span></div><div class="time-node active"><b>00</b><span>SEALED</span></div><div class="time-node ${elapsed >= 24 ? "active" : ""}"><b>24</b><span>HOURS</span></div><div class="time-node ${elapsed >= 72 ? "active" : ""}"><b>72</b><span>HOURS</span></div></section>
    <section class="lab-grid">${evidence.map(item => {
      const isCorrect = choices.get(item.id) === item.correct;
      const reveal = elapsed > 0;
      const moldGrowth = item.id === "shirt" && !isCorrect && elapsed >= 72;
      const degraded = reveal && !isCorrect;
      const condition = !reveal ? "SEALED" : isCorrect ? "STABLE" : moldGrowth ? "MOLD GROWTH" : item.id === "shirt" ? "MOISTURE TRAPPED" : item.id === "knife" ? "PACKAGE FAILURE" : "AT RISK";
      return `<article class="lab-item ${degraded ? "degraded" : reveal ? "stable" : "sealed"}"><div class="lab-icon"><span>${item.icon}</span>${degraded ? "<i>!</i>" : ""}</div><div class="lab-info"><span>E-${item.number}</span><h3>${item.name}</h3><p>${packageLabels[choices.get(item.id)!]}</p></div><div class="condition"><small>CONDITION</small><strong>${condition}</strong></div></article>`;
    }).join("")}</section>
    <div class="time-actions">${elapsed < 72 ? `<button class="primary-button" data-action="advance">ADVANCE TO ${elapsed === 0 ? 24 : 72} HOURS <b>→</b></button>` : `<button class="primary-button" data-action="report">OPEN LAB REPORT <b>→</b></button>`}${elapsed ? `<p><strong>${correct} stable</strong> · ${evidence.length - correct} compromised</p>` : ""}</div>
  </main>`);
}

function report() {
  const correct = evidence.filter(item => choices.get(item.id) === item.correct).length;
  const percent = Math.round((correct / evidence.length) * 100);
  const rank = percent === 100 ? "EXEMPLARY" : percent >= 75 ? "PROFICIENT" : percent >= 50 ? "DEVELOPING" : "REVIEW REQUIRED";
  shell(`<main class="report-page"><section class="report-heading"><div><p class="eyebrow">Final laboratory analysis</p><h1>EVIDENCE INTEGRITY REPORT</h1><p>Case 24-071 · Riverside Apartment · Submitted 72 hours after collection</p></div><div class="score-seal"><span>INTEGRITY SCORE</span><strong>${correct}<small>/8</small></strong><b>${rank}</b></div></section>
    <section class="report-summary"><div><span>${percent}%</span><p><strong>Evidence preserved</strong>Your packaging choices kept ${correct} of 8 items suitable for laboratory analysis.</p></div><div><span>${evidence.length - correct}</span><p><strong>Items compromised</strong>Review each item below to see what happened and why.</p></div><div class="case-code"><small>WORKSHEET CODE</small><strong>RIV-${correct}${8 - correct}-72</strong></div></section>
    <section class="results"><div class="results-title"><h2>ITEM-BY-ITEM ANALYSIS</h2><span>72-HOUR CONDITION</span></div>${evidence.map(item => {
      const choice = choices.get(item.id)!;
      const right = choice === item.correct;
      return `<article class="result-row ${right ? "correct" : "incorrect"}"><div class="result-id"><span>${item.icon}</span><b>E-${item.number}</b></div><div><h3>${item.name}</h3><p>You chose: <strong>${packageLabels[choice]}</strong></p></div><div class="result-outcome"><span>${right ? "✓ PRESERVED" : "! COMPROMISED"}</span><p>${right ? item.success : item.failure}</p>${right ? "" : `<small>Correct choice: ${packageLabels[item.correct]}</small>`}</div></article>`;
    }).join("")}</section>
    <div class="report-actions"><button class="secondary-button" data-action="print">PRINT REPORT</button><button class="primary-button" data-action="restart">START NEW ATTEMPT <b>↻</b></button></div>
  </main>`);
}

function bindEvents() {
  document.querySelectorAll<HTMLElement>("[data-evidence]").forEach(button => button.addEventListener("click", () => {
    selected = evidence.find(item => item.id === button.dataset.evidence) ?? null;
    scene();
  }));

  document.querySelectorAll<HTMLInputElement>('input[name="package"]').forEach(input => input.addEventListener("change", () => {
    pendingChoice = input.value as PackageType;
    document.querySelectorAll(".package-choice").forEach(label => label.classList.remove("chosen"));
    input.closest(".package-choice")?.classList.add("chosen");
    const packageButton = document.querySelector<HTMLButtonElement>('[data-action="package"]');
    if (packageButton) packageButton.disabled = false;
  }));

  document.querySelectorAll<HTMLElement>("[data-action]").forEach(button => button.addEventListener("click", event => {
    const action = button.dataset.action;
    if (action === "close" && event.target !== event.currentTarget && button.classList.contains("modal-backdrop")) return;
    if (action === "home") briefing();
    if (action === "start") scene();
    if (action === "close") { selected = null; scene(); }
    if (action === "package" && selected && pendingChoice) { choices.set(selected.id, pendingChoice); selected = null; pendingChoice = null; scene(); }
    if (action === "seal") { elapsed = 0; timeView(); }
    if (action === "advance") { elapsed = elapsed === 0 ? 24 : 72; timeView(); }
    if (action === "report") report();
    if (action === "print") window.print();
    if (action === "restart") { choices = new Map(); elapsed = 0; selected = null; briefing(); }
  }));
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && selected) { selected = null; scene(); }
});

briefing();
