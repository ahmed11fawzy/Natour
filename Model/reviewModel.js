const mongoose = require("mongoose");
const Tour = require("./tourModel");
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ! INDEXES

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

// ! Static Fuctions

// static function for calcAvgRatings of reviews per tour and insert this to each tour ...
reviewSchema.statics.calcAvgRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        ratingsNumber: { $sum: 1 },
        ratingsAvg: { $avg: "$rating" },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(
    { _id: tourId },
    {
      ratingsQuantity: stats[0].ratingsNumber,
      ratingsAverage: stats[0].ratingsAvg,
    }
  );
};

// ! Middelware

// this middelware for run static function CalcAvgRatings after save
reviewSchema.post("save", function () {
  // ? this points to current review

  this.constructor.calcAvgRatings(this.tour);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo role",
  });
  next();
});

// TODO query middlewares for calc AVRAGE RATING after Updating or Delete Review ...

// TODO 1) calc AVRAGE RATING after Updating or Delete query is finshed .
reviewSchema.post(/^findOneAnd/, async function (doc) {
  // ? doc :- is the document that was found/updated/deleted
  if (doc) await doc.constructor.calcAvgRatings(doc.tour);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
