const Trie = require("./Trie");
const TrieNode = require("./TrieNode");

describe("Trie class data structure", () => {
  let t;

  beforeEach(() => {
    t = new Trie();
  });

  test("instantiates properly", () => {
    expect(t.root).toBeInstanceOf(TrieNode);
    expect(t.root.char).toBe(undefined);
  });

  test("getChildIdx method", () => {
    expect(Trie.getChildIdx('a')).toBe(0);
    expect(Trie.getChildIdx('z')).toBe(25);
  });

  test("insert method", () => {
    t.insert("abc");
    expect(t.root.children[Trie.getChildIdx('a')].char).toBe('a');
    expect(t.root.children[Trie.getChildIdx('a')]
                 .children[Trie.getChildIdx('b')].char).toBe('b');
    const leafNode = t.root.children[Trie.getChildIdx('a')]
                           .children[Trie.getChildIdx('b')]
                           .children[Trie.getChildIdx('c')];
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

  test("processWordsFrom method", () => {
    t.processWordsFrom("cat");
    console.log(t.root.children);
    expect(t.guess("act")).toBeTruthy();
    expect(t.guess("cat")).toBeTruthy();
    expect(t.guess("at")).toBeFalsy();
  });
});