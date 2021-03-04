/*-------------------------------- Constants --------------------------------*/

const boardInfo = {
    small: { 
        x: 10,
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
let cells = null

/*----------------------------- Event Listeners -----------------------------*/

difficultySelect.addEventListener('change', function(evt) {
    boardSize = evt.target.value;
    grid.innerHTML = '';
    render();


})

/*-------------------------------- Functions --------------------------------*/

function init() {
    boardSize = "small";
    render();
}

function render() {
    drawGrid();

}

function drawGrid() {
    let x = boardInfo[boardSize].x;
    let y = boardInfo[boardSize].y;

    grid.style.gridTemplateColumns = `repeat(${x}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${y}, 1fr)`

    let totalCells = x * y;
    
    for ( let i = 0; i < totalCells; i++ ) {

        let el = document.createElement('div')
        el.className = 'cell';
        el.id = i;
        grid.appendChild(el);
    }
    cells = grid.children;
}

init();
