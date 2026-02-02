
        document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
        checkbox.checked = false;
        });

        function areAllQuestionsAnswered() {
            const containers = document.querySelectorAll(".checkboxContainer, .checkboxContainer_standAlone, .horizontal_checkboxContainer_standAlone");
            for (const container of containers) {
                const checked = container.querySelector('input[type="checkbox"]:checked');
                if (!checked) return false;
            }
            return true;
        }

        function handleCheckboxChange() {
            if (areAllQuestionsAnswered()) {
                // Jetzt erst handle_click aufrufen
                // Da handle_click ursprünglich für einen einzelnen Checkbox-Click gedacht war,
                handle_click();
            }
        }


        /*Funktion, damit der Check-Button aktiviert wird und Studierenden ab dem Zeitpunkt egal wie viel sie vom Quiz ausgefüllt haben, die Lösung ansehen können, da die Funktion "check()" hier aufgerufen wird*/
        function handle_click(cb) {
            const msgBox =
            document.getElementById("unitCheckbox_msg") ||
            document.getElementById("Checkbox_msg_standAlone");

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
        /*Funktion, um die Eingaben der Studierenden zu überprüfen -- Single Choice-Frage*/
        function check() {
            // 1. Eltern-Container der Frage finden
            let quizContainer = document.querySelectorAll(".checkboxContainer, .checkboxContainer_standAlone, .horizontal_checkboxContainer_standAlone");
            var allCorrect = true;
            let feedbackText = "";

            quizContainer.forEach(function (quizContainer, index)  {
                // 2. Index der richtigen Antwort auslesen
                let correctIndices = quizContainer.dataset.correct.split(",").map((x) => parseInt(x.trim(), 10));
            
                // 3. Alle Checkboxen und Symbole holen
                var checks = quizContainer.querySelectorAll('input[type="checkbox"]');
                var syms = quizContainer.querySelectorAll('img[id^="sym"]');

            
               
            
                // 5. Prüfen, ob alle und nur die richtigen Checkboxen angehakt sind
                let questionCorrect = true;
                for (let i = 0; i < checks.length; i++) {
                    if (correctIndices.includes(i + 1)) {
                        questionCorrect = questionCorrect && checks[i].checked;
                    } else {
                        questionCorrect = questionCorrect && !checks[i].checked;
                    }
                }

                allCorrect = allCorrect && questionCorrect;

                // 7. Haken/Kreuz anzeigen
                for (let i = 0; i < checks.length; i++) {
                    let mainSrc, fallbackSrc;
                    if (
                        (correctIndices.includes(i + 1) && checks[i].checked) ||
                        (!correctIndices.includes(i + 1) && !checks[i].checked)
                    ) {
                        mainSrc = "../../bilder/tick.png";
                        fallbackSrc = "../bilder/tick.png";
                    } else {
                        mainSrc = "../../bilder/cross.png";
                        fallbackSrc = "../bilder/cross.png";
                    }
                    syms[i].onerror = function() {
                        if (!syms[i].src.endsWith(fallbackSrc)) {
                            syms[i].src = fallbackSrc;
                        }
                    };
                    syms[i].src = mainSrc;
                }

                const feedbackCorrect = quizContainer.dataset.feedbackCorrect || "Richtig!";
                const feedbackWrong = quizContainer.dataset.feedbackWrong || "Falsch!";
                const questionNumber = index + 1;
                feedbackText += `<strong>Frage ${questionNumber}:</strong> ${questionCorrect ? feedbackCorrect : feedbackWrong}<br><br>`;


             // 4. Alle Checkboxen deaktivieren
                checks.forEach(cb => cb.disabled = true);

                // 6. Feedback geben
                const msgBox = document.getElementById("unitCheckbox_msg") || document.getElementById("Checkbox_msg_standAlone");
                if (msgBox) {
                    if (allCorrect) {
                        msgBox.innerHTML = "Super! Das ist richtig!";
                    } else {
                        msgBox.innerHTML = "Nicht ganz, versuche es nochmal!";
                    }
                }
                        
                // Feedback ins Popup schreiben und anzeigen
                const popup = document.getElementById("popUp");
                const popupText = document.getElementById("popupFeedbacktext");
                if (popup && popupText) {
                    popupText.innerHTML = feedbackText;
                    popup.style.display = "block";
                }


            });
        
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
                console.log("Check wurde geladen!");

        }

        function closePopUp() {
            const popup = document.getElementById("popUp");
            if (popup) {
                popup.style.display = "none";
            }
        }
                
