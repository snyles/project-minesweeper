/*-------------------------------- Constants --------------------------------*/

const boardSizes = {
    small: { 
        X: 10,
        y: 8,
        mines: 10
    },
    medium: {
        x: 18,
        y: 14,
        mines: 40
    },
    large: {
        x: 24,
        y: 20,
        mines: 100
    }
}


/*-------------------------------- Variables --------------------------------*/

let totalMines,
    boardSize

/*------------------------ Cached Element References ------------------------*/

const difficultySelect = document.querySelector('select');
const grid = document.getElementById('grid');

/*----------------------------- Event Listeners -----------------------------*/

difficultySelect.addEventListener('change', function(evt) {
    boardSize = evt.target.value;
    grid.innerText = boardSize;


})

/*-------------------------------- Functions --------------------------------*/

function init(boardSize) {

    //create board grid based on size


}