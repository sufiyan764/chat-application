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

io.on("connection", function (socket) {

    //default username
    console.log("connection made by new user");
    //listen on change username
    socket.on("change_username", function (data) {
        //set new username
        socket.username = data.username;
        console.log(socket.username + " connected");
    });


    //listen on typing message
    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", { username: socket.username });
    })

    //listen on new message
    socket.on("message", function (data) {
        //broadcast message with username
        //this line will send the message to all the sockets
        io.sockets.emit("message", { message: data.message, username: socket.username });
    });

    socket.on("disconnect", function (data) {
        console.log(socket.username + " disconnected");
    })
});