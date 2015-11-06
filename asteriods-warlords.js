var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'asteriods-warlords', 
                           { create: create,
                             update: update,
                             render: render});
// "classes"
function Ship(x, y, controls) {
    //properties
    this.x = x;
    this.y = y;
    this.controls = controls;

    //member functions
    this.update = function() {
    }

    this.render = function() {
    }
}

function Controls(left, right, thrust, shoot) {
    this.left = left;
    this.right = right;
    this.thrust = thrust;
    this.shoot = shoot;
}


//global state properties
var verticalDivide;
var horizontalDivide;
var divideIntersect;

//debug
var tick = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Game Lifecycle
function create() {
    game.stage.backgroundColor = "#000";

    verticalDivide = new Phaser.Line(400, 0, 400, 600);
    horizontalDivide = new Phaser.Line(0, 300, 800, 300);
}

function update() {
    horizontalDivide.start.y = getRandomInt(0, 600);
    divideIntersect = horizontalDivide.intersects(verticalDivide, true);
}

function render() {
    game.debug.geom(verticalDivide);
    game.debug.geom(horizontalDivide);

    if (divideIntersect) {
        game.context.fillStyle = 'rgb(0, 255, 255)';
        game.context.fillRect(divideIntersect.x - 2, divideIntersect.y - 2, 5, 5);
    }
}
