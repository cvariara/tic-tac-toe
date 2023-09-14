// state of the board
const gameBoard = () => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const displayBoard = () => {
    const gameContainer = document.querySelector(".game");
    gameContainer.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
      const boardCell = document.createElement("div");
      boardCell.classList.add("cell");
      boardCell.dataset.cell = i;
      boardCell.textContent = board[i];
      gameContainer.appendChild(boardCell);
    }
  };

  const fillBoardCell = (cell, player) => {
    if (board[cell] === "X" || board[cell] === "O") {
      return false;
    } else {
      board[cell] = player;
      return true;
    }
  };

  return {
    getBoard,
    displayBoard,
    fillBoardCell,
  };
};

// controls the flow of the game and win/lose scenarios
const GameController = () => {
  const board = gameBoard();
  // board.displayBoard();

  const Player = (name, type) => {
    const moves = [];
    const printString = () =>
      console.log(`I'm ${name}, and my move is ${type}`);
    return {
      name,
      type,
      moves,
      printString,
    };
  };

  const player = Player("Chris", "X");
  const ai = Player("Computer", "O");
  // player.printString();
  // ai.printString();

  const players = [
    {
      name: player.name,
      type: player.type,
    },
    {
      name: ai.name,
      type: ai.type,
    },
  ];

  let currentPlayer = players.find((player) => player.type === "X");
  const switchTurns = () => {
    // console.log(`switching ${currentPlayer.name}`)
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };
  const getCurrentPlayer = () => currentPlayer;

  const printNewRound = () => {
    board.displayBoard();
    // console.log(`${getCurrentPlayer().name}'s turn`);
  }
  
  const playRound = (cell) => {
    // handles if cell was already chosen
    if (board.fillBoardCell(cell, getCurrentPlayer().type)) {
      switchTurns();
      printNewRound();
    } else {
      return;
    }
    
    /* winning logic */
  };
  printNewRound();

  // const boardIsFull = () => {
  //   return board.getBoard().every((cell) => cell !== "");
  // };


  return {
    playRound,
    getCurrentPlayer,
    getBoard: board.getBoard,
    displayBoard: board.displayBoard
  };
};

const screenController = () => {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.game');

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const currentPlayer = game.getCurrentPlayer();

    playerTurnDiv.textContent = `${currentPlayer.name}'s turn...`;

    game.displayBoard();
  }

  function handleClick(e) {
    console.log(`FROM HANDLECLICK ${e.target.dataset.cell}`);
    const selectedCell = e.target.dataset.cell;

    if (!selectedCell) return;

    game.playRound(selectedCell);
    updateScreen();
  }
  boardDiv.addEventListener("click", handleClick);

  updateScreen();
}

screenController();
