import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatientProfile extends Document {
  userId?: mongoose.Types.ObjectId; // linked to User model if registered
  fullName: string;
  email: string;
  mobile: string;
  age: string;
  gender: "male" | "female" | "other";
  address?: string;

  // Medical History
  allergies?: string;
  existingDiseases?: string;
  medicalHistoryNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const PatientProfileSchema = new Schema<IPatientProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", sparse: true },
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, match: /^[6-9]\d{9}$/ },
    age: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    address: { type: String, trim: true },

    allergies: { type: String, trim: true },
    existingDiseases: { type: String, trim: true },
    medicalHistoryNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Indexes for fast lookup
PatientProfileSchema.index({ mobile: 1 });
PatientProfileSchema.index({ email: 1 });
PatientProfileSchema.index({ userId: 1 });
PatientProfileSchema.index({ fullName: "text" }); // for searching

const PatientProfile: Model<IPatientProfile> =
  mongoose.models.PatientProfile ||
  mongoose.model<IPatientProfile>("PatientProfile", PatientProfileSchema);

export default PatientProfile;
