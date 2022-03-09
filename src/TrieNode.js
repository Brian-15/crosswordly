/** Node for Trie data structure */
class TrieNode {
  constructor(char) {
    this.char = char;
    this.children = new Array(26).fill(null);
    this.isWord = false;
  }

  markWord() {
    this.isWord = true;
  }

  unMarkWord() {
    this.isWord = false;
  }
}

module.exports = TrieNode;