import mongoose from "mongoose";
import Class from "./class.js";
import Session from "./session.js";

const userSchema = new mongoose.Schema(
  {
    personal_info: {
      first_name: { type: String, required: true, trim: true },
      last_name: { type: String, required: true, trim: true },
      father_name: { type: String, required: true, trim: true },
      dob: { type: Date, required: true },
      age: { type: Number, required: true },
      img_URL: { type: String, required: true },
      whatsapp_no: { type: String, required: true },
      alternative_no: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      enrolled_year: { type: String, required: true },
      marj_e_taqleed: { type: String, required: true },
      halafnama: { type: Boolean, required: true },
      verified: {
        type: Boolean,
        required: true,
        default: false,
      },
      isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
      password: {
        type: String,
        default: undefined,
      },
      otp: {
        type: String,
        default: undefined,
      },
      otpExpiresAt: {
        type: Date,
        default: undefined,
      },
    },

    academic_progress: {
      academic_class: {
        type: Number,
        required: true,
      },
      institute_name: {
        type: String,
        required: true,
      },
      inProgress: { type: Boolean, default: false, required: true },
      result: { type: String, required: false },
    },

    class_history: [
      {
        class_name: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Class",
          required: true,
        },
        year: {
          type: String,
          required: true,
        },
        session: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Session",
          required: true,
        },
        status: {
          type: String,
          enum: ["inprogress", "completed", "pass", "fail"],
          required: true,
        },
        result: {
          type: String,
          enum: ["Pass", "Fail"],
          allowNull: true,
        },
        repeat_count: {
          type: Number,
          default: 0,
          allowNull: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.addClassHistory = function (classHistoryData) {
  this.class_history.push(classHistoryData);
  return this.save();
};
export default mongoose.model("User", userSchema);
