import mongoose from "mongoose";
const analysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        default: 'Untitled Job'
    },
    companyName: {
        type: String,
        default: null
    },
    atsScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    matchedKeywords: {
        type: [String],
        default: []
    },
    missingKeywords: {
        type: [String],
        default: []
    },
    skillGaps: {
        type: [
            {
                skill: String,
                importance: {
                    type: String,
                    enum: ['high', 'medium', 'low']
                },

            }
        ],
        default: []
    },
    suggestions: {
        type: [String],
        default: []
    },
    overallFeedback: {
        type: String
    },


    mlScore: {
        type: Number,
        default: null
    },

    mlFeedback: {
        type: [String],
        default: []
    },

    mlBreakdown: {
        skills: {
            type: Number,
            default: null
        },
        projects: {
            type: Number,
            default: null
        },
        education: {
            type: Number,
            default: null
        },
        experience: {
            type: Number,
            default: null
        },
        presence: {
            type: Number,
            default: null
        }
    },

    similarityScore: {
        type: Number,
        default: null
    },

    finalMatchScore: {
        type: Number,
        default: null
    },

    commonTerms: {
        type: [String],
        default: []
    },

    missingTerms: {
        type: [String],
        default: []
    },

    recommendations: {
        type: [String],
        default: []
    },

    keywordAnalysis: {
        matched: {
            type: [String],
            default: []
        },
        missing: {
            type: [String],
            default: []
        },
        matchedCount: {
            type: Number,
            default: 0
        },
        missingCount: {
            type: Number,
            default: 0
        },
        totalJdKeywords: {
            type: Number,
            default: 0
        }
    }
}, { timestamps: true });

export const Analysis = mongoose.model('Analysis', analysisSchema);