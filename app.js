const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();

let players = {};
let capturedPieces = { w: [], b: [] };

const pieceValues = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
};

function calculateScore(pieces) {
    return pieces.reduce((total, piece) => total + (pieceValues[piece.type] || 0), 0);
}

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { title: 'Chess Game' });
});

io.on('connection', (uniquesocket) => {
  console.log('connected:', uniquesocket.id);

  // Assign roles
  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole", "b");
  } else {
    uniquesocket.emit("spectatorRole");
  }
  
  // Send initial game state
  uniquesocket.emit("boardState", {
      fen: chess.fen(),
      captured: capturedPieces,
      score: {
          w: calculateScore(capturedPieces.w),
          b: calculateScore(capturedPieces.b)
      }
  });


  // Handle disconnect
  uniquesocket.on("disconnect", () => {
    if (uniquesocket.id === players.white) {
      delete players.white;
    } else if (uniquesocket.id === players.black) {
      delete players.black;
    }
  });

  // Handle moves
  uniquesocket.on("move", (move) => {
    try {
      // Validate turn
      if (chess.turn() === 'w' && uniquesocket.id !== players.white) return;
      if (chess.turn() === 'b' && uniquesocket.id !== players.black) return;

      // Try move
      const result = chess.move(move);
      if (result) {
        if (result.captured) {
            const capturedColor = result.color === 'w' ? 'b' : 'w';
            if (result.color === 'w') { // White moved and captured a black piece
                capturedPieces.w.push({ type: result.captured, color: capturedColor });
            } else { // Black moved and captured a white piece
                capturedPieces.b.push({ type: result.captured, color: capturedColor });
            }
        }

        const gameState = {
            fen: chess.fen(),
            captured: capturedPieces,
            score: {
                w: calculateScore(capturedPieces.w),
                b: calculateScore(capturedPieces.b)
            }
        };
        io.emit('boardState', gameState);
      } else {
        console.log("Invalid move:", move);
        uniquesocket.emit("invalidMove", move);
      }
    } catch (err) {
      console.log("Error:", err);
      uniquesocket.emit("invalidMove", move);
    }
  });
});

server.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});