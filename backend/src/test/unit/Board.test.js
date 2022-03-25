process.env.NODE_ENV = "test";
const Board = require("../../Board");

describe("Board class", () => {
  const _ = null, WIDTH = 5, HEIGHT = 6;
  let b;

  beforeEach(() => {
    b = new Board('likeable', HEIGHT, WIDTH);
  });

  test("instantiates properly", () => {
    expect(b.height).toBe(HEIGHT);
    expect(b.width).toBe(WIDTH);
    expect(b.rows.length).toBe(HEIGHT);
    expect(b.rows.every(row => row.length === WIDTH)).toBeTruthy();
  });

  test("get method returns 2D array", () => {
    const rows = b.get();
    expect(rows.length).toBe(HEIGHT);
    expect(rows.every(row => row.length === WIDTH));
  });

  describe("at method", () => {
    test("returns row if only first argument x is specified", () => {
      expect(b.at(0)).toEqual(new Array(WIDTH).fill(_));
    });

    test("returns cell value when both x and y arguments are specified", () => {
      expect(b.at(0, 0)).toBe(_);
    });
  });

  describe("setWidth method", () => {
    test("width smaller than original", () => {
      b.setWidth(WIDTH - 1);
      expect(b.width).toBe(WIDTH - 1);
      expect(b.rows.every(row => row.length === WIDTH - 1)).toBeTruthy();
    });

    test("width greater than original", () => {
      b.setWidth(WIDTH + 1);
      expect(b.width).toBe(WIDTH + 1);
      expect(b.rows.every(row => row.length === WIDTH + 1)).toBeTruthy();
    });

    test("width equal to original", () => {
      b.setWidth(WIDTH);
      expect(b.width).toBe(WIDTH);
      expect(b.rows.every(row => row.length === WIDTH)).toBeTruthy();
    });

    test("invalid width less than 0", () => {
      expect(() => b.setWidth(-1)).toThrow();
    });
  });

  describe("setHeight method", () => {
    test("height smaller than original", () => {
      b.setHeight(HEIGHT - 1);
      expect(b.height).toBe(HEIGHT - 1);
      expect(b.rows.length).toBe(HEIGHT - 1);
    });

    test("height greater than original", () => {
      b.setHeight(HEIGHT + 1);
      expect(b.height).toBe(HEIGHT + 1);
      expect(b.rows.length).toBe(HEIGHT + 1);
    });

    test("height equal to original", () => {
      b.setHeight(HEIGHT);
      expect(b.height).toBe(HEIGHT);
      expect(b.rows.length).toBe(HEIGHT);
    });

    test("height width less than 0", () => {
      expect(() => b.setHeight(-1)).toThrow();
    });
  });

  test("setDimensions method", () => {
    b.setDimensions(10, 8);
    expect(b.height).toBe(10);
    expect(b.rows.length).toBe(10);
    expect(b.width).toBe(8);
    expect(b.rows.every(row => row.length === 8)).toBeTruthy();
  });

  describe("hasBlankAdjacentCells method", () => {
    test("should return true when either x or y are out of bounds", () => {
      for (const bool of [true, false]) {
        expect(b.hasBlankAdjacentCells(b.height, 0, bool, bool ? b.height : 0)).toBeTruthy();
        expect(b.hasBlankAdjacentCells(0, b.width, bool, bool ? 0 : b.width)).toBeTruthy();
        expect(b.hasBlankAdjacentCells(b.height, b.width, bool, bool ? b.height : b.width)).toBeTruthy();
      }
    });

    test("should return true when all cells are blank", () => {
      expect(b.hasBlankAdjacentCells(0, 0, true, 0)).toBeTruthy();
      expect(b.hasBlankAdjacentCells(0, 0, false, 0)).toBeTruthy();
      expect(b.hasBlankAdjacentCells(2, 2, true, 0)).toBeTruthy();
      expect(b.hasBlankAdjacentCells(2, 2, false, 0)).toBeTruthy();
    });

    test("should return false for a position next to a horizontal word", () => {
      b.placeWord("stuff", 0, 0, true);
      for (let i = 0; i < 5; i++) {
        expect(b.hasBlankAdjacentCells(1, i, true, 0)).toBeFalsy();
      }
    });

    test("should return false for a position next to a vertical word", () => {
      b.placeWord("stuff", 0, 0, false);
      for (let i = 0; i < 5; i++) {
        expect(b.hasBlankAdjacentCells(i, 1, false, 0)).toBeFalsy();
      }
    });
  });

  describe("placeWord method", () => {
    test("throws error if isHorizontal is not specified", () => {
      expect(() => b.placeWord("anything", 0, 0)).toThrow();
    });

    test("throws error if x and/or y are negative", () => {
      expect(() => b.placeWord("anything", -1, 2, true)).toThrow();
    });

    test("places word whose length does not go out of bounds", () => {
      b.placeWord("stuff", 0, 0, true);
      expect(b.width).toBe(WIDTH);
      expect(b.height).toBe(HEIGHT);
      expect(b.rows[0]).toEqual(['s', 't', 'u', 'f', 'f']);
      expect(b.rows.every(row => row.length === WIDTH)).toBeTruthy();
    });

    test("places word across another", () => {
      b.placeWord("stuff", 2, 1, true);
      expect(b.canPlaceWord("atmosphere", 1, 2, false, 2)).toBeTruthy();
      b.placeWord("atmosphere", 1, 2, false);
      expect(b.rows).toEqual([
        [ _, _, _, _, _, _ ],
        [ _, _, 'a', _, _, _ ],
        [ _, 's', 't', 'u', 'f', 'f' ],
        [ _, _, 'm', _, _, _ ],
        [ _, _, 'o', _, _, _ ],
        [ _, _, 's', _, _, _ ],
        [ _, _, 'p', _, _, _ ],
        [ _, _, 'h', _, _, _ ],
        [ _, _, 'e', _, _, _ ],
        [ _, _, 'r', _, _, _ ],
        [ _, _, 'e', _, _, _ ]
      ]);
    });
    
    describe("adjusts board dimensions when placed words go out of bounds", () => {
      const word = "stuff";

      test("places horizontal word out of column bounds", () => {
        b.placeWord(word, 0, b.width, true);
        expect(b.width).toBe(WIDTH + word.length);
        expect(b.rows[0].length).toBe(WIDTH + word.length);
        expect(b.height).toBe(HEIGHT);
        expect(b.rows.length).toBe(HEIGHT);
        expect(b.rows).toEqual([
          [_, _, _, _, _, 's', 't', 'u', 'f', 'f'],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _]
        ]);
      });

      test("places vertical word out of column bounds", () => {
        b.placeWord(word, 0, b.width, false);
        expect(b.width).toBe(WIDTH + 1);
        expect(b.rows.every(row => row.length === WIDTH + 1)).toBeTruthy();
        expect(b.height).toBe(HEIGHT);
        expect(b.rows.length).toBe(HEIGHT);
        expect(b.rows).toEqual([
          [_, _, _, _, _, 's'],
          [_, _, _, _, _, 't'],
          [_, _, _, _, _, 'u'],
          [_, _, _, _, _, 'f'],
          [_, _, _, _, _, 'f'],
          [_, _, _, _, _, _]
        ]);
      });

      test("places horizontal word out of row bounds", () => {
        b.placeWord(word, b.height, 0, true);
        expect(b.width).toBe(WIDTH);
        expect(b.rows.every(row => row.length === WIDTH)).toBeTruthy();
        expect(b.height).toBe(HEIGHT + 1);
        expect(b.rows.length).toBe(HEIGHT + 1);
        expect(b.rows).toEqual([
          [_, _, _, _, _],
          [_, _, _, _, _],
          [_, _, _, _, _],
          [_, _, _, _, _],
          [_, _, _, _, _],
          [_, _, _, _, _],
          ['s', 't', 'u', 'f', 'f']
        ]);
      });

      test("places vertical word out of row bounds", () => {
        b.placeWord(word, b.height, 0, false);
        expect(b.width).toBe(WIDTH);
        expect(b.rows.every(row => row.length === WIDTH)).toBeTruthy();
        expect(b.height).toBe(HEIGHT + word.length);
        expect(b.rows.length).toBe(HEIGHT + word.length);
        expect(b.rows).toEqual([
          [_, _, _, _, _],
          [_, _, _, _, _],
          [_, _, _, _, _],
          [_, _, _, _, _],
          [_, _, _, _, _],
          [_, _, _, _, _],
          ['s', _, _, _, _],
          ['t', _, _, _, _],
          ['u', _, _, _, _],
          ['f', _, _, _, _],
          ['f', _, _, _, _]
        ]);
      });

      test("places horizontal word out of both column and row bounds", () => {
        b.placeWord(word, b.height, b.width, true);
        expect(b.width).toBe(WIDTH + word.length);
        expect(b.rows.every(row => row.length === WIDTH + word.length)).toBeTruthy();
        expect(b.height).toBe(HEIGHT + 1);
        expect(b.rows.length).toBe(HEIGHT + 1);
        expect(b.rows).toEqual([
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, 's', 't', 'u', 'f', 'f']
        ]);
      });

      test("places horizontal word out of both column and row bounds", () => {
        b.placeWord(word, b.height, b.width, false);
        expect(b.width).toBe(WIDTH + 1);
        expect(b.rows.every(row => row.length === WIDTH + 1)).toBeTruthy();
        expect(b.height).toBe(HEIGHT + word.length);
        expect(b.rows.length).toBe(HEIGHT + word.length);
        expect(b.rows).toEqual([
          [_, _, _, _, _, _],
          [_, _, _, _, _, _],
          [_, _, _, _, _, _],
          [_, _, _, _, _, _],
          [_, _, _, _, _, _],
          [_, _, _, _, _, _],
          [_, _, _, _, _, 's'],
          [_, _, _, _, _, 't'],
          [_, _, _, _, _, 'u'],
          [_, _, _, _, _, 'f'],
          [_, _, _, _, _, 'f']
        ]);
      });
    });
    
  });

  describe("canPlaceWord method", () => {
    test("throws error when isHorizontal parameter is not specified", () =>{
      expect(() => b.canPlaceWord("stuff", 0, 0)).toThrow();
    });

    test("returns false when indices are below zero", () => {
      expect(b.canPlaceWord("anything", -1, 0, true, 0)).toBeFalsy();
      expect(b.canPlaceWord("anything", 0, -1, false, 0)).toBeFalsy();
      expect(b.canPlaceWord("anything", -1, -3, true, 0)).toBeFalsy();
    });

    test("can place any word in blank board", () => {
      expect(b.canPlaceWord("abcd", 0, 0, true, 0)).toBeTruthy();
      expect(b.canPlaceWord("abcd", 0, 0, false, 0)).toBeTruthy();
    });

    test("returns true when word's length goes out of bounds", () => {
      expect(b.canPlaceWord("supercalifragilisticexpialidocious", 0, 0, true, 0)).toBeTruthy();
      expect(b.canPlaceWord("supercalifragilisticexpialidocious", 0, 0, false, 0)).toBeTruthy();
    });

    test("returns true when placing a horizontal word out of bounds", () => {
      expect(b.canPlaceWord("things", 0, b.width, true)).toBeTruthy();
      expect(b.canPlaceWord("things", b.height, 0, true)).toBeTruthy();
      expect(b.canPlaceWord("things", b.height, b.width, true)).toBeTruthy();
      expect(b.canPlaceWord("things", 30, 50, true)).toBeTruthy();
    });

    test("returns true when placing a vertical word out of bounds", () => {
      expect(b.canPlaceWord("things", 0, b.width, false)).toBeTruthy();
      expect(b.canPlaceWord("things", b.height, 0, false)).toBeTruthy();
      expect(b.canPlaceWord("things", b.height, b.width, false)).toBeTruthy();
      expect(b.canPlaceWord("things", 30, 50, false)).toBeTruthy();
    });

    test("returns true when two words intersect on the same letter", () => {
      b.placeWord("things", 5, 5, true);
      expect(b.canPlaceWord("try", 5, 5, false)).toBeTruthy();
    });

    test("returns false when horizontal word over another horizontal word", () => {
      b.placeWord("things", 5, 5, true);
      expect(b.canPlaceWord("try", 5, 5, true)).toBeFalsy();
    });

    test("returns false when vertical word over another vertical word", () => {
      b.placeWord("things", 5, 5, false);
      expect(b.canPlaceWord("try", 5, 5, false)).toBeFalsy();
    });

    test("returns false when horizontal word's intersection with vertical word does not match", () => {
      b.placeWord("things", 5, 5, true);
      expect(b.canPlaceWord("stuff", 5, 5, false)).toBeFalsy();
    });

    test("returns false when vertical word's intersection with horizontal word does not match", () => {
      b.placeWord("things", 5, 5, false);
      expect(b.canPlaceWord("stuff", 5, 5, true)).toBeFalsy();
    });

    test("returns false when checking if vertical word can be placed between two vertical words", () => {
      b.placeWord("things", 5, 5, true);
      b.placeWord("atlantic", 4, 5, false);
      b.placeWord("itch", 5, 7, false);
      expect(b.canPlaceWord("hinge", 5, 6, false, 6)).toBeFalsy();
    });

    test("returns false when checking if horizontal word can be placed between two vertical words", () => {
      b.placeWord("things", 5, 5, false);
      b.placeWord("atlantic", 5, 4, true);
      b.placeWord("itch", 7, 5, true);
      expect(b.canPlaceWord("hinge", 6, 5, false, 5)).toBeFalsy();
    });
  });

  describe("genBoard method", () => {
    test("generates board matrix properly", () => {
      Math.random = jest.fn(() => 1);
      b.genBoard(0, 0, 10);
      expect(b.rows).toEqual([
        ['l', 'i', 'k', 'e', _, _, _],
        ['i', _, _,_, _, _, _],
        ['k', _, _, 'b', 'a', 'l', 'k'],
        ['e', _, _, 'a', _, _, _],
        ['a', _, _, 'i', _, _, _],
        ['b', 'a', 'i', 'l', 'e', 'e', _],
        ['l', _, _, 'i', _, _, _],
        ['e', _, _, 'k', _, _, _],
        [_, _, 'b', 'a', 'l', 'l', _],
        [_, _, _, 'b', _, _, _],
        [_, _, _, 'l', 'i', 'e', _],
        ['b', 'a', 'l', 'e', _, _, _],
        [_, _, 'i', _, _, _, _],
        [_, _, 'b', _, _, _, _]
      ]);
    });
  });
  
});