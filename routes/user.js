const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')

/* const authMiddleware = require("../middlewares/authMiddleware")
const cloudinary = require("../cloudinary") */

const router = require('express').Router()

router.post('/register', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.send({
                success: false,
                message: 'User already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword
        const newUser = new User(req.body)
        await newUser.save()
        res.send({
            succes: true,
            message: 'User created successfully'
        })
    } catch (error) {
        res.send({
            msg: error.message,
            success: false
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.send({
                success: false,
                message: 'User does not exist'
            })
        }
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validPassword) {
            return res.send({
                success: false,
                message: 'Invalid password'
            })
        }
        const token = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        res.send({
            success: true,
            message: 'User logged in successfully',
            data: token
        })
    } catch (error) {
        res.send({
            msg: error.message,
            success: false
        })
    }
})

router.get('/get-current-user', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        res.send({
            success: true,
            msg: 'User fetched successfully',
            data: user
        })
    } catch (error) {
        res.send({
            msg: error.message,
            success: false
        })
    }
})

router.get('/get-all-users', auth, async (req, res) => {
    try {
        const allUsers = await User.find({ _id: { $ne: req.body.userId } })
        res.send({
            success: true,
            message: 'Users fetched successfully',
            data: allUsers
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})

/* router.post("/update-profile-picture", authMiddleware, async (req, res) => {
    try {
        const image = req.body.image

        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: "ksr",
        })

        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { profilePic: uploadedImage.secure_url },
            { new: true }
        )

        res.send({
            success: true,
            message: "Profile picture updated successfully",
            data: user,
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        })
    }
}) */

module.exports = router