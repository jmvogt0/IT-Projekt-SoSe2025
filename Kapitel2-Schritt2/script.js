// ------------------------------
// script.js
// ------------------------------

// 1) DOM references (must exist before usage)
const xEls = ['x1', 'x2', 'x3', 'x4', 'x5'].map(id => document.getElementById(id));
const xOutEls = ['x1Out', 'x2Out', 'x3Out', 'x4Out', 'x5Out'].map(id => document.getElementById(id));
const xFuncEls = ['x1Func', 'x2Func', 'x3Func', 'x4Func', 'x5Func'].map(id => document.getElementById(id));
const xProgEls = ['x1Progress', 'x2Progress', 'x3Progress', 'x4Progress', 'x5Progress'].map(id => document.getElementById(id));

let situations = null; // will be filled later from config.json
let currentSituation = 'situation1';

const sum2Els = ['sum2_neuron1', 'sum2_neuron2', 'sum2_neuron3']
  .map(id => document.getElementById(id));
const resultProgEls = ['resultProgress_neuron1', 'resultProgress_neuron2', 'resultProgress_neuron3']
  .map(id => document.getElementById(id));
const resultIconEls = ['resultIcon_neuron1', 'resultIcon_neuron2', 'resultIcon_neuron3']
  .map(id => document.getElementById(id));

const hlButtons = document.querySelectorAll('.hiddenLayer-toggle button');
const activationContainer = document.querySelector('.activationContainer');

const colorMap = {
  neuron1: "#E4EB19",
  neuron2: "var(--akzent1)",
  neuron3: "var(--warning)"
};

// 3) Global variables populated after loading config.json
let configs = null;          // holds network configurations
let currentConfig = 1;       // default configuration index
let threshold = 0.5;         // activation threshold

// 4) Forward pass through the neural network layers
function forwardPass(inputVector) {
  const config = configs[currentConfig];
  const hiddenActivations = [];
  let prev = inputVector.slice();

  // Compute hidden layers sequentially
  for (let i = 0; i < config.layerSizes.length; i++) {
    const W = config['weights' + i];
    const b = config['biases' + i];

    const currentLayer = W.map((row, j) => {
      const sum = row.reduce((acc, w_val, k) => acc + w_val * prev[k], b[j]);
      return sum;
    });

    hiddenActivations.push(currentLayer);
    prev = currentLayer;
  }

  // Compute final output layer
  const finalIdx = config.layerSizes.length;
  const Wout = config['weights' + finalIdx];
  const bout = config['biases' + finalIdx];

  const output = Wout.map((row, j) => {
    const sum = row.reduce((acc, w_val, k) => acc + w_val * prev[k], bout[j]);
    return sum;
  });

  return { hidden: hiddenActivations, output };
}

// 5) Dynamically render hidden layer neurons into the DOM
function renderHiddenLayers(layerSizes) {
  activationContainer.innerHTML = '';
  let globalIdx = 1; // global neuron index across all layers

  layerSizes.forEach((size, layerIdx) => {
    const layerDiv = document.createElement('div');
    layerDiv.className = `hiddenLayer layer${layerIdx + 1}`;

    for (let i = 0; i < size; i++) {
      const act = document.createElement('div');
      act.className = `activation activation${globalIdx}`;
      act.dataset.layer = layerIdx + 1;
      act.dataset.neuronIndex = i;
      act.innerHTML = `<div class="activationElement"><p class="smallFont">g</p></div>`;
      layerDiv.appendChild(act);
      globalIdx++;
    }

    activationContainer.appendChild(layerDiv);
  });

  if (typeof drawConnections === 'function') drawConnections();
}

