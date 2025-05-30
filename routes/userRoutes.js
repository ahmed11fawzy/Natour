const router = require("express").Router();
const protect = require("../middelwares/protectionMiddleware");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");
const {
  getAllUsers,
  updateUser,
  getUser,
  updateMyData,
  deActivateUser,
} = require("../controllers/userController");
const loginValidator = require("../middelwares/loginValidator");

router.post("/signup", signup);
router.post("/login", loginValidator, login);
router.post("/forgotpassword", forgotPassword);
router.patch("/restpassword/:token", resetPassword);
router.patch("/updatepassword", protect, updatePassword);
router.patch("/updatemydata", protect, updateMyData);
router.delete("/deActivateUser", protect, deActivateUser);

router.route("/").get(getAllUsers);

router.route("/:id").get(getUser).patch(updateUser);

module.exports = router;
