var game, joystick;
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

function init() {

    scoreCounterElement.innerHTML = "Score: " + scoreCounter;

    evilSound = new Sound('sounds/hitEvil.ogg');
    goodieSound = new Sound('sounds/hitGoody.ogg');
    gameOverSound = new Sound('sounds/gameOver.ogg');
    introSound = new Sound('sounds/intro.ogg');

    game = new Scene();

    game.setBG('transparent');
    game.setPos(0, 0);

    game.setSize(
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    );

    clownfish = new Sprite(game, 'images/clownfish.png', 70, 50, null, null, null, null);
    evil1 = new Sprite(game, 'images/evil1.png', 100, 60, -1, evilSound, null, hitEvil1);
    starfish = new Sprite(game, 'images/starfish.png', 80, 60, 2, goodieSound, scoreCounterElement, hitStarfish);

    evil1.setPosition(game.width, game.height / 2);

    starfish.setPosition(game.width, game.height / 4);

    addLives();

    if (game.touchable) {
        joystick = new Joy();
    } else {
        alert('This game requires a touch screen');
    } // end ifs

    button = new GameButton("Start");

    button.setPos((game.width / 2 - 30), game.height - 33);
    button.setSize(60, 30);

    evil1.hide();
    starfish.hide();

    clownfish.setSpeed(0);
    clownfish.setPosition(40, 30);

    game.start();
    introSound.play();

} // end init

function update() {

    game.clear();

    if (starfish.x < 0.1) {
        starfish.setPosition(game.width, game.height * Math.random());
    }

    if (evil1.x < 0.1) {
        evil1.setPosition(game.width, game.height * Math.random());
    }

    if (game.touchable) {

        var dx = joystick.getDiffX() * 0.1;
        var dy = joystick.getDiffY() * 0.1;

        if (clownfish.x + dx <= game.width && clownfish.x + dx > 0) {
            clownfish.setDX(dx);
        } else {
            clownfish.setDX(0);
        }

        if (clownfish.y + dy <= game.height && clownfish.y + dy > 0) {
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

        game.stop();
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
            object.setPosition(game.width, game.height * Math.random());
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
    game.setSize(
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    );
}

function addLives() {
    var anchor;
    for (var i = 0; i < livesCounter; i++) {
        anchor = new Sprite(game, 'images/anchor2.png', 18, 20, null, null, null, null);
        anchor.setPosition(10 + i * 20, 10);
        anchor.setSpeed(0);
        lives.push(anchor);
    }
}

window.addEventListener('load', init);
window.addEventListener('load', resize);


