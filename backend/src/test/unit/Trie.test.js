const Trie = require("../../Trie");
const TrieNode = require("../../TrieNode");

describe("Trie class data structure", () => {
  let t;

  beforeEach(() => {
    t = new Trie();
  });

  test("instantiates properly", () => {
    expect(t.root).toBeInstanceOf(TrieNode);
    expect(t.root.char).toBe(undefined);
  });

  test("insert method", () => {
    t.insert("abc");
    expect(t.root.hasChild('a')).toBeTruthy();
    expect(t.root.getChild('a').hasChild('b')).toBeTruthy();
    const leafNode = t.root.getChild('a')
                           .getChild('b')
                           .getChild('c');
    expect(leafNode).not.toBe(null);
    expect(leafNode.char).toBe('c');
    expect(leafNode.isWord).toBeTruthy();
  });

  test("guess method", () => {
    t.insert("abc");
    expect(t.guess("abc")).toBeTruthy();
    expect(t.guess("a")).toBeFalsy();
    expect(t.guess("ab")).toBeFalsy();
    expect(t.guess("cba")).toBeFalsy();
  });

  test("getWordsFromRoot method", () => {
    t.insert("act");
    t.insert("cat");
    expect(t.getWordsFrom('tac')).toEqual(["act", "cat"]);
    t.insert("concatenate");
    expect(t.getWordsFrom('tac')).toEqual(["act", "cat"]);
    expect(t.getWordsFrom('concatenate')).toEqual(["concatenate", "cat", "act"]);
  });
});