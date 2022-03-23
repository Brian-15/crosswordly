const express = require("express");
const router = express.Router();
const { Word, Definition, Category } = require("../models");

const axios = require("axios");
const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

router.get("", async (req, res, next) => {
  const term = req.query.term;
  try {
    if (!term) return res.status(200).json(await Word.findAll());

    let word = await Word.findOne({ where: { word: term } });
    if (!word.definitions.length) {
      // parse definition data from Free Dictionary API https://dictionaryapi.dev/
      const definitions = await axios.get(API_URL + term);
      definitions.forEach(({ meanings }) => {
        meanings.forEach(({ partOfSpeech, definitions }) => {
          let category = await Category.findOne({ where: { name: partOfSpeech } });
          if (!category) {
            category = await Category.create({ partOfSpeech });
          }
          definitions.forEach(({ definition, example }) => {
            await Definition.create({
              definition,
              example,
              typeId: category.id,
              wordId: word.id
            });
          });
        });
      });
      word = await Word.findOne({ where: { word: term } });
    }
    return res.status(200).json(word);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;