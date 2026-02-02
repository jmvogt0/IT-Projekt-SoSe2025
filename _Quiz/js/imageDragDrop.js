document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector('.imageDropzone_Draggables_standAlone') || document.querySelector('#unit_ImageDropzone_Draggables');
    let draggables = Array.from(container.querySelectorAll(".imageDropzone_SingleDraggable"));
    if (draggables.length === 0) {
        draggables = Array.from(container.querySelectorAll(".unit_ImageDropzone_SingleDraggable"));
    }
    const dropzone = document.querySelector('.singleImageDropzone_standAlone') || document.querySelector('.unit_ImageDropzone');
    const dropzoneStyles = window.getComputedStyle(dropzone);

    // Zielgröße der Draggables: gleiche Breite/Höhe wie Dropzonen
    const targetWidth = parseInt(dropzoneStyles.width);
    const targetHeight = parseInt(dropzoneStyles.height);

    const containerMaxHeight = 110; // z.B. maximale Höhe für den Draggable-Container

    const gap = 10; // px, Abstand zwischen den Draggables

    // Die Breite darf nicht größer als die Dropzone sein
    let draggableWidth = targetWidth;

    // Die Höhe ist wie Dropzone, aber nicht größer als die Container-Max-Höhe
    let draggableHeight = Math.min(targetHeight, containerMaxHeight);

    // Setze Styles für alle Draggables
    draggables.forEach(draggable => {
        draggable.style.width = draggableWidth + "px";
        draggable.style.height = draggableHeight + "px";
        draggable.style.alignItems = "center";
        draggable.style.justifyContent = "center";
        draggable.style.textAlign = "center";
        draggable.style.fontSize = "13px";
        draggable.style.boxSizing = "border-box";
        draggable.style.marginRight = gap + "px";
    });
    // Letztes Element soll keinen rechten Margin haben
    if (draggables.length > 0) {
        draggables[draggables.length - 1].style.marginRight = "0";
    }

    /*Funktion, damit der Check-Button aktiviert wird und Studierenden ab dem Zeitpunkt egal wie viel sie vom Quiz ausgefüllt haben, die Lösung ansehen können, da die Funktion "check()" hier aufgerufen wird*/
    function handle_click(cb) {
        const msgBox =
        document.getElementById("unitImageDrop_msg") ||
        document.getElementById("ImageDrop_msg_standAlone");

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

    let dropzonesOnImage = document.querySelectorAll(".unit_ImageDropzone");
    if (dropzonesOnImage.length === 0) {
        dropzonesOnImage = document.querySelectorAll(".singleImageDropzone_standAlone");
    }
        
    // Hole das Mapping aus dem data-correct Attribut
    const quizContainer = document.querySelector('.quiz') || document.querySelector('.imageMatching');
    const correctMapping = JSON.parse(quizContainer.getAttribute('data-correct'));

    // Drag & Drop Events
    let dragged = null;

    // Drag starten
    let draggablesForImage = document.querySelectorAll(".unit_ImageDropzone_SingleDraggable");
    if (draggablesForImage.length === 0) {
        draggablesForImage = document.querySelectorAll(".imageDropzone_SingleDraggable");
    }
    draggablesForImage.forEach(el => {
        el.addEventListener('dragstart', function (event) {
            dragged = event.target;
            setTimeout(() => {
                event.target.style.opacity = '0.5';
            }, 0);
        });
        el.addEventListener('dragend', function (event) {
            event.target.style.opacity = '';
            handle_click();
        });
    });

    // Dropzonen erlauben Drop
    dropzonesOnImage.forEach(zone => {
        zone.addEventListener('dragover', function (event) {
            event.preventDefault();
        });
        zone.addEventListener('drop', function (event) {
            event.preventDefault();
            if (!dragged) return;

            // Nur ein Drag-Element pro Dropzone zulassen (optional)
            let draggablesContainer = document.getElementById('unit_ImageDropzone_Draggables')||document.querySelector('.imageDropzone_Draggables_standAlone');
            let draggablesSingle = this.querySelector('.unit_ImageDropzone_SingleDraggable')||this.querySelector('.imageDropzone_SingleDraggable');
            if (draggablesSingle) {
                draggablesSingle.style.position = '';
                draggablesSingle.style.left = '';
                draggablesSingle.style.top = '';
                draggablesContainer.appendChild(draggablesSingle);
            }

            // Drag-Element in die Dropzone einfügen und passend positionieren
            zone.appendChild(dragged);
            dragged.style.position = 'absolute';
            dragged.style.top = '0';
            const quelle = document.querySelector('.unit_ImageDropzone_SingleDraggable')|| document.querySelector('.imageDropzone_SingleDraggable'); 
            const bgColor = window.getComputedStyle(quelle).backgroundColor;
            zone.style.background = bgColor;
        });
    });

    // Überprüfung (z.B. beim Klick auf Check-Button)
    function check() {
        let allCorrect = true;
        let dropzonesOnImage = document.querySelectorAll(".unit_ImageDropzone");
        if (dropzonesOnImage.length === 0) {
            dropzonesOnImage = document.querySelectorAll(".singleImageDropzone_standAlone");
        }

        dropzonesOnImage.forEach(zone => {
            const dropzoneId = zone.id;
            const correctDraggableId = correctMapping[dropzoneId];
            const placedDraggable = zone.querySelector('.unit_ImageDropzone_SingleDraggable') || zone.querySelector('.imageDropzone_SingleDraggable');
            const feedbackImg = document.getElementById(`sym_${zone.id}`);


            if (placedDraggable && placedDraggable.id === correctDraggableId) {
                // Korrekt
                const mainSrc = '../../bilder/tick.png';
                const fallbackSrc = '../bilder/tick.png';
                feedbackImg.onerror = function() {
                    if (!feedbackImg.src.endsWith(fallbackSrc)) {
                        feedbackImg.src = fallbackSrc;
                    }
                };
                feedbackImg.src = mainSrc;
            } else {
                // Falsch oder leer
                const mainSrc = '../../bilder/cross.png';
                const fallbackSrc = '../bilder/cross.png';
                feedbackImg.onerror = function() {
                    if (!feedbackImg.src.endsWith(fallbackSrc)) {
                        feedbackImg.src = fallbackSrc;
                    }
                };
                feedbackImg.src = mainSrc;
                allCorrect = false;
            }
            
        });

        // Gesamtergebnis anzeigen
        const msg =
        document.getElementById("unitImageDrop_msg") ||
        document.getElementById("ImageDrop_msg_standAlone");

        if (allCorrect) {
            msg.textContent = 'Super! Das ist richtig!';
        } else {

            msg.textContent = 'Nicht ganz, versuche es nochmal!';
        }
    };

    

});
