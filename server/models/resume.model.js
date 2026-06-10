
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    parsedText: {
        type: String,
        required: true
    },
    cloudinaryPublicId: {
        type: String,
        required: true
    },
    extractedData: {
        name: String,
        email: String,
        phone: String,
        skills: {
            type: [String],
            default: []
        },
        education: {
            type: [
                {
                    degree: String,
                    institution: String,
                    year: String,
                    score: String,
                    collegeScore: {
                        type: Number,
                        default: 0
                    }
                }
            ],
            default: []
        },
        experience: {
            type: [
                {
                    company: String,
                    role: String,
                    duration: String,
                    description: String
                }
            ],
            default: []
        },
        projects: {
            type: [
                {
                    title: String,
                    description: String,
                    techStack: {
                        type: [String],
                        default: []
                    },
                    github: {
                        type: Boolean,
                        default: false
                    },

                    deployed: {
                        type: Boolean,
                        default: false
                    },

                    complexity: {
                        type: Number,
                        default: 0
                    }
                }
            ],
            default: []
        },
        certifications: {
            type: [String],
            default: []
        },
        achievements: {
            type: [String],
            default: []
        },
        links: {
            github: {
                type: Boolean,
                default: false
            },

            linkedin: {
                type: Boolean,
                default: false
            },

            portfolio: {
                type: Boolean,
                default: false
            }
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },


}, { timestamps: true })

export const Resume = mongoose.model('Resume', resumeSchema)