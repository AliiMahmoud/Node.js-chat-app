let userContoller = require('./src/controllers/user')

// Main Socket Handler Function
module.exports = async (io, socket) => {

    // Extacting the unique ID(number) from the session
    socket.number = socket.request.session.uid
    // Join the self-room for private messaging 
    socket.join(socket.number);

    // Getting Friends from database
    let friends = await userContoller.getUserFriends(socket.number)
    // Sending them to the client
    io.in(socket.number).emit("friends", friends);

    // Notifying my friends that i'm online
    for (let friend of friends) {
        // Send Online Signal
        socket.to(friend.number).emit('online', { from: socket.number, to: friend.number })
    }

    // Recieving online signal acknowledgement
    socket.on('online:ack', ({ from, to }) => {
        io.to(from).emit("online:ack", { to });
    })

    socket.on('disconnect', function () {
        for (let friend of friends) {
            // Sending an offline signal
            socket.to(friend.number).emit('offline', { from: socket.number })
        }
    })

    socket.on('search', (query) => {
        // getting users from database
        userContoller.searchForUser(socket.number, query).then(({ user, status, sent }) => {
            if (status == -2)
                user.who = 'mine'
            else if (status == 0)
            {
                user.who = 'pending'
                user.sent = sent
            }
            else if (status == 1)
                user.who = 'friend'
            socket.emit('search:result', user)
        }).catch((_err) => {
            socket.emit('search:result', null)
        })
    })

}

// // dev only 
// socket.onAny((event, ...args) => {
//     console.log(".........................");
//     console.log("SOCKET EVENT");
//     console.log(".........................");
//     console.log(event, "=>", args);
// });