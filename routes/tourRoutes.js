const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getYerlyPlan,
  getToursWithinDistance,
  getDistances,
} = require("../controllers/toursController");
const protect = require("../middelwares/protectionMiddleware");
const restrictionMiddleware = require("../middelwares/restrictionMiddleware");
const reviewRouter = require("./reviewRoutes");

const Router = require("express").Router();

// TODO merge params is used to merge the params of the parent (tour) route with the params of the child route (review)
Router.use("/:tourId/reviews", reviewRouter);

// TODO route to get the nearest tours in certin distance  from specific location or point

Router.route("/within-distance/:distance/center/:location/unit/:unit").get(protect, getToursWithinDistance);
Router.route("/distances/:location/unit/:unit").get(protect, getDistances);

Router.route("/").get(getAllTours).post(protect, restrictionMiddleware("admin", "lead-guide"), createTour);

Router.route("/tour-stats").get(getTourStats);

Router.route("/yearly-plan/:year").get(getYerlyPlan);

Router.route("/:id")
  .get(getTour)
  .patch(protect, restrictionMiddleware("lead-guide", "admin"), updateTour)
  .delete(protect, restrictionMiddleware("lead-guide", "admin"), deleteTour);

module.exports = Router;
