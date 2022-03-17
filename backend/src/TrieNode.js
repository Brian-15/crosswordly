/** Node for Trie data structure */
class TrieNode {
  constructor(char) {
    this.char = char;
    this.children = new Array(26).fill(null);
    this.numChildren = 0;
    this.isWord = false;
  }

  static getChildIdx = char => char.charCodeAt(0) - 'a'.charCodeAt(0);

  /** label node as being the end of a valid word */
  markWord() {
    this.isWord = true;
  }

  /** remove valid word label from node */
  unMarkWord() {
    this.isWord = false;
  }

  /** get child node for character */
  getChild(char) {
    return this.children[TrieNode.getChildIdx(char)];
  }

  /** returns true if node has a child node for specified character */
  hasChild(char) {
    return !!this.getChild(char);
  }

  /** adds child node for specified character */
  addChild(char) {
    const child = new TrieNode(char);
    this.children[TrieNode.getChildIdx(char)] = child;
    this.numChildren++;
    return child;
  }

  /** returns incremental function that will get next child node, and returns null if none are left */
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