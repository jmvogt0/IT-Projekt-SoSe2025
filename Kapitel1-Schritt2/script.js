const situations = {
  situation1: { x1: 1.0, x2: 0.8, x3: 0.1 }, // Abend & ruhig
  situation2: { x1: 1.0, x2: 0.1, x3: 0.9 },  // Tanzparty am Tag
  situation3: { x1: 0.0, x2: 0.6, x3: 0.9 }  // Dunkel & laut
};

const initialState = {
  w1: 0,
  w2: 0,
  w3: 0,
};

// Capture initial weights after DOM content is loaded
window.addEventListener('DOMContentLoaded', () => {
  initialState.w1 = parseFloat(w1Val.textContent);
  initialState.w2 = parseFloat(w2Val.textContent);
  initialState.w3 = parseFloat(w3Val.textContent);
});


let currentSituation = "situation1";
let currentSum = 0;
const threshold = 0.99; // 0.99 possibly better

//Reset Button
document.getElementById("resetBtn").addEventListener("click", resetToInitialState);

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

//INPUT WEIGHTS SLIDER
const w1 = document.getElementById("w1");
const w2 = document.getElementById("w2");
const w3 = document.getElementById("w3");

//INPUT WEIGHTS VALUE
const w1Val = document.getElementById("w1Val");
const w2Val = document.getElementById("w2Val");
const w3Val = document.getElementById("w3Val");

//Input Weight Progess
const w1Progress = document.getElementById("w1Progress");
const w2Progress = document.getElementById("w2Progress");
const w3Progress = document.getElementById("w3Progress");

//INPUT WEIGHTS IN ACTIVATION FUNCTION
const w1Func = document.getElementById("w1Func");
const w2Func = document.getElementById("w2Func");
const w3Func = document.getElementById("w3Func");

//BUTTONS IN TRAINING
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

//CIRCLES IN TRAINING
const circles = [
  document.getElementById('circle1'),
  document.getElementById('circle2'),
  document.getElementById('circle3'),
  document.getElementById('circle4')
];

const epocheEl = document.getElementById('epocheCounter');
let epochCount = 0;
epocheEl.textContent = epochCount;

const learningRateSlider = document.getElementById('learningRate');
const learningRateValSlider = document.getElementById('learningRateVal');


//WEIGHTS IN OUTPUT
const w1ValOut = document.getElementById("w1ValOut");
const w2ValOut = document.getElementById("w2ValOut");
const w3ValOut = document.getElementById("w3ValOut");

//RESULT
const sumEl = document.getElementById("sum");
const sumEl2 = document.getElementById("sum2");
const resultProgress = document.getElementById("resultProgress");
const resultProgress2 = document.getElementById("resultProgress2");
const resultEl = document.getElementById("result");
const outputBackground = document.querySelector(".output");
const errorOutput = document.getElementById("errorOutput");
const resultIcon = document.getElementById("resultIcon");
const resultIcon2 = document.getElementById("resultIcon2");

function resetToInitialState() {
  const confirmed = window.confirm('Möchten Sie das Training wirklich zurücksetzen?');
  if (!confirmed) return;

  // Reset weight values
  w1Val.textContent = initialState.w1.toFixed(2);
  w2Val.textContent = initialState.w2.toFixed(2);
  w3Val.textContent = initialState.w3.toFixed(2);

  // Update functional displays
  w1Func.textContent = w1Val.textContent;
  w2Func.textContent = w2Val.textContent;
  w3Func.textContent = w3Val.textContent;

  w1ValOut.textContent = w1Val.textContent;
  w2ValOut.textContent = w2Val.textContent;
  w3ValOut.textContent = w3Val.textContent;

  // Reset progress bars
  w1Progress.style.width = `${initialState.w1 * 100}%`;
  w2Progress.style.width = `${initialState.w2 * 100}%`;
  w3Progress.style.width = `${initialState.w3 * 100}%`;

  // Reset training UI
  currentStep = -1;
  epochCount = 0;
  epocheEl.textContent = epochCount;
  updateCircles();

  // Reset text displays
  document.getElementById("errorError").textContent = "-";
  document.getElementById("w1Change").textContent = "+ 0.00";
  document.getElementById("w2Change").textContent = "+ 0.00";
  document.getElementById("w3Change").textContent = "+ 0.00";

  // Recalculate everything
  updateInputs();
}


