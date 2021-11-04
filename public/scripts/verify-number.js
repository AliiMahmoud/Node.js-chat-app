
var input = document.getElementById('code');
var form = document.getElementById('form');
var verifyBtn = document.getElementById('verify-btn');


function verifyCode() {
    var respond = -1
    document.getElementById('error-block').innerHTML = ""
    var url = 'verify-number';
    var params = `code=${input.value}`;
    input.value = ""
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () {
        if (http.readyState == 4)
            console.log(http.status)
        if (http.readyState == 4 && http.status == 200) {
            window.location.replace('/home')
        }
        else if (http.readyState == 4 && http.status == 403) {
            window.location.replace('/')
        }
        else if (http.readyState == 4) {
            // error message
            document.getElementById('error-block').innerHTML = `<div class="alert alert-error"> Invalid code </div>`
            respond = 1
        }
    }
    http.send(params);
    let index = 1
    let interval = setInterval(function () {
        if (index > 3)
            index = 0
        verifyBtn.textContent = "Verify" + '...'.substr(0, index)
        index++
        if (respond == 1) {
            verifyBtn.textContent = "Verify"
            clearInterval(interval);
        }
    }, 400);

    return false
}

function generateInterval() {
    var timeleft = 20;
    let sendLink = document.getElementById('send-again')

    let interval = setInterval(function () {
        timeleft--;
        document.getElementById("countdowntimer").textContent = timeleft + " sec";
        if (timeleft <= 0) {
            document.getElementById("countdowntimer").textContent = '';
            // sendLink.setAttribute("href", "/resendcode")
            sendLink.setAttribute("onclick", "resend()")
            sendLink.style.textDecoration = "underline"
            clearInterval(interval);
        }
    }, 1000);
}

function disableBtn() {
    // disable the button
    let sendLink = document.getElementById('send-again')
    sendLink.setAttribute("href", "#")
    sendLink.setAttribute("onclick", "return false")
    sendLink.style.textDecoration = "line-through"
    generateInterval()
}


function resend() {

    document.getElementById('error-block').innerHTML = ""
    disableBtn()
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        if (xhttp.readyState == 4)
            console.log(xhttp.status)
        if (xhttp.status !== 200)
            window.location.replace("/")
    }
    xhttp.open("GET", "/resendcode");
    xhttp.send();
}


disableBtn()