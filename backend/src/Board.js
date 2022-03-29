'use strict';

const Word = require("./Word");
const trie = require("./dictionary");

/** Board class that generates crossword puzzle */
class Board {
  constructor(letters, height=1, width=0) {
    this.height = height;
    this.width = width;
    this.rows = Array.from(new Array(height)).map(() => new Array(width).fill(null));
    this.words = trie.getWordsFrom(letters);
    this.activeWords = {};
  }

  get = () => this.rows;

  at = (x, y) => {
    if (y === undefined) return this.rows[x]; 
    return this.rows[x][y];
  };

  getWidth = () => this.width;
  
  getHeight = () => this.height;

  /** adjusts width of board */
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

  /** adjusts height of board */
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

  /** returns true when all the following cells, relative to cell at (x, y), are blank:
   *  - horizontally: (x, y + 1), (x + 1, y), (x - 1, y);
   *  - vertically: (x + 1, y), (x, y - 1), (x, y + 1);
   */
  hasBlankAdjacentCells = (x, y, isHorizontal, intersectionIdx) => {
    if (isHorizontal) {
      if (y >= this.width) return true;
      if ((this.rows[x] && y + 1 !== intersectionIdx && this.rows[x][y + 1]) ||
          (this.rows[x + 1] && this.rows[x + 1][y]) ||
          (this.rows[x - 1] && this.rows[x - 1][y]))
      {
        return false;
      }
    } else {
      if (x >= this.height) return true;
      if (x + 1 !== intersectionIdx && 
          ((this.rows[x + 1] && this.rows[x + 1][y]) ||
          this.rows[x][y - 1] || this.rows[x][y + 1]))
      {
        return false;
      }
    }
    return true;
  };

  canPlaceWord = (word, x, y, isHorizontal, intersectionIdx) => {
    if (isHorizontal === undefined) throw new Error("must specify isHorizontal as true or false");
    if (x < 0 || y < 0) return false;
    
    if (isHorizontal) {
      if (!this.rows[x]) return true;
      if (this.rows[x][y - 1]) return false;
      if (intersectionIdx === y && this.rows[x][y - 1]) return false;
      for (let i = 0; i < word.length; i++) {
        // once out of bounds, word can be placed
        if (this.rows[x][y + i] === undefined) break;

        // check if this word intersects with another
        // if there is a word, ensure that it is vertical
        if (this.rows[x][y + i] === word[i] && this.rows[x][y + i + 1] === null) continue;

        if ((this.rows[x][y + i] && this.rows[x][y + i] !== word[i]) ||
            (y + i !== intersectionIdx && !this.hasBlankAdjacentCells(x, y + i, true, intersectionIdx)))
        {
          return false;
        }
      }
    } else {
      if (this.rows[x - 1] && this.rows[x - 1][y]) return false;
      if (intersectionIdx === x && this.rows[x - 1] && this.rows[x - 1][y]) return false;
      for (let i = 0; i < word.length; i++) {
        // once out of bounds, word can be placed
        if (!this.rows[x + i]) break;

        // check if this word intersects with another
        // if there is a word, ensure that it is horizontal
        if (this.rows[x + i][y] === word[i] && (!this.rows[x + i + 1] || this.rows[x + i + 1][y] === null)) continue;
        if ((this.rows[x + i][y] && this.rows[x + i][y] !== word[i]) ||
            (x + i !== intersectionIdx && !this.hasBlankAdjacentCells(x + i, y, false, intersectionIdx)))
        {
          return false;
        }
      }
    }
    return true;
  };

  placeWord = (word, x, y, isHorizontal) => {
    if (isHorizontal === undefined) throw new Error("must specify isHorizontal as true or false");
    if (x < 0 || y < 0) throw new Error("x and y must be positive integers or zero");
    let i;

    if (isHorizontal) {
      // horizontal word placement
      if (x >= this.height) this.setHeight(x + 1);
      if (y + word.length > this.width) this.setWidth(y + word.length);
      
      // place on matrix
      for (i = 0; i < word.length; i++) {
        this.rows[x][y + i] = word[i];
      }
      return [x, y + i - 1];
    } else {
      // adjust dimensions
      if (y >= this.width) this.setWidth(y + 1);
      if (x + word.length > this.height) this.setHeight(x + word.length);

      // place on matrix
      for (i = 0; i < word.length; i++) {
        this.rows[x + i][y] = word[i];
      }
      
      return [x + i - 1, y];
    }
  };

  genBoard = (startX=0, startY=0, maxWords=5) => {
    const words = Array.from(this.words).sort(() => 0.5 - Math.random());
    const placedWords = [];
    let isHorizontal = Math.round(Math.random()) === 1;
    let word = words.pop();
    this.placeWord(word, startX, startY, isHorizontal);
    placedWords.push(new Word(word, startX, startY, isHorizontal));

    while (words.length && placedWords.length < maxWords) {
      words.sort(() => 0.5 - Math.random());
      word = words.pop();
      for (const placedWord of placedWords) {
        let foundMatch = false;

        // gather index and coordinates of placed word
        const { xi, yi } = placedWord.getCoords();
        isHorizontal = !placedWord.isHorizontal;

        for (let i = 0; i < word.length; i++) {
          if (!placedWord.has(word[i])) continue;

          const charIdx = placedWord.charIdx(word[i]);
          // set x, y to start of new word to be placed
          // set crossX, crossY to intersection coordinates
          let x, y, intersectionIdx;
          if (placedWord.isHorizontal) {
            x = xi - i;
            y = yi + charIdx;
            intersectionIdx = xi;
          } else {
            x = xi + charIdx;
            y = yi - i;
            intersectionIdx = yi;
          }

          // place word if deemed a valid spot
          if (this.canPlaceWord(word, x, y, isHorizontal, intersectionIdx)) {
            this.placeWord(word, x, y, !placedWord.isHorizontal);
            const newPlacedWord = new Word(word, x, y, !placedWord.isHorizontal);
            this.activeWords[word] = newPlacedWord.getCoords();
            placedWords.push(newPlacedWord);
            foundMatch = true;
            isHorizontal = !isHorizontal;
            break;
          }
        }
        if (foundMatch) break;
      }
    }
  };
  
}

module.exports = Board;