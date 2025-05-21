const mongoose = require('mongoose');


const TourSchema = new mongoose.Schema({
    name:{
        type:String,
        requrired:[true,'Tour name is required'],
        unique:true,
        trim:true,
    },
    price:{
        type:Number,
        required:[true,'Tour price is required']
    },
    duration:{
        type:Number,
        required:[true,'Tour duration is required']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'Tour group size is required']
    },
    difficulty:{
        type:String,
        required:[true,'Tour difficulty is required'],
        enum:{
            values:['easy','medium','difficult'],
            message:'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be below 5.0']
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    priceDiscount:{
        type:Number,
    },
    summary:{
        type:String,
        trim:true,
        required:[true,'Tour summary is required']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'Tour image cover is required']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    startDates:[Date],
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true,
});

// virtual properties that are not stored in the database but are calculated on the fly based on other fields
TourSchema.virtual('durationByWeek').get(function(){
    return this.duration / 7;
});
module.exports = mongoose.model('Tour',TourSchema);