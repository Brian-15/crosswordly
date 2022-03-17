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

  // processWordsFrom = (letters, word='') => {
  //   if (word.length >= 3 && dict[word]) this.insert(word);
  //   for (let i = 0; i < letters.length; i++) {
  //     this.processWordsFrom(letters.substring(0, i) + letters.substring(i + 1), word + letters[i]);
  //   }
  // };
  
  guess = word => {
    let node = this.root;
    for (const char of word) {
      if (!node || !node.hasChild(char)) return false;
      node = node.getChild(char);
    }
    return node.isWord;
  };

  getWordsFrom = (letters, maxDepth=letters.length, node=this.root, word="") => {
    const words = [];
    const visited = {};
    if (node.isWord) words.push(word);
    if (!letters.length || !node || word.length >= maxDepth) return words;
    for (let i = 0; i < letters.length; i++) {
      if (!visited[letters[i]]) visited[letters[i]] = true;
      else continue;
      if (node.hasChild(letters[i])) {
        words.push(...this.getWordsFrom(
          letters.slice(0, i) + letters.slice(i + 1),
          maxDepth,
          node.getChild(letters[i]),
          `${word}${letters[i]}`));
      }
    }
    return words;
  };
}

module.exports = Trie;