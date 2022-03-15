// dynamic board class
class Board {
  constructor(height=1, width=0) {
    this.height = height;
    this.width = width;
    this.rows = Array.from(new Array(height)).map(() => new Array(width).fill(null));
  }

  get() {
    return this.rows;
  }

  at(x, y) {
    if (y === undefined) return this.rows[x]; 
    return this.rows[x][y];
  }

  getWidth() { return this.width; }
  
  getHeight() { return this.height; }

  setWidth(newWidth) {
    if (newWidth <= 0) throw new Error("newWidth must be greater than zero");
    else if (newWidth === this.width) return;
    else {
      this.rows = newWidth < this.width
      ? this.rows.map(row => row.filter((_, i) => i < newWidth))
      : this.rows.map(row => row.concat(new Array(newWidth - this.width).fill(null)));
      this.width = newWidth;
    }
  }

  setHeight(newHeight) {
    if (newHeight <= 0) throw new Error("newHeight must greater than zero");
    else if (newHeight === this.height) return;
    if (newHeight > this.height) {
      this.rows.push(...Array.from(new Array(newHeight - this.height))
                        .map(() => new Array(this.width).fill(null)));
    } else if (newHeight < this.height) {
      this.rows = this.rows.filter((_, i) => i < newHeight);
    }
    this.height = newHeight;
  }

  setDimensions(newHeight, newWidth) {
    this.setWidth(newWidth);
    this.setHeight(newHeight);
  }

  canPlaceWord(word, x, y, isHorizontal) {
    if (isHorizontal === undefined) throw new Error("must specify isHorizontal as true or false");
    if (x < 0 || y < 0) throw new Error("x and y must be positive integers");
    if (isHorizontal) {
      for (let i = 0; i < word.length; i++) {
        if (!this.rows[x]) break;
        if (this.rows[x][y + i] && this.rows[x][y + i] !== word[i])
          return false;
      }
    } else {
      for (let i = x; i < x + word.length; i++) {
        if (!this.rows[x + i]) break;
        if (this.rows[x + i][y] && this.rows[x + i][y] !== word[i])
          return false;
      }
    }
    return true;
  }

  placeWord(word, x, y, isHorizontal) {
    if (isHorizontal === undefined) throw new Error("must specify isHorizontal as true or false");
    if (x < 0 || y < 0) throw new Error("x and y must be positive integers or zero");
    if (isHorizontal) {
      if (x >= this.height) this.setHeight(x + 1);
      if (y + word.length > this.width) this.setWidth(y + word.length);
      for (let i = 0; i < word.length; i++) {
        this.rows[x][y + i] = word[i];
      }
      return;
    } else{
      if (y >= this.width) this.setWidth(y + 1);
      if (x + word.length > this.height) this.setHeight(x + word.length);
      for (let i = 0; i < word.length; i++) {
        this.rows[x + i][y] = word[i];
      }
    }
  }
}

module.exports = Board;