const TrieNode = require("../../TrieNode");

describe("TrieNode class", () => {
  let node;

  beforeEach(() => {
    node = new TrieNode('a');
    const child = new TrieNode('a');
    node.children[0] = child;
    node.numChildren = 1;
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

  test("getChildIdx static method", () => {
    expect(TrieNode.getChildIdx('a')).toBe(0);
    expect(TrieNode.getChildIdx('z')).toBe(25);
  });

  test("hasChild method", () => {
    expect(node.hasChild('l')).toBeFalsy();
    expect(node.hasChild('a')).toBeTruthy();
  });

  test("getChild method", () => {
    expect(node.getChild('l')).toBe(null);
    expect(node.getChild('a')).toBeInstanceOf(TrieNode);
    expect(node.getChild('a').char).toBe('a');
  });

  test("addChild method", () => {
    expect(node.hasChild('b')).toBeFalsy();
    expect(node.numChildren).toBe(1);
    node.addChild('b');
    expect(node.hasChild('b')).toBeTruthy();
    expect(node.numChildren).toBe(2);
  });

  test("getNextChild method", () => {
    node.addChild('x');
    node.addChild('y');
    const nextChild = node.getNextChild();
    expect(nextChild().char).toBe('a');
    expect(nextChild().char).toBe('x');
    expect(nextChild().char).toBe('y');
    expect(nextChild()).toBe(null);
  });
});