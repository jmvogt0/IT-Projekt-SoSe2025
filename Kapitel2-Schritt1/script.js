/* --------------------------------------
   Konstanten & globale Variablen
----------------------------------------- */

// Definition der drei Situationen mit Inputwerten
const situations = {
  situation1: { x1: 1.0, x2: 0.5, x3: 0.8, x4: 1.0, x5: 1.0 },
  situation2: { x1: 0.7, x2: 1.0, x3: 0.2, x4: 0.0, x5: 0.0 },
  situation3: { x1: 1.0, x2: 0.8, x3: 0.7, x4: 1.0, x5: 0.0 }
};

let currentSituation = "situation1";
let currentNeuron = "neuron1";
let activeNeuronIndex = 0;
const threshold = 2.3;

const neuronWeights = {
  neuron1: [1.0, 1.0, 1.0, 1.0, 1.0],
  neuron2: [1.0, 1.0, 1.0, 1.0, 1.0],
  neuron3: [1.0, 1.0, 1.0, 1.0, 1.0]
};

/* --------------------------------------
   Elemente aus dem DOM selektieren
----------------------------------------- */

const getElements = (prefix, count, suffix = "") =>
  Array.from({ length: count }, (_, i) =>
    document.getElementById(`${prefix}${i + 1}${suffix}`)
  );

const xEls = getElements("x", 5);
const xOutEls = getElements("x", 5, "Out");
const xFuncEls = getElements("x", 5, "Func");
const xProgressEls = getElements("x", 5, "Progress");

const sliders = getElements("w", 5);
const wValEls = getElements("w", 5, "Val");
const wFuncEls = getElements("w", 5, "Func");
const wOutEls = getElements("w", 5, "ValOut");
const prodEls = getElements("prod", 5);

/* --------------------------------------
   Funktionen: Daten aktualisieren & anzeigen
----------------------------------------- */

/**
 * Aktualisiert alle Inputanzeigen basierend auf der aktuellen Situation.
 */
function updateInputs() {
  const input = Object.values(situations[currentSituation]);
  input.forEach((val, i) => {
    const fixed = val.toFixed(1);
    xEls[i].textContent = fixed;
    xOutEls[i].textContent = fixed;
    xFuncEls[i].textContent = fixed;
    xProgressEls[i].style.width = `${val * 100}%`;
  });
  updateAllNeurons();
  updateProductsForCurrentNeuron();
}

/**
 * Lädt die Gewichte eines Neurons in die Slider.
 */
function loadNeuronWeights(neuronKey) {
  neuronWeights[neuronKey].forEach((val, i) => {
    sliders[i].value = val;
  });
  updateWeightDisplays();
}

/**
 * Speichert die aktuellen Slider-Werte ins neuronWeights-Objekt.
 */
function saveNeuronWeights(neuronKey) {
  neuronWeights[neuronKey] = sliders.map(slider => +slider.value);
}

/**
 * Aktualisiert die Anzeige der Gewichte in allen UI-Elementen.
 */
function updateWeightDisplays() {
  const weights = neuronWeights[currentNeuron];
  [wValEls, wFuncEls, wOutEls].forEach(group =>
    group.forEach((el, i) => (el.textContent = weights[i].toFixed(1)))
  );
}

/**
 * Berechnet nur für das aktive Neuron die Produkte x*w und aktualisiert die Anzeige.
 */
function updateProductsForCurrentNeuron() {
  const input = Object.values(situations[currentSituation]);
  const weights = neuronWeights[currentNeuron];

  let sum = 0;
  input.forEach((val, i) => {
    const product = val * weights[i];
    const prodEl = prodEls[i];
    if (prodEl) prodEl.textContent = product.toFixed(2);
    sum += product;

    const sumEl = document.getElementById("sum");
    if (sumEl) sumEl.textContent = sum.toFixed(2);
  });
}

/**
 * Berechnet die Summe g eines Neurons, aktualisiert Summe, Balken und Icon-Farbe.
 */
