var scene, joystick;
var scoreCounterElement = document.getElementById('score');
var evilSound, goodieSound, gameOverSound, introSound;
var clownfish, evil1, starfish;
var livesCounter = 5;
var scoreCounter = 0;
//boolean variables to track collisions events
var hitEvil1, hitStarfish;
var lives = [];
var button;
var pause = true;


function MainSprite(scene, imageFile, width, height) {
    entity = new Sprite(scene, imageFile, width, height, null, null, null);
    entity.maxSpeed = 10;
    entity.minSpeed = -3;
    entity.setSpeed(0);
    /*    entity.setAngle(0);*/
    entity.checkKeys = function () {
        if (keysDown[K_LEFT]) {
            this.changeAngleBy(-5);
        } // end if
        if (keysDown[K_RIGHT]) {
            this.changeAngleBy(5);
        } // end if
        if (keysDown[K_UP]) {
            this.changeSpeedBy(1);
            if (this.speed > this.maxSpeed) {
                this.setSpeed(this.maxSpeed);
            } // end if
        } // end if
        if (keysDown[K_DOWN]) {
            this.changeSpeedBy(-1);
            if (this.speed < this.minSpeed) {
                this.setSpeed(this.minSpeed);
            } // end if
        } // end if
    } // end checkKeys

    return entity;
} // end setupFrog


function OtherSprite(scene, imageFile, width, height, counterIncrement, audioElement, hit) {
    entity = new Sprite(scene, imageFile, width, height, null, null, null);

    entity.counterIncrement = counterIncrement;
    entity.audioElement = audioElement;
    entity.hit = hit;

    return entity;
}

function init() {

    scoreCounterElement.innerHTML = "Score: " + scoreCounter;

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

    clownfish = new MainSprite(scene, 'images/clownfish.png', 70, 50);
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

    button = new GameButton("Start");

    button.setPos((scene.width / 2 - 30), scene.height - 33);
    button.setSize(60, 30);

    evil1.hide();
    starfish.hide();

    clownfish.setSpeed(0);
    clownfish.setPosition(40, 30);

    scene.start();
    introSound.play();

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

        detectCollision(evil1);
        detectCollision(starfish);
        evil1.setDX(-8);
        starfish.setDX(-10);

        if (pause) {
            evil1.setDX(0);
            starfish.setDX(0);
        }

        checkGameOver();

        evil1.update();
        starfish.update();
        clownfish.update();
        //update lives
        for (var i = 0; i < livesCounter; i++) {
            lives[i].update();
        }

        checkButtons();

    } // end touchable

}// end update

function checkButtons() {

    if (button.isClicked()) {
        if (pause) {
            evil1.show();
            starfish.show();
            button.setName('Pause');
            pause = false;
        } else {
            button.setName('Resume');
            pause = true;

        }
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
            scoreCounterElement.innerHTML = "Score: " + scoreCounter;
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
        anchor = new Sprite(scene, 'images/anchor2.png', 18, 20, null, null, null, null);
        anchor.setPosition(10 + i * 20, 10);
        anchor.setSpeed(0);
        lives.push(anchor);
    }
}

window.addEventListener('load', init);
window.addEventListener('load', resize);


