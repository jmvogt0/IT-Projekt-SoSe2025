function drawConnections() {
    const container = document.querySelector('.grid');
    const svg = document.querySelector('.connections');

    // Leere vorherige Linien
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // Hilfsfunktion: Mittelpunkt eines Elements relativ zum Container
    function center(el) {
      const rect = el.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2  - cRect.left,
        y: rect.top  + rect.height / 2 - cRect.top
      };
    }

    // Verbindungs-Paare: von → nach
    const pairs = [
      ['.input1',      '.weight1'],
      ['.input2',      '.weight2'],
      ['.input3',      '.weight3'],
      ['.weight1',     '.activation1'],
      ['.weight2',     '.activation1'],
      ['.weight3',     '.activation1'],
      ['.activation1', '.output1']
    ];

    pairs.forEach(([selFrom, selTo]) => {
      const fromEl = document.querySelector(selFrom);
      const toEl   = document.querySelector(selTo);
      if (!fromEl || !toEl) return;

      const p1 = center(fromEl);
      const p2 = center(toEl);

      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',  p1.x);
      line.setAttribute('y1',  p1.y);
      line.setAttribute('x2',  p2.x);
      line.setAttribute('y2',  p2.y);
      line.setAttribute('stroke', 'black');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    });
  }

  // Beim Laden und bei Resize neu zeichnen
  window.addEventListener('load',  drawConnections);
  window.addEventListener('resize', drawConnections);