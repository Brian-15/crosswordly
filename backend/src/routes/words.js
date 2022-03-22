const express = require("express");
const router = express.Router();
const Word = require("../models/word");

router.get("/:term", async (req, res, next) => {
  const { term } = req.params;
  try {
    const word = await Word.findOne({ where: { word: term } });
    return res.status(200).json(word);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;