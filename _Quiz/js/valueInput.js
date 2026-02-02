document.addEventListener('DOMContentLoaded', function() {
        // Korrekte Werte aus data-correct auslesen
        const container = document.querySelector('.unitValuequestion') || document.querySelector('.Valuequestion_standAlone');
        const correctValues = JSON.parse(container.getAttribute('data-correct'));
       

        /*Funktion, damit der Check-Button aktiviert wird und Studierenden ab dem Zeitpunkt egal wie viel sie vom Quiz ausgefüllt haben, die Lösung ansehen können, da die Funktion "check()" hier aufgerufen wird*/
        function handle_click() {
             const msgBox =
                    document.getElementById("unitValue_msg") ||
                    document.getElementById("Value_msg_standAlone");
        
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
        let allCorrect = true;
        // Überprüfung
        function check() {
              
            // Überprüfungsschleife für jede Eingabe
            for (let key in correctValues) {
                const input = document.getElementById(key);
                const feedback = document.getElementById(`sym_${key}`);
                const userValue = parseInt(input.value);

                if (userValue === correctValues[key]) {
                feedback.src = "../../bilder/tick.png";  // ✅
                } else {
                feedback.src = "../../bilder/cross.png"; // ❌
                allCorrect = false;
                }
            }  
            const msgBox = document.getElementById("unitValue_msg") || document.getElementById("Value_msg_standAlone");
            const nextButton = document.getElementById("nextButton");
            if (allCorrect) {
                msgBox.innerHTML = "Super! Das ist richtig!";
                nextButton.classList.add("active");
                nextButton.style.cursor = "pointer";
                nextButton.disabled = false;
                nextButton.onclick = showNextSection;
            } else {
                msgBox.innerHTML = "Nicht ganz, versuche es nochmal!";
                nextButton.classList.remove("active");
                nextButton.style.cursor = "default";
                nextButton.disabled = true;
            }
        }
        let inputs = Array.from(container.querySelectorAll(".unitValuequestion input.value"));
        if (inputs.length === 0) {
            inputs = Array.from(container.querySelectorAll(".Valuequestion_standAlone input.value"));
        }
        inputs.forEach(input => {
        input.addEventListener('input', handle_click);
        });


});

