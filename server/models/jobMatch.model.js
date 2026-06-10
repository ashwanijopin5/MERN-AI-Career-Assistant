import mongoose from 'mongoose'
const jobMatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',

    index: true
  },
  source: {
    type: String,
    enum: ['api', 'manual'],
    default: 'manual'
  },
  jobTitle: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  jobUrl: {
    type: String,
    default: null
  },
  jobId: {
    type: String,
    default: null,
    index: true
  },
  jobDescription: {
    type: String
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  location: {
    type: String,
    default: null
  },
  jobType: {
    type: String,
    enum: ['fulltime', 'parttime', 'internship', 'contract', 'remote'],
    default: 'fulltime'
  },
  applicationStatus: {
    type: String,
    enum: ['saved', 'applied', 'oa', 'interview', 'offer', 'rejected'],
    default: 'saved'
  },
  appliedDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: null
  }
}, { timestamps: true });

export const JobMatch = mongoose.model('JobMatch', jobMatchSchema);