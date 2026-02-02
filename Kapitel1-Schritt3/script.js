const situations = {
  situation1: { x1: 1.0, x2: 0.8, x3: 0.1 }, // Abend & ruhig
  situation2: { x1: 1.0, x2: 0.0, x3: 0.9 },  // Tanzparty am Tag
  situation3: { x1: 0.0, x2: 0.6, x3: 0.9 }  // Dunkel & laut
};

let currentSituation = "situation1";
const threshold = 2.3;

const w1 = 1.0; // Weight for x1
const w2 = 1.0; // Weight for x2
const w3 = 1.0; // Weight for x3

//INPUT VALUES
const x1El = document.getElementById("x1");
const x2El = document.getElementById("x2");
const x3El = document.getElementById("x3");

//Input ProgressBar
const x1Progress = document.getElementById("x1Progress");
const x2Progress = document.getElementById("x2Progress");
const x3Progress = document.getElementById("x3Progress"); 

//INPUT VALUES IN OUTPUT
const x1Out = document.getElementById("x1Out");
const x2Out = document.getElementById("x2Out");
const x3Out = document.getElementById("x3Out");

//INPUT VALUES IN ACTIVATION FUNCTION
const x1Func = document.getElementById("x1Func");
const x2Func = document.getElementById("x2Func");
const x3Func = document.getElementById("x3Func");

//WEIGHTS IN OUTPUT
const w1ValOut = document.getElementById("w1ValOut");
const w2ValOut = document.getElementById("w2ValOut");
const w3ValOut = document.getElementById("w3ValOut");

const biasSlider = document.getElementById("biasSlider");
const biasVal = document.getElementById("biasVal");  // To show bias value
const biasFunc = document.getElementById("biasFunc");
const biasFuncProd = document.getElementById("biasFuncProd");
const biasOut = document.getElementById("biasOut");

//RESULT
const sumEl = document.getElementById("sum");
const sumEl2 = document.getElementById("sum2");
const resultEl = document.getElementById("result");
const outputBackground = document.querySelector(".output");

function updateInputs() {
  const input = situations[currentSituation];

  //UPDATE INPUT VALUES
  x1El.textContent = input.x1.toFixed(1);
  x2El.textContent = input.x2;
  x3El.textContent = input.x3;

  //UPDATE INPUT VALUES IN ACTIVATION FUNCTION
  x1Func.textContent = input.x1.toFixed(1);
  x2Func.textContent = input.x2;
  x3Func.textContent = input.x3;

  //UPDATE INPUT VALUES IN OUTPUT
  x1Out.textContent = input.x1.toFixed(1);
  x2Out.textContent = input.x2;
  x3Out.textContent = input.x3;

  //UPDATE INPUT VALUES IN PROGRESS BAR
  x1Progress.style.width = `${input.x1 * 100}%`;
  x2Progress.style.width = `${input.x2 * 100}%`;
  x3Progress.style.width = `${input.x3 * 100}%`;

  biasOut.textContent      = biasSlider.value;

  calculate();
}

function calculate() {
  const input = situations[currentSituation];
  
  //CALCULATE THE PRODUCTS FOR EACH FACTOR
  const prod1 = input.x1 * w1;
  const prod2 = input.x2 * w2;
  const prod3 = input.x3 * w3;
  const bias = parseFloat(biasSlider.value);

  //DISPLAY PRODUCT IN ACTIVATION FUNCTION
  document.getElementById("prod1").textContent = prod1.toFixed(2);
  document.getElementById("prod2").textContent = `+ ${prod2.toFixed(2)}`;
  document.getElementById("prod3").textContent = `+ ${prod3.toFixed(2)}`;

  //CALCULATE SUM
  const sum = prod1 + prod2 + prod3 + bias;
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
// Pulse Bias
const biasEl = document.querySelector('.biasElement');

//ADD EVENT LISTENER TO SLIDER
document.querySelectorAll(".biasSlider").forEach((slider) => {
  slider.addEventListener("input", () => {
    const b = parseFloat(biasSlider.value).toFixed(1);
    biasVal.textContent      = b;
    biasFunc.textContent     = b;
    biasFuncProd.textContent = `+ ${b}`;
    biasOut.textContent      = b;
  
    calculate();
  });
});

biasSlider.addEventListener('pointerdown', () => {
  biasEl.classList.remove('pulse');
  setTimeout(() => biasEl.classList.add('pulse'), 0);
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