const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("index");
});

server = app.listen(3000, function () {
    console.log("app running on port 3000");
});

const io = require("socket.io")(server);

const nsp = io.of("/chatroom");

nsp.on("connection", function (socket) {
    socket.join("chatroom");
    var address = socket.handshake.address;
    console.log('New connection from ' + address);
    //listen on change username
    socket.on("change_username", function (data) {
        //set new username
        socket.username = data.username;
        console.log(socket.username + " connected");
    });

    //listen on typing message
    socket.on("typing", function (data) {
        socket.broadcast.to("chatroom").emit("typing", { username: socket.username });
    });

    socket.on("nottyping", function (data) {
        socket.broadcast.to("chatroom").emit("nottyping");
    });

    //listen on new message
    socket.on("message", function (data) {
        //broadcast message with username
        //this line will send the message to all the sockets
        nsp.to("chatroom").emit("message", { message: data.message, username: socket.username });
    });

    socket.on("disconnect", function (data) {
        console.log(socket.username + " disconnected");
    });
});