const TrieNode = require("./TrieNode");

describe("Node class", () => {
  let node;

  beforeEach(() => {
    node = new TrieNode('a');
  });

  test("instanciates properly", () => {
    expect(node.char).toBe('a');
    expect(node.isWord).toBeFalsy();
    expect(node.children.length).toBe(26);
  });

  test("toggles isWord with class methods", () => {
    node.markWord();
    expect(node.isWord).toBeTruthy();
    node.unMarkWord();
    expect(node.isWord).toBeFalsy();
  });
});