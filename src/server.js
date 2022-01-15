// Create an http server using createServer
const server = require("http").createServer();
// Wrap server using socket.io w/ transports
const io = require("socket.io")(server, {
    transports: ["websockets", "polling"]
});

// Empty object to store users
const users = {};

// Run callback anytime a user connects to the socket server
io.on("connection", client => {
    // Event to store new user info once username is submitted
    client.on("username", username => {
        const user = {
            name: username,
            id: client.id
        };

        // Stores new user into users object with client.id as key
        users[client.id] = user;
        // Broadcast an event to all the users once the user is created
        io.emit("connected", user);
        // Emit the users object to others users to see all users connected
        io.emit("users", Object.values(users))
    });

    // Event whenever a message is sent to the server
    client.on("send", message => {
        io.emit("message", {
            text: message,
            date: new Date().toISOString(),
            user: user[client.id]
        });
    });

    // Event whenever a user leaves the server
    client.on("disconnect", () => {
        const username = users[client.id];
        delete users[client.id];
        io.emit("disconnected", client.id)
    });
});
// Start & host a server on port:3000
server.listen(3000)