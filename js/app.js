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

/*-------------------------------- Variables --------------------------------*/

let totalMines,
    flagsLeft,
    totalCells,
    boardSize,
    cells = [],
    firstClick

/*------------------------ Cached Element References ------------------------*/

const difficultySelect = document.querySelector('select');
const grid = document.getElementById('grid');
let cellElements = null

/*----------------------------- Event Listeners -----------------------------*/

difficultySelect.addEventListener('change', function(evt) {
    reset();
})

grid.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    let i = parseInt(e.target.id);
    if (!firstClick) {
        rightClick(i);
    }

});

grid.addEventListener('click', function(e) {
    let i = parseInt(e.target.id);
    let button = e.button;
    leftClick(i);

});


/*-------------------------------- Functions --------------------------------*/

function init() {
    firstClick = true;
    boardSize = difficultySelect.value;
    totalCells = boardInfo[boardSize].x * boardInfo[boardSize].y
    flagsLeft = boardInfo[boardSize].mines

    createCells();
    drawGrid()
    render();
}

function reset() {
    cells = [];
    grid.innerHTML = ''
   
    init();
//     firstClick = true;
//     boardSize = difficultySelect.value;
//     totalCells = boardInfo[boardSize].x * boardInfo[boardSize].y
//     flagsLeft = boardInfo[boardSize].mines

//     createCells();
//     drawGrid()
//     render();
}

function render() {
    /*--------------------- Debug--------------------*/
    cells.filter( c => c.mine ).forEach( m => {
        cellElements[m.id].innerHTML = 
            `<img src='img/Mine.ico' class='mine' id=${m.id} />`
    })

    // cells.filter ( c => c.adjMines ).forEach ( cell => {
    //     cellElements[cell.id].innerText = cell.adjMines
    // });
    /*-----------------------------------------------*/

    //clear cell, fill in numbers
    cells.filter ( c => c.clear ).forEach ( cell => {
        cellElements[cell.id].style.backgroundColor = '#f3f3f3';
        if (cell.adjMines) {
            cellElements[cell.id].innerText = cell.adjMines;
        }
    })

    //draw flags
    cells.filter( c => c.flag ).forEach ( c => {
        cellElements[c.id].innerHTML = 
            `<img src='img/Flag.ico' class='flag' id=${c.id} />`
    })
    //clear flags
    cells.filter( c => !c.clear && !c.flag && !c.mine).forEach( c => {
        cellElements[c.id].innerHTML = "";
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

function leftClick(i) {
    if (firstClick) {
        firstClick = false;
        let exclude = [i, ...getAdjCells(i)];
        layMines(exclude);
        setAdjMines();
    }
    clearCell(i);
    render();
}

function rightClick(i) {
    if (!cells[i].clear) {
        cells[i].flag = !cells[i].flag;
    }
    render();
}

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

function layMines(ex) {
    mineNumber = boardInfo[boardSize].mines + ex.length;
    let exclude = [...ex];
    
    while (exclude.length < mineNumber) {
        let rand = Math.floor(Math.random() * totalCells);
        if (!exclude.includes(rand)) {
            exclude.push(rand);
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
    cells.filter( c => !c.mine ).forEach( cell => {
        let mines = cell.adjCells.reduce(function (count, adj) {
            return (cells[adj].mine) ? ++count : count
        }, 0)
        cell.adjMines = (mines > 0) ? mines : null;
    })
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
