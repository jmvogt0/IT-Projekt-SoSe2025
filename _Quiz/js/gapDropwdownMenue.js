
            function areAllDropdownsFilled() {
                // Suche alle aktiven Lückentexte (gapText oder gapText_standAlone)
                let gaptext = document.querySelectorAll(".gapText, .gapText_standAlone, .gapText_long");
               
                for (const quiz of gaptext) {
                    const selects = quiz.querySelectorAll('.list-choice-objects');
                    for (const sel of selects) {
                        if (!sel.value) return false; // Noch nicht ausgewählt
                    }
                }
                return true;
            }

            function handleDropdownChange() {
                if (areAllDropdownsFilled()) {
                    handle_click();
                }
            }

            
            // Check-Button aktivieren, wenn etwas ausgewählt wird
            function handle_click(cb) {
                const msgBox =
                document.getElementById("unitGaptext_msg") || document.getElementById("unitGaptext_long_msg")||
                document.getElementById("Gaptext_msg_standAlone");

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
                   
            
            function check() {
                let score = 0;
                let correct = true;

                let gaptext = document.querySelectorAll(".gapText, .gapText_standAlone, .gapText_long");
                
                
                gaptext.forEach(function(quiz) {
                    const selects = quiz.querySelectorAll('.list-choice-objects');

                    selects.forEach((sel, idx) => {
                        const gapNum = idx + 1;
                        const correctValue = quiz.dataset[`correctQ${gapNum}`]; // z.B. data-correct-q1
                        const feedbackIcon = quiz.querySelector(`#sym_q${gapNum}`);

                        if (!sel.value) {
                            const mainSrc = "../../bilder/cross.png";
                            const fallbackSrc = "../bilder/cross.png";
                            feedbackIcon.onerror = function() {
                                if (!feedbackIcon.src.endsWith(fallbackSrc)) {
                                    feedbackIcon.src = fallbackSrc;
                                }
                            };
                            feedbackIcon.src = mainSrc;
                            correct = false;
                        } else if (sel.value === correctValue) {
                            const mainSrc = "../../bilder/tick.png";
                            const fallbackSrc = "../bilder/tick.png";
                            feedbackIcon.onerror = function() {
                                if (!feedbackIcon.src.endsWith(fallbackSrc)) {
                                    feedbackIcon.src = fallbackSrc;
                                }
                            };
                            feedbackIcon.src = mainSrc;
                            score++;
                        } else {
                            const mainSrc = "../../bilder/cross.png";
                            const fallbackSrc = "../bilder/cross.png";
                            feedbackIcon.onerror = function() {
                                if (!feedbackIcon.src.endsWith(fallbackSrc)) {
                                    feedbackIcon.src = fallbackSrc;
                                }
                            };
                            feedbackIcon.src = mainSrc;
                            correct = false;
                        }
                        
                    });
                

                    const msgBox =
                    document.getElementById("unitGaptext_msg") || document.getElementById("unitGaptext_long_msg")||
                    document.getElementById("Gaptext_msg_standAlone");

                    if (msgBox) {
                        msgBox.innerHTML = (score === selects.length)
                        ? "Super! Das ist richtig!"
                        : "Nicht ganz, versuche es nochmal!";
                    }
                    const checkButton = document.getElementById("check_button");
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
                });
            }

            function closePopUp() {
                const popup = document.getElementById("popUp");
                if (popup) {
                    popup.style.display = "none";
                }
            }
