const router = require("express").Router();
const rateLimit = require("express-rate-limit");
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

const limiter = rateLimit({
  max: 3,
  windowMs: 5 * 60 * 1000,
  message: "Too many tries of login requests , please try again in an 15 minutes!",
});

router.post("/signup", signup);
router.post("/login", limiter, loginValidator, login); //! limiter => Limiting login requests
router.post("/forgotpassword", forgotPassword);
router.patch("/restpassword/:token", resetPassword);
router.patch("/updatepassword", protect, updatePassword);
router.patch("/updatemydata", protect, updateMyData);
router.delete("/deActivateUser", protect, deActivateUser);

router.route("/").get(getAllUsers);

router.route("/:id").get(getUser).patch(updateUser);

module.exports = router;
