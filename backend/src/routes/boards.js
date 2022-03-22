const express = require("express");
const router = express.Router();
// const trie = require("../seed");
const Board = require("../Board");

router.get("/:rootWord", (req, res, next) => {
  try {
    if (!req.params.rootWord.length) throw new Error();
    const board = new Board(req.params.rootWord);
    board.genBoard();
    const words = board.activeWords;
    const crossword = board.rows;
    return res.status(200).json({ words, crossword });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;