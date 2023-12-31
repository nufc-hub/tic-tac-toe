const playerFactory = (marker) => {
    return {marker};
}

const humanPlayer = playerFactory('X');
const computerPlayer = playerFactory('O');


// This module is responsible for the game logic.
const gameLogic = (() => {

    // 2D array that represents the game board.
    let boardContent = [
        ['','',''],
        ['','',''],
        ['','',''],
    ];

    // Allows selection of easy or hard mode.
    const gameModes = {
        EASY: 'easy',
        HARD: 'hard'
    }

    // Default game mode is set to easy.
    let currentGameMode = gameModes.EASY;
    
    // Sets the current player
    let currentPlayer = humanPlayer;

    // This is passed to the setMarkerO function in gameBoard.
    const changePlayer = (player) => {
        currentPlayer = player;
    }

    // Controls turn order.
    const setCurrentPlayer = () => {
        currentPlayer === humanPlayer ? currentPlayer = computerPlayer : currentPlayer = humanPlayer; // Controls turn order.
    }

    /*
       Set to true when first marker is placed on game board.
       Default setting false. Sets to false on reset.
    */
    let gameStarted = false;

    /* 
       In place marker functions this toggles gameStarted to true
       when first marker is placed.
    */
    const toggleGameStarted = () => {
        gameStarted = !gameStarted;
    }

    // Passed into the setMarkerX/O functions in gameBoard.
    const isGameStarted = () => {
        if (gameStarted === true) {
            return true;
        };
    }

    // This checks to make sure no cell is empty in the array.
    const isBoardFull = () => boardContent.every(row => row.every(cell => cell !== ''));
    

    // Next turn. Switches player and sets subtext to match player marker.
    const setNextTurn = () => {
        if (!checkGameState()) {
            // Next players turn.
            setCurrentPlayer();
            gameBoard.setTurnMessage(currentPlayer);
        }
    }

    // Checks for win, tie and continue game conditions.
    const checkGameState = () => {
        const winner = checkWinCondition(currentPlayer.marker); // Pass currentPlayer's marker
        const tie = checkTieCondition();
        if (winner) {
            gameBoard.setWinMessage(currentPlayer); // Indicates who the winner is.
            return true;
        } else if (tie) {
            gameBoard.setTieMessage();
            return true;
        } else {
            return false;
        }
    }
    

    // Checks to see if a win condition has been met.
    const checkWinCondition = (player) => {
        for(let i = 0; i < 3; i++) {
            // Horizontal
            if (boardContent[i][0] === player &&
                boardContent[i][1] === player &&
                boardContent[i][2] === player) {
                
                return true;
            }            
        }
        // Vertical
        for(let j = 0; j < 3; j++) {
            if (boardContent[0][j] === player &&
                boardContent[1][j] === player &&
                boardContent[2][j] === player) {
                
                return true;
            }
        }
        // Diagonal
        if ((boardContent[0][0] === player &&
             boardContent[1][1] === player &&
             boardContent[2][2] === player) ||
            (boardContent[0][2] === player &&
             boardContent[1][1] === player &&
             boardContent[2][0] === player)) {
            return true;
        }
    
        return false;
    }
    

    // This checks for a tie.
    const checkTieCondition = () => { 
        if(isBoardFull()) {
            return true;
        }
        
    }

    //Logic for a player turn.
    const playerTurn = (clickedElement, row, col) => {
        /*
           Puts the marker value into the boardContent array 
           at the position the cell was clicked.
        */
        boardContent[row][col] = currentPlayer.marker; 
        /*
           Sets the text content of the cell elements to whatever 
           the boardContent array values are.
        */
        clickedElement.textContent = boardContent[row][col];

        // Checks if win condition has been met.
        checkGameState();

        if (!checkGameState()) {
            setNextTurn();
        }
        
        
    }

    // Logic for a computer turn.
    const computerTurn = (cellElements, newRow, newCol) => {

        // Add the marker to the boardContent array.
        boardContent[newRow][newCol] = currentPlayer.marker;

        // Adds player marker to the DOM.
        const addRowCol = newRow * 3 + newCol;

        // Add the current players marker to the DOM cell element.
        cellElements[addRowCol].textContent = currentPlayer.marker;

        checkGameState(); // Checks if win condition has been met.

        setNextTurn();
    }


    const placeHumanMarker = (event, cellElements) => {
 
        // event.target is the element that was clicked.
        const clickedElement = event.target;
        // This is to determine the clicked cells position - find it's index.
        const cellIndex = cellElements.indexOf(clickedElement); 
        const row = Math.floor(cellIndex / 3);
        const col = cellIndex % 3;
        /* 
           This is used  to prevent a player switching 
           markers once the game has started.
        */
        if(gameStarted === false) {
            toggleGameStarted();
        }
        /*
           Only allows a marker to be placed when 
           the position in the boardContent array is empty.
        */
        if (boardContent[row][col] === '' && currentPlayer === humanPlayer && !checkGameState()) {
            playerTurn(clickedElement, row, col);  
        }
    }


    //Computer AI for easy mode.
    const AIMarkerEasy = (cellElements) => {
        let newRow;
        let newCol;
    
        do {newRow = Math.floor(Math.random()* 3);
            newCol = Math.floor(Math.random()* 3);
        } while (boardContent[newRow][newCol] !== '');
        
        computerTurn(cellElements, newRow, newCol);
    }

    // Computer AI for hard mode.
    const minimax = (board, depth, maximizingPlayer) => {
        const scores = {
            X: -10,
            O: 10,
            tie: 0
        };
    
        const currentPlayer = maximizingPlayer ? computerPlayer : humanPlayer;
        const opponentPlayer = maximizingPlayer ? humanPlayer : computerPlayer;
    
        if (checkWinCondition(computerPlayer.marker)) {
            return scores.O;
        } else if (checkWinCondition(humanPlayer.marker)) {
            return scores.X;
        } else if (isBoardFull()) {
            return scores.tie;
        }
    
        let bestScore = maximizingPlayer ? -Infinity : Infinity;
        let bestMove = null;
        /*
           Loops through all empty cells on the board.
           Simulates placing the currentPlayers marker in the cell.
           Then makes a recursive call to minimax with the board 
           in its updated state.
        */
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    board[row][col] = currentPlayer.marker;
                    const score = minimax(board, depth + 1, !maximizingPlayer);
                    board[row][col] = ''; // Undo the move
    
                    if ((maximizingPlayer && score > bestScore) || (!maximizingPlayer && score < bestScore)) {
                        bestScore = score;
                        bestMove = { row, col };
                    }
                }
            }
        }
    
        if (depth === 0) {
            /* 
               The return value represents the
               best move to take at the top-level of the tree.
             */
            return bestMove; 
        }
        
        // This is the score calculated at the current node.
        return bestScore;
    };

    /*
       Finds best move for computer.
       Calls the minimax function on each available move,
       then returns the best move. 
    */
    const findBestMove = (board) => {
        const bestMove = minimax(board, 0, true);
        return bestMove;
    };

    // Logic to place computer marker.
    const placeComputerMarker = (cellElements) => {
        if(gameStarted === false) {
            toggleGameStarted();
        }

        if (checkGameState()) {
            return;
        } else if (currentPlayer === computerPlayer && gameLogic.currentGameMode === gameModes.EASY) {
            AIMarkerEasy(cellElements);
        }  else if (currentPlayer === computerPlayer && gameLogic.currentGameMode === gameModes.HARD) {
            const bestMove = findBestMove(boardContent);
            computerTurn(cellElements, bestMove.row, bestMove.col);
        }
    };   
    
    const resetGame = () => {
        // Empties cells in 2d array.
        boardContent = [
            ['','',''],
            ['','',''],
            ['','',''],
        ];
        // Sets default game conditions.
        toggleGameStarted();
        currentPlayer = humanPlayer;
    }



    return {
        boardContent: boardContent,
        currentPlayer: currentPlayer,
        changePlayer: changePlayer,
        gameModes: gameModes,
        currentGameMode: currentGameMode,
        isGameStarted: isGameStarted,
        placeHumanMarker: placeHumanMarker,
        placeComputerMarker: placeComputerMarker,
        resetGame: resetGame
    }
})();








