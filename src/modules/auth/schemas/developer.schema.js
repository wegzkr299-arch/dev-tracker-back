const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"], minlength: 3 },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["developer", "admin"],
      default: "developer",
      lowercase: true,
    },
    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
    resetOTPAttempts: {
      type: Number,
      default: 0,
    },

    resetOTPLastRequest: {
      type: Date,
    }
  },

  { timestamps: true },
);

module.exports = mongoose.model("Developer", developerSchema);
