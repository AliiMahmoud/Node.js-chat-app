module.exports = (io, socket) => {

    const sendMessage = (data) => {
        socket.broadcast.emit('chat:message', data)
    }
    const typingInfo = (data) => {
        socket.broadcast.emit('chat:typing', data)
    }
    const cancelTypingInfo = (data) => {
        socket.broadcast.emit('chat:cancel-typing')
    }

    socket.on("chat:message", sendMessage);
    socket.on("chat:typing", typingInfo);
    socket.on("chat:cancel-typing", cancelTypingInfo);
}