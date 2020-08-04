const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expireToken: { type: Date, expires: 600, default: Date.now() },
});

const ResetPasswordToken = mongoose.model(
  "ResetPasswordToken",
  resetPasswordSchema
);

module.exports = ResetPasswordToken;
