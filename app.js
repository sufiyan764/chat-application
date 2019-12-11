const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/chatroom1", function (req, res) {
    res.render("chatroom1");
});

app.get("/chatroom2", function (req, res) {
    res.render("chatroom2");
});

server = app.listen(3000, function () {
    console.log("app running on port 3000");
});

const io = require("socket.io")(server);



io.of("chatroom1").on("connection", function (socket) {
    var address = socket.handshake.address;
    socket.join("chatting")
    console.log('New connection in cahtroom1 from ' + address);
    //listen on change username
    socket.on("change_username", function (data) {
        //set new username
        socket.username = data.username;
        console.log(socket.username + " connected");
    });

    //listen on typing message
    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", { username: socket.username });
    });

    socket.on("nottyping", function (data) {
        socket.broadcast.emit("nottyping");
    });

    //listen on new message
    socket.on("message", function (data) {
        //broadcast message with username
        //this line will send the message to all the sockets
        io.of("chatroom1").emit("message", { message: data.message, username: socket.username });
    });

    socket.on("disconnect", function (data) {
        console.log(socket.username + " disconnected");
    });
});

io.of("chatroom2").on("connection", function (socket) {
    var address = socket.handshake.address;
    console.log('New connection in cahtroom2 from ' + address);
    //listen on change username
    socket.on("change_username", function (data) {
        //set new username
        socket.username = data.username;
        console.log(socket.username + " connected");
    });

    //listen on typing message
    socket.on("typing", function (data) {
        io.of("chatroom2").to("chatting").emit("typing", { username: socket.username });
    });

    socket.on("nottyping", function (data) {
        io.of("chatroom2").to("chatting").emit("nottyping");
    });

    //listen on new message
    socket.on("message", function (data) {
        //broadcast message with username
        //this line will send the message to all the sockets
        io.of("chatroom2").emit("message", { message: data.message, username: socket.username });
    });

    socket.on("disconnect", function (data) {
        console.log(socket.username + " disconnected");
    });
});