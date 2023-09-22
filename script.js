const playerFactory = (marker) => {
    return {marker};
}

const playerOne = playerFactory('');
const playerTwo = playerFactory('');

const gameLogic = (() => {
    //const rows = (width) => //set width of gameboard;
    //const columns = (height) => //set height of gameboard
    let boardContent = [ // 2D array that represents the game board. //
        ['','',''],
        ['','',''],
        ['','',''],
    ];
    
    //Sets the current player
    let currentPlayer = playerOne;

    // Set to true when a first marker is placed in placeMarker function.
    let gameStarted = false;

    //As switch to let the computer know when to take its turn.
    let playerTurnComplete = false

    // Returns true when a win is met.
    let isWin = false;

    // Returns true when a tie is met.
    let isTie = false;

    //Use this to pass currentPlayer variable to the gameBoard module.
    //This is so currentPlayer variable does not need to be exposed outside gameLogic module.
    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    // Controls turn order.
    const setCurrentPlayer = () => {
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne; // Controls turn order.
    }

    const isGameOver = () => isWin || isTie;

    //This checks to make sure no cell is empty in the array.
    const isBoardFull = () => boardContent.every(row => row.every(cell => cell !== ''));


    // This is to be passed to event listener in gameBoard module.
    // Used to select starting player.
    const setMarkerX = () => {
        // This if statements prevents a player switching markers once the game has started.
        if(gameStarted === true) {
            return;
        } else {
            playerOne.marker = 'X';
            playerTwo.marker = 'O'
            currentPlayer = playerOne;
            gameBoard.setTurnMessage(currentPlayer);
        }
    }

    // This is to be passed to event listener in gameBoard module.
    // Used to select starting player.
    const setMarkerO = () => {
        // This if statements prevents a player switching markers once the game has started.
        if(gameStarted === true) {
            return;
        } else {
            playerOne.marker = 'O';
            playerTwo.marker = 'X';
            currentPlayer = playerOne;
            gameBoard.setTurnMessage(currentPlayer);
        }
    }


    // Will be added to an event listener in order to reset the game board.
    const resetBoard = (board) => {
        // Empties cells in 2d array.
        boardContent = [
            ['','',''],
            ['','',''],
            ['','',''],
        ];

        //Loops through the cells in the DOM and clears the text content.
        for (let i = 0; i < board.children.length; i++) {
            board.children[i].textContent = '';
        }
        
        // Sets variables back to starting values.
        gameStarted = false;
        playerTurnComplete = false;
        isWin = false;
        isTie = false;
        setMarkerX();

        gameLogic.boardContent = boardContent;

    }


    // Next turn. Switches player and sets subtext to match player marker.
    const setNextTurn = () => {
        if (isWin !== true && isTie !== true) {
            setCurrentPlayer(); // Next players turn.
            gameBoard.setTurnMessage(currentPlayer);
        }
    }

    // Checks for win, tie and continue game conditions.
    const checkGameState = (currentPlayer) => {
        const winner = checkWinCondition(currentPlayer);
        const tie = checkTieCondition();
        if (winner) {
            gameBoard.setWinMessage(currentPlayer); // Indicates who the winner is.
            isWin = true;
            return true;
        } else if (tie) {
            gameBoard.setTieMessage();
            isTie = true;
            return true;
        } else {
            return false;
        }
    }

    // Checks to see if a win condition has been met.
    const checkWinCondition = (currentPlayer) => {
        
        for(let i = 0; i < 3; i++) {
            // Horizontal
            if (boardContent[i][0] === currentPlayer.marker &&
                boardContent[i][1] === currentPlayer.marker &&
                boardContent[i][2] === currentPlayer.marker) {
                
                return true;
            }            
        }
        //vertical
        for(let j = 0; j < 3; j++) {
            if (boardContent[0][j] === currentPlayer.marker &&
                boardContent[1][j] === currentPlayer.marker &&
                boardContent[2][j] === currentPlayer.marker) {
                
                return true;
            }
        }
        //Diagonal
        if(boardContent[0][0] === currentPlayer.marker &&
            boardContent[1][1] === currentPlayer.marker &&
            boardContent[2][2] === currentPlayer.marker ||
            boardContent[0][2] === currentPlayer.marker &&
            boardContent[1][1] === currentPlayer.marker &&
            boardContent[2][0] === currentPlayer.marker) {

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

    const playerTurn = (clickedElement, row, col) => {
        boardContent[row][col] = currentPlayer.marker; // Put the marker value into into the boardContent array at the position the cell was clicked.
            
        clickedElement.textContent = boardContent[row][col]; // Sets the text content of the cell elements to whatever the boardContent array values are.

        checkGameState(currentPlayer); // Checks if win condition has been met.

        if (!checkGameState(currentPlayer)) {
            setNextTurn();

            // Switches to true so that computer can take its turn.
            playerTurnComplete = true;
        }
        
        
    }

    const computerTurn = (cellElements, newRow, newCol) => {

        // Add the marker to the boardContent array
        boardContent[newRow][newCol] = currentPlayer.marker;

        //Adds player marker to the DOM
        const addRowCol = newRow * 3 + newCol;

        
        // Add the current players marker to the DOM cell element.
        cellElements[addRowCol].textContent = currentPlayer.marker;

        checkGameState(currentPlayer); // Checks if win condition has been met.

        checkTieCondition(); //Checks if tie condition has been met.

        setNextTurn();

        // Switches to false when computer turn is over.
        playerTurnComplete = false;
    }

    const placeMarker = (event, cellElements) => {
 
        const clickedElement = event.target; // event.target is the element that was clicked
        const cellIndex = cellElements.indexOf(clickedElement); // This is to determine the clicked cells position - find it's index. 
        const row = Math.floor(cellIndex / 3);
        const col = cellIndex % 3;

        // This is used in the setMarkerX/Two function. It's to prevent a player switching markers once the game has started.
        if(gameStarted === false) {
            gameStarted = true;
        }

        //Only allows a marker to be placed when the position in the boardContent array is empty.
        if (boardContent[row][col] === '' && isWin === false && isTie === false) {
            playerTurn(clickedElement, row, col);
            
            // The playerTurnComplete === true is needed to execute this code
            // The isTie === false prevents code executing on tie. Thus preventing an infinite loop due to the do...while loop in placeComputerMaker().
            if (playerTurnComplete === true && isWin === false && isTie === false) {
                placeComputerMarker(cellElements);
            }
        }
    }


    const placeComputerMarker = (cellElements) => {
        let newRow;
        let newCol;

        do {newRow = Math.floor(Math.random()* 3);
            newCol = Math.floor(Math.random()* 3);
        } while (boardContent[newRow][newCol] !== '');
        
        if(gameStarted === false) {
            gameStarted = true;
        }

        if (boardContent[newRow][newCol] === '' && isWin === false && isTie === false) {
            computerTurn(cellElements, newRow, newCol);
        }
    }



    return {
        boardContent: boardContent, // delete after debug
        getCurrentPlayer: getCurrentPlayer,
        setMarkerX: setMarkerX,
        setMarkerO: setMarkerO,
        resetBoard: resetBoard,
        placeMarker: placeMarker
    }
})();









const gameBoard = (() => {

    //Selects P element.
    const subtext = document.querySelector('.game-message');

    const setTurnMessage = (currentPlayer) => {
        const turnMessage = `${currentPlayer.marker}, take your turn.`
        subtext.textContent = turnMessage;
    }; // This is to change the text content of the game message.

    //This is the text that will be displayed when a win condition has been met.
    const setWinMessage = (currentPlayer) => {
        subtext.textContent = `${currentPlayer.marker}, is the winner.`
    }

    //This is the text that will be displayed when a tie has occurred.
    const setTieMessage = () => {
        subtext.textContent = `It's a tie.`;
    }

    //const boardSize = 3 // use if wanting to add ability to change board size. 
    // This could be added to the row and col variables in placeMarker function 
    // instead of using the number 3. 

    const board = document.querySelector('.game-board'); // Selects game board div.
    
    let cellElements = []; // This holds the .game-board children elements (i.e. the game board html cells)

    const initializeGameBoard = () => { // Puts the game-board children elements into cellElements array.
        
        for (let i = 0; i < board.children.length; i++) {// Iterates through game-board children (i.e. class=cell) html elements.

            const cellElement = board.children[i]; //This is a single cell element on the game board.
            
            cellElements.push(board.children[i]) // Adds each child element in game-board to cellElements array. //
            
            cellElement.addEventListener('click', (event) => {
                gameLogic.placeMarker(event, cellElements);
            }); // Adds an event listener to each cellElement
        }
    }

    // Html player select buttons.
    const startingPlayerX = document.querySelector('.player-x');
    const startingPlayerO = document.querySelector('.player-o');

    //Selects starting PlayerOne on click.
    startingPlayerX.addEventListener('click', () => {
        gameLogic.getCurrentPlayer();
        gameLogic.setMarkerX();
    });

    //Selects starting PlayerTwo on click.
    startingPlayerO.addEventListener('click', () => {
        gameLogic.getCurrentPlayer();
        gameLogic.setMarkerO();
    });
    
    // Html reset button.
    const restartButton = document.querySelector('.restart-button');

    // Restarts game on click.
    restartButton.addEventListener('click', () => {
        // Clears boardContent array variable & board (containing DOM cell elements) variable contents.
        gameLogic.resetBoard(board);
    });



    return {
        initializeGameBoard: initializeGameBoard,
        setTurnMessage: setTurnMessage,
        setWinMessage: setWinMessage,
        setTieMessage: setTieMessage
    }


})();

gameBoard.initializeGameBoard();