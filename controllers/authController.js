const User = require('../Model/userModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser =await User.create(req.body);
    if(!newUser) {
        return next(new appError('please provide a valid user data', 400));
    }
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        },
    })
});