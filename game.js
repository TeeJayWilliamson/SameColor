// Function to update the high score text on the page
function updateHighScoreText(score) {
  const highscoreValue = document.getElementById("highscore-value");
  highscoreValue.textContent = score.toFixed(2);
}

// Function to retrieve the high score from local storage
function getHighScore() {
  const highestScore =
    parseFloat(localStorage.getItem("highestScore")) || 0;
  return highestScore;
}

// Call the function to retrieve and display the high score when the page loads
updateHighScoreText(getHighScore());

const targetColor = document.getElementById("target-color");
const userColor = document.getElementById("user-color");
const redSlider = document.getElementById("red-slider");
const greenSlider = document.getElementById("green-slider");
const blueSlider = document.getElementById("blue-slider");
const similarityText = document.getElementById("similarity");
const timerText = document.getElementById("timer");
const checkButton = document.getElementById("check-button");
const resetButton = document.getElementById("reset-button");
const redDot = document.querySelector(".red-dot");
const greenDot = document.querySelector(".green-dot");
const blueDot = document.querySelector(".blue-dot");
const redIndicator = document.getElementById("red-indicator");
const greenIndicator = document.getElementById("green-indicator");
const blueIndicator = document.getElementById("blue-indicator");

function togglePerfectMatch() {
  // Calculate the perfect match values based on the target color
  const perfectRed = targetRGB[0];
  const perfectGreen = targetRGB[1];
  const perfectBlue = targetRGB[2];

  // Set the slider positions to achieve a 100% match
  redSlider.noUiSlider.set(perfectRed);
  greenSlider.noUiSlider.set(perfectGreen);
  blueSlider.noUiSlider.set(perfectBlue);
}

let targetRGB = generateRandomRGB();
let userRGB = [0, 0, 0];
let similarityThreshold = 100;
let timer = 60; // Updated initial timer value to 100 seconds
let timerInterval;
let answerVisible = false; // Add a flag to track whether the answer is visible
let roundsPlayed = 0;
let matchesMade = 0;
let totalSimilarity = 0;
let isButtonDisabled = false;
let matchPercentages = []; // Store the match percentages
let highestScore = parseFloat(localStorage.getItem("highestScore")) || 0;

// Set the initial user color square to black
userColor.style.backgroundColor = "black";

targetColor.style.backgroundColor = `rgb(${targetRGB[0]}, ${targetRGB[1]}, ${targetRGB[2]})`;

startTimer();
// Function to navigate back to index.html
function goBack() {
  window.location.href = "index.html"; // Change the URL to your index.html page
}

// Add a click event listener to the back button
const backButton = document.getElementById("back-button");
backButton.addEventListener("click", goBack);

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

function updateColorDisplay() {
  userColor.style.backgroundColor = `rgb(${userRGB[0]}, ${userRGB[1]}, ${userRGB[2]})`;
}

function checkMatch() {
  // If the answer is already visible, do nothing
  if (answerVisible) return;

  // Pause the timer
  clearInterval(timerInterval);

  const similarity = calculateSimilarity(targetRGB, userRGB);
  similarityText.textContent = `${similarity.toFixed(2)}%`;

  // Add the match percentage to the array
  matchPercentages.push(similarity.toFixed(2));

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

  // Update the number of matches and total similarity
  matchesMade++;
  totalSimilarity += similarity;

  // Show the result for 2 seconds
  answerVisible = true;
  setTimeout(() => {
    answerVisible = false;
    resetSlidersAndChangeColor();
    startTimer();
  }, 2000);
}

// Function to update the high score on the page and in local storage
function updateHighScore(score) {
  highestScore = score;
  localStorage.setItem("highestScore", highestScore);
  updateHighScoreText(highestScore); // Update the high score text on the page
}

updateHighScore(highestScore);

function displayScore() {
  let scoreMessage = `Matches Made: ${matchesMade}<br><br>`;

  for (let i = 0; i < matchesMade; i++) {
    scoreMessage += `Match ${i + 1} - ${matchPercentages[i]}%<br>`;
  }

  // Calculate the score for the current round
  const totalScore = calculateScore(totalSimilarity);

  // Check if the current round's score is higher than the high score
  if (totalScore > highestScore) {
    // Update the high score immediately if a new high score is achieved
    updateHighScore(totalScore);
  }

  scoreMessage += `<br>Score: ${totalScore}`;

  // Display the score in the lightbox
  displayLightbox(scoreMessage, true); // Show the overlay
}

