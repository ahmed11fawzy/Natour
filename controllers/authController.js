const User = require("../Model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, passwordChangedAt, role } =
    req.body;
  const newUser = await User.create({
    // to prevent user from sending unwanted data, we can use destructuring and rest operator
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  });
  if (!newUser) {
    return next(new AppError("please provide a valid user data", 400));
  }
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // Check if user exists in the database
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password"); // Select the password field to compare it later

  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Check if password is correct
  const isPasswordCorrect = await user.correctPassword(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  token = await generateToken(user);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  // Generate a reset token and save it to the user document
  const resetToken = user.createPasswordResetToken();
  console.log("🚀 ~resetToken:", resetToken);
  user.save({ validateBeforeSave: false }); // Save the user with the reset token without validation

  // Create a reset URL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and
                       passwordConfirm to: ${resetURL}.
                      \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email,
      subject: "Your password reset token (valid for 10 min)",
      resetToken, // Pass the reset token to the email function
      url: resetURL, // Pass the reset URL to the email function
    }); // Send the email with the reset token and URL

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined; // Clear the reset token
    user.passwordResetExpires = undefined; // Clear the expiration time
    await user.save({ validateBeforeSave: false }); // Save the user without validation

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params; // Get the token from the URL parameters
  console.log("🚀 ~ token:", token);
  const { password, passwordConfirm } = req.body; // Get the new password and confirm password from the request body

  const hashedToken = crypto
    .createHash("sha256")
    .update(token.toString())
    .digest("hex");

  // Find the user by the reset token and check if it hasn't expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Check if the token is still valid
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // Update the user's password and clear the reset token and expiration time
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); // Save the updated user document

  // Generate a new token for the user
  const newToken = await generateToken(user);

  res.status(200).json({
    status: "success",
    token: newToken, // Return the new token in the response
  });
});
