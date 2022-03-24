process.env.NODE_ENV = "test";
const { sequelize, Word, Category, Definition } = require("../../models");


describe("Word model unit tests", () => {
  let word;

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await Word.create({ word: "hello" });
    word = await Word.findOne({
      where: { word: "hello" },
      include: "definitions"
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("instantiates properly", () => {
    expect(word).toBeTruthy();
    expect(word.word).toBe("hello");
    expect(word.definitions).toEqual([]);
  });

  test("contains words relation", async () => {
    const { id } = await Category.create({ name: "noun" });
    await Definition.create({
      definition: "greeting",
      typeId: id,
      wordId: word.id,
      example: "We were given a warm hello."
    });
    word = await Word.findOne({
      where: { id: word.id },
      include: "definitions"
    });
    expect(word.definitions).toBeTruthy();
    expect(word.definitions.length).toBe(1);
  });

  test("will not create word with empty string", async () => {
    await expect(Word.create({ word: "" })).rejects.toThrow();
  });

  test("will not create word that does not include word string", async () => {
    await expect(Word.create({})).rejects.toThrow();
  });
}); 