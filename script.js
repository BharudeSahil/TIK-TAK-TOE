document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const menuScreen = document.getElementById("menuScreen");
  const gameScreen = document.getElementById("gameScreen");
  const resultScreen = document.getElementById("resultScreen");
  const casualModeBtn = document.getElementById("casualMode");
  const bestOfFiveModeBtn = document.getElementById("bestOfFiveMode");
  const backToMenuBtn = document.getElementById("backToMenu");
  const restartGameBtn = document.getElementById("restartGame");
  const nextRoundBtn = document.getElementById("nextRound");
  const finishGameBtn = document.getElementById("finishGame");
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");
  const colorXInput = document.getElementById("colorX");
  const colorOInput = document.getElementById("colorO");
  const currentPlayerName = document.getElementById("currentPlayerName");
  const player1Score = document.getElementById("player1Score");
  const player2Score = document.getElementById("player2Score");
  const roundInfo = document.getElementById("roundInfo");
  const resultText = document.getElementById("resultText");
  const gameBoard = document.getElementById("gameBoard");
  const casualLeaderboard = document.getElementById("casualLeaderboard");
  const bestOfFiveLeaderboard = document.getElementById(
    "bestOfFiveLeaderboard"
  );

  // Game state
  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameActive = true;
  let player1 = "Player 1";
  let player2 = "Player 2";
  let colorX = "#ff00ff";
  let colorO = "#00ffff";
  let gameMode = "";
  let scores = { X: 0, O: 0 };
  let round = 1;
  let maxRounds = 1;
  let casualWins = {};
  let bestOfFiveWins = {};

  // Initialize leaderboards from localStorage
  loadLeaderboards();

  // Event Listeners
  casualModeBtn.addEventListener("click", () => startGame("casual"));
  bestOfFiveModeBtn.addEventListener("click", () => startGame("bestOf5"));
  backToMenuBtn.addEventListener("click", returnToMenu);
  restartGameBtn.addEventListener("click", restartGame);
  nextRoundBtn.addEventListener("click", nextRound);
  finishGameBtn.addEventListener("click", finishGame);
  colorXInput.addEventListener("input", updateColors);
  colorOInput.addEventListener("input", updateColors);

  // Initialize the game board
  function initializeBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-index", i);
      cell.addEventListener("click", handleCellClick);
      gameBoard.appendChild(cell);
    }
  }

  // Handle cell clicks
  function handleCellClick(e) {
    const index = e.target.getAttribute("data-index");

    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer === "X" ? "x-symbol" : "o-symbol");

    // Apply custom colors
    if (currentPlayer === "X") {
      e.target.style.color = colorX;
      e.target.style.textShadow = `0 0 10px ${colorX}, 0 0 20px ${colorX}`;
    } else {
      e.target.style.color = colorO;
      e.target.style.textShadow = `0 0 10px ${colorO}, 0 0 20px ${colorO}`;
    }

    checkGameResult();
  }

  // Check for win or draw
  function checkGameResult() {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    let roundWon = false;

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      scores[currentPlayer]++;
      updateScoreDisplay();
      gameActive = false;
      showResult(
        `${currentPlayer === "X" ? player1 : player2} wins Round ${round}!`
      );
      return;
    }

    if (!board.includes("")) {
      gameActive = false;
      showResult("Round Draw!");
      return;
    }

    switchPlayer();
  }

  // Switch players
  function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    currentPlayerName.textContent = currentPlayer === "X" ? player1 : player2;
    currentPlayerName.className = "neon-text";
    currentPlayerName.classList.add(
      currentPlayer === "X" ? "x-symbol" : "o-symbol"
    );

    // Apply custom colors to player name
    if (currentPlayer === "X") {
      currentPlayerName.style.color = colorX;
      currentPlayerName.style.textShadow = `0 0 10px ${colorX}, 0 0 20px ${colorX}`;
    } else {
      currentPlayerName.style.color = colorO;
      currentPlayerName.style.textShadow = `0 0 10px ${colorO}, 0 0 20px ${colorO}`;
    }
  }

  // Start a new game
  function startGame(mode) {
    // Get player names and colors
    player1 = player1Input.value || "Player 1";
    player2 = player2Input.value || "Player 2";
    colorX = colorXInput.value;
    colorO = colorOInput.value;

    // Set game mode
    gameMode = mode;
    if (mode === "casual") {
      maxRounds = 1;
      roundInfo.textContent = "";
    } else if (mode === "bestOf5") {
      maxRounds = 5;
      round = 1;
      roundInfo.textContent = `Round ${round} of ${maxRounds}`;
    }

    // Reset scores for new game
    scores = { X: 0, O: 0 };
    updateScoreDisplay();

    // Initialize game
    resetBoard();
    currentPlayer = "X";
    currentPlayerName.textContent = player1;
    currentPlayerName.className = "neon-text x-symbol";
    currentPlayerName.style.color = colorX;
    currentPlayerName.style.textShadow = `0 0 10px ${colorX}, 0 0 20px ${colorX}`;

    // Show game screen
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";
    resultScreen.style.display = "none";
  }

  // Reset the game board
  function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    initializeBoard();
  }

  // Restart the current game
  function restartGame() {
    scores = { X: 0, O: 0 };
    updateScoreDisplay();
    if (gameMode === "bestOf5") {
      round = 1;
      roundInfo.textContent = `Round ${round} of ${maxRounds}`;
    }
    resetBoard();
    currentPlayer = "X";
    currentPlayerName.textContent = player1;
    currentPlayerName.className = "neon-text x-symbol";
    currentPlayerName.style.color = colorX;
    currentPlayerName.style.textShadow = `0 0 10px ${colorX}, 0 0 20px ${colorX}`;
  }

  // Show game result
  function showResult(message) {
    resultText.textContent = message;
    gameScreen.style.display = "none";
    resultScreen.style.display = "block";

    // Hide next round button for casual mode or last round
    if (gameMode === "casual" || round >= maxRounds) {
      nextRoundBtn.style.display = "none";
      finishGameBtn.textContent = "BACK TO MENU";
    } else {
      nextRoundBtn.style.display = "inline-block";
      finishGameBtn.textContent = "FINISH GAME";
    }
  }

  // Proceed to next round
  function nextRound() {
    round++;
    roundInfo.textContent = `Round ${round} of ${maxRounds}`;
    resetBoard();
    currentPlayer = "X";
    currentPlayerName.textContent = player1;
    currentPlayerName.className = "neon-text x-symbol";
    currentPlayerName.style.color = colorX;
    currentPlayerName.style.textShadow = `0 0 10px ${colorX}, 0 0 20px ${colorX}`;

    gameScreen.style.display = "block";
    resultScreen.style.display = "none";
  }

  // Finish the game and return to menu
  function finishGame() {
    if (gameMode === "bestOf5" && round < maxRounds) {
      // Early finish for best of 5
      updateLeaderboard();
    } else if (gameMode === "casual") {
      updateCasualLeaderboard();
    }

    returnToMenu();
  }

  // Return to main menu
  function returnToMenu() {
    menuScreen.style.display = "block";
    gameScreen.style.display = "none";
    resultScreen.style.display = "none";
    loadLeaderboards();
  }

  // Update score display
  function updateScoreDisplay() {
    player1Score.textContent = `${player1} (X): ${scores.X}`;
    player2Score.textContent = `${player2} (O): ${scores.O}`;

    // Apply custom colors
    player1Score.style.color = colorX;
    player1Score.style.textShadow = `0 0 5px ${colorX}`;
    player2Score.style.color = colorO;
    player2Score.style.textShadow = `0 0 5px ${colorO}`;
  }

  // Update colors during game
  function updateColors() {
    colorX = colorXInput.value;
    colorO = colorOInput.value;

    // Update current player display if in game
    if (gameScreen.style.display === "block") {
      if (currentPlayer === "X") {
        currentPlayerName.style.color = colorX;
        currentPlayerName.style.textShadow = `0 0 10px ${colorX}, 0 0 20px ${colorX}`;
      } else {
        currentPlayerName.style.color = colorO;
        currentPlayerName.style.textShadow = `0 0 10px ${colorO}, 0 0 20px ${colorO}`;
      }

      updateScoreDisplay();
    }
  }

  // Update leaderboard for best of 5
  function updateLeaderboard() {
    const winner =
      scores.X > scores.O ? player1 : scores.O > scores.X ? player2 : null;

    if (winner) {
      // Load existing leaderboard
      const leaderboard =
        JSON.parse(localStorage.getItem("bestOfFiveLeaderboard")) || [];

      // Add new winner
      leaderboard.push({
        name: winner,
        date: new Date().toLocaleDateString(),
        score: `${scores.X}-${scores.O}`,
      });

      // Save back to localStorage
      localStorage.setItem(
        "bestOfFiveLeaderboard",
        JSON.stringify(leaderboard)
      );
    }
  }

  // Update casual leaderboard
  function updateCasualLeaderboard() {
    const winner =
      scores.X > scores.O ? player1 : scores.O > scores.X ? player2 : null;

    if (winner) {
      // Load existing leaderboard
      const leaderboard =
        JSON.parse(localStorage.getItem("casualLeaderboard")) || [];

      // Add new winner
      leaderboard.push({
        name: winner,
        date: new Date().toLocaleDateString(),
      });

      // Save back to localStorage
      localStorage.setItem("casualLeaderboard", JSON.stringify(leaderboard));
    }
  }

  // Load leaderboards from localStorage
  function loadLeaderboards() {
    // Casual leaderboard
    const casualLB =
      JSON.parse(localStorage.getItem("casualLeaderboard")) || [];
    casualLeaderboard.innerHTML = "";

    if (casualLB.length === 0) {
      casualLeaderboard.innerHTML = "<li>No games played yet</li>";
    } else {
      // Show last 10 games
      casualLB
        .slice(-10)
        .reverse()
        .forEach((game) => {
          const li = document.createElement("li");
          li.textContent = `${game.name} - ${game.date}`;
          casualLeaderboard.appendChild(li);
        });
    }

    // Best of 5 leaderboard
    const bestOf5LB =
      JSON.parse(localStorage.getItem("bestOfFiveLeaderboard")) || [];
    bestOfFiveLeaderboard.innerHTML = "";

    if (bestOf5LB.length === 0) {
      bestOfFiveLeaderboard.innerHTML = "<li>No games played yet</li>";
    } else {
      // Show last 10 games
      bestOf5LB
        .slice(-10)
        .reverse()
        .forEach((game) => {
          const li = document.createElement("li");
          li.textContent = `${game.name} (${game.score}) - ${game.date}`;
          bestOfFiveLeaderboard.appendChild(li);
        });
    }
  }

  // Initialize the board on load
  initializeBoard();
});
