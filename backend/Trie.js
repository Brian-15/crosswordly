const dict = require("./dictionary.json");
const TrieNode = require("./TrieNode");

/** Prefix tree data structure */
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert = word => {
    let node = this.root;
    for (const char of word) {
      node = node.hasChild(char) ? node.getChild(char) : node.addChild(char);
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
      if (!node || !node.hasChild(char)) return false;
      node = node.getChild(char);
    }
    return node.isWord;
  };
}

module.exports = Trie;