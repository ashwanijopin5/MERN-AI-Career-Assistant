import { InterviewPrep } from "../models/interviewPrep.model.js";
import { Analysis } from "../models/analysis.model.js"
import { Resume } from "../models/resume.model.js"
import generateQuestionsWithAI from '../utils/generateQuestionsWithAI.js'
import generateAnswerFeedback from "../utils/answerFeedback.js"
export const generateQuestions = async (req, res) => {
    try {
        const { analysisId } = req.body;
        const userId = req.userId;

        if (!analysisId) {
            return res.status(400).json({
                message: "analysisId is required",
                success: false
            });
        }

        const analysis = await Analysis.findById(analysisId);
        if (!analysis) {
            return res.status(404).json({
                message: "analysis not found",
                success: false
            });
        }

        if (analysis.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "access denied",
                success: false
            });
        }
        const existing = await InterviewPrep.findOne({ analysisId, userId });
        if (existing) {
            return res.status(200).json({
                success: true,
                message: "interview prep already exists",
                interviewPrep: existing
            });
        }

        const resume = await Resume.findById(analysis.resumeId);
        if (!resume) {
            return res.status(404).json({
                message: "resume not found",
                success: false
            });
        }

        const questions = await generateQuestionsWithAI(
            resume.parsedText,
            analysis.jobDescription,
            analysis.jobTitle
        );

        if (!questions|| questions.length === 0) {
            return res.status(500).json({
                message: "failed to generate questions, please try again",
                success: false
            });
        }

        const interviewPrep = await InterviewPrep.create({
            userId,
            analysisId,
            questions,
            attemptedCount: 0
        });

        return res.status(201).json({
            success: true,
            message: "interview questions generated",
            interviewPrep
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};

export const submitAnswer = async (req, res) => {
    try {
        const { prepId, questionId } = req.params;
        const { userAnswer } = req.body;
        const userId = req.userId;

        if (!userAnswer || userAnswer.trim().length < 5) {
            return res.status(400).json({
                message: "answer is too short",
                success: false
            });
        }
        if (userAnswer.trim().length > 2000) {
            return res.status(400).json({
                success: false,
                message: "answer is too long"
            });
        }

        const interviewPrep = await InterviewPrep.findById(prepId);
        if (!interviewPrep) {
            return res.status(404).json({
                message: "interview prep not found",
                success: false
            });
        }

        if (interviewPrep.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "access denied",
                success: false
            });
        }

        const question = interviewPrep.questions.id(questionId);
        if (!question) {
            return res.status(404).json({
                message: "question not found",
                success: false
            });
        }


        const aiFeedback = await generateAnswerFeedback(
            question.questionText,
            userAnswer.trim()
        );


        question.userAnswer = userAnswer.trim();
        question.aiFeedback = aiFeedback;

        if (!question.isAttempted) {
            question.isAttempted = true;
            interviewPrep.attemptedCount += 1;
        }

        await interviewPrep.save();

        return res.status(200).json({
            success: true,
            message: "answer submitted",
            question: {
                _id: question._id,
                questionText: question.questionText,
                category: question.category,
                difficulty: question.difficulty,
                userAnswer: question.userAnswer,
                aiFeedback: question.aiFeedback,
                isAttempted: question.isAttempted
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};
export const getInterviewPrep = async (req, res) => {
    try {
        const analysisId = req.params.analysisId
        const userId = req.userId
        const interviewPrep = await InterviewPrep.findOne({
            analysisId: analysisId,
            userId: userId
        });

        if (!interviewPrep) {
            return res.status(404).json({
                message: "no interview prep found, generate questions first",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            interviewPrep,
           
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};

export const getAllInterviewPreps = async (req, res) => {
    try {
        const preps = await InterviewPrep.find({ userId: req.userId })
            .select("-questions")
            .populate("analysisId", "jobTitle companyName atsScore")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: preps.length,
            preps
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};

export const regenerateQuestions = async (req, res) => {
    try {
        const { prepId } = req.params;
        const userId = req.userId;

        const interviewPrep = await InterviewPrep.findById(prepId);
        if (!interviewPrep) {
            return res.status(404).json({
                message: "interview prep not found",
                success: false
            });
        }

        if (interviewPrep.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "access denied",
                success: false
            });
        }

        const analysis = await Analysis.findById(interviewPrep.analysisId);
        if (!analysis) {

            return res.status(404).json({
                success: false,
                message: "analysis not found"
            });
        }
        const resume = await Resume.findById(analysis.resumeId);
        if (!resume) {

            return res.status(404).json({
                success: false,
                message: "resume not found"
            });
        }

        const questions = await generateQuestionsWithAI(
            resume.parsedText,
            analysis.jobDescription,
            analysis.jobTitle
        );

        if (!questions) {
            return res.status(500).json({
                message: "failed to regenerate questions",
                success: false
            });
        }


        interviewPrep.questions = questions;
        interviewPrep.attemptedCount = 0;
        await interviewPrep.save();

        return res.status(200).json({
            success: true,
            message: "questions regenerated",
            interviewPrep
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};