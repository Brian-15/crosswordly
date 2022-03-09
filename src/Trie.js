const dict = require("../dictionary.json");
const TrieNode = require("./TrieNode");

/** Prefix tree data structure */
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  static getChildIdx = char => char.charCodeAt(0) - 'a'.charCodeAt(0);

  insert = word => {
    let node = this.root;
    for (const char of word) {
      const idx = Trie.getChildIdx(char);
      if (!node.children[idx]) {
        const child = new TrieNode(char);
        node.children[idx] = child;
        node = child;
      } else {
        node = node.children[idx];
      }
    }
    node.markWord();
  };

  processWordsFrom = (letters, word='') => {
    if (word.length >= 3 && dict[word]) this.insert(word);
    for (let i = 0; i < letters.length; i++) {
      this.processWordsFrom(letters.substring(0, i) + letters.substring(i + 1), word + letters[i]);
    }
  };
  
  guess = word => {
    let node = this.root;
    for (const char of word) {
      const idx = Trie.getChildIdx(char);
      if (!node || !node.children[idx]) return false;
      node = node.children[idx];
    }
    return node.isWord;
  };
}

module.exports = Trie;