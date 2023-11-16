var canvas, ctx;
var joystickX = 0;
var joystickY = 0;

window.addEventListener('load', () => {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');          
    resize(); 

    document.addEventListener('mousedown', startDrawing);
    document.addEventListener('mouseup', stopDrawing);
    document.addEventListener('mousemove', Draw);

    document.addEventListener('touchstart', startDrawing);
    document.addEventListener('touchend', stopDrawing);
    document.addEventListener('touchcancel', stopDrawing);
    document.addEventListener('touchmove', Draw);
    window.addEventListener('resize', resize);

    document.getElementById("x_coordinate").innerText = 0;
    document.getElementById("y_coordinate").innerText = 0;
    // document.getElementById("speed").innerText = 0;
    // document.getElementById("angle").innerText = 0;
});

var width, height, radius, x_orig, y_orig;
function resize() {
    width = window.innerWidth;
    radius = 100;
    height = radius * 6.5;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    background();
    joystick(width / 2, height / 3);
}

function background() {
    x_orig = width / 2;
    y_orig = height / 3;

    ctx.beginPath();
    ctx.arc(x_orig, y_orig, radius + 20, 0, Math.PI * 2, true);
    ctx.fillStyle = '#bbbdbf';
    ctx.fill();
}

function joystick(width, height) {
    ctx.beginPath();
    ctx.arc(width, height, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 8;
    ctx.stroke();
}

let coord = { x: 0, y: 0 };
let paint = false;

function getPosition(event) {
    var mouse_x = event.clientX || event.touches[0].clientX;
    var mouse_y = event.clientY || event.touches[0].clientY;
    coord.x = mouse_x - canvas.offsetLeft;
    coord.y = mouse_y - canvas.offsetTop;
}

function is_it_in_the_circle() {
    var current_radius = Math.sqrt(Math.pow(coord.x - x_orig, 2) + Math.pow(coord.y - y_orig, 2));
    if (radius >= current_radius) return true
    else return false
}


function startDrawing(event) {
    paint = true;
    getPosition(event);
    if (is_it_in_the_circle()) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background();
        joystick(coord.x, coord.y);
        Draw();
    }
}


function stopDrawing() {
    paint = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();
    joystick(width / 2, height / 3);
    document.getElementById("x_coordinate").innerText = 0;
    document.getElementById("y_coordinate").innerText = 0;
    // document.getElementById("speed").innerText = 0;
    // document.getElementById("angle").innerText = 0;

}

function Draw(event) {

    if (paint) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); //canvas gelöscht und neue joystick geschafft
        background();
        var angle_in_degrees,x, y;
        //Winkel zwischen aktuellen mausposition coord und ursporung joystick xorig berechnet um joystick zu positionieren
        var angle = Math.atan2((coord.y - y_orig), (coord.x - x_orig)); 

        if (Math.sign(angle) == -1) {
            angle_in_degrees = Math.round(-angle * 180 / Math.PI);
        }
        else {
            angle_in_degrees =Math.round( 360 - angle * 180 / Math.PI);
        }


        if (is_it_in_the_circle()) { //Wenn es innerhalb joystick bereich dann zeichne und aktualisiere x und y
            joystick(coord.x, coord.y);
            x = coord.x;
            y = coord.y;
        }
        else {
            x = radius * Math.cos(angle) + x_orig;
            y = radius * Math.sin(angle) + y_orig;
            joystick(x, y);
        }

    
        getPosition(event); //aufgerufen um aktuelle mausposition zu aktualisieren

        // var speed =  Math.round(100 * Math.sqrt(Math.pow(x - x_orig, 2) + Math.pow(y - y_orig, 2)) / radius);

        var x_relative = Math.round(x - x_orig); // Berechnet relativen Koordinaten 
        var y_relative = Math.round(y - y_orig);
        

        document.getElementById("x_coordinate").innerText =  x_relative;
        document.getElementById("y_coordinate").innerText =y_relative ;
        // document.getElementById("speed").innerText = speed;
        // document.getElementById("angle").innerText = angle_in_degrees;

        joystickX = x_relative;
        joystickY = y_relative;
    }
} 

var gameBox = document.getElementById("game-box");
var object = document.getElementById("object");
var x = gameBox.clientWidth / 2 - object.clientWidth / 2;
var y = gameBox.clientHeight / 2 - object.clientHeight / 2;
var speed = 0.1;
// var gameover = false;

// Function to update the object's position
function updateObjectPosition() {
    object.style.left = x + "px";
    object.style.top = y + "px";
}

function moveObject(joystickX, joystickY) {
    // Update the object's x and y coordinates based on the joystick input
    x += joystickX * speed;
    y += joystickY * speed;

    // Check for collisions with game-box walls
    if (x < 0 || x > gameBox.clientWidth - object.clientWidth || y < 0 || y > gameBox.clientHeight - object.clientHeight) {
        gameOver();
        return; // Stop further execution of the function
    }

    // Ensure the object stays within the boundaries of the game box
    x = Math.min(gameBox.clientWidth - object.clientWidth, Math.max(0, x));
    y = Math.min(gameBox.clientHeight - object.clientHeight, Math.max(0, y));

    // Update the object's position
    updateObjectPosition();
}

// Periodically update the object's position based on joystick input
setInterval(function() {
    moveObject(joystickX, joystickY);
    console.log(joystickX, joystickY);
}, 50); // You can adjust the interval as needed

var redBall = document.getElementById("red-ball");
var redBallX = 100; // Initial X position
var redBallY = 150; // Initial Y position

// Set initial position of the red ball
redBall.style.left = redBallX + "px";
redBall.style.top = redBallY + "px";

setInterval(function() {
    moveObject(joystickX, joystickY);

    // Check for collision with red ball
    if (checkCollision()) {
        respawnRedBall();
    }
}, 50);

function checkCollision() {
    // Simple bounding box collision detection
    return (
        x < redBallX + redBall.clientWidth &&
        x + object.clientWidth > redBallX &&
        y < redBallY + redBall.clientHeight &&
        y + object.clientHeight > redBallY
    );
}

function respawnRedBall() {
    // Respawn the red ball at a random position within the game box
    redBallX = Math.random() * (gameBox.clientWidth - redBall.clientWidth);
    redBallY = Math.random() * (gameBox.clientHeight - redBall.clientHeight);

    redBall.style.left = redBallX + "px";
    redBall.style.top = redBallY + "px";
}

var score = 0;

function updateScore() {
    document.getElementById("score").innerText = score;
}

function respawnRedBall() {
    // Increment score when the object touches the red ball
    score++;
    updateScore();
    

    // Respawn the red ball at a random position within the game box
    redBallX = Math.random() * (gameBox.clientWidth - redBall.clientWidth);
    redBallY = Math.random() * (gameBox.clientHeight - redBall.clientHeight);

    redBall.style.left = redBallX + "px";
    redBall.style.top = redBallY + "px";
}

// Set initial score display
updateScore();

var intervalId = setInterval(function() {
    moveObject(joystickX, joystickY);

    // Check for collision with red ball
    if (checkCollision()) {
        respawnRedBall();
    }
}, 50);

function showPopup(score) {
    document.getElementById('popupScore').innerText = score;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'flex';
}

function gameOver() {
    clearInterval(intervalId); // Stop the interval

    // Show the custom pop-up
    showPopup(score);
}

// Function to handle touch events
function handleTouch(event) {
    // Check if two fingers are tapped
    if (event.touches.length === 2) {
        // Redirect to the desired HTML page
        window.location.href = 'homepage.html';
    }
    }

    // Add the touch event listener to the document
    document.addEventListener('touchstart', handleTouch);



