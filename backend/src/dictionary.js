const Trie = require("./Trie");
const dict = require("../dictionary.json");

const trie = new Trie();

Object.keys(dict).forEach(word =>
  word.length >= 3
  ? trie.insert(word)
  : undefined);

module.exports = trie;