function updateInputs() {
  const input = situations[currentSituation];

  //UPDATE INPUT VALUES
  x1El.textContent = input.x1.toFixed(1);
  x2El.textContent = input.x2.toFixed(1);
  x3El.textContent = input.x3.toFixed(1);

  //UPDATE INPUT VALUES IN ACTIVATION FUNCTION
  x1Func.textContent = input.x1;
  x2Func.textContent = input.x2;
  x3Func.textContent = input.x3;

  //UPDATE INPUT VALUES IN OUTPUT
  x1Out.textContent = input.x1;
  x2Out.textContent = input.x2;
  x3Out.textContent = input.x3;

  //UPDATE INPUT VALUES IN PROGRESS BAR
  x1Progress.style.width = `${input.x1 * 100}%`;
  x2Progress.style.width = `${input.x2 * 100}%`;
  x3Progress.style.width = `${input.x3 * 100}%`;

  //UPDATE INPUT WEIGHTS IN PROGRESS BAR
  w1Progress.style.width = `${parseFloat(w1Val.innerText) * 100}%`;
  w2Progress.style.width = `${parseFloat(w2Val.innerText) * 100}%`;
  w3Progress.style.width = `${parseFloat(w3Val.innerText) * 100}%`;

  calculate();
}

function calculate() {
  const input = situations[currentSituation];

  // CALCULATE THE PRODUCTS FOR EACH FACTOR
  const prod1 = input.x1 * parseFloat(w1Val.innerText);
  const prod2 = input.x2 * parseFloat(w2Val.innerText);
  const prod3 = input.x3 * parseFloat(w3Val.innerText);

  // DISPLAY PRODUCT IN ACTIVATION FUNCTION
  document.getElementById("prod1").textContent = prod1.toFixed(2);
  document.getElementById("prod2").textContent = `+ ${prod2.toFixed(2)}`;
  document.getElementById("prod3").textContent = `+ ${prod3.toFixed(2)}`;

  // CALCULATE SUM
  const rawSum = prod1 + prod2 + prod3;

  // ROUND LOGICALLY IF >= 0.99
  const adjustedSum = rawSum >= 0.99 ? 1.00 : parseFloat(rawSum.toFixed(2));
  currentSum = adjustedSum;

  sumEl.textContent = `= ${adjustedSum.toFixed(2)}`;
  sumEl2.textContent = `g = ${adjustedSum.toFixed(2)}`;
  resultProgress.style.height = `${adjustedSum * 100}%`;
  resultProgress2.style.height = `${adjustedSum * 100}%`;
  errorOutput.textContent = adjustedSum.toFixed(2);

  // Update result Icon
  const resultIconPath = document.getElementById("resultIconPath");
  
  if (currentSum >= threshold) {
    resultIconPath.setAttribute("fill", "#E4EB19");
    resultIcon.classList.add('pulse');
  } else {
    resultIconPath.setAttribute("fill", "var(--rahmen)");
    resultIcon.classList.remove('pulse');
  }

  const resultIconPath2 = document.getElementById("resultIconPath2");

  if (currentSum >= threshold) {
    resultIconPath2.setAttribute("fill", "#E4EB19");
    resultIcon2.classList.add('pulse');
  } else {
    resultIconPath2.setAttribute("fill", "var(--rahmen)");
    resultIcon2.classList.remove('pulse');
  }

  if (currentSum === 1.0) {
    document.querySelectorAll('.outputElementGraphic').forEach(el => {
      el.style.setProperty('border', '2px solid var(--primary)', 'important');
    });
  } else {
    document.querySelectorAll('.outputElementGraphic').forEach(el => {
      el.style.removeProperty('border');
    });
  }
}

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

//TRAINING STEPS LOGIC
let currentStep = -1;

//ADD EVENT LISTENER TO LEARNING RATE SLIDER
document.querySelectorAll(".weight").forEach((slider) => {
  slider.addEventListener("input", () => {

    learningRateValSlider.textContent = learningRate.value;

  });
});

function updateCircles() {
  circles.forEach((circle, index) => {

    circle.style.backgroundColor = '#cac9c9';

    if (index === currentStep) {
      circle.style.backgroundColor = '#79A64A';
    }
  });

  // Show sum and output only after step 0 (Forward Pass)
  const sumEl = document.getElementById("sum");
  const errorOutputEl = document.getElementById("errorOutput");

  if (currentStep >= 0) {
    sumEl.style.visibility = "visible";
    errorOutputEl.style.visibility = "visible";
  } else {
    sumEl.style.visibility = "hidden";
    errorOutputEl.style.visibility = "hidden";
  }

  if (currentStep === 2) {
    learningRateSlider.classList.remove("disabled");
    learningRateSlider.disabled = false;
  }
  if (currentStep !== 2) {
    learningRateSlider.classList.add("disabled");
    learningRateSlider.disabled = true;
  }
    
}
// Event listener for the learning rate slider
learningRateSlider.addEventListener('input', () => {
  backpropagation();
});

