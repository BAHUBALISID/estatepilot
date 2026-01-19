import mongoose, { Schema, Document } from 'mongoose';
import { LeadStatus } from '../../constants/leadStatus';

export interface IFollowup extends Document {
  leadId: mongoose.Types.ObjectId;
  status: LeadStatus;
  nextFollowupAt: Date;
  attemptCount: number;
  lastSentAt?: Date;
  active: boolean;
  metadata?: {
    templateUsed?: string;
    messageSent?: string;
    responseReceived?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FollowupSchema = new Schema<IFollowup>({
  leadId: {
    type: Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(LeadStatus),
    required: true
  },
  nextFollowupAt: {
    type: Date,
    required: true,
    index: true
  },
  attemptCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastSentAt: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  metadata: {
    templateUsed: String,
    messageSent: String,
    responseReceived: Boolean
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
FollowupSchema.index({ leadId: 1, active: 1 });
FollowupSchema.index({ nextFollowupAt: 1, active: 1 });
FollowupSchema.index({ status: 1, active: 1 });

export const Followup = mongoose.model<IFollowup>('Followup', FollowupSchema);
