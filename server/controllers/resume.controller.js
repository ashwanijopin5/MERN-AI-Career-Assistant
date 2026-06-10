import { Resume } from "../models/resume.model.js"

import getDataURi from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import parseResumeWithAI from "../utils/parseResumeWithAI.js";
import { PDFParse } from 'pdf-parse'

console.log("PDFParse =", PDFParse);
export const resumeUpload = async (req, res) => {
    console.log("controller strta");
    try {
        
        const file = req.file
        console.log("1. File received");
        const userId = req.userId
        if (!file) {
            return res.status(400).json({
                message: "Upload file",
                success: false
            })
        }

        if (file.mimetype !== "application/pdf") {
            return res.status(400).json({
                message: "only pdf file is allowed",
                success: false
            })
        }

        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return res.status(400).json({
                message: "file size must be under 5mb",
                success: false
            })
        }

        let parsedText = ""
        try {
            const parser = new PDFParse({
                data: file.buffer
            });

            const pdfData = await parser.getText();

            parsedText = pdfData.text;
            console.log("2. PDF parsed");
            if (!parsedText || parsedText.trim().length < 50) {
                return res.status(400).json({
                    message: "PDF appears empty or image-based, cannot extract text",
                    success: false
                })
            }
        } catch (parseError) {
            return res.status(400).json({
                message: "could not read PDF, make sure it is not scanned/image-based",
                success: false
            });
        }


        const fileUri = getDataURi(file)
        if (!fileUri) {
            return res.status(400).json({
                message: "Invalid File",
                success: false
            })
        }
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: "raw",
            folder: "resumes",
            format: "pdf"
        })
        if(!cloudResponse){
            return res.status(400).json({
            message: "cloud response error",
            success: false
        })
        }

        console.log("3. Cloudinary upload complete");
        const extractedData = await parseResumeWithAI(parsedText)
        console.log("EXTRACTED DATA");
console.dir(extractedData, { depth: null });
        
          await Resume.updateMany(
            { userId, isActive: true },
            { isActive: false }
        );
        const resume = await Resume.create({
            userId,
            fileName: file.originalname,
            fileUrl: cloudResponse.secure_url,
            cloudinaryPublicId: cloudResponse.public_id,
            parsedText,
            extractedData,
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "resume uploaded successfully",
            resume
        });

    } catch (error) {
        console.log("Resume Upload Error:");
     console.error(error);
        return res.status(400).json({
            message: "server error in resume uplad",
            success: false
        })
    }
}
export const getAllresumes = async (req, res) => {
    try {
        const userID = req.userId
        const resumes = await Resume.find({ userId: userID }).
            select("-parsedText").
            sort({ createdAt: -1 })

        return res.status(200).json({

            success: true,
            count: resumes.length,
            resumes

        })

    } catch (error) {
        console.log(error);
        
        return res.status(400).json({
            message: "server error",
            success: false
        })
    }
}

export const getResumeByid = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.userId
        const resume = await Resume.findOne({
            _id: id,
            userId: userId
        })
        if (!resume) {
            return res.status(404).json({
                message: "resume not found",
                success: false
            })
        }


        return res.status(200).json({

            success: true,
            resume
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "server error",
            success: false
        })
    }

}

export const setActiveResume = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.userId
        const resume = await Resume.findById(id)
        if (!resume) {
            return res.status(404).json({
                message: "resume not found",
                success: false
            })
        }
        if (resume.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "acesses denied",
                success: false
            })
        }

        await Resume.updateMany(
            { userId: userId },
            { isActive: false }

        )
        resume.isActive = true
        await resume.save()
        return res.status(200).json({
            success: true,
            message: "active resume updated",
            resumeId: resume._id
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        })
    }
}

export const deleteResume = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.userId
        const resume = await Resume.findById(id)
        if (!resume) {
            return res.status(404).json({
                message: "resume not found",
                success: false
            })
        }
        if (resume.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "acesses denied",
                success: false
            })
        }

        await cloudinary.uploader.destroy(
            resume.cloudinaryPublicId,
            { resource_type: "raw" }
        );
        if (resume.isActive) {
            const anotherResume =
                await Resume.findOne({
                    userId,
                    _id: { $ne: id }
                });

            if (anotherResume) {
                anotherResume.isActive = true;
                await anotherResume.save();
            }
        }
        await Resume.findByIdAndDelete(id)
        return res.status(200).json({
            message: "resume deleted successfully",
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        })
    }
}