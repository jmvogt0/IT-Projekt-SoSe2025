// ------------------------------------------------------------------
// script.js
// ------------------------------------------------------------------

// *** 1) DOM-Referenzen für Inputs/Szenarien ***
let situations = null; // will be filled from config.json later
let currentSituation = "situation1";

const threshold = 0.5; // threshold for output icons (yellow/dark)

// Inputs (sensor values)
const [x1El, x2El, x3El, x4El, x5El] = ["x1","x2","x3","x4","x5"]
  .map(id => document.getElementById(id));
const [x1Out, x2Out, x3Out, x4Out, x5Out] = ["x1Out","x2Out","x3Out","x4Out","x5Out"]
  .map(id => document.getElementById(id));
const [x1Func, x2Func, x3Func, x4Func, x5Func] = ["x1Func","x2Func","x3Func","x4Func","x5Func"]
  .map(id => document.getElementById(id));
const [x1Progress, x2Progress, x3Progress, x4Progress, x5Progress] = ["x1Progress","x2Progress","x3Progress","x4Progress","x5Progress"]
  .map(id => document.getElementById(id));

// Colors for output neurons (light, music, alarm)
const colorMap = {
  neuron1: "#E4EB19",
  neuron2: "var(--akzent1)",
  neuron3: "var(--warning)"
};

// Slider for hidden neuron amount
const neuronSlider    = document.getElementById("neuronAmountSlider");
const neuronSliderVal = document.getElementById("neuronAmountVal");
neuronSliderVal.textContent = neuronSlider.value;

// Container for hidden layer activations
const activationContainer = document.querySelector('.activationContainer');

// Output neuron elements
const sum2Els = ["sum2_neuron1","sum2_neuron2","sum2_neuron3"]
  .map(id => document.getElementById(id));
const resultProgEls = ["resultProgress_neuron1","resultProgress_neuron2","resultProgress_neuron3"]
  .map(id => document.getElementById(id)); // evtl. null, wenn nicht vorhanden
const resultIconEls = ["resultIcon_neuron1","resultIcon_neuron2","resultIcon_neuron3"]
  .map(id => document.getElementById(id)); // evtl. null

// ------------------------------------------------------------------
// *** 2) Load data from config.json ***
// ------------------------------------------------------------------
let configData = null;

fetch("config.json")
  .then(response => {
    if (!response.ok) throw new Error("Konfigurationsdatei konnte nicht geladen werden.");
    return response.json();
  })
  .then(json => {
    configData = json;
    situations = json.situations;
   // After JSON is loaded: render neurons and update inputs
    renderActivationNeurons(parseInt(neuronSlider.value, 10));
    updateInputs();
  })
  .catch(err => {
    console.error("Fehler beim Laden der Konfig:", err);
  });

  function updateBorderStyle() {
  const cnt = parseInt(neuronSlider.value, 10);
  let apply = false;

  switch (currentSituation) {
    case 'situation1': // Katze läuft nachts
      apply = (cnt === 3 || cnt === 4);
      break;
    case 'situation2': // Tanzparty am Tag
      apply = (cnt === 4);
      break;
    case 'situation3': // Dunkel & laut
      apply = (cnt === 3 || cnt === 4 || cnt === 5);
      break;
  }

  document.querySelectorAll('.outputElement').forEach(el => {
    if (apply) {
      el.style.setProperty('border', '2px solid var(--success)', 'important');
    } else {
      el.style.removeProperty('border');
    }
  });
}


// ------------------------------------------------------------------
// *** 3) Function: generate hidden neurons based on slider value ***
// ------------------------------------------------------------------
function renderActivationNeurons(count) {
  activationContainer.innerHTML = "";
  for (let i = 1; i <= count; i++) {
  const wrapper = document.createElement("div");
  wrapper.className = `activation activation${i}`;
  wrapper.dataset.neuronIndex = i - 1; // 0-basiert: wichtig!
  wrapper.innerHTML = `
    <div class="activationElement">
      <p>g</p>
    </div>
  `;
  activationContainer.appendChild(wrapper);
}
  bindNeuronClicks();
  // After rendering the neurons, update connections (if drawConnections exists)
  if (typeof drawConnections === "function") {
    drawConnections();
  }
}

// Bind click events on neurons for highlighting weights
function bindNeuronClicks() {
  // Hidden-Neurons
  document.querySelectorAll('.activation').forEach(el => {
    el.addEventListener('click', () => {
      clearOutputActive();       
      const index = +el.dataset.neuronIndex;
      highlightWeights('hidden', index);
    });
  });

  // Output-Neurons
  document.querySelectorAll('.outputElement').forEach((el, idx) => {
    el.addEventListener('click', () => {
      highlightWeights('output', idx);
      clearOutputActive();
      el.classList.add('active');
    });
  });
}

