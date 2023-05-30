const auth = require('../middlewares/auth')
const Chat = require('../models/Chat')
const Messages = require('../models/Messages')
const router = require('express').Router()

router.post('/create-new-chat', auth, async (req, res) => {
    try {
        const newChat = new Chat(req.body)
        const savedChat = await newChat.save()

        await savedChat.populate('members')
        res.send({
            success: true,
            message: 'Chat created successfully',
            data: savedChat
        })
    } catch (error) {
        res.send({
            success: false,
            message: 'Error creating chat',
            error: error.message
        })
    }
})

router.get('/get-all-chats', auth, async (req, res) => {
    try {
        const chats = await Chat.find({
            members: {
                $in: [req.body.userId]
            }
        })
            .populate('members')
            .populate('lastMessage')
            .sort({ updateAt: -1 })
        res.send({
            success: true,
            message: 'Chat fetched successfully',
            data: chats
        })
    } catch (error) {
        res.send({
            success: false,
            message: 'Error fetching chats',
            error: error.message
        })
    }
})

router.post('/clear-unread-messages', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.body.chat)
        if (!chat) {
            return res.send({
                success: false,
                message: 'Chat not found'
            })
        }
        const updatedChat = await Chat.findByIdAndUpdate(
            req.body.chat,
            {
                unreadMessages: 0,
            },
            { new: true }
        )
            .populate("members")
            .populate("lastMessage")

        await Message.updateMany(
            {
                chat: req.body.chat,
                read: false,
            },
            {
                read: true,
            }
        );
        res.send({
            success: true,
            message: 'Unread messages cleared successfully',
            data: updateChat
        })
    } catch (error) {
        res.send({
            success: false,
            message: 'Error clearing unread messages',
            error: error.message
        })
    }
})

module.exports = router