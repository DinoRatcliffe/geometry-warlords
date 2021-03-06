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
        var rotationVec = normalize(rotateVec([0, -1], this.rotation * (Math.PI/180)));
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

       var rightFire = new Phaser.Point(center.x, center.y - size);
       var leftFire = new Phaser.Point(center.x, center.y - size);
       rightFire.rotate(center.x, center.y, (360/3) + 25 + this.rotation, true);
       leftFire.rotate(center.x, center.y, ((360/3*2) - 25) + this.rotation, true);

       topPoint.rotate(center.x, center.y, this.rotation, true);
       rightPoint.rotate(center.x, center.y, (360/3) + this.rotation, true);
       leftPoint.rotate(center.x, center.y, (360/3*2) + this.rotation, true);

       if (this.controls && this.controls.thrust.isDown) {
           var topFire = new Phaser.Point(center.x, center.y + size + getRandomInt(5, 15));

           topFire.rotate(center.x, center.y, this.rotation, true);
          
           graphics.lineStyle(1, 0xFFFFFF, getRandomInt(30, 90)/100);
           graphics.moveTo(rightFire.x, rightFire.y);
           graphics.lineTo(leftFire.x, leftFire.y);
           graphics.lineTo(topFire.x, topFire.y);
           graphics.lineTo(rightFire.x, rightFire.y);
       }

       graphics.lineStyle(1, 0xFFFFFF, 1);
       graphics.moveTo(rightFire.x, rightFire.y);
       graphics.lineTo(leftFire.x, leftFire.y);

       this.polygon = new Phaser.Polygon([topPoint, rightPoint, leftPoint]);
       var points = this.polygon.points;
       graphics.lineStyle(1.5, this.color, 1);
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
        new Ship(100, 100, 0xFF0000, new Controls(
            game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            game.input.keyboard.addKey(Phaser.Keyboard.UP),
            game.input.keyboard.addKey(Phaser.Keyboard.CONTROL)
        )), 
        new Ship(200, 200, 0x00FF00, new Controls(
            game.input.keyboard.addKey(Phaser.Keyboard.J),
            game.input.keyboard.addKey(Phaser.Keyboard.L),
            game.input.keyboard.addKey(Phaser.Keyboard.I),
            game.input.keyboard.addKey(Phaser.Keyboard.H)
        )),
        new Ship(300, 300, 0xFF00FF, new Controls(
            game.input.keyboard.addKey(Phaser.Keyboard.A),
            game.input.keyboard.addKey(Phaser.Keyboard.D),
            game.input.keyboard.addKey(Phaser.Keyboard.W),
            game.input.keyboard.addKey(Phaser.Keyboard.F)
        )),
        new Ship(400, 400, 0x00FFFF, new Controls(
            game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1),
            game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_3),
            game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_5),
            game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0)
        ))
    ];
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
