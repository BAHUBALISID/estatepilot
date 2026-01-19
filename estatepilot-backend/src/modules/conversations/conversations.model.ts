import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  leadId: mongoose.Types.ObjectId;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    sender: 'user' | 'bot' | 'admin';
    text: string;
    timestamp: Date;
    metadata?: {
      intent?: string;
      projectId?: string;
      templateUsed?: string;
      isQualification?: boolean;
    };
  }>;
  lastContext?: {
    projectId?: string;
    intent?: string;
    qualificationStep?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot', 'admin'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    intent: String,
    projectId: String,
    templateUsed: String,
    isQualification: Boolean
  }
});

const ConversationSchema = new Schema<IConversation>({
  leadId: {
    type: Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
    unique: true
  },
  messages: [MessageSchema],
  lastContext: {
    projectId: String,
    intent: String,
    qualificationStep: String
  }
}, {
  timestamps: true
});

// Indexes
ConversationSchema.index({ leadId: 1 }, { unique: true });
ConversationSchema.index({ 'messages.timestamp': -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
