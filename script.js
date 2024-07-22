const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setCell = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { getBoard, setCell, resetBoard };
})();

const Player = (name, mark) => {
    return { name, mark };
};

const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return board.includes("") ? null : "Tie";
    };

    const playRound = (index) => {
        if (gameOver || !Gameboard.setCell(index, currentPlayer.mark)) return;

        DisplayController.updateBoard();
        const winner = checkWinner();
        if (winner) {
            gameOver = true;
            DisplayController.displayResult(winner);
        } else {
            switchPlayer();
            DisplayController.updateCurrentPlayer(currentPlayer.name);
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
        DisplayController.updateBoard();
    };

    return { playRound, resetGame, currentPlayer };
})();

const DisplayController = (() => {
    const gameboardDiv = document.getElementById("gameboard");
    const restartBtn = document.getElementById("restart-btn");

    const createBoard = () => {
        gameboardDiv.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.addEventListener("click", () => {
                GameController.playRound(index);
                updateBoard();
            });
            gameboardDiv.appendChild(cellDiv);
        });
    };

    const updateBoard = () => {
        const cells = gameboardDiv.children;
        Gameboard.getBoard().forEach((cell, index) => {
            cells[index].textContent = cell;
        });
    };

    const displayResult = (result) => {
        setTimeout(() => {
            alert(result === "Tie" ? "It's a Tie!" : `${result} wins!`);
        }, 100);
    };

    const updateCurrentPlayer = (player) => {
        console.log(`Current Player: ${player}`);
    };

    restartBtn.addEventListener("click", () => {
        GameController.resetGame();
        createBoard();
    });

    createBoard();

    return { updateBoard, displayResult, updateCurrentPlayer };
})();
