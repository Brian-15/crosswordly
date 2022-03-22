const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index");
const boardsRouter = require("./routes/boards");
const wordsRouter = require("./routes/words");
const usersRouter = require("./routes/users");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/words", wordsRouter);
app.use("/boards", boardsRouter);

module.exports = app;