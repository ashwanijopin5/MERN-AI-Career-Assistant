import { Analysis } from "../models/analysis.model.js"
import { Resume } from "../models/resume.model.js"
import analyzeResumeATS from "../utils/analyiseResumeWithAi.js"
import { getMLScore, getMLSimilarity } from "../utils/mlService.js"

export const analyzeResume = async (req, res) => {
    try {
        const { resumeId, jobDescription, jobTitle, companyName } = req.body
        const userId = req.userId


        if (!resumeId || !jobDescription) {
            return res.status(400).json({
                message: "resumeId and jobDescription are required",
                success: false
            });
        }

        if (jobDescription.trim().length < 50) {
            return res.status(400).json({
                message: "job description is too short, paste the full JD",
                success: false
            });
        }
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({
                message: "resume not found",
                success: false
            });
        }

        if (resume.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "access denied",
                success: false
            })
        }


        const [aiResult, mlScoreResult, mlSimilarityResult] = await Promise.all([
            analyzeResumeATS(
                resume.parsedText,
                jobDescription
            ),

            getMLScore(
                resume.extractedData
            ),

            getMLSimilarity(
                resume.parsedText,
                jobDescription
            )
        ]);



        if (!aiResult) {
            return res.status(500).json({
                message: "AI analysis failed, please try again",
                success: false
            })
        }
        const atsScore = Math.max(
            0,
            Math.min(100, aiResult.atsScore || 0)
        );

        const analysis = await Analysis.create({
            userId,
            resumeId,
            jobDescription,
            jobTitle: jobTitle || 'Untitled Job',
            companyName: companyName || null,
            atsScore: atsScore,
            matchedKeywords: aiResult.matchedKeywords,
            missingKeywords: aiResult.missingKeywords,
            skillGaps: aiResult.skillGaps,
            suggestions: aiResult.suggestions,
            overallFeedback: aiResult.overallFeedback,
            mlScore:
                mlScoreResult?.mlScore || null,

            mlFeedback:
                mlScoreResult?.feedback || [],

            mlBreakdown:
                mlScoreResult?.breakdown || {},

            similarityScore:
                mlSimilarityResult?.similarityScore || null,

            finalMatchScore:
                mlSimilarityResult?.finalMatchScore || null,

            commonTerms:
                mlSimilarityResult?.commonTerms || [],

            missingTerms:
                mlSimilarityResult?.missingTerms || [],

            recommendations:
                mlSimilarityResult?.recommendations || [],

            keywordAnalysis:
                mlSimilarityResult?.keywordAnalysis || {}
        });

        return res.status(201).json({
            success: true,
            message: "analysis completed",
            analysis
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        })
    }
};

export const getAllAnalyses = async (req, res) => {
    try {
        const userId = req.userId
        const analyses = await Analysis.find({ userId: userId })
            .select("-jobDescription")
            .populate("resumeId", "fileName isActive")
            .sort({ createdAt: -1 })
        if (analyses.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                analyses: [],
                message: "no analyses found"
            })
        }

        return res.status(200).json({
            success: true,
            count: analyses.length,
            analyses
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        })
    }
}

export const getAnalysisById = async (req, res) => {
    try {
        
        const id = req.params.id
        const analysis = await Analysis.findById(id)
            .populate("resumeId", "fileName fileUrl")

        if (!analysis) {
            return res.status(404).json({
                message: "analysis not found",
                success: false
            });
        }

        if (analysis.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "access denied",
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            analysis
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        })
    }
}

export const deleteAnalysis = async (req, res) => {
    try {
        const id = req.params.id
        const analysis = await Analysis.findById(id)

        if (!analysis) {
            return res.status(404).json({
                message: "analysis not found",
                success: false
            })
        }

        if (analysis.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "access denied",
                success: false
            })
        }

        await Analysis.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            success: true,
            message: "analysis deleted"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        })
    }
}