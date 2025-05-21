const Tour = require('../Model/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync=require('../utils/catchAsync');
const AppError = require('../utils/appError');







exports.getAllTours = catchAsync(async (req, res,next) => {
  
    /* const reqQuery = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete reqQuery[el]);
    // 1) Filtering
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr))
    let query = Tour.find(JSON.parse(queryStr));
    // 2) Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    }else {
      query.sort('-createdAt');
    }
    // 3) Field limiting
    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields); 
    }else {
      query = query.select('-__v');
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit); */

    // using the APIFeatures class to filter, sort, limit and paginate the data
  const apiFeatures = new APIFeatures(Tour.find(), req.query)
          .filter()
          .sort()
          .limit()
          .paginate();
  const tours = await apiFeatures.query;
  res.status(200).json({
    status: 'success',
    count: tours.length,
    data: {
      tours,
    },
  })

});

exports.createTour = catchAsync( async (req, res,next) => {

  
    const newTour = await Tour.create(req.body);
    if (!newTour) {
      return next(new AppError('Invalid data', 400));
    }

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
})
/* exports.getTour = (req, res) => {
  const id = req.params.id;
  // if arr index and id is same
  //const tour = tours[id];
  // or if we want to get the tour by id and id is not same as index then we can use this method
  // we can use Object.fromEntries to convert the array of objects into an object with the id as the key
  const toursObj = Object.fromEntries(tours.map((el) => [el.id, el]));
  // then we can use this to get the tour by id
  const tour = toursObj[id];
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
}; */

exports.getTour =catchAsync(async (req, res,next) => {
  console.log(req.params.id);
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  
});

exports.updateTour =catchAsync(async (req, res,next) => {
   
    const body = req.body;
    const tour = await Tour.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(203).json({
      status: 'success',
      data: {
        tour,
      },
    })
  
})


exports.deleteTour =catchAsync(async (req, res,next) => {

  
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if(!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
    res.status(204).json({
      status: 'success',
      data: null,
    })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
  
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gt: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          ratingsAverage: { $avg: '$ratingsAverage' },
          numTours: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
      },
    });
  
});

exports.getYerlyPlan = catchAsync(async (req, res,next) => {
  
    const year = req.params.year * 1;

    if (year < new Date().getFullYear()) {
      return next(new AppError('Year must be above 2019 and less than current year ', 400));
    }
    const MonthStats = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group:{
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
      },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $sort: { month: 1 },
      },
      {
        $project:{
          _id: 0,
        }
      }
    ])
    res.status(200).json({
      status: 'success',
      results: MonthStats.length,
      data: {
        MonthStats,
      },
    });
})