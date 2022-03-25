process.env.NODE_ENV = "test";

const request = require("supertest");
const { sequelize, Word } = require("../../models");
const app = require("../../app.js");

describe("/words route", () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await Word.create({ word: "hello" });
  });

  describe("GET /words", () => {
    test("returns list of all words", async () => {
      const { statusCode, body } = await request(app).get("/words");
      expect(statusCode).toBe(200);
      expect(body.length).toBe(1);
      expect(body).toEqual([ { id: 1, word: "hello" } ]);
    });

    test.only("returns word object with definitions association when term is specified", async () => {
      const { statusCode, body } = await request(app).get("/words?term=hello");
      expect(statusCode).toBe(200);
      expect(body.definitions.length).toBe(7);
      expect(body).toEqual({
        id: 1, word: "hello",
        definitions: [
          {
            id: 1,
            definition: '"Hello!" or an equivalent greeting.',
            example: null,
            categoryId: 1,
            wordId: 1,
            category: { id: 1, name: 'noun' }
          },
          {
            id: 2,
            definition: 'To greet with "hello".',
            example: null,
            categoryId: 2,
            wordId: 1,
            category: { id: 2, name: 'verb' }
          },
          {
            id: 3,
            definition: 'A greeting (salutation) said when meeting someone or acknowledging someone’s arrival or presence.',
            example: 'Hello, everyone.',
            categoryId: 3,
            wordId: 1,
            category: { id: 3, name: 'interjection' }
          },
          {
            id: 4,
            definition: 'A greeting used when answering the telephone.',
            example: 'Hello? How may I help you?',
            categoryId: 3,
            wordId: 1,
            category: { id: 3, name: 'interjection' }
          },
          {
            id: 5,
            definition: 'A call for response if it is not clear if anyone is present or listening, or if a telephone conversation may have been disconnected.',
            example: 'Hello? Is anyone there?',
            categoryId: 3,
            wordId: 1,
            category: { id: 3, name: 'interjection' }
          },
          {
            id: 6,
            definition: 'Used sarcastically to imply that the person addressed or referred to has done something the speaker or writer considers to be foolish.',
            example: 'You just tried to start your car with your cell phone. Hello?',
            categoryId: 3,
            wordId: 1,
            category: { id: 3, name: 'interjection' }
          },
          {
            id: 7,
            definition: 'An expression of puzzlement or discovery.',
            example: 'Hello! What’s going on here?',
            categoryId: 3,
            wordId: 1,
            category: { id: 3, name: 'interjection' }
          }
        ]
      })
    });

  });

  // describe("GET /words?term=hello", () => {
  //   // test("returns ")
  // });

});