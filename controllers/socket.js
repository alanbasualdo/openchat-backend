// chatController.js

const Chat = require("../models/Chat");

const clearUnreadMessages = async (chatId, members) => {
    try {
        // Lógica para borrar los mensajes no leídos del chat con el ID proporcionado
        // Aquí puedes utilizar tu lógica existente o implementarla según tus requisitos
        // Por ejemplo:
        const chat = await Chat.findById(chatId);
        chat.unreadMessages = 0;
        await chat.save();

        // Emitir un evento a los miembros del chat para indicar que los mensajes no leídos han sido borrados
        io.to(members[0]).to(members[1]).emit('unread-messages-cleared', { chatId, members });

        return { success: true, data: chat };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Internal Server Error' };
    }
};

module.exports = { clearUnreadMessages };
