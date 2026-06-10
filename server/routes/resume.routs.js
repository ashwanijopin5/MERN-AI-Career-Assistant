import express from "express";
import {
    resumeUpload,
    getAllresumes,
    getResumeByid,
    setActiveResume,
    deleteResume
} from "../controllers/resume.controller.js";
import isAuthanticated from '../middlewares/isAuthanticated.js'
import { singleUpload } from '../middlewares/multer.js'

const router = express.Router();


router.post("/upload", (req, res, next) => {
    console.log("UPLOAD ROUTE HIT");
    next();
}, isAuthanticated, singleUpload, resumeUpload);
router.get("/all", isAuthanticated, getAllresumes);
router.get("/:id", isAuthanticated, getResumeByid);
router.put("/:id/setactive", isAuthanticated, setActiveResume);
router.delete("/:id", isAuthanticated, deleteResume);

export default router;