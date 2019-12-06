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


    message.bind("keyup", (e) => {
        if (e.keyCode === 13) {
            if (message.val().length > 0) {
                send_message.click();
            }
        } else {
            setTimeout(() => {
                socket.emit('nottyping');
            }, 3000);
        }
    });



    socket.on("nottyping", function (data) {
        feedback.html("<p><i>&nbsp;</i></p>");
    });


    //emit message
    send_message.click(function () {
        socket.emit("message", { message: message.val() })
    });

    //emit username
    send_username.click(function () {
        socket.emit("change_username", { username: username.val() })
    });

    //listen message and username
    socket.on("message", function (data) {
        chatroom.append("<p class='message'>" + data.username + ": " + data.message);
    });



    socket.on("disconnect", function (data) {
        socket.connect();
    })
});