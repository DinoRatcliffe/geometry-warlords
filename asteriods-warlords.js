var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'asteriods-warlords', 
                           { create: create,
                             update: update,
                             render: render});
//helper functions
function vecLen(vec) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}

function normalize(vec) {
    var len = vecLen(vec);
    return [vec[0]/len, vec[1]/len];
}

function rotateVec(vec, rot) {
    var newVec = [
        vec[0] * Math.cos(rot) - vec[1] * Math.sin(rot),
        vec[0] * Math.sin(rot) + vec[1] * Math.cos(rot)
    ]
    return newVec;
}

// "classes"
function Ship(x, y, color, controls) {
    this.ROTATION_SPEED = 2.5;
    this.THRUST_POWER = 0.02;

    //properties
    this.center = new Phaser.Point(x, y);
    this.controls = controls;
    this.rotation = 0;
    this.size = 10;
    this.color = color;

    this.velocityVec = [0, 0];

    //member functions
    this.thrust = function() {
        var rotationVec = normalize(rotateVec([1, 0], this.rotation * (Math.PI/180)));
        this.velocityVec = [
            this.velocityVec[0] + rotationVec[0] * this.THRUST_POWER,
            this.velocityVec[1] + rotationVec[1] * this.THRUST_POWER
        ];
    };

    this.rotate = function(direction) {
        var rot = this.ROTATION_SPEED;
        if (direction === 'left') {
            rot *= -1;
        }
        this.rotation += rot;
    }

    //game lifecycle
    this.update = function() {
        this.center.x += this.velocityVec[0];
        this.center.y += this.velocityVec[1];

        if (this.controls && this.controls.left.isDown) {
            this.rotate('left');
        }
        
        if (this.controls && this.controls.right.isDown) {
            this.rotate('right');
        }

        if (this.controls && this.controls.thrust.isDown) {
            console.log('thrust');
            this.thrust();
        }


        if (this.controls && this.controls.shoot.isDown) {
            console.log('todo shoot');
        }
    }

    this.render = function(graphics) {
       var center = this.center;
       var size = this.size;

       var topPoint = new Phaser.Point(center.x, center.y - size);
       var rightPoint = new Phaser.Point(center.x, center.y - size);
       var leftPoint = new Phaser.Point(center.x, center.y - size);
       topPoint.rotate(center.x, center.y, this.rotation, true);
       rightPoint.rotate(center.x, center.y, (360/3) + this.rotation, true);
       leftPoint.rotate(center.x, center.y, (360/3*2) + this.rotation, true);

       this.polygon = new Phaser.Polygon([topPoint, rightPoint, leftPoint]);
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

    players = [
        new Ship(100, 100, 0xFFFFFF, new Controls(
            game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            game.input.keyboard.addKey(Phaser.Keyboard.UP),
            game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        )), 
        new Ship(200, 200, 0x00FF00)];
    graphics = game.add.graphics(0, 0);
}

function update() {
    horizontalDivide.start.y = getRandomInt(0, 600);
    divideIntersect = horizontalDivide.intersects(verticalDivide, true);
    players.forEach(function(player) {
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
