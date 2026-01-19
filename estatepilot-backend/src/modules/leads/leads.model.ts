import mongoose, { Schema, Document } from 'mongoose';
import { LeadStatus, LeadIntent } from '../../constants/leadStatus';

export interface ILead extends Document {
  builderId: mongoose.Types.ObjectId;
  phone: string;
  name?: string;
  language: 'en' | 'hi' | 'hinglish';
  budget?: {
    min: number;
    max: number;
  };
  unitType?: string;
  timeline?: 'immediate' | 'short_term' | 'medium_term' | 'exploring';
  intent: LeadIntent;
  status: LeadStatus;
  lastMessageAt: Date;
  qualificationScore: number;
  lastFollowupAt?: Date;
  nextFollowupAt?: Date;
  followupCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  builderId: {
    type: Schema.Types.ObjectId,
    ref: 'Builder',
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'hinglish'],
    default: 'en'
  },
  budget: {
    min: Number,
    max: Number
  },
  unitType: {
    type: String
  },
  timeline: {
    type: String,
    enum: ['immediate', 'short_term', 'medium_term', 'exploring']
  },
  intent: {
    type: String,
    enum: Object.values(LeadIntent),
    default: LeadIntent.GENERAL
  },
  status: {
    type: String,
    enum: Object.values(LeadStatus),
    default: LeadStatus.COLD
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  qualificationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  lastFollowupAt: {
    type: Date
  },
  nextFollowupAt: {
    type: Date
  },
  followupCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
LeadSchema.index({ builderId: 1, phone: 1 }, { unique: true });
LeadSchema.index({ builderId: 1, status: 1 });
LeadSchema.index({ builderId: 1, lastMessageAt: -1 });
LeadSchema.index({ builderId: 1, qualificationScore: -1 });
LeadSchema.index({ nextFollowupAt: 1 });
LeadSchema.index({ isActive: 1 });

// Pre-save hook to update qualification score
LeadSchema.pre('save', function(next) {
  let score = 0;
  
  if (this.budget?.min && this.budget?.max) {
    score += 3;
  }
  
  if (this.unitType) {
    score += 2;
  }
  
  if (this.timeline === 'immediate') {
    score += 3;
  } else if (this.timeline === 'short_term') {
    score += 2;
  } else if (this.timeline === 'medium_term') {
    score += 1;
  }
  
  if (this.intent && this.intent !== LeadIntent.GENERAL) {
    score += 1;
  }
  
  // Update status based on score
  this.qualificationScore = Math.min(score, 10);
  
  if (score >= 8) {
    this.status = LeadStatus.HOT;
  } else if (score >= 4) {
    this.status = LeadStatus.WARM;
  } else {
    this.status = LeadStatus.COLD;
  }
  
  next();
});

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
