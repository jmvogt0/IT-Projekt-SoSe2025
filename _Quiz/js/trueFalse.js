        /*Funktion, damit der Check-Button aktiviert wird und Studierenden ab dem Zeitpunkt egal wie viel sie vom Quiz ausgefüllt haben, die Lösung ansehen können, da die Funktion "check()" hier aufgerufen wird*/
        function handle_click() {
            const msgBox =
            document.getElementById("unitTrueFalse_msg") ||
            document.getElementById("TrueFalse_msg_standAlone");

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

        /*Funktionen, die aufgerufen werden, wenn der DAUMEN HOCH oder DAUEMN RUNTER geklickt wurde - anderes Bild wird dadurch visuell deaktiviert, dass Studierender auch sieht, dass ihre Auswahl auch erkannt wurde*/
        let userSelection = null; // Merkt sich, was der User angeklickt hat

        function trueClicked(cb) {
            userSelection = true;
            handle_click();
            setButtonBackgroundWithFallback(
                "check_false",
                "../../bilder/false_disabled4.png",
                "../bilder/false_disabled4.png"
            );
        }

        function falseClicked(cb) {
            userSelection = false;
            handle_click();
            setButtonBackgroundWithFallback(
                "check_true",
                "../../bilder/true_disabled4.png",
                "../bilder/true_disabled4.png"
            );
        }

        /*Funktion, damit der Check-Button aktiviert wird und Studierenden ab dem Zeitpunkt egal wie viel sie vom Quiz ausgefüllt haben, die Lösung ansehen können, da die Funktion "check()" hier aufgerufen wird*/
        function check() {
            // 1. Container der aktuellen Frage finden
            const quizContainer = document.querySelector('.true_false_container') || document.querySelector('.true_false_container_standAlone');
            // 2. Richtige Antwort auslesen
            const correctAnswer = quizContainer.dataset.correct === "true";
        
            // 3. Vergleich mit der Auswahl des Users
            const msgBox =
                    document.getElementById("unitTrueFalse_msg") ||
                    document.getElementById("TrueFalse_msg_standAlone");
           
                    if(userSelection === correctAnswer) {
                        msgBox.innerHTML = "Super! Das ist richtig!";
                
                    } else {
                        msgBox.innerHTML = "Nicht ganz, versuche es nochmal!";
                    }
                    
                    const symTrue = document.getElementById("sym_true");
                    const symFalse = document.getElementById("sym_false");
                    if (userSelection === correctAnswer) {
                        setImgWithFallback(symTrue, "../../bilder/tick.png", "../bilder/tick.png");
                        setImgWithFallback(symFalse, "../../bilder/tick.png", "../bilder/tick.png");
                    } else {
                        setImgWithFallback(symTrue, "../../bilder/cross.png", "../bilder/cross.png");
                        setImgWithFallback(symFalse, "../../bilder/cross.png", "../bilder/cross.png");
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
        }
        
        function setButtonBackgroundWithFallback(elementId, mainUrl, fallbackUrl) {
            const img = new Image();
            img.onload = function() {
                document.getElementById(elementId).style.backgroundImage = "url('" + mainUrl + "')";
            };
            img.onerror = function() {
                document.getElementById(elementId).style.backgroundImage = "url('" + fallbackUrl + "')";
            };
            img.src = mainUrl;
        }

        function setImgWithFallback(imgElem, mainSrc, fallbackSrc) {
            imgElem.onerror = function() {
                if (!imgElem.src.endsWith(fallbackSrc)) {
                    imgElem.src = fallbackSrc;
                }
            };
            imgElem.src = mainSrc;
        }