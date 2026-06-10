import { JobMatch } from "../models/jobMatch.model.js";
import { Resume } from "../models/resume.model.js";
import fetchJobsFromAPI from "../utils/fetchJobsFromAPI.js"
import mongoose from "mongoose";
export const getRecommendedJobs = async (req, res) => {
    try {
        const userId = req.userId;
        const { jobTitle } = req.query;
        

        const resume = await Resume.findOne({ userId, isActive: true });
        
        if (!resume) {
            return res.status(404).json({
                message: "no active resume found, upload a resume first",
                success: false
            });
        }

        const skills = resume.extractedData?.skills || [];
        console.log("skills:", skills);

        if (skills.length === 0) {
            return res.status(400).json({
                message: "no skills found in resume, make sure your resume is parsed correctly",
                success: false
            });
        }
      

        

        

        

        const jobs = await fetchJobsFromAPI(skills, jobTitle);
        
        if (jobs.length === 0) {
            return res.status(200).json({
                success: true,
                message: "no jobs found for your skills right now, try again later",
                jobs: []
            });
        }


        

        const savedJobIds = await JobMatch.find({ userId })
            .distinct("jobId");

        const jobsWithSavedStatus = jobs.map((job) => ({
            ...job,
            isSaved: savedJobIds.includes(job.jobId)
        }));

        return res.status(200).json({
            success: true,
            count: jobsWithSavedStatus.length,
            skills,
            jobs: jobsWithSavedStatus
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};

export const saveJob = async (req, res) => {
    try {
        const userId = req.userId;
        const { jobId, jobTitle, companyName, location, jobUrl, jobDescription, jobType, source, resumeId } = req.body;


        if (!jobTitle || !companyName) {
            return res.status(400).json({
                message: "jobTitle and companyName are required",
                success: false
            });
        }

        if (jobId) {
            const alreadySaved = await JobMatch.findOne({
                userId,
                $or: [
                    { jobId },
                    { jobUrl }
                ]
            });
            if (alreadySaved) {
                return res.status(400).json({
                    message: "job already saved",
                    success: false
                });
            }
        }


        if (resumeId) {
            const resume = await Resume.findOne({ _id: resumeId, userId });
            if (!resume) {
                return res.status(404).json({
                    message: "resume not found",
                    success: false
                });
            }
        }

        const job = await JobMatch.create({
            userId,
            jobId: jobId || null,
            jobTitle,
            companyName,
            location: location || null,
            jobUrl: jobUrl || null,
            jobDescription: jobDescription || null,
            jobType: jobType || "fulltime",
            source: source || "manual",
            resumeId: resumeId || null,
            applicationStatus: "saved"
        });

        return res.status(201).json({
            success: true,
            message: "job saved successfully",
            job
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.userId;
        const { status } = req.query;


        const filter = { userId };
        if (status) {
            const validStatuses = ['saved', 'applied', 'oa', 'interview', 'offer', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: "invalid status filter",
                    success: false
                });
            }
            filter.applicationStatus = status;
        }

        const jobs = await JobMatch.find(filter)
            .populate("resumeId", "fileName")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};
export const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes, appliedDate } = req.body;
        const userId = req.userId;

        const validStatuses = ['saved', 'applied', 'oa', 'interview', 'offer', 'rejected'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: `status must be one of: ${validStatuses.join(", ")}`,
                success: false
            });
        }

        const job = await JobMatch.findById(id);
        if (!job) {
            return res.status(404).json({
                message: "job not found",
                success: false
            });
        }

        if (job.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "access denied",
                success: false
            });
        }


        job.applicationStatus = status;


        if (status === "applied" && !job.appliedDate) {
            job.appliedDate = appliedDate || new Date();
        }

        if (typeof notes === "string" && notes.trim().length > 0) {
            job.notes = notes.trim();
        }

        await job.save();

        return res.status(200).json({
            success: true,
            message: "status updated",
            job
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};

export const deleteSavedJob = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const job = await JobMatch.findById(id);
        if (!job) {
            return res.status(404).json({
                message: "job not found",
                success: false
            });
        }

        if (job.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "access denied",
                success: false
            });
        }

        await JobMatch.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "job removed"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};

export const getApplicationStats = async (req, res) => {
    try {
        const userId = req.userId;


        const stats = await JobMatch.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: "$applicationStatus",
                    count: { $sum: 1 }
                }
            }
        ])


        const formatted = {
            saved: 0,
            applied: 0,
            oa: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
            total: 0
        };

        stats.forEach((s) => {
            formatted[s._id] = s.count;
            formatted.total += s.count;
        });

        return res.status(200).json({
            success: true,
            stats: formatted
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        });
    }
};