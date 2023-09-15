// state of the board
const gameBoard = () => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setBoard = (newBoard) => {
    for (let i = 0; i < 9; i++) {
      board[i] = newBoard[i];
    }
  };

  const displayBoard = () => {
    const gameContainer = document.querySelector(".game");
    gameContainer.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
      const boardCell = document.createElement("div");
      boardCell.classList.add("cell");
      if (i === 2 || i === 5) {
        boardCell.classList.add("no-r");
      } else if (i === 6 || i === 7) {
        boardCell.classList.add("no-b");
      } else if (i === 8) {
        boardCell.classList.add("no-b");
        boardCell.classList.add("no-r");
      }
      boardCell.dataset.cell = i;
      boardCell.textContent = board[i];
      gameContainer.appendChild(boardCell);
    }
  };

  const fillBoardCell = (cell, player) => {
    if (board[cell] === "X" || board[cell] === "O") {
      return false;
    } else {
      board[cell] = player.type;
      player.moves.push(cell);
      player.moves.sort();
      return true;
    }
  };

  return {
    getBoard,
    setBoard,
    displayBoard,
    fillBoardCell,
  };
};

// controls the flow of the game and win/lose scenarios
const GameController = () => {
  const board = gameBoard();

  const Player = (name, type) => {
    const moves = [];
    return {
      name,
      type,
      moves,
    };
  };

  const player = Player("Player 1", "X");
  const ai = Player("Player 2", "O");

  const players = [
    {
      name: player.name,
      type: player.type,
      moves: player.moves,
    },
    {
      name: ai.name,
      type: ai.type,
      moves: ai.moves,
    },
  ];

  let currentPlayer = players.find((player) => player.type === "X");
  const switchTurns = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const getCurrentPlayer = () => currentPlayer;

  const printNewRound = () => {
    board.displayBoard();
  };

  const playRound = (cell) => {
    // handles if cell was already chosen
    if (board.fillBoardCell(cell, getCurrentPlayer())) {
      /* winning logic */
      if (checkWin(getCurrentPlayer())) {
        console.log(`${getCurrentPlayer().name} wins!`);
        return;
      }
      if (boardIsFull()) {
        console.log(`Tie game!`);
        return;
      }

      switchTurns();
      printNewRound();
    } else {
      return;
    }
  };
  printNewRound();

  const boardIsFull = () => {
    return board.getBoard().every((cell) => cell !== "");
  };

  const checkWin = (player) => {
    const nums = player.moves.map((str) => parseInt(str));
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // checks to see if the players movies are in the winningCombos
    const foundCombo = winningCombos.find((combo) =>
      combo.every((elem) => nums.includes(elem))
    );

    if (foundCombo) {
      return true;
    } else {
      return false;
    }
  };

  return {
    playRound,
    getCurrentPlayer,
    setBoard: board.setBoard,
    displayBoard: board.displayBoard,
    checkWin,
    boardIsFull,
  };
};

// controls to display content on the screen
const ScreenController = () => {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".game");
  const info = document.querySelector(".info");

  const updateScreen = () => {
    const currentPlayer = game.getCurrentPlayer();
    boardDiv.textContent = "";

    playerTurnDiv.textContent = `${currentPlayer.name}'s turn...`;

    game.displayBoard();
  };

  const restartGame = () => {
    game.setBoard(["", "", "", "", "", "", "", "", ""]);
    restart.remove();
    ScreenController();
  };

  const restart = document.createElement("button");
  restart.classList.add("restart");
  restart.textContent = "Restart Game";
  restart.addEventListener("click", restartGame);

  function handleClick(e) {
    const selectedCell = e.target.dataset.cell;

    if (!selectedCell || game.checkWin(game.getCurrentPlayer())) return;

    game.playRound(selectedCell);
    updateScreen();

    if (game.checkWin(game.getCurrentPlayer())) {
      playerTurnDiv.textContent = `${game.getCurrentPlayer().name} Wins!`;
      boardDiv.removeEventListener("click", handleClick);
      info.appendChild(restart);
      return;
    }

    if (game.boardIsFull()) {
      playerTurnDiv.textContent = `Tie Game!`;
      boardDiv.removeEventListener("click", handleClick);
      info.appendChild(restart);
      return;
    }
  }

  boardDiv.addEventListener("click", handleClick);

  updateScreen();
};

ScreenController();
