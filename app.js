var game, gameOver;
var counterElement = document.getElementById('counter');
var scoreElement = document.getElementById('score');
var evilAudioElement = document.createElement('audio');
var goodyAudioElement = document.createElement('audio');
var clownfish, evil1, starfish, seahorse, shell;
var joystick;
var counter = 5;
var score = 0;
var hitEvil1, hitStarfish;

function init() {

    counterElement.innerHTML = counter;
    scoreElement.innerHTML = score;

    evilAudioElement.setAttribute('src', 'sounds/hitEvil.ogg');
    goodyAudioElement.setAttribute('src', 'sounds/hitGoody.ogg');

    game = new Scene();

    game.setBG('transparent');
    game.setPos(0, 0);

    game.setSize(
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    );

    clownfish = new Sprite(game, 'images/clownfish.png', 70, 50);
    evil1 = new Sprite(game, 'images/evil1.png', 100, 60);
    starfish = new Sprite(game, 'images/starfish.png', 80, 60);
    seahorse = new Sprite(game, 'images/seahorse.png', 100, 60);
    shell = new Sprite(game, 'images/shell.png', 100, 60);

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

        detectEvilCollision(evil1);

        detectGoodyCollision(starfish);

        clownfish.update();

        evil1.setDX(-8);
        starfish.setDX(-10);
        checkGameOver();

        evil1.update();
        starfish.update();
    } // end touchable

}// end update

function checkGameOver() {

    if (counter === 0) {

        clownfish = null;
        evil1 = null;
        starfish = null;
        document.body.style.background = 'url("images/gameoverK.png") no-repeat center center';

        evilAudioElement.setAttribute('src', 'sounds/end.ogg');

        evilAudioElement.play();
    }
}

function detectEvilCollision(object) {

    if (!hitEvil1 && clownfish.x < object.x + object.width && clownfish.x + clownfish.width > object.x &&
        clownfish.y < object.y + object.height && clownfish.y + clownfish.height > object.y) {
        hitEvil1 = true;
        evilAudioElement.play();
        counter -= 1;
        counterElement.innerHTML = counter;
    }

    if (clownfish.x > object.x + object.width) {
        hitEvil1 = false;
    }

}

function detectGoodyCollision(object) {

    if (!hitStarfish && clownfish.x < object.x + object.width && clownfish.x + clownfish.width > object.x &&
        clownfish.y < object.y + object.height && clownfish.y + clownfish.height > object.y) {
        hitStarfish = true;
        goodyAudioElement.play();
        score += 1;
        scoreElement.innerHTML = score;
    }

    if (clownfish.x > object.x + object.width) {
        hitStarfish = false;
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


