const express = require("express");
const router = express.Router();
const { Word } = require("../models");

router.get("", async (req, res, next) => {
  const term = req.query.term;
  try {
    const wordBank = term
      ? await Word.findOne({ where: { word: term } })
      : await Word.findAll();
    return res.status(200).json(wordBank);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;