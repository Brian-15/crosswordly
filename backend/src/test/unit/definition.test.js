process.env.NODE_ENV = "test";

const { sequelize, Definition, Word, Category } = require("../../models");

describe("Definition model", () => {
  let word, category;
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    word = await Word.create({ word: "hello" });
    category = await Category.create({ name: "noun" });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("instantiates properly", async () => {
    const definition = await Definition.create({
      definition: "hello noun",
      example: "example hello noun",
      wordId: word.id,
      typeId: category.id
    });
    expect(word && category && definition).toBeTruthy();
    expect(definition.wordId).toBe(word.id);
    expect(definition.definition).toBe("hello noun");
    expect(definition.example).toBe("example hello noun");
    expect(definition.typeId).toBe(category.id);
  });

  test("does not allow empty definition string", async () => {
    await expect(Definition.create({
      wordId: word.id,
      typeId: category.id,
      definition: "",
    })).rejects.toThrow();
  });

  test("does not allow null definition string", async () => {
    await expect(Definition.create({
      wordId: word.id,
      typeId: category.id,
    })).rejects.toThrow();
  });
});