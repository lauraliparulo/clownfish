var game, joystick;
var livesCounterElement = document.getElementById('lives');
var scoreCounterElement = document.getElementById('score');
var evilAudioElement = document.createElement('audio');
var goodyAudioElement = document.createElement('audio');
var clownfish, evil1, starfish, seahorse, shell;
var livesCounter = 5;
var scoreCounter = 0;
//boolean variables to track collisions events
var hitEvil1, hitStarfish;

function init() {

    livesCounterElement.innerHTML = livesCounter;
    scoreCounterElement.innerHTML = "Score: " + scoreCounter;

    evilAudioElement.setAttribute('src', 'sounds/hitEvil.ogg');
    goodyAudioElement.setAttribute('src', 'sounds/hitGoody.ogg');

    game = new Scene();

    game.setBG('transparent');
    game.setPos(0, 0);

    game.setSize(
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    );

    clownfish = new Sprite(game, 'images/clownfish.png', 70, 50, null, null, null, null);
    evil1 = new Sprite(game, 'images/evil1.png', 100, 60, -1, evilAudioElement, livesCounterElement, hitEvil1);
    starfish = new Sprite(game, 'images/starfish.png', 80, 60, 2, goodyAudioElement, scoreCounterElement, hitStarfish);
    /*    seahorse = new Sprite(game, 'images/seahorse.png', 100, 60);
     shell = new Sprite(game, 'images/shell.png', 100, 60);*/

    evil1.setPosition(game.width, game.height / 2);
    starfish.setPosition(game.width, game.height / 4);

    if (game.touchable) {
        joystick = new Joy();
    } else {
        alert('This game requires a touch screen');
    } // end if

    clownfish.setSpeed(0);
    clownfish.setPosition(40, 30);
    game.start();

} // end init

function update() {
    game.clear();

    if (starfish.x < 0.1) {
        starfish.setPosition(game.width, game.height * Math.random());
        console.log('starfish set position');

    }

    if (evil1.x < 0.1) {
        evil1.setPosition(game.width, game.height * Math.random());
        console.log('starfish set position');
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

        clownfish.update();

        evil1.setDX(-8);
        starfish.setDX(-10);
        checkGameOver();

        evil1.update();
        starfish.update();
        scoreCounterElement.innerHTML = "Score: " + scoreCounter;
    } // end touchable

}// end update

function checkGameOver() {

    if (livesCounter === 0) {

        clownfish = null;
        evil1 = null;
        starfish = null;
        document.body.style.background = 'url("images/gameoverK.png") no-repeat center center';

        evilAudioElement.setAttribute('src', 'sounds/end.ogg');
        evilAudioElement.play();
    }
}

function detectCollision(object) {

    if (!object.hit && clownfish.x < object.x + object.width && clownfish.x + clownfish.width > object.x &&
        clownfish.y < object.y + object.height && clownfish.y + clownfish.height > object.y) {
        object.hit = true;
        object.audioElement.play();

        if (object.counterIncrement > 0) {
            scoreCounter = scoreCounter + object.counterIncrement;
            object.counterElement.innerHTML = scoreCounter;

        }
        else {
            livesCounter = livesCounter + object.counterIncrement;
            object.counterElement.innerHTML = livesCounter;
        }

        console.log("evil: " + livesCounter);
        console.log("good: " + scoreCounter);
        console.log("increment" + object.counterIncrement);
    }

    if (clownfish.x > object.x + object.width) {
        object.hit = false;
    }

}

function resize() {
    game.setSize(
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    );
}
window.addEventListener('load', init);
window.addEventListener('load', resize);


