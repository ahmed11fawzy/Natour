const { getAllTours, createTour, getTour, updateTour } = require('../controllers/toursController');

const  Router = require('express').Router();


Router.route('/')
      .get(getAllTours)
      .post(createTour);
Router.route('/:id')
      .get(getTour)
       .patch(updateTour)
      /*.delete(deleteTour); */

module.exports = Router;
