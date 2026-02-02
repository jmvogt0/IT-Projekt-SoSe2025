document.addEventListener("DOMContentLoaded", function() {

            let sourceEl = null;
            let connections = [];

            const svg = document.getElementById('svgCanvas');

            function setSource(element) {
                sourceEl = element;
            }
            window.setSource = setSource;


            function setTarget(targetEl) {

                    if (!sourceEl) return;

                    const existingConnection = connections.find(
                    conn => conn.source === sourceEl.id && conn.target === targetEl.id
                    );

                    if (existingConnection) {
                    svg.removeChild(existingConnection.element);
                    connections = connections.filter(c => c !== existingConnection);
                    sourceEl = null;
                    return;
                    }

                    const startRect = sourceEl.getBoundingClientRect();
                    const endRect = targetEl.getBoundingClientRect();
                    const svgRect = svg.getBoundingClientRect();
                    const offsetX = svgRect.left;
                    const offsetY = svgRect.top;

                    //Start- und Endpunkte absolut festlegen
                    const startX = startRect.left + startRect.width /2 - offsetX;
                    const startY = startRect.top + startRect.height / 2 -offsetY;
                    const endX = endRect.left + endRect.width /2 - offsetX;
                    const endY = endRect.top + endRect.height / 2 - offsetY;

                    // Das Element, dessen Hintergrundfarbe du übernehmen willst
                    const element = document.querySelector('.unit_matchingBox .dotLeft') || document.querySelector('.matchingBox_standAlone .dotLeft');

                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", startX);
                    line.setAttribute("y1", startY);
                    line.setAttribute("x2", endX);
                    line.setAttribute("y2", endY);
                    line.setAttribute("stroke", window.getComputedStyle(element).backgroundColor);
                    line.setAttribute("stroke-width", "2");

                    line.addEventListener("click", function () {
                    svg.removeChild(line);
                    connections = connections.filter(c => c.element !== line);
                    });

                    svg.appendChild(line);
                    connections.push({ source: sourceEl.id, target: targetEl.id, element: line });
                    sourceEl = null;
                    handle_click();
            }
            window.setTarget = setTarget;

            /*Funktion, damit der Check-Button aktiviert wird und Studierenden ab dem Zeitpunkt egal wie viel sie vom Quiz ausgefüllt haben, die Lösung ansehen können, da die Funktion "check()" hier aufgerufen wird*/
            function handle_click() {
              const msgBox =
                    document.getElementById("unitLine_msg") ||
                    document.getElementById("Line_msg_standAlone");
        
                if (msgBox) {
                    msgBox.innerHTML = "Klicke auf Check für die Lösung!";
                }
                const checkButton = document.getElementById("check_button");
                const mainSrc = "../../bilder/check_enabled3.png";
                const fallbackSrc = "../bilder/check_enabled3.png";

                checkButton.onerror = function() {
                    // Nur wechseln, wenn noch nicht versucht wurde, das Fallback zu laden
                    if (!checkButton.src.endsWith(fallbackSrc)) {
                        checkButton.src = fallbackSrc;
                    }
                };
                checkButton.src = mainSrc;

                document.getElementById("check_button").onclick = check;
            }
             
                const box = document.querySelector('.unit_matchingBox') || document.querySelector('.matchingBox_standAlone');

                // Das Attribut als String auslesen:
                const mappingsStr = box.dataset.mappings;

                // In ein Objekt umwandeln:
                const mappings = JSON.parse(mappingsStr);
           
            
              // Linke und rechte Listen in der Einhieit finden
              const leftList = box.querySelector('.unit_listLeft');
              const rightList = box.querySelector('.unit_listRight');
          
              // Maximale Anzahl der Einträge bestimmen
              const liCount = Math.max(
                leftList ? leftList.querySelectorAll('li').length : 0,
                rightList ? rightList.querySelectorAll('li').length : 0
              );
          
              // Gesamthöhe, die du für die Liste möchtest (z.B. 260px)
              const containerHeight = 260;
              // Höhe pro Eintrag berechnen (mindestens z.B. 40px)
              const liHeight = Math.max(containerHeight / liCount, 40);
          
              // Höhe für alle linken Einträge setzen
              if (leftList) {
                leftList.querySelectorAll('li').forEach(function(li) {
                  li.style.height = liHeight + "px";
                });
              }
              // Höhe für alle rechten Einträge setzen
              if (rightList) {
                rightList.querySelectorAll('li').forEach(function(li) {
                  li.style.height = liHeight + "px";
                });
              }

              // Linke und rechte Listen bei Einzelfragen finden
              const leftListAlone = box.querySelector('.listLeft_standAlone');
              const rightListAlone = box.querySelector('.listRight_standAlone');

              // Maximale Anzahl der Einträge bestimmen
              const liCountAlone = Math.max(
                leftListAlone ? leftListAlone.querySelectorAll('li').length : 0,
                rightListAlone ? rightListAlone.querySelectorAll('li').length : 0
              );

              // Gesamthöhe, die du für die Liste möchtest
              const containerHeightAlone = 340;
              // Höhe pro Eintrag berechnen (mindestens z.B. 40px)
              const liHeightAlone = Math.max(containerHeightAlone / liCountAlone, 40);

              // Höhe für alle linken Einträge setzen
              if (leftListAlone) {
                leftListAlone.querySelectorAll('li').forEach(function(li) {
                  li.style.height = liHeightAlone + "px";
                });
              }
              // Höhe für alle rechten Einträge setzen
              if (rightListAlone) {
                rightListAlone.querySelectorAll('li').forEach(function(li) {
                  li.style.height = liHeightAlone + "px";
                });
              }

            function check() {
                let allCorrect = true;

                Object.keys(mappings).forEach(leftKey => {
                    const expectedTargets = mappings[leftKey];
                    const actualTargets = connections
                    .filter(conn => conn.source === leftKey)
                    .map(conn => conn.target);

                    const isCorrect =
                        expectedTargets.length === actualTargets.length &&
                        expectedTargets.every(t => actualTargets.includes(t)) &&
                        actualTargets.every(t => expectedTargets.includes(t));

                    const img = document.getElementById(`sym_${leftKey}`);
                    
                    if (img) {
                      setImageWithFallback(img, isCorrect);
                    }
                    if (!isCorrect) allCorrect = false;
                });

                const msgBox = document.getElementById("unitLine_msg") || document.getElementById("Line_msg_standAlone");
                if (msgBox) {
                    msgBox.innerHTML = allCorrect
                        ? "Super! Das ist richtig!"
                        : "Nicht ganz, versuche es nochmal!";
                }

                const checkButton = document.getElementById("check_button");
                if (checkButton) {
                    checkButton.onclick = null;
                    const mainSrc = "../../bilder/check_disable.png";
                    const fallbackSrc = "../bilder/check_disable.png";

                    checkButton.onerror = function() {
                        // Nur wechseln, wenn noch nicht versucht wurde, das Fallback zu laden
                        if (!checkButton.src.endsWith(fallbackSrc)) {
                            checkButton.src = fallbackSrc;
                        }
                    };
                    checkButton.src = mainSrc;
                }
            }
});   

function setImageWithFallback(img, isCorrect) {
  const mainSrc = isCorrect
      ? "../../bilder/tick.png"
      : "../../bilder/cross.png";
  const fallbackSrc = isCorrect
      ? "../bilder/tick.png"
      : "../bilder/cross.png";

  // Temporäres Image-Objekt zum Testen des Hauptpfads
  const testImg = new Image();
  testImg.onload = function() {
      img.src = mainSrc;
  };
  testImg.onerror = function() {
      img.src = fallbackSrc;
  };
  testImg.src = mainSrc;
}

        



