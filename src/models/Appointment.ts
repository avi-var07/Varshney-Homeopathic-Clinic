import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  fullName: string;
  mobile: string;
  age: string;
  problem: string;
  preferredDate: string;
  preferredTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid Indian mobile number"],
    },
    age: {
      type: String,
      required: [true, "Age is required"],
      trim: true,
    },
    problem: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
      maxlength: [500, "Problem description cannot exceed 500 characters"],
    },
    preferredDate: {
      type: String,
      required: [true, "Preferred date is required"],
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
