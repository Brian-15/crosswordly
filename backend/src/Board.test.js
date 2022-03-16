const Board = require("./Board");

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
      expect(b.at(0)).toEqual(new Array(WIDTH).fill(null));
    });

    test("returns cell value when both x and y arguments are specified", () => {
      expect(b.at(0, 0)).toBe(null);
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
      expect(b.canPlaceWord("atmosphere", 1, 2, false)).toBeTruthy();
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
      expect(b.canPlaceWord("anything", -1, 0, true)).toBeFalsy();
      expect(b.canPlaceWord("anything", 0, -1, false)).toBeFalsy();
      expect(b.canPlaceWord("anything", -1, -3, true)).toBeFalsy();
    });

    test("can place any word in blank board", () => {
      expect(b.canPlaceWord("abcd", 0, 0, true)).toBeTruthy();
      expect(b.canPlaceWord("abcd", 0, 0, false)).toBeTruthy();
    });

    test("returns true when word's length goes out of bounds", () => {
      expect(b.canPlaceWord("supercalifragilisticexpialidocious", 0, 0, true)).toBeTruthy();
      expect(b.canPlaceWord("supercalifragilisticexpialidocious", 0, 0, false)).toBeTruthy();
    });

    test("returns true when placing a horizontal word out of bounds", () => {
      expect(b.canPlaceWord("things", 0, b.width, true)).toBeTruthy();
      expect(b.canPlaceWord("things", b.height, 0, true)).toBeTruthy();
      expect(b.canPlaceWord("things", b.height, b.width, true)).toBeTruthy();
    });

    test("returns true when placing a vertical word out of bounds", () => {
      expect(b.canPlaceWord("things", 0, b.width, false)).toBeTruthy();
      expect(b.canPlaceWord("things", b.height, 0, false)).toBeTruthy();
      expect(b.canPlaceWord("things", b.height, b.width, false)).toBeTruthy();
    });
  });

  describe("genBoard method", () => {
    test.only("", () => {
      b.genBoard();
    });
  });
  
});