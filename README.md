# Minesweeper -  Unit 1 Project

## Wireframe

https://wireframe.cc/eNtijM

![Minesweeper Wireframe](https://raw.githubusercontent.com/snyles/project-minesweeper/main/img/minesweep-wire.png)

## Pseudocode

* data structure hold value of cells
  * values
    * mine
    * flag
    * cleared
    * uncleared
    * number
  
  * array of cells **model**
  ```
  object cell = {
      index: i
      cleared: true/false
      flagged: true/false
      mine: true/false
  }
  ```
  * number of adjacent mines?
  * function: this.explode?
  * store adjacent cell list in each cell obj, easy retrieval? 

* other variables
  * total mines, flags remaining
  * timer?
 

* algorithm for retreiving value of adjacent cells
  * based on board size
    * cell above cell index x = x - boardwidth
    * cell below x + boardwidth, etc
  * check contents of adjacent cells


* render function **view**
  * css classes for state of cells
  * buttons?

* Create board grid in css
  * board size changes with difficulty?
    * dropdown
    * implement smallest first, make scalable
  * mobile first? 


* mouseclick event **control**
  * right click
    * reveal square
    * bomb? = explode.exe
  * left click
    * mark flag, remove flag
  * double mouseclick
    * reveal surrounding squares if safe, marked, number logic

  * functions that update model based on clicks


* state of board does not change with gameplay, only information that is revealed
  * create board object with all data at start of game?
    * randomly place mines
    * assign adjacent mine data to all cells?

* how much to reveal, stop at cells with adjacent mines


