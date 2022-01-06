const express = require('express')
const Post = require('../models/Post')
const verifyToken = require('../middleware/auth')

const router = express.Router()

// @route POST api/posts
// @desc get post
// @access private
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', ['username'])
        res.json({
            success: true,
            posts
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// @route POST api/posts/create
// @desc create post
// @access private
router.post('/create', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body
    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'title is required'
        })
    }
    try {
        const newPost = new Post({
            title,
            description,
            url: (url.startsWith('https://')) ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId
        })
        await newPost.save()

        res.send({
            success: true,
            message: 'happy learning',
            post: newPost
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// @route PUT api/posts/edit/:id
// @desc update post
// @access private
router.put('/edit/:id', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body
    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'title is required'
        })
    }
    try {
        let updatedPost = {
            title,
            description: description || '',
            url: ((url.startsWith('https://')) ? url : `https://${url}`) || '',
            status: status || 'TO LEARN'
        }

        const postUpdateCondition = {
            _id: req.params.id,
            user: req.userId
        }
        updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, { new: true })
        if (!updatedPost) {
            return res.status(401).json({
                success: false,
                message: 'post not found or user not authorized'
            })
        }

        res.json({
            success: true,
            message: 'excellent progress!',
            post: updatedPost
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// @route PUT api/posts/delete/:id
// @desc delete post
// @access private
router.delete('/delete/:id', verifyToken, async (req, res) => {
    const postDeleteCondition = {
        _id: req.params.id,
        user: req.userId
    }
    try {
        const deletedPost = await Post.findOneAndDelete(postDeleteCondition)
        if (!deletedPost) {
            return res.status(401).json({
                success: false,
                message: 'post not found or user not authorized'
            })
        }
        res.json({
            success: true,
            message: 'delete post successfully',
            post: deletedPost
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
