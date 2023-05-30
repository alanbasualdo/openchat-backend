const express = require('express')
require('dotenv').config()
const app = express()
require('./config/dbConn')
const cors = require('cors')
const port = process.env.PORT || 5000

const userRoute = require('./routes/user')
const chatRoute = require('./routes/chat')
const messagesRoute = require('./routes/message')

app.use(
    express.json({
        limit: "50mb",
    })
)

const server = require('http').createServer(app)

const io = require('socket.io')(server, {
    cors: {
        origin: ["http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    },
})

let onlineUsers = []

io.on('connection', (socket) => {
    socket.on('join-room', (userId) => {
        socket.join(userId)
    })

    socket.on('send-message', (message) => {
        io.to(message.members[0]).to(message.members[1]).emit('receive-message', message)
    })

    socket.on('clear-unread-messages', (data) => {
        io.to(data.members[0]).to(data.members[1]).emit('unread-messages-cleared', data)
    })

    socket.on('typing', (data) => {
        io.to(data.members[0]).to(data.members[1]).emit('started-typing', data)
    })

    socket.on("came-online", (userId) => {
        if (!onlineUsers.find(user => user.userId === userId)) {
            onlineUsers.push({ userId, socketId: socket.id })
        }

        io.emit("online-users-updated", onlineUsers.map(user => user.userId))
    })

    socket.on("disconnect", () => {
        const disconnectedUser = onlineUsers.find(user => user.socketId === socket.id)
        if (disconnectedUser) {
            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
            io.emit("went-offline", disconnectedUser.userId)
        }
    })
})

app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use('/api/user', userRoute)
app.use('/api/chat', chatRoute)
app.use('/api/messages', messagesRoute)

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

server.listen(port, () => console.log(`Server running on port ${port}`))
