const { getAllTours, createTour, getTour, updateTour, deleteTour , getTourStats, getYerlyPlan} = require('../controllers/toursController');
const  protect  = require('../middelwares/protectionMiddleware');
const restrictionMiddleware = require('../middelwares/restrictionMiddleware');

const  Router = require('express').Router();


Router.route('/').get(protect,getAllTours).post(createTour);

Router.route('/tour-stats')
      .get(getTourStats)
      
Router.route('/yearly-plan/:year')
.get(getYerlyPlan);

Router.route('/:id')
      .get(getTour)
      .patch(updateTour)
      .delete(protect,restrictionMiddleware,deleteTour);

module.exports = Router;
