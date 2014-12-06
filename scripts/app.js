var scene, joystick;
var scoreBoards;
var evilSound, goodieSound, gameOverSound, introSound;
var clownfish, evil1, starfish;
var livesCounter = 5;
var scoreCounter = 0;
//boolean variables to track collisions events
var hitEvil1, hitStarfish;
var lives = [];
var restartButton;



function OtherSprite(scene, imageFile, width, height, counterIncrement, audioElement, hit) {
    entity = new Sprite(scene, imageFile, width, height);
    entity.counterIncrement = counterIncrement;
    entity.audioElement = audioElement;
    entity.hit = hit;
    return entity;
}

function init() {

    scoreBoard = "Score: " + scoreCounter;

    evilSound = new Sound('sounds/hitEvil.ogg');
    goodieSound = new Sound('sounds/hitGoody.ogg');
    gameOverSound = new Sound('sounds/gameOver.ogg');
    introSound = new Sound('sounds/intro.ogg');

    scene = new Scene();

    scene.setBG('transparent');
    scene.setPos(0, 0);

    scene.setSize(
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    );

    clownfish = new Sprite(scene, 'images/clownfish.png', 70, 50);
    evil1 = new OtherSprite(scene, 'images/evil1.png', 100, 60, -1, evilSound, hitEvil1);
    starfish = new OtherSprite(scene, 'images/starfish.png', 80, 60, 2, goodieSound, hitStarfish);

    evil1.setPosition(scene.width, scene.height / 2);

    starfish.setPosition(scene.width, scene.height / 4);

    addLives();

    if (scene.touchable) {
        joystick = new Joy();
    } else {
        alert('This scene requires a touch screen');
    } // end ifs

    restartButton = new GameButton("Restart");

    restartButton.setPos(scene.width - 70, scene.height - 40);
    restartButton.setSize(60, 30);


    evil1.show();
    starfish.show();

    clownfish.setSpeed(0);
    clownfish.setPosition(40, 30);

    scene.start();
    introSound.play();

    showScore(scoreBoard);
} // end init


function update() {

    scene.clear();

    if (starfish.x < 0.1) {
        starfish.setPosition(scene.width, scene.height * Math.random());
    }

    if (evil1.x < 0.1) {
        evil1.setPosition(scene.width, scene.height * Math.random());
    }

    if (scene.touchable) {
        checkJoystick();
    } else {
        checkMouse();
    } // end if)// end touchable

    checkButtons();
    checkGameOver();

    detectCollision(evil1);
    detectCollision(starfish);
    evil1.setDX(-8);
    starfish.setDX(-10);

    evil1.update();
    starfish.update();
    clownfish.update();
    //update lives
    for (var i = 0; i < livesCounter; i++) {
        lives[i].update();
    }

    showScore(scoreBoard);

}// end update

function checkJoystick() {
    var dx = joystick.getDiffX() * 0.1;
    var dy = joystick.getDiffY() * 0.1;

    if (clownfish.x + dx <= scene.width && clownfish.x + dx > 0) {
        clownfish.setDX(dx);
    } else {
        clownfish.setDX(0);
    }

    if (clownfish.y + dy <= scene.height && clownfish.y + dy > 0) {
        clownfish.setDY(dy);
    } else {
        clownfish.setDY(0);
    }
}

function checkMouse() {
    x = scene.getMouseX();
    y = scene.getMouseY();
    if (x < scene.width && y < scene.height) {
        clownfish.show();
        clownfish.setPosition(x, y);
    } else {
        clownfish.hide();
    }
}

function checkButtons() {

    if (restartButton.isClicked()) {
        restart();
        evil1.show();
        starfish.show();
    }
}// end checkbutton

function checkGameOver() {

    if (livesCounter === 0) {

        document.body.style.background = 'url("images/gameoverK.png") no-repeat center center';

        clownfish.hide();
        evil1.hide();
        starfish.hide();

        gameOverSound = new Sound('sounds/gameOver.ogg');
        gameOverSound.play();

        scene.stop();
        document.body.removeChild(button.button);

    }
}

function detectCollision(object) {

    if (!object.hit && clownfish.collidesWith(object)) {
        object.audioElement.play();
        object.hit = true;
        if (object.counterIncrement > 0) {
            scoreCounter = scoreCounter + object.counterIncrement;
            scoreBoard = "Score: " + scoreCounter;
            object.setPosition(scene.width, scene.height * Math.random());
        }
        else {
            livesCounter = livesCounter + object.counterIncrement;
            //      object.counterElement.innerHTML = livesCounter;
            lives.pop();

        }
    } else if (!clownfish.collidesWith(object)) {
        object.hit = false;
    }

}

function resize() {
    scene.setSize(
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    );
}

function addLives() {
    var anchor;
    for (var i = 0; i < livesCounter; i++) {
        anchor = new Sprite(scene, 'images/anchor2.png', 18, 20);
        anchor.setPosition(40 + i * 21, scene.height - 40);
        anchor.setSpeed(0);
        lives.push(anchor);
    }
}


function restart() {
    document.location.href = "";
} // end restart

window.addEventListener('load', init);
window.addEventListener('load', resize);


function showScore(score) {
    scene.context.font = "20px Arial";
    scene.context.fillText(score, 30, 40);
}