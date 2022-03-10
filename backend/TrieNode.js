/** Node for Trie data structure */
class TrieNode {
  constructor(char) {
    this.char = char;
    this.children = new Array(26).fill(null);
    this.numChildren = 0;
    this.isWord = false;
  }

  static getChildIdx = char => char.charCodeAt(0) - 'a'.charCodeAt(0);

  markWord() {
    this.isWord = true;
  }

  unMarkWord() {
    this.isWord = false;
  }

  getChild(char) {
    return this.children[TrieNode.getChildIdx(char)];
  }

  hasChild(char) {
    return this.getChild(char) !== null;
  }

  addChild(char) {
    const child = new TrieNode(char);
    this.children[TrieNode.getChildIdx(char)] = child;
    this.numChildren++;
    return child;
  }

  getNextChild() {
    const children = this.children;
    let idx = 0;
    return function() {
      if (idx >= children.length) return null;
      for (let i = idx; i < children.length; i++) {
        if (children[i] !== null) {
          idx = i + 1;
          return children[i];
        }
      }
      return null;
    }
  }
}

module.exports = TrieNode;