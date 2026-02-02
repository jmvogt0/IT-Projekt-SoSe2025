const situations = {
  situation1: { x1: 1.0, x2: 0.8, x3: 0.1 }, // Abend & ruhig
  situation2: { x1: 1.0, x2: 0.1, x3: 0.9 },  // Tanzparty am Tag
  situation3: { x1: 0.0, x2: 0.6, x3: 0.9 }  // Dunkel & laut
};

let currentSituation = "situation1";
const threshold = 2.3;

const w1 = 2.5; // Weight for x1
const w2 = 0.3; // Weight for x2
const w3 = 2.5; // Weight for x3

//INPUT VALUES
const x1El = document.getElementById("x1");
const x2El = document.getElementById("x2");
const x3El = document.getElementById("x3");

//INPUT VALUES IN OUTPUT
const x1Out = document.getElementById("x1Out");
const x2Out = document.getElementById("x2Out");
const x3Out = document.getElementById("x3Out");

//Input ProgressBar
const x1Progress = document.getElementById("x1Progress");
const x2Progress = document.getElementById("x2Progress");
const x3Progress = document.getElementById("x3Progress");

//INPUT VALUES IN ACTIVATION FUNCTION
const x1Func = document.getElementById("x1Func");
const x2Func = document.getElementById("x2Func");
const x3Func = document.getElementById("x3Func");

//WEIGHTS IN OUTPUT
const w1ValOut = document.getElementById("w1ValOut");
const w2ValOut = document.getElementById("w2ValOut");
const w3ValOut = document.getElementById("w3ValOut");

const biasVal = document.getElementById("biasVal");  // To show bias value
const biasFunc = document.getElementById("biasFunc");
const biasFuncProd = document.getElementById("biasFuncProd");

//RESULT
const sumEl = document.getElementById("sum");
const sumEl2 = document.getElementById("sum2");
const resultEl = document.getElementById("result");
const outputBackground = document.querySelector(".output");

//EVENT LISTENER FOR DROPDOWN
document.getElementById("activationDropdown").addEventListener("change", function () {
  const img = document.getElementById("functionImage");
  const plotImg = document.getElementById("functionPlot");
  const value = this.value;

  switch (value) {
    case "step":
      img.src = "threshold.svg";
      img.alt = "Schwellenwert-Formel";
      plotImg.src = "thresholdFunction.png";
      plotImg.alt = "Schwellenwert-Funktion";
      break;
    case "sigmoid":
      img.src = "sigmoid.svg";
      img.alt = "Sigmoid-Formel";
      plotImg.src = "sigmoidFunction.png";
      plotImg.alt = "Sigmoid-Funktion";
      break;
    case "relu":
      img.src = "relu.svg";
      img.alt = "ReLU-Formel";
      plotImg.src = "reluFunction.png";
      plotImg.alt = "ReLU-Funktion";
      break;
    case "tanh":
      img.src = "tanh.svg";
      img.alt = "Tanh-Formel";
      plotImg.src = "tanhFunction.png";
      plotImg.alt = "Tanh-Funktion";
      break;
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const activationDropdown = document.getElementById('activationDropdown');
  const functionResult = document.getElementById('functionResult');
  const sumDisplay = document.getElementById('sum');

  const inputs = {
    x1: parseFloat(document.getElementById('x1').textContent),
    x2: parseFloat(document.getElementById('x2').textContent),
    x3: parseFloat(document.getElementById('x3').textContent),
    bias: parseFloat(document.getElementById('biasVal').textContent),
  };

  const weights = {
    w1: parseFloat(document.getElementById('w1Func').textContent),
    w2: parseFloat(document.getElementById('w2Func').textContent),
    w3: parseFloat(document.getElementById('w3Func').textContent),
  };

  function calculateSum() {
    const sum =
      situations.situation1.x1 * weights.w1 +
      situations.situation1.x2 * weights.w2 +
      situations.situation1.x3 * weights.w3 +
      inputs.bias;

    sumDisplay.textContent = sum.toFixed(2);
    return sum;
  }

  function applyActivationFunction(sum) {
    let result;
    const selected = activationDropdown.value;

    if (selected === 'step') {
      result = sum >= 1 ? 1 : 0;
    } else if (selected === 'sigmoid') {
      result = 1 / (1 + Math.exp(-sum));
    } else if (selected === 'relu') {
      result = Math.max(0, sum);
    } else if (selected ==='tanh'){
      result = (Math.exp(sum) - Math.exp(-sum)) / (Math.exp(sum) + Math.exp(-sum));
    }

    functionResult.textContent = `= ${result.toFixed(2)}`;
    sumEl2.textContent = result.toFixed(2);
  }

  function update() {
    const sum = calculateSum();
    applyActivationFunction(sum);
  }

  activationDropdown.addEventListener('change', update);

  // Initial calculation
  update();
});

function updateInputs() {
  const input = situations[currentSituation];

  //UPDATE INPUT VALUES
  x1El.textContent = input.x1;
  x2El.textContent = input.x2;
  x3El.textContent = input.x3;

  //UPDATE INPUT VALUES IN ACTIVATION FUNCTION
  x1Func.textContent = input.x1;
  x2Func.textContent = input.x2;
  x3Func.textContent = input.x3;

  //UPDATE INPUT VALUES IN OUTPUT
  x1Out.textContent = input.x1;
  x2Out.textContent = input.x2;
  x3Out.textContent = input.x3;

  calculate();
}

function calculate() {
  const input = situations[currentSituation];
  
  //CALCULATE THE PRODUCTS FOR EACH FACTOR
  const prod1 = input.x1 * w1;
  const prod2 = input.x2 * w2;
  const prod3 = input.x3 * w3;
  const biasValue = parseFloat(biasVal.textContent);
  
  //DISPLAY PRODUCT IN ACTIVATION FUNCTION
  document.getElementById("prod1").textContent = prod1.toFixed(2);
  document.getElementById("prod2").textContent = `+ ${prod2.toFixed(2)}`;
  document.getElementById("prod3").textContent = `+ ${prod3.toFixed(2)}`;

  //Display Products in Input Field
  x1El.textContent = prod1.toFixed(2);
  x2El.textContent = prod2.toFixed(2);
  x3El.textContent = prod3.toFixed(2);

  x1Progress.style.width = `${prod1 / 2.5 * 100}%`;
  x2Progress.style.width = `${prod2 / 2.5 * 100}%`;
  x3Progress.style.width = `${prod3 / 2.5 * 100}%`;

  //CALCULATE SUM
  const sum = prod1 + prod2 + prod3 + biasValue;
  sumEl.textContent = `= ${sum.toFixed(2)}`;
}

function toggleActive(activeId) {
  document.getElementById("situation1Btn").classList.remove("active");
  document.getElementById("situation2Btn").classList.remove("active");
  document.getElementById("situation3Btn").classList.remove("active");
  document.getElementById(activeId).classList.add("active");
}
updateInputs();//INITIAL LOAD