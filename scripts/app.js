var livesCounter = 5;
var scoreCounter = 0;
//boolean variables to track collisions events
var hitEvil1, hitEvil2, hitEvil3, hitEvil4, hitEvil5, hitStarfish, hitSeahorse;
var lives = [];


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
    evil2 = new OtherSprite(scene, 'images/evil5.png', 100, 60, -1, evilSound, hitEvil2);
    evil3 = new OtherSprite(scene, 'images/evil8.png', 60, 30, -2, evilSound, hitEvil3);
    evil4 = new OtherSprite(scene, 'images/evil6.png', 160, 100, -1, evilSound, hitEvil4);
    jellyfish = new OtherSprite(scene, 'images/evil7.png', 60, 30, -2, evilSound, hitEvil5);

    //neutral
    tropical = new OtherSprite(scene, 'images/tropical.png', 60, 30);
    tortoise = new OtherSprite(scene, 'images/tortoise.png', 60, 30);

    starfish = new OtherSprite(scene, 'images/starfish.png', 80, 60, 2, goodieSound, hitStarfish);
    seahorse = new OtherSprite(scene, 'images/seahorse.png', 40, 80, 4, goodieSound, hitSeahorse);
    shell = new OtherSprite(scene, 'images/shell.png', 40, 80, 4, goodieSound, hitSeahorse);
    seaweed = new OtherSprite(scene, 'images/seaweed.png', 40, 80, 4, goodieSound, hitSeahorse);

    evil1.setPosition(scene.width, scene.height / 2);
    evil2.setPosition(scene.width, scene.height / 3);
    evil3.setPosition(scene.width, scene.height / 5);
    evil4.setPosition(scene.width, scene.height / 7);
    jellyfish.setPosition(scene.width, scene.height / 5);

    tropical.setPosition(scene.width, scene.height / 5);
    tortoise.setPosition(scene.width, scene.height / 5);

    starfish.setPosition(scene.width, scene.height / 4);
    seahorse.setPosition(scene.width, scene.height / 6);
    seaweed.setPosition(scene.width, scene.height / 8);
    shell.setPosition(scene.width, scene.height / 9);

    addLives();

    if (scene.touchable) {
        joystick = new Joy();
    } else {
        alert('This scene requires a touch screen');
    } // end ifs

    restartButton = new GameButton("Restart");

    restartButton.setPos(scene.width - 70, scene.height - 40);
    restartButton.setSize(60, 30);

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

    if (seahorse.x < 0.1) {
        seahorse.setPosition(scene.width, scene.height * Math.random());
    }

    if (evil1.x < 0.1) {
        evil1.setPosition(scene.width, scene.height * Math.random());
    }

    if (evil2.x < 0.1) {
        evil2.setPosition(scene.width, scene.height * Math.random());
    }

    if (evil3.x < 0.1) {
        evil3.setPosition(scene.width, scene.height * Math.random());
    }

    if (evil4.x < 0.1) {
        evil4.setPosition(scene.width, scene.height * Math.random());
    }

    if (jellyfish.x < 0.1) {
        jellyfish.setPosition(scene.width, scene.height * Math.random());
    }

    if (tortoise.x < 0.1) {
        tortoise.setPosition(scene.width, scene.height * Math.random());
    }

    if (tropical.x < 0.1) {
        tropical.setPosition(scene.width, scene.height * Math.random());
    }

    if (shell.x < 0.1) {
        shell.setPosition(scene.width, scene.height * Math.random());
    }

    if (seaweed.x < 0.1) {
        seaweed.setPosition(scene.width, scene.height * Math.random());
    }

    if (scene.touchable) {
        checkJoystick();
    } else {
        checkMouse();
    } // end if)// end touchable

    checkButtons();
    checkGameOver();

    detectCollision(evil1);
    detectCollision(evil2);
    detectCollision(evil3);
    detectCollision(evil4);
    detectCollision(jellyfish);

    detectCollision(starfish);
    detectCollision(seahorse);
    detectCollision(shell);
    detectCollision(seaweed);

    evil1.setDX(-8);
    evil2.setDX(-9);
    evil3.setDX(-10);
    evil4.setDX(-11);
    jellyfish.setDX(-13);

    starfish.setDX(-10);
    seahorse.setDX(-12);
    shell.setDX(-14);
    seaweed.setDX(-5);

    tortoise.setDX(-12);
    tropical.setDX(-12);

    evil1.update();
    evil2.update();
    evil3.update();
    evil4.update();
    jellyfish.update();

    starfish.update();
    seahorse.update();
    shell.update();
    seaweed.update();

    tortoise.update();
    tropical.update();

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
    }
}// end checkbutton

function checkGameOver() {

    if (livesCounter === 0) {

        document.body.style.background = 'url("images/gameoverK.png") no-repeat center center';

        clownfish.hide();
        evil1.hide();
        evil2.hide();
        evil3.hide();
        evil3.hide();
        evil4.hide();
        jellyfish.hide();

        seaweed.hide();
        shell.hide();

        tropical.hide();
        tortoise.hide();
        starfish.hide();
        seahorse.hide();

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