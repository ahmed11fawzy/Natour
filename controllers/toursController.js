const fs = require('fs');
const data = fs.readFileSync(
  `${__dirname}/../dev-data/data/tours-simple.json`,
  'utf-8'
);
const tours = JSON.parse(data);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    count: tours.length,
    data: {
      tours,
    },
  });
};

exports.createTour = (req, res) => {
    const newId = (tours.length - 1) + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour,
          },
        });
      }
    );

}
exports.getTour = (req, res) => {
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
};

exports.updateTour = (req, res) => {
    const body = req.body;
    const id = req.params.id;
     const toursObj = Object.fromEntries(tours.map((el) => [el.id, el]));
     // then we can use this to get the tour by id
     toursObj[id]= {...toursObj[id], ...body};
    const toursArr = Object.values(toursObj);

    console.log('🚀 ~ tour:', toursObj);
    fs.writeFile(
      `${__dirname}/../dev-data/data/tours-simple.json`,
      JSON.stringify(toursArr),
      (err) => {
        res.status(201).json({
          status: 'success',
          data: {
            tour: toursObj[id],
          },
        });
      }
    );
    

}