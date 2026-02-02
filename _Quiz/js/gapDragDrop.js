        
        

        /*Funktion, damit der Check-Button aktiviert wird und Studierenden ab dem Zeitpunkt egal wie viel sie vom Quiz ausgefüllt haben, die Lösung ansehen können, da die Funktion "check()" hier aufgerufen wird*/
        function handle_click(cb) {
            const msgBox = document.getElementById("unitDragDropGap_msg") 
            || document.getElementById("unitDragDropGap_long_msg") || document.getElementById("DragDropGap_msg_standAlone");

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
        /*Funktion, die aufgerufen wird, wenn ein draggable-Element geklickt und bewegt wird - speichert die ID des zu bewegenden Elements.*/
        function drag(ev) {
            handle_click();
            ev.dataTransfer.setData("text", ev.target.id);
        };
        /*Funktion, die es erlaubt, dass auf den Elementen, ein draggable-Element hingezogen werden werden kann - sorgt dafür, dass das Ablegen überhaupt funktioniert - Dropzone*/
        function allowDrop(ev) {
            ev.preventDefault(); 
        };
        /*Funktion, wenn draggable-Element über einer Dropzone losgelassen wird und an dieser Stelle bleibt, Funktion verarbeitet das Ablegen eines Elementssorgt und dass das draggable-Element korrekt in die Dropzone eingefügt wird.*/
        function drop(ev) {
            ev.preventDefault();
            let divID = ev.dataTransfer.getData("text"); // ID des Drag-Elements holen
            console.log(divID);
            let draggedElement = document.getElementById(divID); // Element holen
            let dropzone = ev.target; // Ziel-Dropzone holen
            
            if (dropzone.classList.contains("gap_dropzone") && dropzone.children.length === 0) { //stellt sicher, dass nur ein Element in einer Dropzone abgelegt werden kann
                dropzone.appendChild(draggedElement);
                draggedElement.style.position = "static"; //sichergestellen, dass das Element innerhalb der Dropzone bleibt
                draggedElement.style.display ="flex";
                draggedElement.style.alignItems ="center";
                draggedElement.style.justifyContent ="center";
                
            };
        
        };

       
        /*Funktion, um die Eingaben der Studierenden zu überprüfen - Drag&Drop-Frage: überprüft, ob jede Dropzone das richtige Element enthält*/
        function check() {
            const quizContainer = document.querySelector('.quiz') || document.querySelector('.dragGap_standAlone');
            const correctAnswers = quizContainer ? JSON.parse(quizContainer.dataset.correct) : {};
            
            let allcorrect = true; //Variable, um zu speichern, ob alle Elemente auf die richtigen Felder gezogen wurden
            
            for (let dropzoneId in correctAnswers) {
                let dropzone = document.getElementById(dropzoneId);
                let correctAnswersId = correctAnswers[dropzoneId];
                let symIcon = document.getElementById("sym_" + dropzoneId);


                if (dropzone.children.length === 1) {
                    let droppedId = dropzone.children[0].id;

                        // Prüfen, ob gedroppte ID in den erlaubten Antworten ist
                        if (correctAnswersId.includes(droppedId)) {
                            const mainSrc = "../../bilder/tick.png";
                            const fallbackSrc = "../bilder/tick.png";
                            symIcon.onerror = function() {
                                if (!symIcon.src.endsWith(fallbackSrc)) {
                                    symIcon.src = fallbackSrc;
                                }
                            };
                            symIcon.src = mainSrc; // korrekt
                        } else {
                            const mainSrc = "../../bilder/cross.png";
                            const fallbackSrc = "../bilder/cross.png";
                            symIcon.onerror = function() {
                                if (!symIcon.src.endsWith(fallbackSrc)) {
                                    symIcon.src = fallbackSrc;
                                }
                            };
                            symIcon.src = mainSrc; // falsches Element
                            allcorrect = false;
                        }
                        } else {
                            // Keine oder mehrere Elemente in der Dropzone → nicht korrekt
                            const mainSrc = "../../bilder/cross.png";
                            const fallbackSrc = "../bilder/cross.png";
                            symIcon.onerror = function() {
                                if (!symIcon.src.endsWith(fallbackSrc)) {
                                    symIcon.src = fallbackSrc;
                                }
                            };
                            symIcon.src = mainSrc;
                            allcorrect = false;
                        }

            }

            if (allcorrect) {
                const msgBox = document.getElementById("unitDragDropGap_msg") || document.getElementById("unitDragDropGap_long_msg") || document.getElementById("DragDropGap_msg_standAlone");
                if (msgBox) msgBox.innerHTML = "Super! Das ist richtig!";            }
            else {
                const msgBox = document.getElementById("unitDragDropGap_msg") || document.getElementById("unitDragDropGap_long_msg") || document.getElementById("DragDropGap_msg_standAlone");
                if (msgBox) msgBox.innerHTML = "Nicht ganz, versuche es nochmal!";
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

        document.addEventListener("DOMContentLoaded", function() {
            const draggables = document.querySelectorAll('.drag_gapSingleDraggable');
            const dropzones = document.querySelectorAll('.gap_dropzone');
            let longestWord = "";
        
            // 1. Längstes Wort finden (nach Zeichen)
            draggables.forEach(div => {
                const words = div.textContent.trim().split(/\s+/); // alle Wörter
                words.forEach(word => {
                    if (word.length > longestWord.length) {
                        longestWord = word;
                    }
                });
            });
        
            // 2. Breite des längsten Wortes messen
            const ruler = document.createElement('span');
            ruler.style.visibility = 'hidden';
            ruler.style.position = 'absolute';
            ruler.style.whiteSpace = 'nowrap';
            ruler.style.font = getComputedStyle(draggables[0]).font;
            ruler.textContent = longestWord;
            document.body.appendChild(ruler);
            const wordWidth = ruler.offsetWidth;
            document.body.removeChild(ruler);
        
            // 3. Allen Divs die Breite geben (+ etwas Puffer)
            draggables.forEach(div => {
                div.style.width = (wordWidth + 5) + 'px';
            });
        
            dropzones.forEach(div => {
                div.style.width = (wordWidth + 5) + 'px';
            });
        });
