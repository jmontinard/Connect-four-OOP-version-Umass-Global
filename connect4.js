/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let gameBtn = document.querySelector('#game-btn')



class Game {
  constructor(p1, p2, HEIGHT=6, WIDTH=7 ){
      this.WIDTH = WIDTH
      this.HEIGHT =HEIGHT
      this.players = [p1,p2]
      this.currPlayer = p1
      this.makeBoard()
      this.makeHtmlBoard();
      this.gameOver = false;
  }
  makeBoard() {
        this.board = [];
        for (let y = 0; y < this.HEIGHT; y++) {
          this.board.push(Array.from({ length: this.WIDTH }));
        }
      }
        
    makeHtmlBoard() {
      const {HEIGHT, WIDTH} = this
      const board = document.getElementById('board');
      board.innerHTML = '';

      // make column tops (clickable area for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');

      this.handleGameClick = this.handleClick.bind(this);
      top.addEventListener('click', this.handleGameClick);

    
      for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
    
      board.append(top);
    
      // make main part of board
      for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement('tr');
    
        for (let x = 0; x < WIDTH; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
    
        board.append(row);
      }
    }

       findSpotForCol(x) {
       
      for (let y = this.HEIGHT - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null;
    }



    placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      // piece.classList.add(`p${this.currPlayer}`);
      piece.style.backgroundColor = this.currPlayer.color;
      piece.style.top = -50 * (y + 2);
    
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }
    
    /** endGame: announce game end */
    
    endGame(msg) {
      alert(msg);
      const top = document.querySelector('#column-top')
      top.removeEventListener('click', this.handleGameClick)
    }
    
    /** handleClick: handle click of column top to play piece */
    
    handleClick(evt) {
      // get x from ID of clicked cell
      const x = +evt.target.id;
    
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
    
      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }

      // check for win
      if (this.checkForWin()) {
        this.gameOver = true
        return this.endGame(`Player ${this.currPlayer.color} won!`);
      }
        
      // switch players
      this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];

    }
    
     checkForWin() {
       const {WIDTH,HEIGHT, currPlayer} = this
      const _win = (cells) => {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer
    
        return cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < HEIGHT &&
            x >= 0 &&
            x < WIDTH &&
            this.board[y][x] === currPlayer
        );
      }
    
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    
          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {

            return true;
          }
        }
      }
    }

}

class Player {
  constructor(color){
    this.color = color
  }
}

gameBtn.addEventListener('click',(e)=> {
  e.preventDefault()
  gameBtn.textContent = 'New Game' ? gameBtn.textContent = 'Reset Game' : gameBtn.textContent = 'New Game'
  const p1 = new Player(document.querySelector('#p1-color').value)
  const p2 = new Player(document.querySelector('#p2-color').value)
  document.querySelector('#p1-color').value = ''
  document.querySelector('#p2-color').value = ''
  new Game(p1, p2)
} )