// Highlight weights connected to a clicked hidden or output neuron
function highlightWeights(type, index) {
  if (!container || !svg || !configData) return;

  const highlightLayer = svg.querySelector('.highlight-layer');
  if (!highlightLayer) return;

 // Clear only highlight layer
  while (highlightLayer.firstChild) highlightLayer.removeChild(highlightLayer.firstChild);

  const inputs = Array.from({length:5}, (_,i)=>document.querySelector(`.input${i+1}`));
  const hidden = Array.from(document.querySelectorAll('.activationContainer .activation'));
  const outputs = Array.from({length:3}, (_,i)=>document.getElementById(`sum2_neuron${i+1}`));

  displayActivationFormula(type, index);

  const cfg = configData[`${currentSituation}Weights`];
  if (type === 'hidden') {
    if (!cfg.weights0[index]) return;
    inputs.forEach((inpEl, inpIdx) => {
      const wVal = cfg.weights0[index][inpIdx];
      const coords = drawLine(inpEl, hidden[index], 'black');
      highlightLayer.appendChild(coords.line);
      drawWeightLabel(coords, wVal.toFixed(2), 0, highlightLayer);
    });
  } else if (type === 'output') {
    if (!cfg.weights1[index]) return;
    hidden.forEach((hidEl, hidIdx) => {
      const wVal = cfg.weights1[index][hidIdx];
      const coords = drawLine(hidEl, outputs[index], 'black');
      highlightLayer.appendChild(coords.line);
      drawWeightLabel(coords, wVal.toFixed(2), 0, highlightLayer);
    });
  }
}


// ------------------------------------------------------------------
// *** 4) Slider listener: updates hidden neurons on change ***
// ------------------------------------------------------------------
neuronSlider.addEventListener("input", () => {
  resetActivationTable();
  const highlightLayer = svg.querySelector('.highlight-layer');
  if (highlightLayer) {
    while (highlightLayer.firstChild) highlightLayer.removeChild(highlightLayer.firstChild);
  }
  const cnt = parseInt(neuronSlider.value, 10);
  neuronSliderVal.textContent = cnt;
  renderActivationNeurons(cnt);
  updateInputs();
  clearOutputActive();

  updateBorderStyle();
});

// ------------------------------------------------------------------
// *** 5) Scenario buttons: switch between 4 predefined inputs ***
// ------------------------------------------------------------------
["1","2","3"].forEach(n => {
  document.getElementById(`situation${n}Btn`)
    .addEventListener("click", () => {
      // 1) Tab-Bar aktiv setzen
      document.querySelectorAll(".situation-toggle button")
        .forEach(btn => btn.classList.remove("active"));
      document.getElementById(`situation${n}Btn`).classList.add("active");
      currentSituation = `situation${n}`;
      updateInputs();
      clearOutputActive();

      // 2) Reset wie beim Slider:
      resetActivationTable();                                  // Tabelle zurücksetzen
      document.querySelectorAll('.activation, .outputElement') // Selektion löschen
        .forEach(el => el.classList.remove('selected'));
      // Highlight‐Layer leeren
      const highlightLayer = svg.querySelector('.highlight-layer');
      if (highlightLayer) {
        while (highlightLayer.firstChild) 
          highlightLayer.removeChild(highlightLayer.firstChild);
      }

      // 3) Inputs neu laden
      currentSituation = `situation${n}`;
      updateInputs();
    });
});

