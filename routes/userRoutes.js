const router = require("express").Router();
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  getAllUsers,
  updateUser,
  getUser,
} = require("../controllers/userController");
const loginValidator = require("../middelwares/loginValidator");

router.post("/signup", signup);
router.post("/login", loginValidator, login);
router.post("/forgotpassword", forgotPassword);
router.post("/restpassword/:token", resetPassword);

router.route("/").get(getAllUsers);

router.route("/:id").get(getUser).patch(updateUser);

module.exports = router;
