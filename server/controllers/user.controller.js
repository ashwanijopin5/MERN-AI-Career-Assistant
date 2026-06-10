import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataURi from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "somthing is missing",
                success: false
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "invalid email format",
                success: false
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "password must be at least 6 characters",
                success: false
            })
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() })
        if (user) {
            return res.status(400).json({
                message: "user is alerady exsist with this email",
                success: false
            })
        }
        const hashedPass = await bcrypt.hash(password, 10)
        await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPass,

        })

        return res.status(201).json({
            message: "registration successful",
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

export const login = async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "somthing is missing",
                success: false
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "invalid email format",
                success: false
            })
        }
        const user = await User.findOne(
            { email: email.toLowerCase() }).select("+password")
        if (!user) {
            return res.status(404).json({
                message: "invalid user",
                success: false
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                message: "wrong password",
                success: false
            })
        }
        const tokenData = {
            userId: user._id,
            role: user.role
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" })

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email
        }

        return res.status(200).cookie("token", token, {
            httpOnly: true, sameSite: "lax", maxAge: 1 * 24 * 60 * 60 * 1000
        }).json({
            success: true,
            message: `welcome back ${user.name}`,
            userData,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        })

    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            success: true,
            message: "logout succesfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        })



    }
}

export const update = async (req, res) => {
    try {
        const { name } = req.body
        const file = req.file
        let cloudResponce = null

        const userId = req.userId
        let user = await User.findById(userId)
        if (!user) {

            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }
        if (name && typeof name === "string" && name.trim().length > 0) {
            user.name = name.trim()
        }


        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    message: "only jpg, png, webp images allowed",
                    success: false
                })
            }
            const fileUri = getDataURi(file)
            if (!fileUri) {
                return res.status(400).json({
                    success: false,
                    message: "invalid file"
                })
            }
            cloudResponce = await cloudinary.uploader.upload(fileUri.content)


            if (cloudResponce) {
                if (user.avatar?.public_id) {
                    await cloudinary.uploader.destroy(user.avatar.public_id)
                }
                user.avatar = {
                    public_id: cloudResponce.public_id,
                    url: cloudResponce.secure_url
                }
            }
        }

        await user.save()


        const userSa = {
            _id: user._id,
            name: user.name,
            avatar: user.avatar
        }

        return res.status(200).json({
            success: true,
            message: "profile updated succesfully",
            userSa,


        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
            success: false
        })

    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "server error",
            success: false
        })
    }
}