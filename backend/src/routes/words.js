const express = require("express");
const router = express.Router();
const { Word, Category, Definition } = require("../models");
const loadDefinitions = require("../helpers/fetchDefinitions");

router.get("", async (req, res, next) => {
  const term = req.query.term;
  try {
    if (!term) return res.status(200).json(await Word.findAll());
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

    if (!word.definitions.length) {
      // parse definition data from Free Dictionary API https://dictionaryapi.dev/
      const wordId = word.id;
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
                wordId,
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

module.exports = router;