// ------------------------------------------------------------------
// *** 6) Function: calculate and display hidden/output values ***
// ------------------------------------------------------------------
function updateInputs() {
  if (!configData) return; // config must be loaded first

  // 6a) Current input vector
  const inp = situations[currentSituation];
  const inputVector = [inp.x1, inp.x2, inp.x3, inp.x4, inp.x5];

  // Update input values in DOM
  [x1El, x2El, x3El, x4El, x5El].forEach((el, i) => {
    const v = inputVector[i].toFixed(1);
    el.textContent = v;
  });
  [x1Func, x2Func, x3Func, x4Func, x5Func].forEach((el, i) => {
    const v = inputVector[i].toFixed(1);
    el.textContent = v;
  });
  [x1Out, x2Out, x3Out, x4Out, x5Out].forEach((el, i) => {
    const v = inputVector[i].toFixed(1);
    el.textContent = v;
  });
  if (x1Progress) x1Progress.style.width = `${inp.x1 * 100}%`;
  if (x2Progress) x2Progress.style.width = `${inp.x2 * 100}%`;
  if (x3Progress) x3Progress.style.width = `${inp.x3 * 100}%`;
  if (x4Progress) x4Progress.style.width = `${inp.x4 * 100}%`;
  if (x5Progress) x5Progress.style.width = `${inp.x5 * 100}%`;

  // 6b) Calculate hidden layer activations (number of neurons from slider)
  const neuronCount = parseInt(neuronSlider.value, 10);
  const { weights0, biases0 } = configData[`${currentSituation}Weights`];

  const hiddenActivations = new Array(neuronCount);

  for (let i = 0; i < neuronCount; i++) {
    const wRow = weights0[i];   // weights array length 5
    const bVal = biases0[i];    // bias for this neuron

    // Summe = x1*w1 + x2*w2 + … + x5*w5 + bias
    const terms = inputVector.map((xVal,k) => xVal * wRow[k]);
    const sum = terms.reduce((acc,v) => acc + v, bVal);


    hiddenActivations[i] = sum;

    const p = document.querySelector(`.activation${i+1} .activationElement p`);
    if (p) p.textContent = sum.toFixed(2);
  }

// 6c) Calculate outputs for 3 neurons: Light, Music, Alarm
  const { weights1, biases1 } = configData[`${currentSituation}Weights`];
  const outputValues = []; // werden später in sum2_neuron1..3 geschrieben

  for (let outIdx = 0; outIdx < 3; outIdx++) {
    const wOutRow = weights1[outIdx]; // Länge = max Hidden‐Neuronen (hier 10)
    const bOut   = biases1[outIdx];
    // Berechnung nur über die tatsächlich existierenden Hidden‐Neuronen
    const relevantWeights = wOutRow.slice(0, neuronCount);
    // sum = Σ (hiddenActivations[i] * relevantWeights[i]) + bOut
    const termsOut = hiddenActivations.map((hVal, k) => hVal * relevantWeights[k]);
    const sumOut = termsOut.reduce((a,b) => a + b, bOut);

    outputValues.push(sumOut);
  }

  // 6d) Update output elements in DOM
  outputValues.forEach((val, idx) => {
    const span = sum2Els[idx];
    if (span) span.textContent = val.toFixed(2);

    const prog = resultProgEls[idx];
    if (prog) {
      const maxOutputValue = 1.5;
      const wPct = Math.min(Math.abs(val) / maxOutputValue, 1) * 100;
      prog.style.width = `${wPct}%`;
    }
    const iconSvg = resultIconEls[idx];
    if (iconSvg) {
      const path = iconSvg.querySelector("path");
      if (path) {
        const neuronKey = `neuron${idx + 1}`;
        const fillColor = (val >= threshold) ? colorMap[neuronKey] : "var(--rahmen)";
        path.setAttribute("fill", fillColor);
      }
    }
  });

  // 6e) Redraw connections
  if (typeof drawConnections === "function") {
    drawConnections();
  }
}
// ------------------------------------------------------------------
// *** 7) Initial reset and display of activation formulas ***
// ------------------------------------------------------------------

// Reset the activation table by setting all cells to "–"
function resetActivationTable() {
  const xCells = document.querySelectorAll('.calculation-grid p[id^="x"]');
  const wCells = document.querySelectorAll('.calculation-grid p[id^="w"]');
  const pCells = document.querySelectorAll('.calculation-grid p[id^="prod"]');

  [...xCells, ...wCells, ...pCells].forEach(el => {
    el.textContent = '–';
  });

  const sumEl = document.getElementById('sum');
  if (sumEl) sumEl.textContent = '–';
}

