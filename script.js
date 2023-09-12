const playerFactory = (marker) => {

    return {marker};
}

const playerOne = playerFactory('X');
const playerTwo = playerFactory('O');

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

    // This is the default board state. If win condition has been met it will change to true.
    let endGameConditionMet = false;

    //Use this to pass currentPlayer variable to the gameBoard module.
    //This is so currentPlayer variable does not need to be exposed outside gameLogic module.
    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    // This is to be passed to event listener in gameBoard module.
    // Used to select starting player.
    const setPlayerOne = () => {
        // This if statements prevents a player switching markers once the game has started.
        if(gameStarted === true) {
            return;
        } else {
            currentPlayer = playerOne;
            gameBoard.setTurnMessage(currentPlayer);
        }
    }

    // This is to be passed to event listener in gameBoard module.
    // Used to select starting player.
    const setPlayerTwo = () => {
        // This if statements prevents a player switching markers once the game has started.
        if(gameStarted === true) {
            return;
        } else {
            currentPlayer = playerTwo;
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
        endGameConditionMet = false;
        setPlayerOne();
    }

    // Controls turn order.
    const setCurrentTurn = () => {
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne; // Controls turn order.
    }

    // Checks to see if a win condition has been met.
    const checkWinCondition = (currentPlayer) => {
        
        for(let i = 0; i < 3; i++) {
            // Horizontal
            if (boardContent[i][0] === currentPlayer.marker &&
                boardContent[i][1] === currentPlayer.marker &&
                boardContent[i][2] === currentPlayer.marker) {
                
                endGameConditionMet = true
                gameBoard.setWinMessage(currentPlayer); // Indicates who the winner is.
                return;
            }            
        }
        //vertical
        for(let j = 0; j < 3; j++) {
            if (boardContent[0][j] === currentPlayer.marker &&
                boardContent[1][j] === currentPlayer.marker &&
                boardContent[2][j] === currentPlayer.marker) {
                
                endGameConditionMet = true;
                gameBoard.setWinMessage(currentPlayer);
                return;
            }
        }
        //Diagonal
        if(boardContent[0][0] === currentPlayer.marker &&
            boardContent[1][1] === currentPlayer.marker &&
            boardContent[2][2] === currentPlayer.marker ||
            boardContent[0][2] === currentPlayer.marker &&
            boardContent[1][1] === currentPlayer.marker &&
            boardContent[2][0] === currentPlayer.marker) {

                endGameConditionMet = true;
                gameBoard.setWinMessage(currentPlayer);
            }
    }

    // This checks for a tie.
    const checkTieCondition = () => { 
        const arrayIsFull = boardContent.every(row => row.every(cell => cell !== '')); //This checks to make sure no cell is empty in the array.

        if(arrayIsFull) {
            endGameConditionMet = true;
            gameBoard.setTieMessage();
        }
    }

    const placeMarker = (event, cellElements) => {
 
        const clickedElement = event.target; // event.target is the element that was clicked
        const cellIndex = cellElements.indexOf(clickedElement); // This is to determine the clicked cells position - find it's index. 
        const row = Math.floor(cellIndex / 3);
        const col = cellIndex % 3;

        // This is used in the setPlayerOne/Two function. It's to prevent a player switching markers once the game has started.
        if(gameStarted === false) {
            gameStarted = true;
        }

        //Only allows a marker to be placed when the position in the boardContent array is empty.
        if (boardContent[row][col] === '' && endGameConditionMet === false) {

            boardContent[row][col] = currentPlayer.marker; // Put the marker value into into the boardContent array at the position the cell was clicked.
            
            clickedElement.textContent = boardContent[row][col]; // Sets the text content of the cell elements to whatever the boardContent array values are.

            checkWinCondition(currentPlayer); // Checks if win condition has been met.

            checkTieCondition(); //Checks if tie condition has been met.

            setCurrentTurn(); // Next players turn.
            

        }
    }

    return {
        boardContent: boardContent, //remove after debugging
        getCurrentPlayer: getCurrentPlayer,
        setPlayerOne: setPlayerOne,
        setPlayerTwo: setPlayerTwo,
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
        gameLogic.setPlayerOne();
    });

    //Selects starting PlayerTwo on click.
    startingPlayerO.addEventListener('click', () => {
        gameLogic.getCurrentPlayer();
        gameLogic.setPlayerTwo();
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