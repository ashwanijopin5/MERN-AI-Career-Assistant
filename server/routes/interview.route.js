import express from "express";
import {
    generateQuestions,
    submitAnswer,
    getInterviewPrep,
    getAllInterviewPreps,
    regenerateQuestions
} from "../controllers/interview.controller.js";
import isAuthanticated from '../middlewares/isAuthanticated.js'

const router = express.Router();


router.get("/all", isAuthanticated, getAllInterviewPreps);
router.get("/:analysisId", isAuthanticated, getInterviewPrep);
router.post("/generate", isAuthanticated, generateQuestions);
router.put("/:prepId/answer/:questionId", isAuthanticated, submitAnswer);
router.put("/:prepId/regenerate", isAuthanticated, regenerateQuestions);

export default router;