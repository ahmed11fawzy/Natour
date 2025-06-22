const router = require("express").Router();
const { overview, getTour, login } = require("../controllers/viewController");
const { isLoggedIn } = require("../middelwares/isLoggedIn");

router.use(isLoggedIn);
router.get("/", overview);
router.get("/tour/:slug", getTour);
router.get("/login", login);

module.exports = router;
