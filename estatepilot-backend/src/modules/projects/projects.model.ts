import mongoose, { Schema, Document } from 'mongoose';

interface UnitConfiguration {
  type: string; // '2BHK', '3BHK', '4BHK', 'Penthouse'
  carpetArea: number; // in sqft
  superArea: number; // in sqft
  priceRange: {
    min: number;
    max: number;
  };
}

interface PaymentPlan {
  name: string;
  description: string;
  percentageOnBooking: number;
  constructionLinkedPercentage: number;
  possessionLinkedPercentage: number;
}

interface LoanOption {
  bankName: string;
  interestRate: number;
  maxLoanPercentage: number;
  tenureOptions: number[]; // in months
}

interface FAQPoint {
  question: string;
  answer: string;
}

interface ObjectionHandlingPoint {
  objection: string;
  response: string;
}

export interface IProject extends Document {
  builderId: mongoose.Types.ObjectId;
  projectName: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    googleMapsLink?: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  unitConfigurations: UnitConfiguration[];
  amenities: string[];
  specifications: string[];
  reraNumber: string;
  possessionTimeline: string; // e.g., 'Dec 2025'
  paymentPlans: PaymentPlan[];
  loanOptions: LoanOption[];
  faqPoints: FAQPoint[];
  objectionHandlingPoints: ObjectionHandlingPoint[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentPlanSchema = new Schema<PaymentPlan>({
  name: String,
  description: String,
  percentageOnBooking: Number,
  constructionLinkedPercentage: Number,
  possessionLinkedPercentage: Number
});

const LoanOptionSchema = new Schema<LoanOption>({
  bankName: String,
  interestRate: Number,
  maxLoanPercentage: Number,
  tenureOptions: [Number]
});

const FAQPointSchema = new Schema<FAQPoint>({
  question: String,
  answer: String
});

const ObjectionHandlingPointSchema = new Schema<ObjectionHandlingPoint>({
  objection: String,
  response: String
});

const UnitConfigurationSchema = new Schema<UnitConfiguration>({
  type: String,
  carpetArea: Number,
  superArea: Number,
  priceRange: {
    min: Number,
    max: Number
  }
});

const ProjectSchema = new Schema<IProject>({
  builderId: {
    type: Schema.Types.ObjectId,
    ref: 'Builder',
    required: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    googleMapsLink: String
  },
  priceRange: {
    min: Number,
    max: Number
  },
  unitConfigurations: [UnitConfigurationSchema],
  amenities: [String],
  specifications: [String],
  reraNumber: String,
  possessionTimeline: String,
  paymentPlans: [PaymentPlanSchema],
  loanOptions: [LoanOptionSchema],
  faqPoints: [FAQPointSchema],
  objectionHandlingPoints: [ObjectionHandlingPointSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
ProjectSchema.index({ builderId: 1 });
ProjectSchema.index({ projectName: 1 });
ProjectSchema.index({ 'location.city': 1 });
ProjectSchema.index({ isActive: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
