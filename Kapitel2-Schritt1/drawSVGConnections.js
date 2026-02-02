function drawConnections() {
  // Get the grid container and SVG element for drawing lines
  const container = document.querySelector('.grid');
  const svg = document.querySelector('.connections');

  // Clear existing SVG lines
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // Helper: Calculate center point of an element relative to the container
  function center(el) {
    const rect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - cRect.left,
      y: rect.top + rect.height / 2 - cRect.top
    };
  }

  // Determine the active neuron index (1-based)
  const neuron = activeNeuronIndex + 1;

  // Define the connections to actively highlight (current neuron only)
  const allPairs = [
    // Connections from each input to its corresponding weight
    ['.input1', '.weight1'],
    ['.input2', '.weight2'],
    ['.input3', '.weight3'],
    ['.input4', '.weight4'],
    ['.input5', '.weight5'],

    // Connections from weights to the active neuron’s activation cell
    ['.weight1', `.activation${neuron}`],
    ['.weight2', `.activation${neuron}`],
    ['.weight3', `.activation${neuron}`],
    ['.weight4', `.activation${neuron}`],
    ['.weight5', `.activation${neuron}`],

    // Connection from the active neuron’s activation to its output
    [`.activation${neuron}`, `.output${neuron}`]
  ];

  // Define all possible connections for the entire diagram (for gray background lines)
  const fullPairs = [
    ['.input1', '.weight1'], ['.input2', '.weight2'], ['.input3', '.weight3'],
    ['.input4', '.weight4'], ['.input5', '.weight5'],
    ['.weight1', '.activation1'], ['.weight2', '.activation1'], ['.weight3', '.activation1'],
    ['.weight4', '.activation1'], ['.weight5', '.activation1'], ['.activation1', '.output1'],
    ['.weight1', '.activation2'], ['.weight2', '.activation2'], ['.weight3', '.activation2'],
    ['.weight4', '.activation2'], ['.weight5', '.activation2'], ['.activation2', '.output2'],
    ['.weight1', '.activation3'], ['.weight2', '.activation3'], ['.weight3', '.activation3'],
    ['.weight4', '.activation3'], ['.weight5', '.activation3'], ['.activation3', '.output3'],
  ];

  // Draw all gray lines for the complete network structure first
  fullPairs.forEach(([fromSel, toSel]) => drawLine(fromSel, toSel, 'lightgray'));

  // Draw the active neuron’s black lines on top
  allPairs.forEach(([fromSel, toSel]) => drawLine(fromSel, toSel, 'black'));

  // Function to draw a line between two elements, given CSS selectors and color
  function drawLine(fromSel, toSel, color) {
    const fromEl = document.querySelector(fromSel);
    const toEl = document.querySelector(toSel);
    if (!fromEl || !toEl) return;

    const p1 = center(fromEl);
    const p2 = center(toEl);

    // Create and configure SVG line element
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
  }
}

// Redraw connections on page load and when the window is resized
window.addEventListener('load', drawConnections);
window.addEventListener('resize', drawConnections);