const { Router } = require("express");
const router = Router();
const { User } = require("../models");

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
});

/* GET user listing. */
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log("id:", id);
  try {
    const user = await User.findOne({
      where: { uuid: id },
      include: "words"
    });
    return res.status(200).json(user);
  } catch(err) {
    return next(err);
  }
});

/* POST users listing. */
router.post("/", async (req, res, next) => {
  const { username, displayName, password } = req.body;
  try {
    const user = await User.create({ username, displayName, password });
    return res.status(201).json(user);
  } catch(err) {
    return next(err);
  }
});

/* DELETE user listing. */
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    await user.destroy();
    return res.status(200).json({ message: "User has been deleted" });
  } catch(err) {
    return next(err);
  }
});

module.exports = router;
