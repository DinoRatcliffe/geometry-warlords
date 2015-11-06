var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'asteriods-warlords', 
                           { create: create,
                             update: update,
                             render: render});

// "classes"
function Ship(x, y, color, controls) {
    //properties
    this.center = new Phaser.Point(x, y);
    this.controls = controls;
    this.rotation = 0;
    this.size = 10;
    this.color = color;

    //member functions
    this.thrust = function() {
        this.center.x += 2;
    };

    this.rotate = function() {
        this.rotation += 1;
    }

    //game lifecycle
    this.update = function() {
        var center = this.center;
        var size = this.size;

        var topPoint = new Phaser.Point(center.x, center.y - size);
        var rightPoint = new Phaser.Point(center.x, center.y - size);
        var leftPoint = new Phaser.Point(center.x, center.y - size);
        topPoint.rotate(center.x, center.y, this.rotation, true);
        rightPoint.rotate(center.x, center.y, (360/3) + this.rotation, true);
        leftPoint.rotate(center.x, center.y, (360/3*2) + this.rotation, true);

        this.polygon = new Phaser.Polygon([topPoint, rightPoint, leftPoint]);
    }

    this.render = function(graphics) {
       var points = this.polygon.points;
       graphics.lineStyle(1, this.color, 1);
       graphics.moveTo(points[points.length-1].x, points[points.length-1].y);
       points.forEach(function (point) {
           graphics.lineTo(point.x, point.y);
       });
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
var players;
var graphics;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Game Lifecycle
function create() {
    game.stage.backgroundColor = "#000";

    verticalDivide = new Phaser.Line(400, 0, 400, 600);
    horizontalDivide = new Phaser.Line(0, 300, 800, 300);

    players = [new Ship(100, 100, 0xFFFFFF), new Ship(200, 200, 0x00FF00)];
    graphics = game.add.graphics(0, 0);
}

function update() {
    horizontalDivide.start.y = getRandomInt(0, 600);
    divideIntersect = horizontalDivide.intersects(verticalDivide, true);
    players.forEach(function(player) {
        player.rotate();
        player.update();
    });
}

function render() {
    graphics.clear();
    game.debug.geom(verticalDivide);
    game.debug.geom(horizontalDivide);

    if (divideIntersect) {
        game.context.fillStyle = 'rgb(0, 255, 255)';
        game.context.fillRect(divideIntersect.x - 2, divideIntersect.y - 2, 5, 5);
    }


    players.forEach(function(player) {
        player.render(graphics);
    });
}
