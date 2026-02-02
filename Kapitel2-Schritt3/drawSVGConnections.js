// ------------------------------
// drawSVGConnections.js
// ------------------------------

// Note: configData (weights, biases) is loaded globally from script.js

// Get references to the container grid and the SVG canvas for connections
const container = document.querySelector('.grid');
const svg       = document.querySelector('.connections');

// Calculate the center of an element relative to the container
function center(el) {
  const r  = el.getBoundingClientRect();
  const cr = container.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - cr.left,
    y: r.top + r.height / 2 - cr.top
  };
}

// Draw a line between two elements and return the SVG line plus coordinates
function drawLine(src, dst, color='black') {
  const p1 = center(src), p2 = center(dst);
  const line = document.createElementNS(svg.namespaceURI, 'line');
  line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
  line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', '2');
  line.setAttribute('stroke-linecap', 'round');
  return { line, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
}

// Draw a "weight pill" label on the connection with the weight value
function drawWeightLabel(coords, text, offset=0, layer) {
  const fs = 12, ph = 4, pv = 2;
  const mx = (coords.x1 + coords.x2) / 2, my = (coords.y1 + coords.y2) / 2;
  const dx = coords.x2 - coords.x1, dy = coords.y2 - coords.y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const ox = nx * 8 * offset, oy = ny * 8 * offset;

  // Measure text size off-screen first
  const tmp = document.createElementNS(svg.namespaceURI, 'text');
  tmp.setAttribute('font-size', fs);
  tmp.setAttribute('font-family', 'sans-serif');
  tmp.textContent = text;
  tmp.setAttribute('x', -9999);
  tmp.setAttribute('y', -9999);
  layer.appendChild(tmp);
  const bb = tmp.getBBox();
  layer.removeChild(tmp);

  const w = bb.width + ph * 2, h = bb.height + pv * 2;

  // Draw pill background (rounded rectangle)
  const rect = document.createElementNS(svg.namespaceURI, 'rect');
  rect.setAttribute('x', mx + ox - w / 2);
  rect.setAttribute('y', my + oy - h / 2);
  rect.setAttribute('width', w);
  rect.setAttribute('height', h);
  rect.setAttribute('rx', pv + 2);
  rect.setAttribute('ry', pv + 2);
  rect.setAttribute('fill', '#f0f0f0');
  rect.setAttribute('stroke', '#ccc');
  rect.setAttribute('stroke-width', '1');
  layer.appendChild(rect);

  // Draw text centered in the pill
  const txt = document.createElementNS(svg.namespaceURI, 'text');
  txt.setAttribute('x', mx + ox);
  txt.setAttribute('y', my + oy + bb.height / 4);
  txt.setAttribute('font-size', fs);
  txt.setAttribute('font-family', 'sans-serif');
  txt.setAttribute('text-anchor', 'middle');
  txt.textContent = text;
  layer.appendChild(txt);
}

// Draw all connections in the network graph
function drawConnections() {
  if (!container || !svg || !configData) return;

  // Create base and highlight layers if not already present
  let baseLayer = svg.querySelector('.base-layer');
  let highlightLayer = svg.querySelector('.highlight-layer');
  if (!baseLayer) {
    baseLayer = document.createElementNS(svg.namespaceURI, 'g');
    baseLayer.classList.add('base-layer');
    svg.appendChild(baseLayer);
  }
  if (!highlightLayer) {
    highlightLayer = document.createElementNS(svg.namespaceURI, 'g');
    highlightLayer.classList.add('highlight-layer');
    svg.appendChild(highlightLayer);
  }

  // Clear existing base connections, keep highlight layer intact
  while (baseLayer.firstChild) baseLayer.removeChild(baseLayer.firstChild);

  const cfg = configData;

  // Collect DOM elements for each layer
  const inputs = Array.from({length:5}, (_, i) => document.querySelector(`.input${i+1}`));
  const hidden = [
    Array.from(document.querySelectorAll(`.activationContainer .activation`))
  ];
  const outputs = Array.from({length:3}, (_, i) => document.getElementById(`sum2_neuron${i+1}`));

  const layers = [inputs, ...hidden, outputs];

  // Draw gray connections between each layer pair (inputs→hidden, hidden→outputs)
  for (let i = 0; i < layers.length - 1; i++) {
    layers[i].forEach(s => layers[i+1].forEach(d => {
      if (s && d) {
        const coords = drawLine(s, d, '#ccc');
        if (coords) baseLayer.appendChild(coords.line);
      }
    }));
  }
}

// Recalculate and redraw connections on window resize
window.addEventListener('resize', drawConnections);