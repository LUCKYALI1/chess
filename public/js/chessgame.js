const socket = io();
const chess = new Chess();
const boardElement = document.querySelector('.chessboard');
const capturedByWhiteElement = document.getElementById('captured-by-white');
const capturedByBlackElement = document.getElementById('captured-by-black');
const scoreWhiteElement = document.getElementById('score-white');
const scoreBlackElement = document.getElementById('score-black');


let draggedPiece = null;
let sourceSquare = null;
let playerRole = null; // Can be 'w', 'b', or null for spectators

// Unicode map for chess pieces
const pieceUnicode = {
  pw: "♙", rw: "♖", nw: "♘", bw: "♗", qw: "♕", kw: "♔",
  pb: "♟", rb: "♜", nb: "♞", bb: "♝", qb: "♛", kb: "♚",
};

// Helper to get correct piece symbol
function getPieceUnicode(piece) {
  if (!piece) return "";
  const key = piece.type + piece.color;
  return pieceUnicode[key] || "";
}

const updateScoresAndCaptured = (gameState) => {
    scoreWhiteElement.textContent = `Score: ${gameState.score.w}`;
    scoreBlackElement.textContent = `Score: ${gameState.score.b}`;

    capturedByWhiteElement.innerHTML = "";
    gameState.captured.w.forEach(p => {
        capturedByWhiteElement.innerHTML += getPieceUnicode(p);
    });

    capturedByBlackElement.innerHTML = "";
    gameState.captured.b.forEach(p => {
        capturedByBlackElement.innerHTML += getPieceUnicode(p);
    });
};


const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === 'w' ? "white" : "black"
                );
                pieceElement.innerHTML = getPieceUnicode(square);

                // A piece is draggable if it's the player's color AND it's their turn
                pieceElement.draggable = playerRole === square.color && chess.turn() === playerRole;

                if (pieceElement.draggable) {
                    pieceElement.addEventListener("dragstart", (e) => {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", "");
                    });

                    pieceElement.addEventListener("dragend", (e) => {
                        draggedPiece = null;
                        sourceSquare = null;
                    });
                }
                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };
                    handleMove(sourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });

    if (playerRole === 'b') {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }
};

const handleMove = (source, target) => {
    const move = {
        from: `${"abcdefgh"[source.col]}${8 - source.row}`,
        to: `${"abcdefgh"[target.col]}${8 - target.row}`,
        promotion: "q",
    };

    // Emit the move to the server
    socket.emit("move", move);
};

socket.on("playerRole", (role) => {
    playerRole = role;
    if (role === 'w') {
        document.getElementById('white-player-label').textContent = "You (White)";
        document.getElementById('black-player-label').textContent = "Opponent (Black)";
    } else if (role === 'b') {
        document.getElementById('white-player-label').textContent = "Opponent (White)";
        document.getElementById('black-player-label').textContent = "You (Black)";
    }
    renderBoard();
});

socket.on("spectatorRole", () => {
    playerRole = null;
    renderBoard();
});

socket.on("boardState", (gameState) => {
    chess.load(gameState.fen);
    updateScoresAndCaptured(gameState);
    renderBoard();
});

socket.on("invalidMove", (move) => {
    console.log("Invalid move received from server:", move);
});

renderBoard();