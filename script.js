const playerFactory = (marker) => {
    const declareWinner = () => console.log(`${marker} is the winner.`);

    return {marker,
            declareWinner,};
}

const playerOne = playerFactory('X');
const playerTwo = playerFactory('O');

const gameBoard = (() => {
    //const rows = (width) => //set width of gameboard;
    //const columns = (height) => //set height of gameboard
    const boardContent = [ // 2D array that represents the game board. //
        ['','',''],
        ['','',''],
        ['','',''],
    ];

    const cellElements = []; // This holds the .game-board children elements (i.e. the game board html cells)

    const initializeGameBoard = () => { // Puts the game-board children elements into cellElements array.
        const board = document.querySelector('.game-board');
        
        for (let i = 0; i < board.children.length; i++) {// Iterates through game-board children (i.e. class=cell) html elements.

            const cellElement = board.children[i]; //This is a single cell element on the game board.
            
            cellElements.push(board.children[i]) // Adds each child element in game-board to cellElements array. //
            
            cellElement.addEventListener('click', placeMarker); // Adds an event listener to each cellElement
            }
        }

    const placeMarker = (event) => {
        const clickedElement = event.target; // event.target is the element that was clicked
        const cellIndex = cellElements.indexOf(clickedElement); // This is to determine the clicked cells position - find it's index. 
        const row = Math.floor(cellIndex / 3);
        const col = cellIndex % 3;

        boardContent[row][col] = playerOne.marker; // Put the marker value into into the boardContent array at the position the cell was clicked

        clickedElement.textContent = boardContent[row][col]; // Sets the text content of the cell elements to whatever the boardContent array values are.
        }

    return {
        initializeGameBoard: initializeGameBoard,
    }


})();

gameBoard.initializeGameBoard();
//gameBoard.renderGameBoard();



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