// Responsible for UI and board initialization.
const gameBoard = (() => {
    // CODE FOR GAME MESSAGES (SUBTEXT).

    // Selects P element.
    const subtext = document.querySelector('.game-message');

    // This is to change the text content of the game message.
    const setTurnMessage = (currentPlayer) => {
        const turnMessage = `${currentPlayer.marker}, take your turn.`
        subtext.textContent = turnMessage;
    }; 

    // This is the text that will be displayed when a win condition has been met.
    const setWinMessage = (currentPlayer) => {
        subtext.textContent = `${currentPlayer.marker}, is the winner.`
    }

    // This is the text that will be displayed when a tie has occurred.
    const setTieMessage = () => {
        subtext.textContent = `It's a tie.`;
    }

    // CODE FOR BOARD INITIALIZATION.

    const board = document.querySelector('.game-board'); // Selects game board div.
    
    let cellElements = []; // This holds the .game-board children elements (i.e. the game board html cells)

    const initializeGameBoard = () => { // Puts the game-board children elements into cellElements array.
        
        for (let i = 0; i < board.children.length; i++) {// Iterates through game-board children (i.e. class=cell) html elements.

            const cellElement = board.children[i]; //This is a single cell element on the game board.
            
            cellElements.push(board.children[i]) // Adds each child element in game-board to cellElements array. //
            
            cellElement.addEventListener('click', (event) => {
                setTimeout(() => {
                    gameLogic.placeHumanMarker(event, cellElements);
                }, 0);
                setTimeout(() => {
                    gameLogic.placeComputerMarker(cellElements);
                }, 700);
            });
        }
        
        toggleIndicatorColor();
    }

    // CODE FOR BUTTONS.

    const easyIndicator = document.getElementById('easy-indicator');
    const hardIndicator = document.getElementById('hard-indicator');
    const playerXIndicator = document.getElementById('player-x-indicator');
    const playerOIndicator = document.getElementById('player-o-indicator');

    // Toggles indicators color depending on mode selected.
    const toggleIndicatorColor = () => {
        if (gameLogic.currentGameMode === gameLogic.gameModes.EASY) {
            easyIndicator.style.backgroundColor = '#884AB2';
            hardIndicator.style.backgroundColor = '#f0eef7';
        } else if (gameLogic.currentGameMode === gameLogic.gameModes.HARD) {
            hardIndicator.style.backgroundColor = '#884AB2';
            easyIndicator.style.backgroundColor = '#f0eef7';
        }

        if (gameLogic.currentPlayer.marker === 'X') {
            playerXIndicator.style.backgroundColor = '#884AB2';
            playerOIndicator.style.backgroundColor = '#f0eef7';
        } else if (gameLogic.currentPlayer.marker === 'O') {
            playerOIndicator.style.backgroundColor = '#884AB2';
            playerXIndicator.style.backgroundColor = '#f0eef7';
        }
    }

    // Easy game-mode.
    const easyMode = document.querySelector('.easy-mode');
    // Hard game-mode.
    const hardMode = document.querySelector('.hard-mode');
    // Sets the game mode.
    const setGameMode = (mode) => {
        gameLogic.currentGameMode = mode;
    }

    // Selects easy game-mode.
    easyMode.addEventListener('click', () => {
        resetBoard();
        setGameMode(gameLogic.gameModes.EASY);
        toggleIndicatorColor()
    });

    // Selects hard game-mode.
    hardMode.addEventListener('click', () => {
        console.log('Clicked on Hard Mode');
        resetBoard();
        setGameMode(gameLogic.gameModes.HARD)
        toggleIndicatorColor()
    });

    // Html player select buttons.
    const humanPlayerX = document.querySelector('.player-x');
    const humanPlayerO = document.querySelector('.player-o');

    // Logic for setting humanPlayer to marker X.
    const setMarkerX = () => {
        if(gameLogic.isGameStarted()){
            resetBoard();
        } 
        humanPlayer.marker = 'X';
        computerPlayer.marker = 'O';
        gameLogic.currentPlayer = humanPlayer;
        setTurnMessage(gameLogic.currentPlayer);
       
    }

    // Logic for setting humanPlayer to marker O.
    const setMarkerO = (cellElements) => {
        if(gameLogic.isGameStarted()){
            resetBoard();
        } 
        humanPlayer.marker = 'O';
        computerPlayer.marker = 'X';
        gameLogic.changePlayer(computerPlayer);
        setTurnMessage(gameLogic.currentPlayer);
        console.log("currentPlayer:", gameLogic.currentPlayer);
        setTimeout(() => {
            // Computer takes first move.
            gameLogic.placeComputerMarker(cellElements);
        }, 300);  
    }

    // humanPlayer plays as markerX when clicked.
    humanPlayerX.addEventListener('click', () => {
        gameLogic.isGameStarted();
        // Resets board if game has started. 
            setMarkerX();
            toggleIndicatorColor();
    });

    // humanPlayer plays as markerO when clicked.
    humanPlayerO.addEventListener('click', () => {
        setMarkerO(cellElements);
        toggleIndicatorColor();
    });
    
    // Restart button html element.
    const restartButton = document.querySelector('.restart-button');

    const resetBoard = () => {
        
        gameLogic.resetGame();

        // Loops through the cells in the DOM and clears the text content.
        for (let i = 0; i < board.children.length; i++) {
            board.children[i].textContent = '';
        }

        // Resets the game so human player starts as X marker.
        setMarkerX();
    }

    // Restarts game on click.
    restartButton.addEventListener('click', () => {
        /*
           Clears boardContent array variable & 
           board (containing DOM cell elements) variable contents.
        */
        resetBoard();
        toggleIndicatorColor();
    });

    return {
        initializeGameBoard: initializeGameBoard,
        setTurnMessage: setTurnMessage,
        setWinMessage: setWinMessage,
        setTieMessage: setTieMessage,
        setMarkerX: setMarkerX
    }
})();

gameBoard.initializeGameBoard();