function calculateNeuronOutput(neuronKey) {
  const input = Object.values(situations[currentSituation]);
  const weights = neuronWeights[neuronKey];
  const sum = input.reduce((acc, val, i) => acc + val * weights[i], 0);

  const sumEl = document.getElementById(`sum2_${neuronKey}`);
  const progressEl = document.getElementById(`resultProgress_${neuronKey}`);
  const iconEl = document.getElementById(`resultIcon_${neuronKey}`);
  const iconPath = iconEl?.querySelector("path");

  const colorMap = {
    neuron1: "#E4EB19",
    neuron2: "var(--akzent1)",
    neuron3: "var(--warning)"
  };

  if (sumEl) sumEl.textContent = sum.toFixed(2);
  if (progressEl) progressEl.style.width = `${(sum / 10) * 100}%`;

  if (iconPath) {
    const isOn = sum > threshold;
    const fillColor = isOn ? colorMap[neuronKey] : "var(--rahmen)";
    iconPath.setAttribute("fill", fillColor);
  }

  // === Dynamisches Feedback für die Rahmenfarben ===
  function updateBorderColor(neuronId, shouldBeOn, isCurrentlyOn) {
    const element = document.querySelector(`#resultIcon_${neuronId}`).closest('.outputElement');
    element.style.borderColor = isCurrentlyOn === shouldBeOn ? 'var(--success)' : 'var(--warning)';
  }

  function isIconOn(resultIconId) {
    const path = document.querySelector(`#${resultIconId} path`);
    return path.getAttribute("fill") !== "var(--rahmen)";
  }

  // Situation-bezogenes Verhalten definieren
  const situationExpectations = {
    situation1: { neuron1: false, neuron2: false, neuron3: false },
    situation2: { neuron1: false, neuron2: false, neuron3: true },
    situation3: { neuron1: true,  neuron2: true,  neuron3: false },
  };

  // Aktuelle Situation und Ergebnisstatus abfragen
  const expectations = situationExpectations[currentSituation];
  updateBorderColor("neuron1", expectations.neuron1, isIconOn("resultIcon_neuron1"));
  updateBorderColor("neuron2", expectations.neuron2, isIconOn("resultIcon_neuron2"));
  updateBorderColor("neuron3", expectations.neuron3, isIconOn("resultIcon_neuron3"));
}

/**
 * Aktualisiert alle drei Neuronen.
 */
function updateAllNeurons() {
  ["neuron1", "neuron2", "neuron3"].forEach(calculateNeuronOutput);
}

/* --------------------------------------
   Event-Handling: Interaktionen der Nutzer
----------------------------------------- */

// Slider-Events: Gewichte anpassen
sliders.forEach((slider, i) => {
  slider.addEventListener("input", () => {
    saveNeuronWeights(currentNeuron);
    updateWeightDisplays();
    updateAllNeurons();
    updateProductsForCurrentNeuron();
  });

  // Animation beim Drücken des Sliders
  const weightEl = document.querySelector(`.weight${i + 1} .weightElement`);
  slider.addEventListener("pointerdown", () => {
    weightEl.classList.remove("pulse");
    setTimeout(() => weightEl.classList.add("pulse"), 0);
  });
});

// Neuron-Buttons: Aktives Neuron wechseln
["neuron1", "neuron2", "neuron3"].forEach((neuron, index) => {
  const btn = document.getElementById(`${neuron}Btn`);
  btn.addEventListener("click", () => {
    currentNeuron = neuron;
    activeNeuronIndex = index;
    toggleActive("neuron", index);
    loadNeuronWeights(neuron);
    drawConnections();
    updateActiveActivation(index);
    updateOutputHighlight(index);
    updateAllNeurons();
    document.getElementById("neuronNameFunc").textContent = btn.textContent;
    updateProductsForCurrentNeuron();
  });
});

// Situations-Buttons: Situation wechseln
["situation1", "situation2", "situation3"].forEach((situation, index) => {
  const btn = document.getElementById(`${situation}Btn`);
  btn.addEventListener("click", () => {
    currentSituation = situation;
    toggleActive("situation", index);
    updateInputs();
    updateProductsForCurrentNeuron();
  });
});

/* --------------------------------------
   Hilfsfunktionen für aktive Elemente
----------------------------------------- */

/**
 * Schaltet aktive Klasse für Buttons eines Typs (Neuron oder Situation).
 */
function toggleActive(type, activeIndex) {
  [0, 1, 2].forEach(i => {
    const btn = document.getElementById(`${type}${i + 1}Btn`);
    btn.classList.toggle("active", i === activeIndex);
  });
}

/**
 * Hebt das aktive Aktivierungsfeld hervor.
 */
function updateActiveActivation(activeIndex) {
  ["activation1", "activation2", "activation3"].forEach((id, i) => {
    const el = document.querySelector(`.${id}`);
    if (el) el.classList.toggle("active", i === activeIndex);
  });
}

/**
 * Hebt den aktiven Output hervor.
 */
function updateOutputHighlight(activeIndex) {
  ["output1", "output2", "output3"].forEach((cls, i) => {
    const el = document.querySelector(`.${cls}`);
    if (el) el.classList.toggle("active", i === activeIndex);
  });
}

/* --------------------------------------
   Initialisierung bei Seitenstart
----------------------------------------- */
updateInputs();
loadNeuronWeights(currentNeuron);
updateAllNeurons();
updateProductsForCurrentNeuron();
updateActiveActivation(0);
updateOutputHighlight(0);