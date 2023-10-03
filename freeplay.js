const targetColor = document.getElementById("target-color");
const userColor = document.getElementById("user-color");
const redSlider = document.getElementById("red-slider");
const greenSlider = document.getElementById("green-slider");
const blueSlider = document.getElementById("blue-slider");
const similarityText = document.getElementById("similarity");
const checkButton = document.getElementById("check-button");
const redDot = document.querySelector(".red-dot");
const greenDot = document.querySelector(".green-dot");
const blueDot = document.querySelector(".blue-dot");
const redIndicator = document.getElementById("red-indicator");
const greenIndicator = document.getElementById("green-indicator");
const blueIndicator = document.getElementById("blue-indicator");

// Function to update and save the closest match in localStorage
function updateClosestMatch(similarity) {
  // Get the previous closest match from localStorage
  const previousClosestMatch =
    parseFloat(localStorage.getItem("closestMatch")) || 0;

  // Check if the current similarity is higher than the previous closest match
  if (similarity > previousClosestMatch) {
    // Update the highest similarity
    highestSimilarity = similarity;

    // Update the "Closest Match" value
    document.getElementById(
      "closestmatch-value"
    ).textContent = `${highestSimilarity.toFixed(2)}%`;

    // Save the new closest match in localStorage
    localStorage.setItem("closestMatch", highestSimilarity.toFixed(2));
  }
}

let targetRGB = generateRandomRGB();
let userRGB = [0, 0, 0];
let similarityThreshold = 10;
let highestSimilarity = 0; // Initialize highest similarity as 0

// Function to navigate back to index.html
function goBack() {
  window.location.href = "index.html"; // Change the URL to your index.html page
}

// Add a click event listener to the back button
const backButton = document.getElementById("back-button");
backButton.addEventListener("click", goBack);

// Set the initial user color square to black
userColor.style.backgroundColor = "black";

targetColor.style.backgroundColor = `rgb(${targetRGB[0]}, ${targetRGB[1]}, ${targetRGB[2]})`;

// Initialize noUiSlider for the red slider
noUiSlider.create(redSlider, {
  start: 0,
  range: {
    min: 0,
    max: 255,
  },
  step: 0.0001,
});

// Initialize noUiSlider for the green slider
noUiSlider.create(greenSlider, {
  start: 0,
  range: {
    min: 0,
    max: 255,
  },
  step: 0.0001,
});

// Initialize noUiSlider for the blue slider
noUiSlider.create(blueSlider, {
  start: 0,
  range: {
    min: 0,
    max: 255,
  },
  step: 0.0001,
});

// Update the user color when redSlider value changes
redSlider.noUiSlider.on("update", function (values, handle) {
  userRGB[0] = parseFloat(values[handle]);
  updateColorDisplay();
});

// Update the user color when greenSlider value changes
greenSlider.noUiSlider.on("update", function (values, handle) {
  userRGB[1] = parseFloat(values[handle]);
  updateColorDisplay();
});

// Update the user color when blueSlider value changes
blueSlider.noUiSlider.on("update", function (values, handle) {
  userRGB[2] = parseFloat(values[handle]);
  updateColorDisplay();
});

redSlider.addEventListener("input", updateColorDisplay);
greenSlider.addEventListener("input", updateColorDisplay);
blueSlider.addEventListener("input", updateColorDisplay);

checkButton.addEventListener("click", checkMatch);

function updateColorDisplay() {
  userColor.style.backgroundColor = `rgb(${userRGB[0]}, ${userRGB[1]}, ${userRGB[2]})`;
}

function checkMatch() {
  const similarity = calculateSimilarity(targetRGB, userRGB);
  similarityText.textContent = `${similarity.toFixed(2)}%`;
  checkButton.disabled = true;

  // Update and save the closest match
  updateClosestMatch(similarity);

  const redPosition =
    ((targetRGB[0] - redSlider.noUiSlider.options.range.min) /
      (redSlider.noUiSlider.options.range.max -
        redSlider.noUiSlider.options.range.min)) *
    100;

  const greenPosition =
    ((targetRGB[1] - greenSlider.noUiSlider.options.range.min) /
      (greenSlider.noUiSlider.options.range.max -
        greenSlider.noUiSlider.options.range.min)) *
    100;

  const bluePosition =
    ((targetRGB[2] - blueSlider.noUiSlider.options.range.min) /
      (blueSlider.noUiSlider.options.range.max -
        blueSlider.noUiSlider.options.range.min)) *
    100;

  redIndicator.style.left = `${redPosition}%`;
  greenIndicator.style.left = `${greenPosition}%`;
  blueIndicator.style.left = `${bluePosition}%`;

  // Show the answer with the sliders for 3 seconds
  setTimeout(() => {
    // Re-enable the "Check Match" button after 3 seconds
    checkButton.disabled = false;
    resetGame(); // Perform the reset
  }, 3000);
}

function resetGame() {
  targetRGB = generateRandomRGB();
  targetColor.style.backgroundColor = `rgb(${targetRGB[0]}, ${targetRGB[1]}, ${targetRGB[2]})`;
  similarityText.textContent = "0%";

  // Reset user color square to black
  userColor.style.backgroundColor = "black";

  redIndicator.style.left = "0%";
  greenIndicator.style.left = "0%";
  blueIndicator.style.left = "0%";

  // Reset the sliders
  redSlider.noUiSlider.set(0);
  greenSlider.noUiSlider.set(0);
  blueSlider.noUiSlider.set(0);
}

function generateRandomRGB() {
  return [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];
}

function calculateSimilarity(color1, color2) {
  const deltaR = color1[0] - color2[0];
  const deltaG = color1[1] - color2[1];
  const deltaB = color1[2] - color2[2];
  const distance = Math.sqrt(deltaR ** 2 + deltaG ** 2 + deltaB ** 2);
  return Math.max(0, 100 - (distance / 255) * 100);
}

// When the game starts, retrieve and display the closest match from localStorage
const savedClosestMatch = localStorage.getItem("closestMatch");
if (savedClosestMatch) {
  highestSimilarity = parseFloat(savedClosestMatch);
  document.getElementById(
    "closestmatch-value"
  ).textContent = `${highestSimilarity.toFixed(2)}%`;
}
