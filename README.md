# Minesweeper

## Objective
This humble recreation of the legendary Minesweeper game seeks to capture the glory of one the best free games bundled with Windows™ that I played whenever I was bored at school.

## Getting Started

### [Play MineSweeper Here!](https://snyles-minesweeper.surge.sh/)

For instructions, click on the Help icon ![Help Icon](https://github.com/snyles/project-minesweeper/raw/main/img/help_black.png) above the game board.

Change the game difficulty with the dropdown Difficulty selector and start over by clicking the Reset button.

## Screenshots

![Screenshot 1](https://raw.githubusercontent.com/snyles/project-minesweeper/main/img/screenshots/MS-Screenshot1.png)
![Screenshot 2](https://raw.githubusercontent.com/snyles/project-minesweeper/main/img/screenshots/MS-Screenshot2.png)


## Technologies Used

* Vanilla Javascript ES6
* CSS3
* HTML5
* Git
  
  
## Attribution

* Flag and Mine Icons by [Martina Šmejkalová](http://www.sireasgallery.com/iconset/minesweeper/)
* Confetti.js from [MathuSum Mut](https://github.com/mathusummut/confetti.js/)
* Javascript counter function  adapted from [Jake Archibald](https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95)
* Sound effects from [Mixkit.co](https://mixkit.co/)

## Wireframe

https://wireframe.cc/eNtijM

![Minesweeper Wireframe](https://raw.githubusercontent.com/snyles/project-minesweeper/main/img/screenshots/minesweep-wire.png)


## Pseudocode

* Draw the board based on the difficulty selected by the user. Higher difficulty means a bigger board with more mines
* Left clicking reveals the contents of the cell
  * If the cell contains a mine, the player loses
  * If the cell has mines adjacent to it, the number of adjacent mines appears in the cell
  * If the cell does not have any adjacent mines, reveal the surrounding cells recursively
* Right clicking marks a cell with a flag or removes a flag
* Double left clicking or clicking both mouse buttons on a cell reveals the cells adjacent to the cell clicked
  * Only happens if the player has marked as many flags as there are mines adjacent to the cell
* The player wins when every cell containing a mine is marked by a flag

### Model

* Array of cell objects created at start of game
```
Obj cell = {
  id: int,
  mine: boolean,
  flag: boolean,
  clear: boolean,
  render: boolean,
  adjCells: array of adjacent cell ids,
  adjMines: int, number of adjacent mines,
  element: reference to corresponding DOM element
}
```

### Control

* Functions for Right click, left click, double click
* State variables such as:
  * flagsLeft, boardSize, winner, etc.
* Update data in cells array based on user action

* Helper functions
  * Create cell objects and array at start of game
  * Retrieve adjacent cell ids given a cell id
  * Randomly place mines in cells
  * Determine number of mines adjacent to given cell
  * Clear a cell function, calls itself recursively
  * Check for win, all mines marked with flag


### View

* Draw grid at start of game, create cell elements
* Render function
  * Update display of cells based on data in cells array
* Timer display and update
* Win/Loss Display
* Responsive CSS design

# Next Steps

* ~~Ensure first click is not a mine~~
  * Mines are placed after user clicks first square, excluding that cell and adjacent cells
* ~~Implement timer~~
  * Stops when player wins or loses, restarts with new game
* ~~Instructions modal~~
* ~~Win and Lose message modal, includes game time~~
* Make numbers in squares different colors
