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

    // داخل الـ developerSchema في ملف developer.schema.js

teams: [{
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Developer" 
  },
  joinedAt: { 
    type: Date, 
    default: Date.now 
  },
  // هنا بنحدد المطور ده يقدر يعمل إيه في فريق الأدمن ده
  permissions: {
    canCreateProjects: { type: Boolean, default: false },
    canEditProjects: { type: Boolean, default: false },
    canDeleteProjects: { type: Boolean, default: false },
    canManageTasks: { type: Boolean, default: true }, // غالباً أي حد بينضم بيقدر يدير التاكات
    canSeeFinancials: { type: Boolean, default: false } // هل يشوف الفلوس والـ Hourly Rate؟
  }
}],

    resetOTPLastRequest: {
      type: Date,
    }

    
  },

  

  { timestamps: true },
);

module.exports = mongoose.model("Developer", developerSchema);