// Event listener for the next button
nextBtn.addEventListener('click', () => {
  if (currentStep < 3) {
    currentStep++;
  } else {
    currentStep = -1;
  }

  updateCircles();
  prevBtn.disabled = false;

  if (currentStep === -1) {
    document.getElementById("errorError").textContent = "-";
  }

  if (currentStep === 0) {
    epochCount++;
    epocheEl.textContent = epochCount;
  }

  if (currentStep < 1) {
    document.getElementById("w1Change").textContent = "+ 0.00";
    document.getElementById("w2Change").textContent = "+ 0.00";
    document.getElementById("w3Change").textContent = "+ 0.00";
  }


  // Fehlerberechnung – Step 2
  if (currentStep === 1) {
    const goal = parseFloat(document.getElementById("errorGoal").textContent);
    const output = parseFloat(document.getElementById("errorOutput").textContent);
    const error = goal - output;

    const errorErrorEl = document.getElementById("errorError");
    errorErrorEl.textContent = `${goal.toFixed(2)} - ${output.toFixed(2)} = ${error.toFixed(2)}`;
    errorErrorEl.dataset.error = error.toFixed(2);
  }


  // Backpropagation – Step 3
  if (currentStep === 2) {
    backpropagation();
  }

  // Apply new weights (Step 3: Update sliders and values)
  if (currentStep === 3) {
    const error = parseFloat(document.getElementById("errorError").dataset.error || "0");

    // Learning rate
    const learningRate = 0.1;
    const input = situations[currentSituation];

    // Get the calculated weight changes stored earlier
    const weightChange1 = parseFloat(document.getElementById("w1Change").dataset.change);
    const weightChange2 = parseFloat(document.getElementById("w2Change").dataset.change);
    const weightChange3 = parseFloat(document.getElementById("w3Change").dataset.change);

    // Update weights by adding the changes
    w1Val.textContent = (parseFloat(w1Val.textContent) + weightChange1).toFixed(2);
    w2Val.textContent = (parseFloat(w2Val.textContent) + weightChange2).toFixed(2);
    w3Val.textContent = (parseFloat(w3Val.textContent) + weightChange3).toFixed(2);

    w1Func.textContent = w1Val.textContent;
    w2Func.textContent = w2Val.textContent;
    w3Func.textContent = w3Val.textContent;

    w1ValOut.textContent = w1Val.textContent;
    w2ValOut.textContent = w2Val.textContent;
    w3ValOut.textContent = w3Val.textContent;

    calculate();
  }
});

const backpropagation = () => {
  const error = parseFloat(document.getElementById("errorError").dataset.error || "0");
    const learningRate = parseFloat(learningRateSlider.value);
    const input = situations[currentSituation];

    // Calculate the weight updates based on error
    const weightChange1 = learningRate * error * input.x1;
    const weightChange2 = learningRate * error * input.x2;
    const weightChange3 = learningRate * error * input.x3;

    // Display the weight change (plus or minus) next to the weight sliders
    document.getElementById("w1Change").textContent = (weightChange1 >= 0 ? `+ ${weightChange1.toFixed(2)}` : `- ${Math.abs(weightChange1).toFixed(2)}`);
    document.getElementById("w2Change").textContent = (weightChange2 >= 0 ? `+ ${weightChange2.toFixed(2)}` : `- ${Math.abs(weightChange2).toFixed(2)}`);
    document.getElementById("w3Change").textContent = (weightChange3 >= 0 ? `+ ${weightChange3.toFixed(2)}` : `- ${Math.abs(weightChange3).toFixed(2)}`);

    // Store the calculated weight changes for later use
    document.getElementById("w1Change").dataset.change = weightChange1;
    document.getElementById("w2Change").dataset.change = weightChange2;
    document.getElementById("w3Change").dataset.change = weightChange3;
}

// Event listener for the previous button
prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--; // Move to the previous step
  }
  updateCircles();

  if (currentStep < 1) {
    document.getElementById("errorError").textContent = "-";
    document.getElementById("errorOutput").textContent = currentSum.toFixed(2);
  }

  if (currentStep <= 1) {
    document.getElementById("w1Change").textContent = "+ 0.00";
    document.getElementById("w2Change").textContent = "+ 0.00";
    document.getElementById("w3Change").textContent = "+ 0.00";
  }

  if (currentStep === 2) {
    // Get the weight changes stored previously
    const weightChange1 = parseFloat(document.getElementById("w1Change").dataset.change);
    const weightChange2 = parseFloat(document.getElementById("w2Change").dataset.change);
    const weightChange3 = parseFloat(document.getElementById("w3Change").dataset.change);

    // Revert the weights
    w1Val.textContent = (parseFloat(w1Val.textContent) - weightChange1).toFixed(2);
    w2Val.textContent = (parseFloat(w2Val.textContent) - weightChange2).toFixed(2);
    w3Val.textContent = (parseFloat(w3Val.textContent) - weightChange3).toFixed(2);

    w1Func.textContent = w1Val.textContent;
    w2Func.textContent = w2Val.textContent;
    w3Func.textContent = w3Val.textContent;

    w1ValOut.textContent = w1Val.textContent;
    w2ValOut.textContent = w2Val.textContent;
    w3ValOut.textContent = w3Val.textContent;

    // Recalculate outputs based on reverted weights
    calculate();
  }
});

// Initialize the first step
updateCircles();

// Initially disable the prev button
prevBtn.disabled = true;

updateInputs();//INITIAL LOAD
