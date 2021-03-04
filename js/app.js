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
    console.log(getAdjCells(i));
});



/*-------------------------------- Functions --------------------------------*/

function init() {
    boardSize = "small";
    drawGrid();
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
        el.innerText = i;
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
    }
}

function getAdjCells(i) {
    let adjCells = [];
    let index = parseInt(i)
    let topEdge = false, 
        leftEdge = false, 
        rightEdge = false, 
        bottomEdge = false;
    let row = boardInfo[boardSize].x;

    if (index < row) 
        topEdge = true;
    if (index > (totalCells - (row + 1))) 
        bottomEdge = true;
    if (index % row === 0)
        leftEdge = true;
    if ((index + 1) % row === 0)
        rightEdge = true;

    // console.log("top", topEdge, "right", rightEdge, "bottom", bottomEdge, "left", leftEdge);

    let NW = index - row - 1;
    let N = index - row;
    let NE = index - row + 1
    let W = index - 1;
    let E = index + 1;
    let SW = index + row - 1;
    let S = index + row;
    let SE = index + row + 1;

    if (topEdge) {
        if (leftEdge) {
            adjCells.push(E, S, SE);
        }
        else if (rightEdge) {
            adjCells.push(W, SW, S);
        }
        else {
            adjCells.push(W, E, SW, S, SE);
        }
    }
    else if (bottomEdge) {
        if (leftEdge) {
            adjCells.push(N, NE, E);
        }
        else if (rightEdge) {
            adjCells.push(NW, N, W);
        }
        else {
            adjCells.push(NW, N, NE, W, E);
        }
    }
    else if (leftEdge) {
        adjCells.push(N, NE, E, S, SE);
    }
    else if (rightEdge) {
        adjCells.push(NW, N, W, SW, S);
    }
    else {
        adjCells.push(NW, N, NE, W, E, SW, S, SE);
    }
    return(adjCells);
}


init();
