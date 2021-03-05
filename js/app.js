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

const explosion = new Audio('./sound/boom.wav')

/*-------------------------------- Variables --------------------------------*/

let totalMines,
    flagsLeft,
    totalCells,
    boardSize,
    cells = [],
    firstClick,
    winner

/*------------------------ Cached Element References ------------------------*/

const difficultySelect = document.querySelector('select');
const grid = document.getElementById('grid');
const flagsLeftEl = document.querySelector('#flags-left span');
let cellElements = null

/*----------------------------- Event Listeners -----------------------------*/

difficultySelect.addEventListener('change', function(evt) {
    reset();
})

grid.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    let i = parseInt(e.target.id);
    if (firstClick || winner) { return }
    rightClick(i);
});

grid.addEventListener('click', function(e) {
    let i = parseInt(e.target.id);
    if (winner) { return };
    leftClick(i);
});

grid.addEventListener('dblclick', function(e) {
    let i = parseInt(e.target.id);
    if (winner) { return };
    doubleClick(i);
})

/*-------------------------------- Functions --------------------------------*/

function init() {
    firstClick = true;
    winner = null;
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
    // cells.filter( c => c.mine ).forEach( m => {
    //     cellElements[m.id].innerHTML = 
    //         `<img src='img/Mine.ico' class='mine' id=${m.id} />`
    // })

    // cells.filter ( c => c.adjMines ).forEach ( cell => {
    //     cellElements[cell.id].innerText = cell.adjMines
    // });
    /*-----------------------------------------------*/

    // cells.filter( c => c.clear && c.mine ).forEach (bomb => {
    //     winner;
    //     cellElements[bomb.id].style.backgroundColor = "red";
    //     cellElements[bomb.id].innerHTML =
    //         `<img src='img/Mine.ico' class='mine' id=${bomb.id} />`;
    //     explosion.play();
    // })

    if (winner === "mines") {
        cells.filter( c => c.mine ).forEach ( mine => {
            cellElements[mine.id].innerHTML = 
                `<img src='img/Mine.ico' class='mine' id=${mine.id} />`;
            if (mine.clear) {
                cellElements[mine.id].style.backgroundColor = "red";
            }
        })
        explosion.play();
    } else if (winner === "player" ) {
        console.log("you are a super player");
    }
    
    cells.filter( c => c.render ).forEach ( cell => {
            if (cell.clear) {
                cellElements[cell.id].style.backgroundColor = '#f3f3f3';
                if (cell.adjMines) {
                    cellElements[cell.id].innerText = cell.adjMines;
                }
            } else {
                cellElements[cell.id].innerHTML = (cell.flag) ?
                `<img src='img/Flag.ico' class='flag' id=${cell.id} />` :
                null;
            }
            cell.render = false;
        })

    flagsLeftEl.innerText = flagsLeft;
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
        return (cells[adj].flag) ? count + 1 : count;
    }, 0)

    if (flags === cell.adjMines) {
        cell.adjCells.forEach( c => clearCell(c));
        render();
    }
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
        cell.render = false;
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
        let mines = cell.adjCells.reduce(function (count, adj) {
            return (cells[adj].mine) ? ++count : count
        }, 0)
        cell.adjMines = (mines > 0) ? mines : null;
    })
}

function clearCell(i) {
    let cell = cells[i]
    
    if (cell.mine && !cell.flag) {
        cell.clear = true;
        winner = "mines";
        return;
    }
    else if (cell.clear || cell.flag) {
        return
    }
    cell.clear = true;
    cell.render = true;
    if (!cell.adjMines) {
        cell.adjCells.forEach( c => clearCell(c))
    }
    if (cell.flag) {
        cell.flag = false;
    }
}

function checkWin() {
    if (flagsLeft !== 0) return;

    if (cells.filter(c => c.mine).every( c => c.flag )) {
        winner = "player";
        cells.filter(c => !c.mine && !c.flear && !c.flag ).forEach( cell => {
            clearCell(cell.id);
        })
    }

}

init();
