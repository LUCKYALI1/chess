# Real-Time Chess Game

![Chess Game Screenshot]([Screenshot 2025-09-06 195227.png](https://github.com/LUCKYALI1/chess/blob/main/Screenshot%202025-09-06%20195227.png))
*<p align="center">Please replace `Screenshot 2025-09-06 195227.png` with a screenshot of your application.</p>*

## About The Project

This is a real-time, two-player chess game built with Node.js and Socket.IO. It allows two players to connect and play a game of chess in their web browsers. The application features a clean and modern user interface with drag-and-drop functionality for moving pieces.
git 
The game state is managed on the server, ensuring that both players have a synchronized experience. The backend handles player connections, role assignments (White and Black), move validation, and turn management. The frontend dynamically updates to reflect the current state of the game, including piece positions, captured pieces, and player scores.

### Key Features

*   **Real-Time Multiplayer:** Play chess with another person in real-time.
*   **Drag-and-Drop Interface:** Easily move pieces by dragging and dropping them on the board.
*   **Turn-Based Gameplay:** The application enforces the rules of chess, allowing players to move only on their turn.
*   **Player Roles:** The first two players to connect are assigned as White and Black. Subsequent connections can spectate the game.
*   **Dynamic Labels:** The UI clearly indicates which player is "You" and which is your "Opponent".
*   **Flipped Board:** The board automatically flips for the player controlling the black pieces, providing a comfortable perspective.
*   **Score and Captured Pieces:** The UI displays the score (based on the value of captured pieces) and the list of pieces each player has captured.

## Tech Stack

This project is built with the following technologies:

*   **Backend:**
    *   [Node.js](https://nodejs.org/) - JavaScript runtime environment
    *   [Express.js](https://expressjs.com/) - Web framework for Node.js
    *   [Socket.IO](https://socket.io/) - For real-time, bidirectional communication
    *   [EJS](https://ejs.co/) - Embedded JavaScript templating for rendering HTML

*   **Frontend:**
    *   HTML5 & CSS3
    *   [Tailwind CSS](https://tailwindcss.com/) - For styling the user interface
    *   JavaScript

*   **Chess Logic:**
    *   [chess.js](https://github.com/jhlywa/chess.js) - A JavaScript library for chess move generation, validation, and game state management.

## How to Run

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username/your_repository.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd your_repository
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Run the application:**
    The project uses `nodemon` to automatically restart the server on file changes.
    ```sh
    npm run test
    ```
    Alternatively, you can run it with `node`:
    ```sh
    node app.js
    ```
5.  **Open your browser** and navigate to `http://localhost:3000`. Open two browser windows to play a game between two players.
