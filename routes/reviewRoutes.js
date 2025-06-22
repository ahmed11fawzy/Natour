const restrictionMiddleware = require("../middelwares/restrictionMiddleware");
const protect = require("../middelwares/protectionMiddleware");
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const Router = require("express").Router({ mergeParams: true }); // ? enable nested routes and merge the params of the parent (tour) route with the params of the child route (review)

Router.route("/")
  .get(getAllReviews)
  .post(
    protect,
    restrictionMiddleware("user"),
    (req, res, next) => {
      if (!req.body.tour) req.body.tour = req.params.tourId;
      if (!req.body.user) req.body.user = req.user.id;

      next();
    },
    createReview
  );

Router.route("/:id").get(protect, getReview).patch(updateReview).delete(deleteReview);

module.exports = Router;
