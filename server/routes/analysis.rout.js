
import express from "express";
import {
    analyzeResume,
    getAllAnalyses,
    getAnalysisById,
    deleteAnalysis
} from "../controllers/analysis.controller.js";
import isAuthanticated from "../middlewares/isAuthanticated.js";

const router = express.Router();

router.post("/analyze", isAuthanticated, analyzeResume);
router.get("/all", isAuthanticated, getAllAnalyses);
router.get("/:id", isAuthanticated, getAnalysisById);
router.get("/ml-analysis/:id", isAuthanticated, getAnalysisById);
router.delete("/:id", isAuthanticated, deleteAnalysis);

export default router;