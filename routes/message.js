const router = require('express').Router()
const auth = require('../middlewares/auth')
const Chat = require('../models/Chat')
const Messages = require('../models/Messages')

router.post('/new-message', async (req, res) => {
    try {
        const newMessage = new Messages(req.body)
        const savedMessage = await newMessage.save()
        await Chat.findOneAndUpdate(
            { _id: req.body.chat },
            { lastMessage: savedMessage._id, $inc: { unreadMessages: 1 } }
        )
        res.send({
            success: true,
            message: 'Message sent successfully',
            data: savedMessage
        })
    } catch (error) {
        res.send({
            success: false,
            message: 'Error sending message',
            error: error.message
        })
    }
})

router.get('/get-all-messages/:chatId', async (req, res) => {
    try {
        const messages = await Messages.find({
            chat: req.params.chatId
        }).sort({ createdAt: 1 })
        res.send({
            success: true,
            message: 'Message fetched successfully',
            data: messages
        })
    } catch (error) {
        res.send({
            success: false,
            message: 'Error fetching message',
            error: error.message
        })
    }
})

module.exports = router