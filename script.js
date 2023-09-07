const playerFactory = (marker, name) => {
    const declareWinner = () => console.log(`${marker} is the winner.`);

    return {marker,
            name,
            declareWinner,};
}

const playerOne = playerFactory('X', 'Player 1');
const playerTwo = playerFactory('O', 'Player 2');

const gameLogic = (() => {
    
    let currentPlayer = playerOne; //Sets the current player

    //const rows = (width) => //set width of gameboard;
    //const columns = (height) => //set height of gameboard
    const boardContent = [ // 2D array that represents the game board. //
        ['','',''],
        ['','',''],
        ['','',''],
    ];

    const setCurrentTurn = () => {
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne; // Controls turn order.
    }

    const checkWinCondition = (boardContent, currentPlayer) => {
        
        for(let i = 0; i < 3; i++) {
            if (boardContent[i][0] === currentPlayer.marker &&
                boardContent[i][1] === currentPlayer.marker &&
                boardContent[i][2] === currentPlayer.marker) {
                
                gameBoard.setWinMessage(currentPlayer);
            }            
        }

        for(let j = 0; j < 3; j++) {
            if (boardContent[0][j] === currentPlayer.marker &&
                boardContent[1][j] === currentPlayer.marker &&
                boardContent[2][j] === currentPlayer.marker) {
                
                gameBoard.setWinMessage(currentPlayer);
            }
        }

        if(boardContent[0][0] === currentPlayer.marker &&
            boardContent[1][1] === currentPlayer.marker &&
            boardContent[2][2] === currentPlayer.marker ||
            boardContent[0][2] === currentPlayer.marker &&
            boardContent[1][1] === currentPlayer.marker &&
            boardContent[2][0] === currentPlayer.marker) {

                gameBoard.setWinMessage(currentPlayer);
            }
    }
 
    const placeMarker = (event, cellElements) => {
 
        const clickedElement = event.target; // event.target is the element that was clicked
        const cellIndex = cellElements.indexOf(clickedElement); // This is to determine the clicked cells position - find it's index. 
        const row = Math.floor(cellIndex / 3);
        const col = cellIndex % 3;


        //Only allows a marker to be placed when the position in the boardContent array is empty.
        if (boardContent[row][col] === '') {

            boardContent[row][col] = currentPlayer.marker; // Put the marker value into into the boardContent array at the position the cell was clicked.
            
            clickedElement.textContent = boardContent[row][col]; // Sets the text content of the cell elements to whatever the boardContent array values are.

            checkWinCondition(boardContent, currentPlayer);

            setCurrentTurn(); // Next players turn

            gameBoard.setTurnMessage(currentPlayer);

            

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

    const setWinMessage = (currentPlayer) => {
        winMessageSelector.textContent = `${currentPlayer.name}, is the winner.`
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
        setWinMessage: setWinMessage
    }


})();

gameBoard.initializeGameBoard();