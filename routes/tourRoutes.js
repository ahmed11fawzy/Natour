const { getAllTours, createTour, getTour, updateTour, deleteTour , getTourStats, getYerlyPlan} = require('../controllers/toursController');

const  Router = require('express').Router();


Router.route('/')
      .get(getAllTours)
      .post(createTour);

Router.route('/tour-stats')
      .get(getTourStats)
      
Router.route('/yearly-plan/:year')
.get(getYerlyPlan);

Router.route('/:id')
      .get(getTour)
      .patch(updateTour)
      .delete(deleteTour);

module.exports = Router;
