
        document.addEventListener("DOMContentLoaded", function() {
            const ul = document.getElementById("unitSingleDropzone") || document.getElementById("SingleDropzone_standAlone");
            const lis = ul.querySelectorAll("li");
            const ulWidth = ul.offsetWidth;
            const count = lis.length;
            const basis = (100 / count) + "%";
            const gap = 10;


            // Berechne verfügbare Breite pro Dropzone
            const totalGap = gap * (count - 1);
            const maxLiWidth = Math.floor((ulWidth - totalGap) / count);
    
            lis.forEach(li => {
                li.style.flexBasis = basis;
                li.style.width = maxLiWidth + "px";
                li.style.maxWidth = maxLiWidth + "px";
            });

            const container = document.getElementById("unitSingleDropzone_Draggables") || document.getElementById("SingleDropzone_Draggables_standAlone");
            let draggables = Array.from(container.querySelectorAll(".SingleDraggable"));
            if (draggables.length === 0) {
                draggables = Array.from(container.querySelectorAll(".SingleDraggable_standAlone"));
            }
            const containerWidth = container.offsetWidth;
            const n = draggables.length;
            let longestWord = "";
            let draggableHeight = 0;

            // 1. Längstes Wort finden (über alle Zeilen)
            draggables.forEach(div => {
                const words = div.textContent.replace(/\n/g, ' ').split(/\s+/);
                words.forEach(word => {
                    if (word.length > longestWord.length) longestWord = word;
                });
            });

            // 2. Größe des längsten Wortes messen
            const ruler = document.createElement('span');
            ruler.style.visibility = 'hidden';
            ruler.style.position = 'absolute';
            ruler.style.whiteSpace = 'nowrap';
            ruler.style.font = getComputedStyle(draggables[0]).font;
            ruler.textContent = longestWord;
            document.body.appendChild(ruler);
            const minWidth = ruler.offsetWidth + 20; // Puffer für Padding
            document.body.removeChild(ruler);

            // 3. Gap berücksichtigen
            const totalGapWidth = gap * (n - 1);
            const availableWidth = containerWidth - totalGapWidth;

            // 3. Benötigte Gesamtbreite berechnen
            let finalWidth;

            if (minWidth * n < availableWidth) {
                // Wenn die Summe kleiner ist als der Container, verteile gleichmäßig
                finalWidth = Math.floor(availableWidth / n);
            } else {
                // Sonst: Mindestbreite verwenden
                finalWidth = minWidth;
            }
            // 4. Allen Divs die berechnete Breite geben
            draggables.forEach(div => {
                div.style.width = finalWidth + "px";
                draggableHeight= div.offsetHeight;

            });
            const dropzones = document.querySelectorAll(".Singledropzone");
            dropzones.forEach(div => {
                div.style.width = finalWidth + "px";
                div.style.height = (draggableHeight+2) + "px";
            });

            // 5. Grid-Layout setzen
            container.style.display = "grid";
            container.style.gridTemplateColumns = `repeat(${draggables.length}, 1fr)`;
            container.style.gap = gap + "px";



        });

        

        /*Funktion, damit der Check-Button aktiviert wird und Studierenden ab dem Zeitpunkt egal wie viel sie vom Quiz ausgefüllt haben, die Lösung ansehen können, da die Funktion "check()" hier aufgerufen wird*/
        function handle_click() {
            const msg = document.getElementById("unitSingleDrop_msg") || document.getElementById("SingleDrop_msg_standAlone");
            msg.innerHTML = "Klicke auf Check für die Lösung!";
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
       
        /*Funktion, die aufgerufen wird, wenn ein draggable-Element geklickt und bewegt wird - speichert die ID des zu bewegenden Elements.*/
        function drag(ev) {
            handle_click();
            ev.dataTransfer.setData("text", ev.target.id);
        };
        
        /*Funktion, die es erlaubt, dass auf den Elementen, ein draggable-Element hingezogen werden werden kann - sorgt dafür, dass das Ablegen überhaupt funktioniert - Dropzone*/
        function allowDrop(ev) {
            ev.preventDefault();
        };
        
        /*Funktion, wenn draggable-Element über einer Dropzone losgelassen wird und an dieser Stelle bleibt, Funktion verarbeitet, das Ablegen eines Elementes und sorgt, dass das draggable-Element korrekt in die Dropzone eingefügt wird.*/
        function drop(ev) {
            ev.preventDefault();
            let divID = ev.dataTransfer.getData("text"); // ID des Drag-Elements holen
            let draggedElement = document.getElementById(divID); // Element holen
            let dropzone = ev.target; // Ziel-Dropzone holen
           
            if (dropzone.classList.contains("Singledropzone") && dropzone.children.length === 0) { //stellt sicher, dass nur ein Element in einer Dropzone abgelegt werden kann
                dropzone.appendChild(draggedElement);
                draggedElement.style.position = "static"; //sichergestellen, dass das Element innerhalb der Dropzone bleibt
                draggedElement.style.padding ="2px";
            };
       
        };


        /*Funktion, um die Eingaben der Studierenden zu überprüfen - Drag&Drop-Frage: überprüft, ob jede Dropzone das richtige Element enthält*/
        function check() {
            const quizContainer = document.querySelector('.quiz') || document.querySelector('.singleMatching');
            const correctAnswers = quizContainer ? JSON.parse(quizContainer.dataset.correct) : {};
            let allcorrect = true; //Variable, um zu speichern, ob alle Elemente auf die richtigen Felder gezogen wurden
           
            for (let dropzoneId in correctAnswers) {
                let dropzone = document.getElementById(dropzoneId);
                let correctAnswersId = correctAnswers[dropzoneId];
                let symIcon = document.getElementById("sym_" + dropzoneId);
                
                
                if (dropzone && dropzone.children.length === 1 && dropzone.children[0].id === correctAnswersId) {
                    if (symIcon) setImgWithFallback(symIcon, "../../bilder/tick.png", "../bilder/tick.png");
                } else {
                    if (symIcon) setImgWithFallback(symIcon, "../../bilder/cross.png", "../bilder/cross.png");
                    allcorrect = false;
                }
            }


            const msgBox = document.getElementById("unitSingleDrop_msg") || document.getElementById("SingleDrop_msg_standAlone");
            if (msgBox) {
                msgBox.innerHTML = allcorrect
                    ? "Super! Das ist richtig!"
                    : "Nicht ganz, versuche es nochmal!";
            }


            document.getElementById("check_button").onclick = null;
            const checkButton = document.getElementById("check_button");
                const mainSrc = "../../bilder/check_disable.png";
                const fallbackSrc = "../bilder/check_disable.png";

                checkButton.onerror = function() {
                    // Nur wechseln, wenn noch nicht versucht wurde, das Fallback zu laden
                    if (!checkButton.src.endsWith(fallbackSrc)) {
                        checkButton.src = fallbackSrc;
                    }
                };
                checkButton.src = mainSrc;
        };

        function setImgWithFallback(imgElem, mainSrc, fallbackSrc) {
            imgElem.onerror = function() {
                if (!imgElem.src.endsWith(fallbackSrc)) {
                    imgElem.src = fallbackSrc;
                }
            };
            imgElem.src = mainSrc;
        }

     