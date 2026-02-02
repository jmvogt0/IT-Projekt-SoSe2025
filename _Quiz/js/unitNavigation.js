document.addEventListener("DOMContentLoaded", function() {
    const nav = document.getElementById('quizNavigation');
    if (!nav) return;
    const navLinks = nav.querySelectorAll('a');
    const linkCount = navLinks.length;
  
    // Containerhöhe bestimmen (z.B. 450px oder automatisch)
    const containerHeight = nav.offsetHeight || 450;
    const linkHeight = containerHeight / linkCount - 10;

    navLinks.forEach(link => {
      link.style.height = linkHeight + 'px';
    });

    const secondLink = navLinks[1]; // 0-basiert: das zweite <a>
    const cursor = document.getElementById('cursor');

    secondLink.appendChild(cursor);
    cursor.style.position = "absolute";
    cursor.style.top = "90%";
    cursor.style.left = "40%";
    cursor.style.transform = "translate(-50%, -50%)";
    cursor.style.opacity = 0;
    cursor.style.animation = "none"; 

    const iconQuiz = document.getElementById('Icon_quiz');
    if (iconQuiz) {
        iconQuiz.addEventListener('mouseenter', function() {
            cursor.style.opacity = 1;
            cursor.style.animation ="cursor-pulse 2s infinite alternate";
        });
        iconQuiz.addEventListener('mouseleave', function() {
            // Animation zurücksetzen, damit sie erneut ausgelöst werden kann
            cursor.style.opacity = 0;
            cursor.style.animation = "none"; 
            void cursor.offsetWidth; // Force reflow, damit die Animation beim nächsten Hover wieder startet
          });
    }

    if (document.querySelector('.hideExitIcon')) {
        const exitIcon = document.getElementById("exitIcon");
        setImgWithFallback(exitIcon, "../../bilder/exit4_disable.png", "../bilder/exit4_disable.png");
        var exitLink = document.getElementById("exit_icon");
        if (exitLink) {
            exitLink.addEventListener("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            exitLink.style.pointerEvents = "none";
            exitLink.style.cursor = "default";
            exitLink.setAttribute("aria-disabled", "true");
        }
    }

  });

  function setImgWithFallback(imgElem, mainSrc, fallbackSrc) {
    imgElem.onerror = function() {
        if (!imgElem.src.endsWith(fallbackSrc)) {
            imgElem.src = fallbackSrc;
        }
    };
    imgElem.src = mainSrc;
}
  