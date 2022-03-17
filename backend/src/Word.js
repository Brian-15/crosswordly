class Word {
  constructor(word, x, y, isHorizontal) {
    this.word = word;
    this.isHorizontal = isHorizontal;
    this.coords = {
      xi: x,
      yi: y,
      xf: isHorizontal ? x + word.length - 1 : x,
      yf: isHorizontal ? y : y + word.length - 1
    };
    this.charMap = {};
    for (let i = 0; i < word.length; i++) {
      if (!this.charMap[word[i]]) this.charMap[word[i]] = i;
    }
  }

  addMatch(coords) {
    this.matches.push(coords);
    this.numMatches++;
  }

  get() {
    return this.word;
  }

  charIdx(char) {
    return this.charMap[char];
  }

  at(idx) {
    return this.word[idx];
  }

  has(char) {
    return this.charMap[char] !== undefined;
  }

  getCoords() {
    return this.coords;
  }
}

module.exports = Word;