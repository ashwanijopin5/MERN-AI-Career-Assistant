import mongoose from "mongoose"

const interviewPrepSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index:true
    },
    analysisId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analysis',
        required: true,
        index:true
    },
    questions: {
        type: [
            {
                questionText: {
                    type: String,
                    required: true
                },
                category: {
                    type: String,
                    enum: ['technical', 'behavioural', 'project', 'hr'],
                    required:true
                },
                difficulty: {
                    type: String,
                    enum: ['easy', 'medium', 'hard'],
                    required:true
                },
                userAnswer: {
                    type: String,
                    default: null
                },
                aiFeedback: {
                    type: String,
                    default: null
                },
                isAttempted: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        default: []
    },
   attemptedCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const InterviewPrep = mongoose.model('InterviewPrep', interviewPrepSchema)