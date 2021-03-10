// TODO: get timer to stop, responsive, dress it up, directions modal
// import { animationInterval } from './timer.js';

/*-------------------------------- Constants --------------------------------*/

const boardInfo = {
    small: { 
        x: 10,
        y: 8,
        mines: 10
    },
    medium: {
        x: 14,
        y: 12,
        mines: 30
    },
    large: {
        x: 18,
        y: 14,
        mines: 60
    },
    xlarge: {
        x: 18,
        y: 14,
        mines: 100
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
    startTime,
    leftClicked,
    rightClicked,
    controller,
    timer

/*------------------------ Cached Element References ------------------------*/

const difficultySelect = document.querySelector('select');
const resetButton = document.getElementById('resetButton');
const grid = document.getElementById('grid');

const flagsLeftEl = document.querySelector('#flags-left span');
const timeEl = document.getElementById('time');
const helpIcon = document.getElementById('help');
const helpModal = document.getElementById('helpModal');

/*----------------------------- Event Listeners -----------------------------*/

resetButton.addEventListener('click', reset );
difficultySelect.addEventListener('change', reset );

helpIcon.addEventListener('click', function() {
    helpModal.style.display = "flex";
    helpModal.addEventListener('click', function() {
        helpModal.style.display = "none";
        helpModal.removeEventListener('click');
    })

})

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

grid.addEventListener('mousedown', function(e) {
    if (e.button === 0) leftClicked = true; 
    if (e.button === 2) rightClicked = true; 
})

grid.addEventListener('mouseup', function(e) {
    if (rightClicked && leftClicked) {
        let i = parseInt(e.target.id);
        if (winner || isNaN(i)) return;
        doubleClick(i);
    }
    if (e.button === 0) {
        leftClicked = false;
    }
    if (e.button === 2) {
        rightClicked = false;
    }
})

/*-------------------------------- Functions --------------------------------*/

function init() {
    firstClick = true;
    winner = null;
    timer = 0;
    boardSize = difficultySelect.value;
    totalCells = boardInfo[boardSize].x * boardInfo[boardSize].y
    flagsLeft = boardInfo[boardSize].mines
   
    //timer function
    controller = new AbortController();
    // let start = document.timeline ? document.timeline.currentTime : 
    //     performance.now();
    animationInterval(1000, controller.signal, time => {
        timer += time;
        updateTimer(timer);
    });

    createCells();
    drawGrid()
    render();
}

function reset() {
    confetti.stop();
    cells = [];
    grid.innerHTML = '';
    firstClick = true;
    winner = null;
    timer = 0;
    updateTimer(timer);
    
    boardSize = difficultySelect.value;
    totalCells = boardInfo[boardSize].x * boardInfo[boardSize].y
    flagsLeft = boardInfo[boardSize].mines

    controller.abort();
    controller = new AbortController();
    animationInterval(1000, controller.signal, time => {
        timer += time;
        updateTimer(timer);
    });
   
    createCells();
    drawGrid()
    render();
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
            mine.element.innerHTML = (mine.clear) ?
                `<img src='img/MineRed.ico' class='mine' id=${mine.id} />` :
                `<img src='img/Mine.ico' class='mine' id=${mine.id} />`;
            })
        explosionSound.play();
        setTimeout(function() {
            loseSound.play();
        }, 500);
        controller.abort();
    } else if ( winner === "player" ) {
        winSound.play();
        applauseSound.play();
        // kazooSound.play();
        confetti.start();
        controller.abort();
    }
    
    cells.filter( c => c.render ).forEach ( cell => {
        if (cell.clear) {
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

    grid.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${y}, 1fr)`;
    grid.className = boardSize;

    cells.forEach( cell => {
        let el = document.createElement('div')
        el.className = 'cell';
        el.id = cell.id;

        cell.element = el;
        grid.appendChild(el);
    })
}

/*-----------------Timer Functions-------------------*/

function updateTimer(seconds) {
    let sec = Math.floor(seconds / 1000);
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

/*---------TIMER FROM https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95 -----------------------------*/

function animationInterval(ms, signal, callback) {
    // Prefer currentTime, as it'll better sync animtions queued in the 
    // same frame, but if it isn't supported, performance.now() is fine.

    const start = document.timeline ? document.timeline.currentTime : performance.now();
  
    function frame(timestamp) {
      if (signal.aborted) return;
      callback(1000);
      scheduleFrame(timestamp);
    }
  
    function scheduleFrame(time) {
      const elapsed = time - start;
      const roundedElapsed = Math.round(elapsed / ms) * ms;
      const targetNext = start + roundedElapsed + ms;
      const delay = targetNext - performance.now();
      setTimeout(() => requestAnimationFrame(frame), delay);
    }
  
    scheduleFrame(start);
  }

  