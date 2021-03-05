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

const sampleCell = {
    id: 5,
    mine: false,
    flag: false,
    clear: false,
    adjCells: []

}


/*-------------------------------- Variables --------------------------------*/

let totalMines,
    totalCells,
    boardSize,
    cells = []

/*------------------------ Cached Element References ------------------------*/

const difficultySelect = document.querySelector('select');
const grid = document.getElementById('grid');
let cellElements = null

/*----------------------------- Event Listeners -----------------------------*/

difficultySelect.addEventListener('change', function(evt) {
    boardSize = evt.target.value;
    grid.innerHTML = '';
    drawGrid();
})

grid.addEventListener('click', function(evt) {
    let i = parseInt(evt.target.id);
    // console.log(i);
    let adj = getAdjCells(i);
    adj.forEach(function(n) {
        cellElements[n].style.backgroundColor = "blue";
    })
});



/*-------------------------------- Functions --------------------------------*/

function init() {
    boardSize = "small";
    drawGrid();
    createCells();
}

function render() {
}

function drawGrid() {
    let x = boardInfo[boardSize].x;
    let y = boardInfo[boardSize].y;

    grid.style.gridTemplateColumns = `repeat(${x}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${y}, 1fr)`
    grid.className = boardSize;

    totalCells = x * y;
    
    for ( let i = 0; i < totalCells; i++ ) {
        let el = document.createElement('div')
        el.className = 'cell';
        el.id = i;
        //el.innerText = i;
        grid.appendChild(el);
    }
    cellElements = grid.children;
}

function createCells() {
    for ( let i = 0; i < totalCells; i++ ) {
        let cell = {}
        cell.id = i;
        cell.mine = false;
        cell.flag = false;
        cell.clear = false;
        cell.adjCells = getAdjCells(i);
        cells.push(cell);
    }
}

function getAdjCells(i) {
    let index = parseInt(i);
    let row = boardInfo[boardSize].x;

    let candidates = [
        index - row - 1,
        index - row,
        index - row + 1,
        index - 1,
        index + 1,
        index + row - 1,
        index + row,
        index + row + 1];

    let adj = candidates.filter( n =>
        n >= 0 && n < totalCells &&
        Math.abs( (n % row) - (index % row)) <= 1 )

    return adj;
}
    



init();
