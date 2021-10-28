// socket conenction
var socket = io();

// Query DOM
var form = document.getElementById('form');
var input = document.getElementById('input');
var messages = document.getElementById('messages');
var chatWindow = document.getElementById('chat-window');
var feedback = document.getElementById('feedback');


input.addEventListener('keypress', function (e) {
    socket.emit('typing', 'name');
})

input.addEventListener('focusout', function (e) {
    socket.emit('cancel typing', '');
})

// Form Submition
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        appendMyMessage(input.value)
        input.value = '';
    }
    input.focus()
});

function appendMyMessage(msg) {
    var item = document.createElement('p');
    item.style = `text-align: end`;
    item.textContent = msg;
    messages.appendChild(item);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendOtherMessages(msg) {
    var item = document.createElement('p');
    item.style = `text-align: start`;
    item.textContent = msg;
    messages.appendChild(item);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

socket.on('chat message', function (msg) {
    feedback.textContent = "";
    appendOtherMessages(msg)
    input.focus()
});

socket.on('typing', function (data) {
    feedback.textContent = data + " is writing."
});

socket.on('cancel typing', function (data) {
    feedback.textContent = ""
});