// 6) Update inputs and recompute the network output
function updateInputs() {
  const inp = situations[currentSituation];
  const inputVector = [inp.x1, inp.x2, inp.x3, inp.x4, inp.x5];

  // a) Update input values in the DOM
  xEls.forEach((el, i) => {
    const v = inputVector[i].toFixed(1);
    el.textContent = v;
    xFuncEls[i].textContent = v;
    xOutEls[i].textContent = v;
    xProgEls[i].style.width = `${inputVector[i] * 100}%`;
  });
  document.querySelectorAll('.outputElement.active').forEach(box => box.classList.remove('active'));

  // b) Perform forward pass
  const { hidden, output } = forwardPass(inputVector);

  // c) Update hidden layer activations in DOM & log calculations
  console.group(`Config ${currentConfig} – Hidden layer computations`);
  hidden.forEach((layerArr, layerIdx) => {
    console.group(`Hidden Layer ${layerIdx + 1}`);
    const W = configs[currentConfig]['weights' + layerIdx];
    const b = configs[currentConfig]['biases' + layerIdx];

    layerArr.forEach((val, neuronIdx) => {
      const srcVec = (layerIdx === 0) ? inputVector : hidden[layerIdx - 1];
      const terms = srcVec.map((srcVal, k) => `${srcVal}*${W[neuronIdx][k]}`);
      const formula = terms.join(' + ') + ` + ${b[neuronIdx]}`;

      // Update DOM element for activation
      const prevCount = hidden.slice(0, layerIdx).reduce((acc, arr) => acc + arr.length, 0);
      const globalIdx = prevCount + neuronIdx + 1;
      const p = document.querySelector(`.activation${globalIdx} .activationElement p`);
      if (p) p.textContent = val.toFixed(2);
    });
    console.groupEnd();
  });
  console.groupEnd();

  // d) Compute and update output layer
  console.group(`Config ${currentConfig} – Output computations`);
  const lastHiddenIdx = configs[currentConfig].layerSizes.length - 1;
  const prevLayer = (lastHiddenIdx >= 0) ? hidden[lastHiddenIdx] : inputVector;
  const Wout = configs[currentConfig]['weights' + (lastHiddenIdx + 1)];
  const bout = configs[currentConfig]['biases' + (lastHiddenIdx + 1)];

  output.forEach((val, idx) => {
    const terms = prevLayer.map((prevVal, k) => `${prevVal}*${Wout[idx][k]}`);
    const formula = terms.join(' + ') + ` + ${bout[idx]}`;

    sum2Els[idx].textContent = val.toFixed(2);
    const maxOutputValue = 1.5;
    const widthPercent = Math.min(val / maxOutputValue, 1) * 100;
    resultProgEls[idx].style.width = `${widthPercent}%`;

    const svgEl = resultIconEls[idx];
    if (svgEl) {
      const path = svgEl.querySelector('path');
      const neuronKey = `neuron${idx + 1}`;
      const fillColor = (val >= threshold) ? colorMap[neuronKey] : "var(--rahmen)";
      path.setAttribute('fill', fillColor);
    }
  });
  console.groupEnd();

  // e) Update SVG connections and bind neuron click events
  if (typeof drawConnections === 'function') drawConnections();
  bindNeuronClicks();
}

// 7) Event listeners for hidden layer configuration buttons
hlButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    hlButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentConfig = parseInt(btn.id.replace('HLConfig', ''), 10);
    renderHiddenLayers(configs[currentConfig].layerSizes);
    updateInputs();

    document.querySelectorAll('.outputElement').forEach(el => {
    if (btn.textContent.includes('Optimiertes Netz')) {
      el.style.setProperty('border', '2px solid var(--success)', 'important');
    } else {
      el.style.removeProperty('border');
    }
  });
  });
});

// 8) Event listeners for scenario buttons
['1', '2', '3'].forEach(n => {
  document.getElementById(`situation${n}Btn`)
    .addEventListener('click', () => {
      document.querySelectorAll('.input-toggle button')
        .forEach(b => b.classList.remove('active'));
      document.getElementById(`situation${n}Btn`).classList.add('active');
      currentSituation = `situation${n}`;
      updateInputs();
    });
});

// 9) Load configurations from JSON and initialize the network
fetch('config.json')
  .then(res => {
    if (!res.ok) throw new Error('Config not found');
    return res.json();
  })
  .then(json => {
    configs = json;
    situations = json.situations;

    // Initialize hidden layers and inputs with default config
    renderHiddenLayers(configs[1].layerSizes);
    updateInputs();
  })
  .catch(err => {
    console.error('Error loading config:', err);
  });

