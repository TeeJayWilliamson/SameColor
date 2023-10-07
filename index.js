function startNewGame() {
  // Redirect to the game page or load the game using JavaScript
  window.location.href = "game.html"; // Change the URL to your game page
}

function startFreePlay() {
  // Redirect to the game page or load the game using JavaScript
  window.location.href = "freeplay.html"; // Change the URL to your game page
}

function showHighscores() {
  // Create a blur overlay div
  const blurOverlay = document.createElement("div");
  blurOverlay.classList.add("blur-overlay");
  document.body.appendChild(blurOverlay);

  // Create a lightbox container
  const lightbox = document.createElement("div");
  lightbox.classList.add("lightbox");

  // Create the content for the lightbox
  const content = document.createElement("div");
  content.classList.add("lightbox-content");

  // Add the header for "Time Attack"
  content.innerHTML += "<h2>Time Attack</h2>";

  // Retrieve the high score from game.html
  const iframe = document.createElement("iframe");
  iframe.src = "game.html"; // Replace with the correct path to game.html
  iframe.style.display = "none"; // Hide the iframe
  document.body.appendChild(iframe);

  iframe.onload = () => {
    const gameDocument =
      iframe.contentDocument || iframe.contentWindow.document;
    const highscore =
      gameDocument.getElementById("highscore-value").textContent;

    // Display the highscore in the lightbox
    content.innerHTML += `Highscore: ${highscore}<br>`;

    // Remove the hidden iframe
    document.body.removeChild(iframe);

    // You can add other content for "Time Attack" here

    // Add the header for "Freeplay"
    content.innerHTML += "<h2>Freeplay</h2>";

    // Retrieve the closest match from localStorage
    const savedClosestMatch = localStorage.getItem("closestMatch");

    // Check if there is a closest match stored in localStorage
    if (savedClosestMatch) {
      // Display the closest match in the lightbox
      content.innerHTML += `Closest Match: ${savedClosestMatch}%<br>`;
    } else {
      // If there is no closest match stored, display a message
      content.innerHTML += "No closest match found.<br>";
    }

    // Add the "Close" button
    content.innerHTML += '<button id="close-lightbox">Close</button>';

    // Add the content to the lightbox
    lightbox.appendChild(content);

    // Add the lightbox to the document
    document.body.appendChild(lightbox);

    // Add an event listener to close the lightbox and remove the blur overlay when the "Close" button is clicked
    const closeButton = document.getElementById("close-lightbox");
    closeButton.addEventListener("click", () => {
      document.body.removeChild(lightbox);
      document.body.removeChild(blurOverlay); // Remove the blur overlay
    });
  };
}



