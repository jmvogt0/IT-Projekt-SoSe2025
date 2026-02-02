// ------------------------------
// drawSVGConnections.js
// ------------------------------

// Note: configs and currentConfig are globally defined in script.js

const container = document.querySelector('.grid');          // Main grid container
const svg       = document.querySelector('.connections');   // SVG element to draw connections

// Calculate the center point of an element relative to the container
function center(el) {
  const r  = el.getBoundingClientRect();
  const cr = container.getBoundingClientRect();
  return { x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top };
}

// Draw a straight line between two elements
function drawLine(src, dst, color='black') {
  const p1 = center(src), p2 = center(dst);
  const line = document.createElementNS(svg.namespaceURI, 'line');
  line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
  line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', '2');
  line.setAttribute('stroke-linecap', 'round');
  svg.appendChild(line);
  return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
}

// Draw a weight label ("pill") at the midpoint of a line
function drawWeightLabel(coords, text, offset=0) {
  const fs=12, ph=4, pv=2;
  const mx=(coords.x1+coords.x2)/2, my=(coords.y1+coords.y2)/2;

  // Determine direction vector perpendicular to the line for offset
  const dx=coords.x2-coords.x1, dy=coords.y2-coords.y1;
  const len=Math.hypot(dx,dy)||1;
  const nx=-dy/len, ny=dx/len;
  const ox=nx*8*offset, oy=ny*8*offset;

  // Create temporary text element to measure size
  const tmp=document.createElementNS(svg.namespaceURI,'text');
  tmp.setAttribute('font-size',fs);
  tmp.setAttribute('font-family','sans-serif');
  tmp.textContent=text; tmp.setAttribute('x',-9999); tmp.setAttribute('y',-9999);
  svg.appendChild(tmp);
  const bb=tmp.getBBox(); svg.removeChild(tmp);

  // Calculate pill dimensions
  const w=bb.width+ph*2, h=bb.height+pv*2;

  // Draw pill background rectangle
  const rect=document.createElementNS(svg.namespaceURI,'rect');
  rect.setAttribute('x',mx+ox-w/2); rect.setAttribute('y',my+oy-h/2);
  rect.setAttribute('width',w); rect.setAttribute('height',h);
  rect.setAttribute('rx',pv+2); rect.setAttribute('ry',pv+2);
  rect.setAttribute('fill','#f0f0f0'); rect.setAttribute('stroke','#ccc'); rect.setAttribute('stroke-width','1');
  svg.appendChild(rect);

  // Draw pill text centered in the rectangle
  const txt=document.createElementNS(svg.namespaceURI,'text');
  txt.setAttribute('x',mx+ox); txt.setAttribute('y',my+oy+bb.height/4);
  txt.setAttribute('font-size',fs); txt.setAttribute('font-family','sans-serif');
  txt.setAttribute('text-anchor','middle'); txt.textContent=text;
  svg.appendChild(txt);
}

// Draws all connections for the current network configuration
function drawConnections() {
  if (!container || !svg || !configs?.[currentConfig]) return;

  // Clear any previous lines and pills
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const cfg = configs[currentConfig];

  // Collect input elements
  const inputs = Array.from({length:5}, (_,i) => document.querySelector(`.input${i+1}`));

  // Collect activations from each hidden layer
  const hidden = cfg.layerSizes.map((_,i)=>
    Array.from(document.querySelectorAll(`.hiddenLayer.layer${i+1} .activation`))
  );

  // Collect output elements
  const outputs = Array.from({length:3}, (_,i) => document.getElementById(`sum2_neuron${i+1}`));

  // Combine all layers for drawing connections
  const layers = [inputs, ...hidden, outputs];

  // Draw connections between each consecutive pair of layers
  for (let i=0; i<layers.length-1; i++) {
    layers[i].forEach(s => layers[i+1].forEach(d => { if(s && d) drawLine(s, d, '#ccc'); }));
  }
}

// Redraw connections when the window is resized to keep positions updated
window.addEventListener('resize', drawConnections);