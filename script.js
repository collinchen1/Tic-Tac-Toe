let currentPlayer = "X";
let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];
var winCounts = { "X": 0, "O": 0 };
let enableAI = false; 

document.getElementById("toggleAI").addEventListener("click", function() {
  enableAI = !enableAI; 
  updateAIStatus(); 
});

document.getElementById("resetGame").addEventListener("click", function() {
  resetGame();
});

function handleClick(row, col) {
  if (!board[row][col]) {
    board[row][col] = currentPlayer;
    document.querySelector(`.b${row * 3 + col + 1}`).value = currentPlayer;
    if (checkWin()) {
      winCounts[currentPlayer]++;
      bestCheck();
    } else if (checkDraw()) {
      document.querySelector(`.current-player`).textContent = `It's a draw. Try Again!`;
      resetGame();
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      document.querySelector(`.current-player`).textContent = `Current Player is  ${currentPlayer}.`;
      if (currentPlayer === "O" && enableAI) {
        let [aiRow, aiCol] = findBestMove();
        handleClick(aiRow, aiCol);
      }
    }
  }
}

function changeWins() {
  if (currentPlayer == "X") {
    document.querySelector(`.x-wins`).textContent = `X Wins: ${winCounts[currentPlayer]}`;
  } else if (currentPlayer == "O") {
    document.querySelector(`.o-wins`).textContent = `O Wins: ${winCounts[currentPlayer]}`;
  }
}

function checkWin() {
  for (let i = 0; i < 3; i++) {
    //check row
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== "") {
      return true;
    }
    //check column
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== "") {
      return true;
    }
  }
  //check diag
  if ((board[0][0] === board[1][1] && board[1][1] === board[2][2] ||
    board[0][2] === board[1][1] && board[1][1] === board[2][0]) && board[1][1] !== "") {
    return true;
  }
  return false;
}

function checkDraw() {
  for (let row of board) {
    for (let cell of row) {
      if (cell === "") {
        return false;
      }
    }
  }
  return true;
}

function resetGame() {
  resetBoard();
  winCounts = { "X": 0, "O": 0 };
  document.querySelector(`.x-wins`).textContent = `X Wins: 0`;
  document.querySelector(`.o-wins`).textContent = `O Wins: 0`;
}

function resetBoard() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];
  currentPlayer = "X";
  document.querySelectorAll('input[type="button"]').forEach(button => {
    button.value = "";
  });
}

function bestCheck() {
  if (winCounts[currentPlayer] == 1) {
    document.querySelector(`.current-player`).textContent = `${currentPlayer} Won!`;
    changeWins();
    resetBoard();
  } else if (winCounts[currentPlayer] == 2) {
    document.querySelector(`.current-player`).textContent = `${currentPlayer} won 2 in a row!`;
    changeWins();
    resetGame();
  } else {
    resetBoard();
  }
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        board[i][j] = 'O';
        let score = minimax(board, 0, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = [i, j];
        }
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWin()) {
    return isMaximizing ? -10 + depth : 10 - depth;
  } else if (checkDraw()) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function updateAIStatus() {
  const aiStatus = document.getElementById("aiStatus");
  aiStatus.textContent = enableAI ? "AI: On" : "AI: Off";
  aiStatus.className = enableAI ? "ai-status enabled" : "ai-status disabled";
}