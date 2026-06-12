import mongoose, { Schema, Document, Model } from "mongoose";

export type AppointmentType = "online" | "offline";
export type PaymentStatus =
  | "pending_upload"
  | "payment_verification_pending"
  | "payment_approved"
  | "payment_rejected";
export type AppointmentStatus =
  | "payment_pending"
  | "payment_verification_pending"
  | "confirmed"
  | "cancelled"
  | "completed";
export type DeliveryStatus =
  | "not_applicable"
  | "dispatch_pending"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export interface IPrescription {
  type: "pdf" | "image";
  url: string;
  publicId: string;
  uploadedAt: Date;
}

export interface IConsultationNote {
  advice: string;
  medicines: string[];
  followUpDate?: Date;
  notes?: string;
  meetLink?: string;
  addedAt: Date;
}

export interface IPatientAppointment extends Document {
  // Patient info
  patientId?: mongoose.Types.ObjectId; // linked user if logged in
  fullName: string;
  email: string;
  mobile: string;
  age: string;
  gender: "male" | "female" | "other";
  address?: string;
  symptoms: string;

  // Appointment details
  type: AppointmentType;
  preferredDate: string;
  preferredTime: string;
  tokenNumber?: string; // e.g. VHC-2026-001

  // Payment
  paymentStatus: PaymentStatus;
  paymentScreenshotUrl?: string;
  paymentScreenshotPublicId?: string;
  upiTransactionId?: string;
  paymentRejectionReason?: string;

  // Status
  status: AppointmentStatus;

  // Consultation
  consultationNotes: IConsultationNote[];
  prescriptions: IPrescription[];
  meetLink?: string;

  // Delivery (for online consultations with medicine)
  deliveryStatus: DeliveryStatus;
  deliveryNotes?: string;
  trackingNumber?: string;

  // Admin notes
  doctorNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema = new Schema<IPrescription>(
  {
    type: { type: String, enum: ["pdf", "image"], required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ConsultationNoteSchema = new Schema<IConsultationNote>(
  {
    advice: { type: String, required: true },
    medicines: [{ type: String }],
    followUpDate: { type: Date },
    notes: { type: String },
    meetLink: { type: String },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const PatientAppointmentSchema = new Schema<IPatientAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User" },
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },
    age: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    address: { type: String, trim: true },
    symptoms: { type: String, required: true, maxlength: 500 },

    type: { type: String, enum: ["online", "offline"], required: true },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    tokenNumber: { type: String, unique: true, sparse: true },

    paymentStatus: {
      type: String,
      enum: [
        "pending_upload",
        "payment_verification_pending",
        "payment_approved",
        "payment_rejected",
      ],
      default: "pending_upload",
    },
    paymentScreenshotUrl: { type: String },
    paymentScreenshotPublicId: { type: String },
    upiTransactionId: { type: String, trim: true },
    paymentRejectionReason: { type: String },

    status: {
      type: String,
      enum: [
        "payment_pending",
        "payment_verification_pending",
        "confirmed",
        "cancelled",
        "completed",
      ],
      default: "payment_pending",
    },

    consultationNotes: [ConsultationNoteSchema],
    prescriptions: [PrescriptionSchema],
    meetLink: { type: String },

    deliveryStatus: {
      type: String,
      enum: [
        "not_applicable",
        "dispatch_pending",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
      ],
      default: "not_applicable",
    },
    deliveryNotes: { type: String },
    trackingNumber: { type: String },

    doctorNotes: { type: String },
  },
  { timestamps: true }
);

PatientAppointmentSchema.index({ patientId: 1, createdAt: -1 });
PatientAppointmentSchema.index({ status: 1, paymentStatus: 1 });
PatientAppointmentSchema.index({ email: 1 });
PatientAppointmentSchema.index({ preferredDate: 1 });

// Auto-generate token number
async function generateToken(
  type: AppointmentType,
  year: number,
  serial: number
): Promise<string> {
  const typeCode = type === "online" ? "ONL" : "OFF";
  const serialPadded = String(serial).padStart(3, "0");
  return `VHC-${year}-${typeCode}-${serialPadded}`;
}

// Static method to get next token serial for the day
PatientAppointmentSchema.statics.generateToken = generateToken;

const PatientAppointment: Model<IPatientAppointment> =
  mongoose.models.PatientAppointment ||
  mongoose.model<IPatientAppointment>(
    "PatientAppointment",
    PatientAppointmentSchema
  );

export default PatientAppointment;
