'use strict';

const trie = require("./seed");
// const Word = require("./Word");

// dynamic board class
class Board {
  constructor(letters, height=1, width=0) {
    this.height = height;
    this.width = width;
    this.rows = Array.from(new Array(height)).map(() => new Array(width).fill(null));
    this.words = trie.getWordsFrom(letters);
  }

  get = () => this.rows;

  at = (x, y) => {
    if (y === undefined) return this.rows[x]; 
    return this.rows[x][y];
  };

  getWidth = () => this.width;
  
  getHeight = () => this.height;

  setWidth = newWidth => {
    if (newWidth <= 0) throw new Error("newWidth must be greater than zero");
    else if (newWidth === this.width) return;
    else if (newWidth > this.width) {
      this.rows.forEach(row => {
        for (let i = this.width; i < newWidth; i++) {
          row[i] = null;
        }
      });
    } else {
      this.rows = this.rows.map(row => row.slice(0, newWidth));
    }
    this.width = newWidth;
  };

  setHeight = newHeight => {
    if (newHeight <= 0) throw new Error("newHeight must greater than zero");
    else if (newHeight === this.height) return;
    if (newHeight > this.height) {
      for (let i = this.height; i < newHeight; i++) {
        this.rows[i] = new Array(this.width).fill(null);
      }
    } else {
      this.rows = this.rows.filter((_, i) => i < newHeight);
    }
    this.height = newHeight;
  };

  setDimensions = (newHeight, newWidth) => {
    this.setWidth(newWidth);
    this.setHeight(newHeight);
  };

  // TODO: canPlaceWord does not properly assess matching character
  canPlaceWord = (word, x, y, isHorizontal) => {
    if (isHorizontal === undefined) throw new Error("must specify isHorizontal as true or false");
    if (x < 0 || y < 0) return false;
    if (isHorizontal) {
      if (!this.rows[x]) return true;
      for (let i = 0; i < word.length; i++) {
        if (this.rows[x][y + i] && this.rows[x][y + i] !== word[i]) return false;
      }
    } else {
      for (let i = x; i < x + word.length; i++) {
        if (!this.rows[x + i]) break;
        if (this.rows[x + i][y] && this.rows[x + i][y] !== word[i]) return false;
      }
    }
    return true;
  };

  placeWord = (word, x, y, isHorizontal) => {
    if (isHorizontal === undefined) throw new Error("must specify isHorizontal as true or false");
    if (x < 0 || y < 0) throw new Error("x and y must be positive integers or zero");
    console.log(x, y);
    let i;

    if (isHorizontal) {
      // horizontal word placement
      if (x >= this.height) this.setHeight(x + 1);
      if (y + word.length > this.width) this.setWidth(y + word.length);
      
      // print error to console
      if (this.rows[x] === undefined) {
        console.error(`tried to place horizontal word: ${word}, char: ${word[i]}, row: ${x}`);
      }

      // place on matrix
      for (i = 0; i < word.length; i++) {
        this.rows[x][y + i] = word[i];
      }
      
      console.table(this.rows);
      console.log('final coords', x, y + i - 1);
      return [x, y + i - 1];
    } else {
      // adjust dimensions
      if (y >= this.width) this.setWidth(y + 1);
      if (x + word.length > this.height) this.setHeight(x + word.length);
      console.table(this.rows);

      // place on matrix
      for (i = 0; i < word.length; i++) {
        if (this.rows[x + i] === undefined) {
          console.error(`tried to place ${word[i]} at row ${x + i}`);
          console.table(this.rows);
        }
        this.rows[x + i][y] = word[i];
      }
      
      console.table(this.rows);
      console.log('final coords', x + i - 1, y);
      return [x + i - 1, y];
    }
  };

  genBoard = () => {
    const words = Array.from(this.words).sort(() => 0.5 - Math.random());
    let isHorizontal = Math.round(Math.random()) === 1;
    let word = words.pop(), foundMatch = false;
    let xi = 5, yi = 5;
    let [xf, yf] = this.placeWord(word, xi, yi, isHorizontal);
    // let count = 1; // this will be for maxWords
    console.table(this.rows);
    isHorizontal = !isHorizontal;
    console.log(words)
  
    while (words.length) {
      word = words.pop();
      for (let charIdx = 0; charIdx < word.length; charIdx++) {
        if (isHorizontal) {
          // iterate through previous vertical word to find a spot
          for (let i = yi; i <= yf; i++) {
            // console.log(`comparing ${word} at ${word[charIdx]} with ${this[xi][i]}`)
            if (this.canPlaceWord(word, xi, i - charIdx, true)) {
              console.log("found for horizontal", word, "at", xi, i - charIdx);
              // get next coordinates
              [xf, yf] = this.placeWord(word, xi, i - charIdx, true);
              yi = i - charIdx;

              // toggle isHorizontal to prepare for next word
              isHorizontal = !isHorizontal;
              foundMatch = true;
              break;
            }
          }
        } else {
          // iterate through previous horizontal word to find a spot
          for (let i = xi; i <= xf; i++) {
            // console.log(`comparing ${word} at ${word[charIdx]} with ${this[xi][i]}`)
            if (this.canPlaceWord(word, i - charIdx, yi, false)) {
              console.log("found for vertical", word, "at", i - charIdx, yi)

              // get next coordinates 
              [xf, yf] = this.placeWord(word, i - charIdx, yi, false);
              console.table(this.rows);
              xi = i - charIdx;

              // toggle isHorizontal
              isHorizontal = !isHorizontal;
              foundMatch = true;
              break;
            }
          }
        }
        if (!foundMatch) {
          console.log("no match found");
          words.push(word);
        } else {
          foundMatch = false;
        }
      }
    }
    console.table(this.rows);
  };
  
}

module.exports = Board;