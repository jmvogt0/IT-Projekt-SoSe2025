function distributeListItems() {
    const ul = document.getElementById('sortable_standAlone') || document.getElementById('sortable');
    const liItems = ul.querySelectorAll('li');
    const ul_standAloneHeight = 350; // feste Höhe in Pixel für ul-Liste in Einzelfragen
    const ul_Height = 260; // feste Höhe in Pixel für ul-Liste in Frage innerhalb einer Einheit
    const itemCount= liItems.length;

    if (itemCount === 0) return;

    // Berechne die Höhe für jedes li-Element
    const itemHeight = ul_Height / itemCount || ul_standAloneHeight / itemCount;

    // Setze die Höhe und andere Styles für jedes li-Element
    liItems.forEach(li => {
        li.style.height = itemHeight + 'px';
        li.style.lineHeight = itemHeight + 'px'; // vertikale Zentrierung des Textes
    });

}

function setImgWithFallback(imgElem, mainSrc, fallbackSrc) {
    imgElem.onerror = function() {
        if (!imgElem.src.endsWith(fallbackSrc)) {
            imgElem.src = fallbackSrc;
        }
    };
    imgElem.src = mainSrc;
}

window.addEventListener('DOMContentLoaded', () => {
        distributeListItems();
   
        const list = document.getElementById("sortable") || document.getElementById("sortable_standAlone");
       
        let dragItem = null;

        function handleDragStart(e) {
            dragItem=this;
            e.dataTransfer.effectAllowed="move";
            this.classList.add("dragging");   
        }

        function handleDragOver(e) {
            e.preventDefault();
            const bounding = this.getBoundingClientRect();
            const offset = e.clientY - bounding.top;
            
            if (offset > bounding.height / 2) {
                this.classList.remove("over");
                this.after(dragItem);
            } else {
                this.classList.remove("over");
                this.before(dragItem);
            }
           
        }

        function handleDragEnter() {
            this.classList.add("over");
        }

        function handleDragLeave() {
            this.classList.remove("over");

        }

        function handleDrop(e) {
            e.stopPropagation();

            if (dragItem !== this) {
                const draggedIndex = Array.from(list.children).indexOf(dragItem);
                const targetIndex = Array.from(list.children).indexOf(this);
                if (draggedIndex < targetIndex) {
                this.after(dragItem);
                } else {
                this.before(dragItem);
                }
            }
            return false;
        
        }

        function handleDragEnd() {
        this.classList.remove("dragging");
        const items = list.querySelectorAll("li");
        items.forEach(item => item.classList.remove("over"));
        handle_click();

        }


        function addDnDHandlers(elem) {
        elem.addEventListener("dragstart", handleDragStart);
        elem.addEventListener("dragover", handleDragOver);
        elem.addEventListener("drop", handleDrop);
        elem.addEventListener("dragenter", handleDragEnter);
        elem.addEventListener("dragleave", handleDragLeave);
        elem.addEventListener("dragend", handleDragEnd);
        }

        function refreshDnD() {
        const items = list.querySelectorAll("li");
        items.forEach(addDnDHandlers);
        }

        refreshDnD();


        // Richtige Reihenfolge
        function check() {

            const list = document.getElementById("sortable") || document.getElementById("sortable_standAlone");
            const correctOrderStr = list.getAttribute("data-correct-order");
            const correctOrder = correctOrderStr.split(",");
            const items = list.querySelectorAll("li");
            let allCorrect = true;

            items.forEach((item, index) => {
                const id = item.getAttribute("data-id");
                const sym = document.getElementById("sym_" + id);
                if (id === correctOrder[index]) {
                    if (sym) setImgWithFallback(sym, "../../bilder/tick.png", "../bilder/tick.png");
                } else {
                    if (sym) setImgWithFallback(sym, "../../bilder/cross.png", "../bilder/cross.png");
                    allCorrect = false;
                }
            });

            const msg = document.getElementById("unitSortable_msg") || document.getElementById("sortable_msg_standAlone") ;
            if (allCorrect) {
                msg.innerHTML = "Richtig! Die Reihenfolge stimmt.";
            } else {
                msg.innerHTML = "Leider falsch. Versuch es nochmal.";
            }
        
        };

        /*Funktion, damit der Check-Button aktiviert wird und Studierenden ab dem Zeitpunkt egal wie viel sie vom Quiz ausgefüllt haben, die Lösung ansehen können, da die Funktion "check()" hier aufgerufen wird*/
        function handle_click(cb) {
            const msgBox =
            document.getElementById("unitSortable_msg") ||
            document.getElementById("sortable_msg_standAlone");

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

    });
    