import mongoose, { Schema, Document } from 'mongoose';

export interface IBuilder extends Document {
  name: string;
  phone: string;
  businessName: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BuilderSchema = new Schema<IBuilder>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  gstNumber: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
BuilderSchema.index({ phone: 1 }, { unique: true });
BuilderSchema.index({ businessName: 1 });
BuilderSchema.index({ isActive: 1 });

export const Builder = mongoose.model<IBuilder>('Builder', BuilderSchema);
