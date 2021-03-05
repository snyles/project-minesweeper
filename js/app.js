/*-------------------------------- Constants --------------------------------*/

const boardInfo = {
    small: { 
        x: 10,
        y: 8,
        mines: 10
    },
    medium: {
        x: 16,
        y: 12,
        mines: 30
    },
    large: {
        x: 20,
        y: 16,
        mines: 70
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
    flagsLeft,
    totalCells,
    boardSize,
    cells = []

/*------------------------ Cached Element References ------------------------*/

const difficultySelect = document.querySelector('select');
const grid = document.getElementById('grid');
let cellElements = null

/*----------------------------- Event Listeners -----------------------------*/

difficultySelect.addEventListener('change', function(evt) {
    reset();
})

grid.addEventListener('click', function(evt) {
    let i = parseInt(evt.target.id);
    clearCell(i);
    render();
});



/*-------------------------------- Functions --------------------------------*/

function init() {
    boardSize = difficultySelect.value;
    totalCells = boardInfo[boardSize].x * boardInfo[boardSize].y

    createCells();
    layMines();
    setAdjMines();

    drawGrid()
    render();
}

function reset() {
    cells = [];
    boardSize = difficultySelect.value;
    totalCells = boardInfo[boardSize].x * boardInfo[boardSize].y

    createCells();
    layMines();
    setAdjMines();

    grid.innerHTML = ''
    drawGrid()
    render();
}

function render() {

    /*----------- Debug------------*/
    cells.filter( c => c.mine ).forEach( mine => {
        cellElements[mine.id].innerText = "m";
        cellElements[mine.id].style.backgroundColor = "red";
    })

    cells.filter ( c => c.adjMines ).forEach ( cell => {
        cellElements[cell.id].innerText = cell.adjMines
    });
    /*-----------------------------*/


    cells.filter ( c => c.clear ).forEach ( cell => {
        cellElements[cell.id].style.backgroundColor = '#f3f3f3';
        if (cell.adjMines) {
            cellElements[cell.id].innerText = cell.adjMines;
        }
    })
}

/*------------------- View Functions -----------------------------------------*/

function drawGrid() {
    let x = boardInfo[boardSize].x;
    let y = boardInfo[boardSize].y;

    grid.style.gridTemplateColumns = `repeat(${x}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${y}, 1fr)`
    
    for ( let i = 0; i < totalCells; i++ ) {
        let el = document.createElement('div')
        el.className = 'cell';
        el.id = i;
        grid.appendChild(el);
    }
    cellElements = grid.children;
}


/*----------------------Control Functions ------------------------------------*/

function createCells() {
    for ( let i = 0; i < totalCells; i++ ) {
        let cell = {}
        cell.id = i;
        cell.mine = false;
        cell.flag = false;
        cell.clear = false;
        cell.adjCells = getAdjCells(i);
        cell.adjMines = null;
        cells.push(cell);
    }
}

function layMines() {
    mineNumber = boardInfo[boardSize].mines;
    let mined = [];

    while (mined.length < mineNumber) {
        let rand = Math.floor(Math.random() * totalCells);
        if (!mined.includes(rand)) {
            mined.push(rand);
            cells[rand].mine = true;
        }

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
        index + row + 1
    ];

    let adj = candidates.filter( n =>
        n >= 0 && n < totalCells &&
        Math.abs( (n % row) - (index % row)) <= 1 )

    return adj;
}

function setAdjMines () {
    let notMines = cells.filter( c => !c.mine )
    for (let cell of notMines) {
        let mines = cell.adjCells.reduce(function (count, adj) {
            return (cells[adj].mine) ? ++count : count
        }, 0)
        cell.adjMines = (mines > 0) ? mines : null;
    }
}

function clearCell(i) {
    if (cells[i].mine) {
        console.log("boom");
    }
    else if (cells[i].flagged || cells[i].clear) {
        return
    }
    else {
        cells[i].clear = true;
        if (!cells[i].adjMines) {
            cells[i].adjCells.forEach( c => clearCell(c))
        }
    }
}

init();
