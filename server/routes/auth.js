require('dotenv').config()
const express = require('express')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const verifyToken = require('../middleware/auth')
const router = express.Router()

// @route GET api/auth
// @desc check if user is logged in
// @access public
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'user not found'
            })
        }
        res.json({
            success: true,
            user
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// @route POST api/auth/register
// @desc register user
// @access public
router.post('/register', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing username or password'
        })
    }

    try {
        // check username exists??
        const user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'username is already in use'
            })
        }

        // all good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({
            username,
            password: hashedPassword,
        })
        await newUser.save()

        // return token
        // const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRES_TIME })
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET)

        return res.send({
            success: true,
            message: 'resgister successfully',
            accessToken,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// @route POST api/auth/login
// @desc login user
// @access public
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing username or password'
        })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'username or password is incorrect'
            })
        }
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: 'username or password is incorrect'
            })
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)

        return res.send({
            success: true,
            message: 'login successfully',
            accessToken,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

module.exports = router
