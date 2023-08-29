const gameBoard = (() => {
    //const rows = (width) => //set width of gameboard;
    //const columns = (height) => //set height of gameboard
    const boardContent = [ // 2D array that represents the game board. //
        ['O','X','O'],
        ['X','O','X'],
        ['O','X','O'],
    ];

    const cellElements = [];

    const initializeGameBoard = () => { //function to render contents of array to webpage
        const board = document.querySelector('.game-board');
        
        for (let i = 0; i < board.children.length; i++) {// Iterates through cells in game board.

            cellElements.push(board.children[i]) // Adds each child element in board to cellElements array. //
            }
        }

    const renderGameBoard = () => { // Loops through contents of boardContent array //

        for (let i = 0; i < boardContent.length; i++) { // Loops through each row in array. //
            
            for (let j = 0; j < boardContent[i].length; j++) { //Loops through each cell in array. //
                
                const cellValue = boardContent[i][j]; // This extracts the value of the current row [i] and column [j] in boardContent array. //

                const cellIndex = i * boardContent.length + j; // This calculates a linear index that corresponds to the current row(i) & column(j). Using this index allows you to access the appropriate cell element that corresponds to the current position in the boardContent array. // 

                cellElements[cellIndex].textContent = cellValue; // This sets the text content of the cellElement(s). //
            } 
        }
    }

    return {
        initializeGameBoard: initializeGameBoard,
        renderGameBoard: renderGameBoard
    }


})();

gameBoard.initializeGameBoard();
gameBoard.renderGameBoard();

const playerFactory = (marker) => {
    const declareWinner = () => console.log(`${marker} is the winner.`);

    return {marker,
            declareWinner,};
}

const playerOne = playerFactory('X');
const playerTwo = playerFactory('O');


const gamePlay = (() => {
    let currentPlayer = playerOne;
    //player is assigned to playerOne
    //computer is assigned to playerTwo
    //playerOne goes first
    //on click, using loop find where mouse is clicked
    //using loop store result of mouse click in that position in array
    //change to playerTwo turn
    //playerTwo randomly? adds O marker to gameBoard - result is stored somewhere
    //When one player has three markers in a row, game ends with winner message 
})();