import express from "express";
import {
    getRecommendedJobs,
    saveJob,
    getSavedJobs,
    updateJobStatus,
    deleteSavedJob,
    getApplicationStats
} from "../controllers/jobmatch.controller.js";
import isAuthanticated from '../middlewares/isAuthanticated.js'

const router = express.Router();

router.get("/recommendations", isAuthanticated, getRecommendedJobs);
router.get("/saved", isAuthanticated, getSavedJobs);
router.get("/stats", isAuthanticated, getApplicationStats);
router.post("/save", isAuthanticated, saveJob);
router.put("/:id/status", isAuthanticated, updateJobStatus);
router.delete("/:id", isAuthanticated, deleteSavedJob);

export default router;