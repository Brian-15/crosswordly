const Word = require("../../Word");

describe("Word class", () => {

  let wH, wV;

  beforeEach(() => {
    wH = new Word("exam", 1, 2, true);
    wV = new Word("exam", 3, 4, false);
  });

  test("instantiates properly", () => {
    expect(wH.isHorizontal).toBeTruthy();
    expect(wV.isHorizontal).toBeFalsy();
    expect(wH.coords).toEqual({
      xi: 1,
      yi: 2,
      xf: 1,
      yf: 5
    });
    expect(wV.coords).toEqual({
      xi: 3,
      yi: 4,
      xf: 6,
      yf: 4
    });
    expect(wH.charMap).toEqual(wV.charMap);
    expect(wH.charMap).toEqual({
      'e': 0,
      'x': 1,
      'a': 2,
      'm': 3
    });
    expect(wH.word).toBe(wV.word);
    expect(wV.word).toBe("exam");
  });

  describe("has method", () => {
    test("returns true when character present in word", () => {
      expect(wH.has("e")).toBeTruthy();
      expect(wV.has("e")).toBeTruthy();
    });

    test("returns false when character is not present in word", () => {
      expect(wH.has("p")).toBeFalsy();
      expect(wV.has("p")).toBeFalsy();
    });
  });

  describe("charIdx method", () => {
    test("returns first index of char", () => {
      expect(wH.charIdx('e')).toBe(0);
      expect(wV.charIdx('m')).toBe(3);
    });

    test("returns undefined if no index is found", () => {
      expect(wH.charIdx('p')).toBe(undefined);
    });
  });
});