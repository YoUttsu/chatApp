const io = require("socket.io")(3000, {
    cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    },
})
let connectedSockets = new Set()
io.on("connection", (socket) => {
    connectedSockets.add(socket.id)
    socket.on("custom-sent-message", (message, room) => {
        if (room === "") {
            socket.broadcast.emit("custom-recieve-message", message)
            // io.emit("custom-recieve-message",message,room) //this will send message to all the peers
        } else {
            if (connectedSockets.has(room)) {
                console.log("encrypted message  " + message)
                socket.to(room).emit("custom-dm-event", message)
            } else {
                socket.to(room).emit("custom-recieve-message", message)//you dont have to do .broadcast here as it already does it for you
            }
        }
        console.log(message, room)
    })


    //this will allow us to join the custom room any user can subscribe to this room
    socket.on("custom-join-room", (room, callbackfun) => {
        socket.join(room)
        callbackfun(`joined room with id ${room}`)
    })
    socket.on("disconnect", () => {
        connectedSockets.delete(socket.id);
    });


    console.log(socket.id)
})


