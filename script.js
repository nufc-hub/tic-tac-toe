const playerFactory = (marker, name) => {

    return {marker,
            name};
}

const playerOne = playerFactory('X', 'Player 1');
const playerTwo = playerFactory('O', 'Player 2');

const gameLogic = (() => {
    
    //Sets the current player
    let currentPlayer = playerOne

    // This is the default board state. If win condition has been met it will change to true.
    let endGameConditionMet = false;


    //const rows = (width) => //set width of gameboard;
    //const columns = (height) => //set height of gameboard
    const boardContent = [ // 2D array that represents the game board. //
        ['','',''],
        ['','',''],
        ['','',''],
    ];

    // Controls turn order.
    const setCurrentTurn = () => {
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne; // Controls turn order.
    }

    // Checks to see if a win condition has been met.
    const checkWinCondition = (currentPlayer) => {
        
        for(let i = 0; i < 3; i++) {
            if (boardContent[i][0] === currentPlayer.marker &&
                boardContent[i][1] === currentPlayer.marker &&
                boardContent[i][2] === currentPlayer.marker) {
                
                endGameConditionMet = true
                gameBoard.setWinMessage(currentPlayer); // Indicates who the winner is.
                return;
            }            
        }

        for(let j = 0; j < 3; j++) {
            if (boardContent[0][j] === currentPlayer.marker &&
                boardContent[1][j] === currentPlayer.marker &&
                boardContent[2][j] === currentPlayer.marker) {
                
                endGameConditionMet = true;
                gameBoard.setWinMessage(currentPlayer);
                return;
            }
        }

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

    const checkTieCondition = () => { 
        const arrayIsFull = boardContent.every(row => row.every(cell => cell !== ''));

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


        //Only allows a marker to be placed when the position in the boardContent array is empty.
        if (boardContent[row][col] === '' && endGameConditionMet === false) {

            boardContent[row][col] = currentPlayer.marker; // Put the marker value into into the boardContent array at the position the cell was clicked.
            
            clickedElement.textContent = boardContent[row][col]; // Sets the text content of the cell elements to whatever the boardContent array values are.

            checkWinCondition(currentPlayer); // Checks if win condition has been met.

            checkTieCondition(); //Checks if tie condition has been met.

            setCurrentTurn(); // Next players turn

            gameBoard.setTurnMessage(currentPlayer); //Indicates which players turn it is.

            

        }
    }

    return {
        placeMarker: placeMarker
    }
})();

const gameBoard = (() => {
    
    //const boardSize = 3 // use if wanting to add ability to change board size. 
    // This could be added to the row and col variables in placeMarker function 
    // instead of using the number 3. 

    const board = document.querySelector('.game-board'); // Selects game board div.

    const cellElements = []; // This holds the .game-board children elements (i.e. the game board html cells)

    const turnMessageSelector = document.querySelector('.player');  // Selects the span element in the game message in UI.

    const setTurnMessage = (currentPlayer) => {
        const turnMessage = turnMessageSelector.textContent = currentPlayer === playerTwo ? 'Player 2' : 'Player 1';
        turnMessageSelector.textContent = turnMessage;
    }; // This is to change the text content of the game message.

    const winMessageSelector = document.querySelector('.game-message');

    //This is the text that will be displayed when a win condition has been met.
    const setWinMessage = (currentPlayer) => {
        winMessageSelector.textContent = `${currentPlayer.name}, is the winner.`
    }

    //This is the text that will be displayed when a tie has occurred.
    const setTieMessage = () => {
        winMessageSelector.textContent = `It's a tie.`;
    }

    const initializeGameBoard = () => { // Puts the game-board children elements into cellElements array.
        
        for (let i = 0; i < board.children.length; i++) {// Iterates through game-board children (i.e. class=cell) html elements.

            const cellElement = board.children[i]; //This is a single cell element on the game board.
            
            cellElements.push(board.children[i]) // Adds each child element in game-board to cellElements array. //
            
            cellElement.addEventListener('click', (event) => {
                gameLogic.placeMarker(event, cellElements);
            }); // Adds an event listener to each cellElement
            
            }
        }

    return {
        initializeGameBoard: initializeGameBoard,
        setTurnMessage: setTurnMessage,
        setWinMessage: setWinMessage,
        setTieMessage: setTieMessage
    }


})();

gameBoard.initializeGameBoard();