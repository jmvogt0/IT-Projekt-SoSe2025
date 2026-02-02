const situations = {
  situation1: { x1: 1.0, x2: 0.8, x3: 0.1 }, // Abend & ruhig
  situation2: { x1: 1.0, x2: 0.1, x3: 0.9 },  // Tanzparty am Tag
  situation3: { x1: 0.0, x2: 0.6, x3: 0.9 }  // Dunkel & laut
};

let currentSituation = "situation1";
const threshold = 2.3;

//INPUT VALUES
const x1El = document.getElementById("x1");
const x2El = document.getElementById("x2");
const x3El = document.getElementById("x3");

//INPUT VALUES IN OUTPUT
const x1Out = document.getElementById("x1Out");
const x2Out = document.getElementById("x2Out");
const x3Out = document.getElementById("x3Out");

//INPUT VALUES IN ACTIVATION FUNCTION
const x1Func = document.getElementById("x1Func");
const x2Func = document.getElementById("x2Func");
const x3Func = document.getElementById("x3Func");

//Input ProgressBar
const x1Progress = document.getElementById("x1Progress");
const x2Progress = document.getElementById("x2Progress");
const x3Progress = document.getElementById("x3Progress"); 

//INPUT WEIGHTS SLIDER
const w1 = document.getElementById("w1");
const w2 = document.getElementById("w2");
const w3 = document.getElementById("w3");

//INPUT WEIGHTS VALUE
const w1Val = document.getElementById("w1Val");
const w2Val = document.getElementById("w2Val");
const w3Val = document.getElementById("w3Val");

//INPUT WEIGHTS IN ACTIVATION FUNCTION
const w1Func = document.getElementById("w1Func");
const w2Func = document.getElementById("w2Func");
const w3Func = document.getElementById("w3Func");

//WEIGHTS IN OUTPUT
const w1ValOut = document.getElementById("w1ValOut");
const w2ValOut = document.getElementById("w2ValOut");
const w3ValOut = document.getElementById("w3ValOut");

//RESULT
const sumEl = document.getElementById("sum");
const sumEl2 = document.getElementById("sum2");
const resultProgress = document.getElementById("resultProgress");
const resultIcon = document.getElementById("resultIcon");

function updateInputs() {
  const input = situations[currentSituation];

  //UPDATE INPUT VALUES
  x1El.textContent = input.x1.toFixed(1);
  x2El.textContent = input.x2.toFixed(1);;
  x3El.textContent = input.x3.toFixed(1);;

  //UPDATE INPUT VALUES IN ACTIVATION FUNCTION
  x1Func.textContent = input.x1.toFixed(1);;
  x2Func.textContent = input.x2.toFixed(1);;
  x3Func.textContent = input.x3.toFixed(1);;

  //UPDATE INPUT VALUES IN OUTPUT
  x1Out.textContent = input.x1.toFixed(1);;
  x2Out.textContent = input.x2.toFixed(1);;
  x3Out.textContent = input.x3.toFixed(1);;

  //UPDATE INPUT VALUES IN PROGRESS BAR
  x1Progress.style.width = `${input.x1 * 100}%`;
  x2Progress.style.width = `${input.x2 * 100}%`;
  x3Progress.style.width = `${input.x3 * 100}%`;

  calculate();
}

function calculate() {
  const input = situations[currentSituation];
  
  //CALCULATE THE PRODUCTS FOR EACH FACTOR
  const prod1 = input.x1 * parseFloat(w1.value);
  const prod2 = input.x2 * parseFloat(w2.value);
  const prod3 = input.x3 * parseFloat(w3.value);

  //DISPLAY PRODUCT IN ACTIVATION FUNCTION
  document.getElementById("prod1").textContent = prod1.toFixed(2);
  document.getElementById("prod2").textContent = `+ ${prod2.toFixed(2)}`;
  document.getElementById("prod3").textContent = `+ ${prod3.toFixed(2)}`;

  //CALCULATE SUM
  const sum = prod1 + prod2 + prod3;
  sumEl.textContent = `= ${sum.toFixed(2)}`;
  sumEl2.textContent = `g = ${sum.toFixed(2)}`;

  //UPDATE PROGRESS BAR
  resultProgress.style.height = `${(sum / 10) * 100}%`;

  //Update result Icon
  const path = resultIcon.querySelector("path");
  if (sum > threshold) {
    path.setAttribute("fill", "#E4EB19");
    resultIcon.classList.add('pulse');
  } else {
    path.setAttribute("fill", "var(--rahmen)");
    resultIcon.classList.remove('pulse');
  }

  // Dynamisches Feedback zur Border-Farbe
  const outputElement = document.querySelector(".outputElement");
  const resultIsOn = sum > threshold;
  let borderColor;

  if (currentSituation === "situation1") {
    borderColor = resultIsOn ? "var(--success)" : "var(--warning)";
  } else {
    borderColor = resultIsOn ? "var(--warning)" : "var(--success)";
  }
  outputElement.style.borderColor = borderColor;
}

// Gewicht-1–Element, das wir pulsen wollen
const weight1El = document.querySelector('.weight1 .weightElement');
const weight2El = document.querySelector('.weight2 .weightElement');
const weight3El = document.querySelector('.weight3 .weightElement');

//ADD EVENT LISTENER TO SLIDER
document.querySelectorAll(".weight").forEach((slider) => {
  slider.addEventListener("input", () => {
    w1Val.textContent = w1.value;
    w2Val.textContent = w2.value;
    w3Val.textContent = w3.value;

    w1Func.textContent = w1.value;
    w2Func.textContent = w2.value;
    w3Func.textContent = w3.value;

    w1ValOut.textContent = w1.value;
    w2ValOut.textContent = w2.value;
    w3ValOut.textContent = w3.value;
    calculate();
  });
});


// Pulsieren beim drücken der Slider
w1.addEventListener('pointerdown', () => {
  weight1El.classList.remove('pulse');
  setTimeout(() => weight1El.classList.add('pulse'), 0);
});
w2.addEventListener('pointerdown', () => {
  weight2El.classList.remove('pulse');
  setTimeout(() => weight2El.classList.add('pulse'), 0);
});
w3.addEventListener('pointerdown', () => {
  weight3El.classList.remove('pulse');
  setTimeout(() => weight3El.classList.add('pulse'), 0);
});

//CHANGE SITUATIONS
document.getElementById("situation1Btn").addEventListener("click", () => {
  currentSituation = "situation1";
  toggleActive("situation1Btn");
  updateInputs();
});

document.getElementById("situation2Btn").addEventListener("click", () => {
  currentSituation = "situation2";
  toggleActive("situation2Btn");
  updateInputs();
});

document.getElementById("situation3Btn").addEventListener("click", () => {
  currentSituation = "situation3";
  toggleActive("situation3Btn");
  updateInputs();
});

function toggleActive(activeId) {
  document.getElementById("situation1Btn").classList.remove("active");
  document.getElementById("situation2Btn").classList.remove("active");
  document.getElementById("situation3Btn").classList.remove("active");
  document.getElementById(activeId).classList.add("active");
}
updateInputs();//INITIAL LOAD