const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [
      {
        validator: function (el) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(el);
        },
        message: "Please provide a valid email",
      },
    ],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// ! Middleware to hash the password before saving the user document

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// ! Middleware to set passwordChangedAt field when password is changed

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  // subtract 1 second to ensure the JWT is not issued before passwordChangedAt
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// ! Middlewer to only show active users

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// ! Instance methods for user schema for password comparison
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// ! Instance method to check if password was changed after JWT was issued
userSchema.methods.checkPasswordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp; // if true, password was changed after token was issued
  }
  //  false means not changed
  return false;
};

// ! Instance method to create a password reset token and set it "hashed" to the user document
userSchema.methods.createPasswordResetToken = function () {
  // Create a reset token
  const resetToken = Math.floor(Math.random() * 1000000); // Generate a random number as token (you can use a more secure method

  // Hash the token and set it to passwordResetToken field

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken.toString()).digest("hex");
  // Set the expiration time for the token
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
