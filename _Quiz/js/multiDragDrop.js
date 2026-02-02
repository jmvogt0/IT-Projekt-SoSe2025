


        // Drag & Drop Funktionen
        function allowDrop(ev) {
        ev.preventDefault();
        }

        function drag(ev) {
        handle_click();
        ev.dataTransfer.setData("text", ev.target.id);
        }

        function drop(ev) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text");
        const draggedElement = document.getElementById(data);
        
        // nur hinzufügen, wenn Element noch nicht enthalten ist
        if (!Array.from(ev.target.children).includes(draggedElement)) {
            ev.target.appendChild(draggedElement);
        }
        }

        // Überprüfung der Zuordnungen
        function check() {
            let zones = document.querySelectorAll(".unit_multiDropzone");
            if (zones.length === 0) {
                zones = document.querySelectorAll(".multipleDropzone_standAlone");
            }
            const dropboxMatching = document.querySelector('.quiz') || document.querySelector('.multiMatching');
            const mappings = JSON.parse(dropboxMatching.dataset.mappings);

            zones.forEach(zone => {
                const category = zone.dataset.category;
                const expected = mappings[category];
                let children = zone.querySelectorAll(".unit_multiDropzone_SingleDraggable");
                if (children.length === 0) {
                    children = zone.querySelectorAll(".multiSingleDraggable_standAlone");
                }                
                const given = Array.from(children).map(child => child.id);

                const allCorrect =
                expected.every(item => given.includes(item)) &&
                given.every(item => expected.includes(item));

                const feedbackImg = document.getElementById(`sym_${category}`);
                console.log(feedbackImg);
                if (feedbackImg) {
                    const mainSrc = allCorrect ? "../../bilder/tick.png" : "../../bilder/cross.png";
                    const fallbackSrc = allCorrect ? "../bilder/tick.png" : "../bilder/cross.png";
                
                    feedbackImg.onerror = function() {
                        if (!feedbackImg.src.endsWith(fallbackSrc)) {
                            feedbackImg.src = fallbackSrc;
                        }
                    };
                    feedbackImg.src = mainSrc;
                    
                    const msgBox = document.getElementById("unitMultiDrop_msg") || document.getElementById("MultiDrop_msg_standAlone");
                    if (msgBox) {
                        msgBox.innerHTML = allCorrect
                            ? "Super! Das ist richtig!"
                            : "Nicht ganz, versuche es nochmal!";
                    }
                    
                }
            });
        }

        /*Funktion, damit der Check-Button aktiviert wird und Studierenden ab dem Zeitpunkt egal wie viel sie vom Quiz ausgefüllt haben, die Lösung ansehen können, da die Funktion "check()" hier aufgerufen wird*/
        function handle_click(cb) {
            const msgBox =
            document.getElementById("unitMultiDrop_msg") ||
            document.getElementById("MultiDrop_msg_standAlone");

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

window.addEventListener("DOMContentLoaded", function() {
        const container = document.querySelector('.multipleDropzone_container_standAlone') || document.querySelector('.multipleDropzone_unit');
        let dropzones = Array.from(container.querySelectorAll(".multipleDropzone_standAlone"));
            if (dropzones.length === 0) {
                dropzones = Array.from(container.querySelectorAll(".unit_multiDropzone"));
            }
        const containerWidth = container.clientWidth;
        const spacing = 8; // entspricht margin: 0 4px (links und rechts je 4px)
        const numDropzones = dropzones.length;

        // Gesamten horizontalen Abstand berechnen
        const totalSpacing = spacing * 2 * numDropzones;
        // Verfügbare Breite für die Dropzonen berechnen
        const availableWidth = containerWidth - totalSpacing;
        // Breite pro Dropzone
        const dropzoneWidth = availableWidth / numDropzones;

        dropzones.forEach(function(zone) {
            zone.style.width = dropzoneWidth + "px";
        });

        let draggables = Array.from(this.document.querySelectorAll(".unit_multiDropzone_SingleDraggable"));
            if (draggables.length === 0) {
                draggables = Array.from(this.document.querySelectorAll(".multiSingleDraggable_standAlone"));
            }
        const gap = 10;
        const numDraggables = draggables.length;


        // 1. Breite des längsten Wortes bestimmen
        let longestWord = "";
        draggables.forEach(div => {
            const words = div.textContent.replace(/\n/g, ' ').split(/\s+/);

            words.forEach(word => {
                if (word.length > longestWord.length) longestWord = word;
            });
        });

        const tempSpan = document.createElement("span");
        tempSpan.style.visibility = "hidden";
        tempSpan.style.position = "absolute";
        tempSpan.style.fontFamily = "Open Sans";
        tempSpan.style.fontSize = "14px";
        document.body.appendChild(tempSpan);
        tempSpan.textContent = longestWord;

        const maxTextWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);


        // 2. Mindestbreite festlegen (z.B. 160px oder Breite des längsten Wortes + Puffer)
        const minWidth = Math.max(160, maxTextWidth + 15); // 10px Puffer für Padding/Borders


        // 3. Maximale mögliche Breite berechnen, sodass alle Draggables + Gaps in den Container passen
        const totalGap = gap * (numDraggables - 1);
        let maxPossibleWidth = Math.floor((containerWidth - totalGap) / numDraggables);
        let draggableWidth = Math.max(Math.min(minWidth, maxPossibleWidth), 60);

        // 4. Sicherstellen, dass die Breite nicht kleiner als minWidth ist
        draggableWidth = Math.max(draggableWidth, minWidth);

        // 5. Setze die Breite für alle Draggables
        draggables.forEach(div => {
            div.style.width = draggableWidth + "px";
        });

        // 6. Optional: Grid-Template-Columns dynamisch setzen, damit Grid korrekt verteilt
        let draggablesGrid = this.document.getElementById("multiDropzone_Draggables_standAlone") || this.document.getElementById("unit_multiDropzone_Draggables");
        draggablesGrid.style.gridTemplateColumns = `repeat(auto-fill, ${draggableWidth}px)`;

});


