$(function () {
    //make connection
    var socket = io.connect("http://192.168.1.66:3000/chatroom")

    //buttons and inputs
    var username = $("#username");
    var send_username = $("#send_username");
    var message = $("#message");
    var send_message = $("#send_message");
    var chatroom = $("#chatroom");
    var feedback = $("#feedback");

    //Emit typing
    message.bind("keypress", () => {
        socket.emit('typing');
    });

    //Listen on typing
    socket.on("typing", function (data) {
        feedback.html("<p><i>" + data.username + " is typing.." + "</i></p>");
    });

    //emit message
    send_message.click(function () {
        socket.emit("message", { message: message.val() })
    });

    socket.on("message", function (data) {
        chatroom.append("<p class='message'>" + data.username + ": " + data.message);
    });

    //emit username
    send_username.click(function () {
        socket.emit("change_username", { username: username.val() })
    });

    socket.on("disconnect", function (data) {
        socket.connect();
    })
});