// Bind click handlers for hidden layer and output neurons
function bindNeuronClicks() {

  document.querySelectorAll('.activation').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.outputElement.active').forEach(box => box.classList.remove('active'));

      const layer = +el.dataset.layer;
      const index = +el.dataset.neuronIndex;
      highlightWeights(layer, index);
    });
  });

  document.querySelectorAll('.outputElement').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.outputElement.active').forEach(box => box.classList.remove('active'));

      const index = +el.dataset.neuronIndex;
      highlightWeights(configs[currentConfig].layerSizes.length + 1, index);
    });
  });
}

// Reset the activation function table in the UI
function resetActivationTable() {
  for (let i = 1; i <= 5; i++) {
    const fields = [`x${i}Func`, `w${i}Func`, `prod${i}`];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '–';
    });
  }

  const sumEl = document.getElementById('sum');
  if (sumEl) sumEl.textContent = '–';
}

// Display the activation formula for a specific neuron
function displayActivationFormula(layer, neuronIndex) {
  resetActivationTable();

  const config = configs[currentConfig];
  const inputVector = Object.values(situations[currentSituation]);

  // Determine input vector for this neuron
  const prevLayerOutput = (layer === 1)
    ? inputVector
    : forwardPass(inputVector).hidden[layer - 2];

  const weights = config['weights' + (layer - 1)][neuronIndex];
  const bias    = config['biases' + (layer - 1)][neuronIndex];

  // Update activation formula text
  const terms = weights.map((_, i) => `x${i+1}*w${i+1}`);
  const formulaStr = `g = ${terms.join(' + ')} + ${bias.toFixed(2)}`;
  const formulaEl = document.getElementById('activationFormula');
  if (formulaEl) formulaEl.textContent = formulaStr;

  let sum = 0;

  for (let i = 0; i < weights.length && i < 5; i++) {
    const x = prevLayerOutput[i];
    const w = weights[i];
    const p = x * w;
    sum += p;

    const xId = `x${i + 1}Func`;
    const wId = `w${i + 1}Func`;
    const pId = `prod${i + 1}`;

    const xEl = document.getElementById(xId);
    const wEl = document.getElementById(wId);
    const pEl = document.getElementById(pId);

    if (xEl && wEl && pEl) {
      xEl.textContent = x.toFixed(2);
      wEl.textContent = w.toFixed(2);
      pEl.textContent = p.toFixed(2);
    }
  }

  const total = sum + bias;
  console.groupEnd();

  const sumEl = document.getElementById('sum');
  if (sumEl) sumEl.textContent = total.toFixed(2);
}

// Highlight the connections for a clicked neuron and update SVG
function highlightWeights(layer, index) {
  if (!container || !svg || !configs?.[currentConfig]) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  drawConnections();

  const cfg = configs[currentConfig];
  const total = cfg.layerSizes.length;
  let src, dst, W;

  if (layer >= 1 && layer <= total) {
    // Hidden layer neuron clicked
    src = (layer === 1)
      ? Array.from({length:5}, (_,i) => document.querySelector(`.input${i+1}`))
      : Array.from(document.querySelectorAll(`.hiddenLayer.layer${layer-1} .activation`));
    dst = document.querySelector(`.hiddenLayer.layer${layer} .activation[data-neuron-index="${index}"]`);
    W   = cfg['weights' + (layer-1)];
  } else if (layer === total + 1) {
    // Output neuron clicked
    src = Array.from(document.querySelectorAll(`.hiddenLayer.layer${total} .activation`));
    dst = document.getElementById(`sum2_neuron${index+1}`);
    styleBox = document.querySelector(`.outputElement[data-neuron-index="${index}"]`);
    styleBox.classList.add('active');

    W   = cfg['weights' + total];
  } else return;

  src.forEach((s,i) => {
    if (s && dst && W) {
      const wval = Array.isArray(W[index]) ? W[index][i] : W[i][index];
      const c = drawLine(s, dst, 'black');
      drawWeightLabel(c, wval.toFixed(2), 0);
    }
  });

  // Update activation formula table with detailed computation
  displayActivationFormula(layer, index);
}