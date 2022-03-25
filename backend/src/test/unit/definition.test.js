process.env.NODE_ENV = "test";

const { sequelize, Definition, Word, Category } = require("../../models");

describe("Definition model", () => {
  let word, category;
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    word = await Word.create({ word: "hello" });
    category = await Category.create({ name: "noun" });
    definition = await Definition.create({
      definition: "hello noun",
      example: "example hello noun",
      wordId: word.id,
      categoryId: category.id
    });
  });

  afterEach(async () => {
    await sequelize.sync({ force: true });
  });

  test("instantiates properly", async () => {
    expect(word && category && definition).toBeTruthy();
    expect(definition.wordId).toBe(word.id);
    expect(definition.definition).toBe("hello noun");
    expect(definition.example).toBe("example hello noun");
    expect(definition.categoryId).toBe(category.id);
  });

  test("does not allow empty definition string", async () => {
    await expect(Definition.create({
      wordId: word.id,
      categoryId: category.id,
      definition: "",
    })).rejects.toThrow();
  });

  test("does not allow null definition string", async () => {
    await expect(Definition.create({
      wordId: word.id,
      categoryId: category.id,
    })).rejects.toThrow();
  });

  test("category relation", async () => {
    definition = await Definition.findOne({
      where: { id: definition.id },
      include: "category"
    });
    expect(definition.category).toBeTruthy();
    expect(definition.category.name).toBe("noun");
  });
});