const express = require("express");
const router = express.Router();
const { Word, Category, Definition } = require("../models");
const loadDefinitions = require("../helpers/fetchDefinitions");
const trie = require("../dictionary");

router.get("", async (req, res, next) => {
  const term = req.query.term;
  try {
    if (!term) return res.status(200).json(await Word.findAll());
    if (!trie.guess(term)) res.status(404).json({ msg: `${term} is not a valid word.` });
    let word = await Word.findOne({
      where: { word: term },
      include: {
        model: Definition,
        as: "definitions",
        include: {
          all: true,
          nested: true
        }
      }
    });

    if (!word) word = await Word.create({
      word: term
    }, {
      include: [{
        association: "definitions",
        include: ["category"]
      }]
    });

    if (!word.definitions.length) {
      // parse definition data from Free Dictionary API https://dictionaryapi.dev/
      word = await Promise.resolve(
        loadDefinitions(term)
        .then(async result => {
          return [
            await Promise.all(Object.keys(result)
              .map(category => Category.create({ name: category }))),
            result
          ];
        }).then(([categories, definitions]) => {
          const defModels = [];
          categories.forEach(({ id, name }) => {
            defModels.push(...definitions[name].map(data => {
              return Definition.create({
                wordId: word.id,
                categoryId: id,
                ...data
              });
            }));
          });
          return Promise.all(defModels);
        }).then(() => {
          return Word.findOne({
            where: { word: term },
            include: {
              all: true,
              nested: true
            }
          });
        })
      );
    }
    return res.status(200).json(word);
  } catch (err) {
    return next(err);
  }
});

router.get("/random", async (req, res, next) => {
  try {
    const words = await Word.findAll();
    const { word } = words[Math.floor(Math.random() * words.length)];
    return res.status(200).json(word);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;