// Function to check if the current score is a new high score and update if needed
function checkAndUpdateHighScore(currentScore) {
  if (currentScore > highestScore) {
    highestScore = currentScore;
    localStorage.setItem("highestScore", highestScore);
    updateHighScoreText(highestScore);
  }
}

// Function to reset the high score
function resetHighScore() {
  highestScore = 0;
  localStorage.removeItem("highestScore"); // Remove the high score from localStorage
  updateHighScoreText(); // Update the high score element on the page
}

// Call resetHighScore() to reset the high score (you can do this in a button click event or elsewhere)
//resetHighScore();

// Update the high score element when the page loads
updateHighScoreText(highestScore);

function resetGame() {
  // Reset the number of matches and total similarity
  matchesMade = 0;
  totalSimilarity = 0;

  // Reset sliders and change color
  resetSlidersAndChangeColor();

  // Reset timer
  timer = 60;
  clearInterval(timerInterval);
  timerText.textContent = "60 seconds";
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
  const similarity = Math.max(0, 100 - (distance / 255) * 100);
  return similarity;
}

function startTimer() {
  // Disable the "Check Match" button when the timer starts
  checkButton.disabled = true;

  timerInterval = setInterval(() => {
    if (timer > 0) {
      timer--;
      timerText.textContent = `${timer} seconds`;
    } else {
      // Time is up, calculate the user's score
      displayScore(); // Display the score in the lightbox
      clearInterval(timerInterval);
    }
  }, 1000);

  // Allow the button to be clicked again after a 2-second delay
  setTimeout(() => {
    checkButton.disabled = false;
  }, 2000);
}

function calculateScore(totalSimilarity) {
  // Define a weight for similarity
  const similarityWeight = 1; // 1 point per percentage similarity

  // Calculate the score based on similarity
  const score = totalSimilarity * similarityWeight;

  // Round the score to 2 decimal places
  const roundedScore = score.toFixed(2);

  return roundedScore;
}

function playAgain() {
  // Reset the timer to 60 seconds
  timer = 60;

  // Reset other game-related variables and elements
  resetGame();

  // Calculate the score for the current round and display it
  const currentTotalScore = calculateScore(totalSimilarity);
  displayScore(currentTotalScore); // Pass the currentTotalScore

  // Remove the lightbox
  const existingLightbox = document.querySelector(".lightbox");
  if (existingLightbox) {
    document.body.removeChild(existingLightbox);
  }

  // Remove the blur overlay
  removeBlurOverlay();

  startTimer();

  updateHighScoreText(getHighScore());
}

function displayLightbox(message, showOverlay = true) {
  const lightbox = document.createElement("div");
  lightbox.classList.add("lightbox");

  // Create a div for the content with a darker background
  const content = document.createElement("div");
  content.classList.add("lightbox-content");

  // Replace newline characters with <br> tags in the message
  message = message.replace(/\n/g, "<br>");

  // Wrap "Matches Made" in an h2 element and "Score" in a strong element
  message = message.replace("Matches Made:", "<strong>Matches Made:</strong>");
  message = message.replace("Score:", "<strong>Score:</strong>");

  const messageElement = document.createElement("p");
  messageElement.innerHTML = message;

  content.appendChild(messageElement);

  const playAgainButton = document.createElement("button");
  playAgainButton.textContent = "Restart";
  playAgainButton.addEventListener("click", () => {
    document.body.removeChild(lightbox);
    if (showOverlay) {
      removeBlurOverlay(); // Remove the overlay
    }
    playAgain();
  });

  const homeButton = document.createElement("button");
  homeButton.textContent = "Home";
  homeButton.addEventListener("click", () => {
    window.location.href = "index.html"; // Change the URL to your index.html page
  });

  const shareButton = document.createElement("button");
  shareButton.textContent = "Share";
  shareButton.classList.add("share-button"); // Add a class to the share button

  // Add a click event listener to the share button
  shareButton.addEventListener("click", () => {
    copyMatchStatsToClipboard();
  });

  // Add the share button to the button container
  const buttonContainer = document.querySelector(".button-container");
  buttonContainer.appendChild(shareButton);

  content.appendChild(playAgainButton);
  content.appendChild(homeButton); // Add the "Home" button to the lightbox
  content.appendChild(shareButton);

  lightbox.appendChild(content);

  document.body.appendChild(lightbox);

  if (showOverlay) {
    addBlurOverlay(); // Add the overlay
  }
}