// Display the formula and fill the activation calculation table for a neuron
function displayActivationFormula(type, index) {
  resetActivationTable();

  const gridContainer = document.querySelector(".calculation-grid");

  // Determine how many rows are needed for the formula display
  const requiredRows = (type === "hidden") 
    ? configData[`${currentSituation}Weights`].weights0[index].length 
    : parseInt(neuronSlider.value, 10);

  // Remove old rows (keep headers and sum row)
  gridContainer.querySelectorAll(".grid-cell").forEach(cell => cell.remove());

  // Create new rows dynamically based on required size
  for (let i = 0; i < requiredRows; i++) {
    const xCell = document.createElement("div");
    xCell.className = "grid-cell";
    xCell.innerHTML = `<p id="x${i+1}Func">-</p>`;

    const wCell = document.createElement("div");
    wCell.className = "grid-cell";
    wCell.innerHTML = `<p id="w${i+1}Func">-</p>`;

    const pCell = document.createElement("div");
    pCell.className = "grid-cell";
    pCell.innerHTML = `<p id="prod${i+1}">-</p>`;

    gridContainer.insertBefore(xCell, gridContainer.querySelector(".grid-sum"));
    gridContainer.insertBefore(wCell, gridContainer.querySelector(".grid-sum"));
    gridContainer.insertBefore(pCell, gridContainer.querySelector(".grid-sum"));
  }


  // Bias‐Zeile hinzufügen
  const sumRow = gridContainer.querySelector(".grid-sum");
  const biasArr = configData[`${currentSituation}Weights`][ type === "hidden"
    ? "biases0"
    : "biases1"
  ];
  const bias = biasArr[index];

  // X‐Zelle (leer)
  const biasX = document.createElement("div");
  biasX.className = "grid-cell";
  biasX.innerHTML = `<p id="xBias">Bias</p>`;
  gridContainer.insertBefore(biasX, sumRow);

  // W‐Zelle (Bias‐Wert)
  const biasW = document.createElement("div");
  biasW.className = "grid-cell";
  biasW.innerHTML = `<p id="wBias">${bias.toFixed(2)}</p>`;
  gridContainer.insertBefore(biasW, sumRow);

  // Prod‐Zelle (Bias als Produkt, also identisch)
  const biasP = document.createElement("div");
  biasP.className = "grid-cell";
  biasP.innerHTML = `<p id="prodBias">${bias.toFixed(2)}</p>`;
  gridContainer.insertBefore(biasP, sumRow);

  // Fill table with actual calculation values for the selected neuron
  if (type === 'hidden') {
    const inpVec = Object.values(situations[currentSituation]);
    const weights = configData[`${currentSituation}Weights`].weights0[index];
    const bias = configData[`${currentSituation}Weights`].biases0[index];

    // Update formula string in the formula display element
    const formulaStr = `g = ${weights.map((_, i) => `x${i+1}*w${i+1}`).join(' + ')} + ${bias.toFixed(2)}`;
    const formulaEl = document.getElementById('activationFormula');
    if (formulaEl) formulaEl.textContent = formulaStr;

    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      const x = inpVec[i];
      const w = weights[i];
      const p = x * w;
      sum += p;

      document.getElementById(`x${i+1}Func`).textContent = x.toFixed(2);
      document.getElementById(`w${i+1}Func`).textContent = w.toFixed(2);
      document.getElementById(`prod${i+1}`).textContent = p.toFixed(2);
    }

    const total = sum + bias;
    document.getElementById('sum').textContent = total.toFixed(2);

  } else if (type === 'output') {
    const neuronCount = parseInt(neuronSlider.value, 10);
    const hiddenActivations = [];
    const inpVec = Object.values(situations[currentSituation]);

    // First calculate all hidden activations based on input
    for (let i = 0; i < neuronCount; i++) {
      const wRow = configData[`${currentSituation}Weights`].weights0[i];
      const bVal = configData[`${currentSituation}Weights`].biases0[i];
      const terms = inpVec.map((x, k) => x * wRow[k]);
      const s = terms.reduce((a, v) => a + v, bVal);
      hiddenActivations.push(s);
    }

    const weights = configData[`${currentSituation}Weights`].weights1[index].slice(0, neuronCount);
    const bias = configData[`${currentSituation}Weights`].biases1[index];
    
    const formulaStr = `g = ${weights.map((_, i) => `h${i+1}*w${i+1}`).join(' + ')} + ${bias.toFixed(2)}`;
    const formulaEl = document.getElementById('activationFormula');
    if (formulaEl) formulaEl.textContent = formulaStr;

    let sum = 0;
    for (let i = 0; i < neuronCount; i++) {
      const h = hiddenActivations[i];
      const w = weights[i];
      const p = h * w;
      sum += p;

      document.getElementById(`x${i+1}Func`).textContent = h.toFixed(2);
      document.getElementById(`w${i+1}Func`).textContent = w.toFixed(2);
      document.getElementById(`prod${i+1}`).textContent = p.toFixed(2);
    }

    const total = sum + bias;
    document.getElementById('sum').textContent = total.toFixed(2);
  }
}

// helper zum Zurücksetzen
function clearOutputActive() {
  document.querySelectorAll('.outputElement.active')
    .forEach(box => box.classList.remove('active'));
}