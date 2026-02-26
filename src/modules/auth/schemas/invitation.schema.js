const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    // الأدمن اللي بعت الدعوة
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Developer",
      required: true,
      index: true,
    },
    
    // إيميل الشخص اللي المفروض يقبل الدعوة
    recipientEmail: {
      type: String,
      required: [true, "sender emailes requierd"],
      trim: true,
      lowercase: true,
    },
    
    // حالة الدعوة
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    
    // لو عايز تضيف رسالة ترحيبية من الأدمن (اختياري)
    message: {
      type: String,
      trim: true,
    },
  },
  { 
    timestamps: true // عشان نعرف الدعوة اتبعتت إمتى بالظبط
  }
);

// هنعمل Index مركب عشان الأدمن ميبعتش نفس الدعوة لنفس الإيميل مرتين وهي لسه Pending
invitationSchema.index({ sender: 1, recipientEmail: 1, status: 1 });

module.exports = mongoose.model("Invitation", invitationSchema);