function addBlurOverlay() {
  const blurOverlay = document.createElement("div");
  blurOverlay.classList.add("blur-overlay");
  document.body.appendChild(blurOverlay);
}

function removeBlurOverlay() {
  const blurOverlay = document.querySelector(".blur-overlay");
  if (blurOverlay) {
    document.body.removeChild(blurOverlay);
  }
}

function copyTextToClipboard(text) {
  // Create a hidden input element
  const tempInput = document.createElement("input");
  tempInput.type = "text";
  tempInput.value = text;

  // Append the input element to the document
  document.body.appendChild(tempInput);

  // Select and copy the text from the input element
  tempInput.select();
  document.execCommand("copy");

  // Remove the temporary input element
  document.body.removeChild(tempInput);
}

function copyMatchStatsToClipboard() {
  // Prepare the match stats text
  let matchStatsText = `Color Craze - Time Attack\n\n`;

  for (let i = 0; i < matchesMade; i++) {
    const matchNumber = i + 1;
    const matchPercentage = parseFloat(matchPercentages[i]);
    let emoji = "🟨"; // Default to a yellow square

    if (matchPercentage < 75) {
      emoji = "🟥"; // Red square
    } else if (matchPercentage >= 90) {
      emoji = "🟩"; // Green square
    } else if (matchPercentage >= 75) {
      emoji = "🟨"; // Yellow square
    }

    matchStatsText += `Match ${matchNumber}: ${emoji} ${matchPercentage.toFixed(
      2
    )}%\n`;
  }

  // Calculate the score for the current round
  const currentTotalScore = calculateScore(totalSimilarity);

  matchStatsText += `\nScore: ${currentTotalScore}`;

  // Create a temporary textarea element to copy plain text content
  const tempTextarea = document.createElement("textarea");
  tempTextarea.style.position = "absolute";
  tempTextarea.style.left = "-9999px";
  tempTextarea.style.top = "0";
  tempTextarea.value = matchStatsText;

  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextarea);

  // Show a message that the match stats have been copied
  showCopyMessage();
}

function showCopyMessage() {
  // Create a message element
  const messageElement = document.createElement("div");
  messageElement.textContent =
    "Match stats have been copied to the clipboard!";

  messageElement.style.position = "fixed";
  messageElement.style.top = "35%";
  messageElement.style.left = "50%";
  messageElement.style.transform = "translateX(-50%)";
  messageElement.style.backgroundColor = "#fff";
  messageElement.style.color = "#000";
  messageElement.style.padding = "10px";
  messageElement.style.borderRadius = "5px";
  messageElement.style.zIndex = "1001";
  messageElement.style.border = "2px solid #333"; // You can adjust the border width and color
  messageElement.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)"; // Adjust the shadow as needed


  // Append the message element to the document
  document.body.appendChild(messageElement);

  // Automatically remove the message element after 2 seconds
  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, 2000);
}

function resetDots() {
  redIndicator.style.left = "0%";
  greenIndicator.style.left = "0%";
  blueIndicator.style.left = "0%";
}
// Add a call to resetDots() in the resetSlidersAndChangeColor() function
function resetSlidersAndChangeColor() {
  // Reset the sliders to their initial state
  redSlider.noUiSlider.set(0);
  greenSlider.noUiSlider.set(0);
  blueSlider.noUiSlider.set(0);

  // Reset the red, green, and blue dots
  resetDots();

  // Generate and display a new color on the left
  targetRGB = generateRandomRGB();
  targetColor.style.backgroundColor = `rgb(${targetRGB[0]}, ${targetRGB[1]}, ${targetRGB[2]})`;

  // Reset similarity text
  similarityText.textContent = "0%";
}

// Update the high score text to reflect any changes
updateHighScoreText(highestScore);