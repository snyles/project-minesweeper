// TODO: get timer to stop, responsive, dress it up, directions modal


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

class Cell {
    constructor(id) {
        this.id = id;
        this.mine = false;
        this.flag = false;
        this.clear = false;
        this.render = false;
        this.adjCells = getAdjCells(id);
        this.adjMines = null;
        this.element = null;
    }
} 

const explosionSound = new Audio('./sound/boom.wav');
const loseSound = new Audio('./sound/lose.wav');
const winSound = new Audio('./sound/win.wav');
const applauseSound = new Audio('./sound/applause.wav');

/*-------------------------------- Variables --------------------------------*/

let totalMines,
    flagsLeft,
    totalCells,
    boardSize,
    cells = [],
    firstClick,
    winner,
    startTime

/*------------------------ Cached Element References ------------------------*/

const difficultySelect = document.querySelector('select');
const resetButton = document.getElementById('resetButton');
const grid = document.getElementById('grid');

const flagsLeftEl = document.querySelector('#flags-left span');
const timeEl = document.getElementById('time');

/*----------------------------- Event Listeners -----------------------------*/

resetButton.addEventListener('click', reset );
difficultySelect.addEventListener('change', reset );

grid.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    let i = parseInt(e.target.id);
    if (firstClick || winner || isNaN(i)) return 
    rightClick(i);
});

grid.addEventListener('click', function(e) {
    let i = parseInt(e.target.id);
    if (winner || isNaN(i)) return;
    leftClick(i);
});

grid.addEventListener('dblclick', function(e) {
    let i = parseInt(e.target.id);
    if (winner || isNaN(i)) return;
    doubleClick(i);
})

/*-------------------------------- Functions --------------------------------*/

function init() {
    firstClick = true;
    winner = null;
    boardSize = difficultySelect.value;
    totalCells = boardInfo[boardSize].x * boardInfo[boardSize].y
    flagsLeft = boardInfo[boardSize].mines

    startTime = document.timeline.currentTime;
    frame(startTime);

    createCells();
    drawGrid()
    render();
}

function reset() {
    cells = [];
    grid.innerHTML = ''
   
    init();
}

/*------------------- View Functions -----------------------------------------*/

function render() {
    /*--------------------- Debug--------------------*/
    // cells.filter( c => c.mine ).forEach( m => {
    //     m.element.innerHTML = 
    //         `<img src='img/Mine.ico' class='mine' id=${m.id} />`
    // })

    // cells.filter ( c => c.adjMines ).forEach ( cell => {
    //     cell.element.innerText = cell.adjMines
    // });
    /*-----------------------------------------------*/

    if (winner === "mines") {
        cells.filter( c => c.mine ).forEach ( mine => {
            mine.element.innerHTML = 
                `<img src='img/Mine.ico' class='mine' id=${mine.id} />`;
            if (mine.clear) { 
                mine.element.style.backgroundColor = "red";
            }
        })
        explosionSound.play();
        setTimeout(function() {
            loseSound.play();
        }, 500);
    } else if ( winner === "player" ) {
        console.log("you are a super player");
        winSound.play();
        applauseSound.play();
    }
    
    cells.filter( c => c.render ).forEach ( cell => {
        if (cell.clear) {
            // cell.element.style.backgroundColor = '#f3f3f3';
            cell.element.classList.add('clear');
            cell.element.innerText = cell.adjMines;
        } else {
            cell.element.innerHTML = (cell.flag) ?
                `<img src='img/Flag.ico' class='flag' id=${cell.id} />` :
                null;
        }
        cell.render = false;
    })

    flagsLeftEl.innerText = flagsLeft;
}

function drawGrid() {
    let x = boardInfo[boardSize].x;
    let y = boardInfo[boardSize].y;

    grid.style.gridTemplateColumns = `repeat(${x}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${y}, 1fr)`

    cells.forEach( cell => {
        let el = document.createElement('div')
        el.className = 'cell';
        el.id = cell.id;

        cell.element = el;
        grid.appendChild(el);
    })
}

/*-----------------Timer Functions-------------------*/
function frame(time) {
    const elapsed = time - startTime;
    const seconds = Math.round(elapsed / 1000);
    updateTimer(seconds);
    const targetNext = (seconds + 1) * 1000 + startTime;
    setTimeout (
        () => requestAnimationFrame(frame), 
        targetNext - performance.now(),
    );
}

function updateTimer(sec) {
    let m = Math.floor(sec / 60)
    let s = (sec > 59) ? sec - (m * 60) : sec;
    timeEl.innerText = (s > 9) ? `${m}:${s}` : `${m}:0${s}`
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
    if (cells[i].clear) return
    
    cells[i].flag = !cells[i].flag;
    cells[i].render = true;
    
    flagsLeft = boardInfo[boardSize].mines - cells.filter( c => c.flag ).length
    if (flagsLeft === 0) checkWin();
    
    render();
}

function doubleClick(i) {
    let cell = cells[i];
    if (!cell.clear || !cell.adjMines) return

    let flags = cell.adjCells.reduce( (count, adj) => {
        return (cells[adj].flag) ? ++count : count;
    }, 0)
    if (flags === cell.adjMines) {
        cell.adjCells.forEach( c => clearCell(c));
    }
    render();
}

function createCells() {
    for ( let i = 0; i < totalCells; i++ ) {
        let cell = new Cell(i);
        cells.push(cell);
    }
}

function layMines(ex) {
    mineNumber = boardInfo[boardSize].mines;
    let exclude = [...ex];
    
    while (exclude.length < mineNumber + ex.length) {
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
        let mines = cell.adjCells.reduce( (count, adj) => {
            return (cells[adj].mine) ? ++count : count
        }, 0)
        cell.adjMines = (mines > 0) ? mines : null;
    })
}

function clearCell(i) {
    let cell = cells[i]

    if (cell.clear || cell.flag) return
    if (cell.mine) {
        cell.clear = true;
        winner = "mines";
        return;
    }

    cell.clear = true;
    cell.render = true;

    if (!cell.adjMines) {
        cell.adjCells.forEach( c => clearCell(c))
    }
}

function checkWin() {
    if (flagsLeft !== 0) return;
    
    if (cells.filter( c => c.mine ).every( c => c.flag )) {
        winner = "player";
        cells.filter(c => !c.mine && !c.clear ).forEach( cell => {
            clearCell(cell.id);
        })
    }
}

init();
