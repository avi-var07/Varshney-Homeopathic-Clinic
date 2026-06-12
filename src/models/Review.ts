import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  patientId?: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  location?: string;
  problem?: string;
  rating: number;
  title?: string;
  text: string;
  approved: boolean;
  featured: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User" },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "PatientAppointment",
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    location: { type: String, trim: true },
    problem: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 100 },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    approved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ approved: 1, createdAt: -1 });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
