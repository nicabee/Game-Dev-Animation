var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var sprite;

canvas.onkeydown = function(e) {
    sprite.speedX = 0;
    sprite.speedY = 0;
    switch (e.keyCode) {
    case 65:
        sprite.setSprite("left");
        sprite.speedX--;
        break;
    case 87: 
        sprite.setSprite("up");
        sprite.speedY--;
        break;
    case 68: 
        sprite.setSprite("right");
        sprite.speedX++;
        break;
    case 83:
        sprite.setSprite("down");
        sprite.speedY++;
        break;
    default:
        break;
    }
};
canvas.onkeyup = function(e) {
    sprite.setSprite("idle");
    sprite.speedX = 0;
    sprite.speedY = 0;
};
var image = new Image();

image.onload = function() {
    sprite = new Character({
        mapWidth: canvas.width,
        mapHeight: canvas.height,
        image: image,
        frameWidth: 32,
        frameHeight: 48,
        interval: 100,
        left: 10,
        top: 10,
    });

    sprite.addSprite({
        name: "down",
        startFrame: 0,
        framesCount: 4
    });

    sprite.addSprite({
        name: "left",
        startFrame: 4,
        framesCount: 4
    });
    sprite.addSprite({
        name: "right",
        startFrame: 8,
        framesCount: 4
    });
    sprite.addSprite({
        name: "up",
        startFrame: 12,
        framesCount: 4
    });
    sprite.addSprite({
        name: "idle",
        startFrame: 16,
        framesCount: 4
    });
    sprite.setSprite("idle");
    setInterval(function() {
        sprite.update();
        canvas.width = canvas.width;
        sprite.draw(context);
    }, 1000 / 60);
};

image.src = 'img/test3.png';

// CHARACTER

function Character(data) {

    this.mapWidth = data.mapWidth;
    this.mapHeight = data.mapHeight;

    this.speedX = 0;
    this.speedY = 0;

    this.init(data);
}


// ANIMATED SPRITE
var AnimatedSprite = function(data) {
    this.init(data);
    this.isFinished = false;
    this.currentSprite = null;
    this.currentFrame = 0;
    this.lastTick = 0;
};

AnimatedSprite.prototype = {
    start: function(){
    this.isFinished = false;
    this.currentFrame = 0;
    },        
    init: function(data) {
        if (data) {

            this.isLooping = data.isLooping;
            if (typeof this.isLooping != "boolean") this.isLooping = true;

            this.image = data.image;
            this.frameWidth = data.frameWidth;
            this.frameHeight = data.frameHeight || this.frameWidth;

            this.sprites = [];
            this.interval = data.interval;

            this.left = data.left;
            this.top = data.top;
            this.width = data.width || this.frameWidth;
            this.height = data.hegiht || this.frameHeight;

            this.onCompleted = data.onCompleted;
        }
    },
    addSprite: function(data) {
        this.sprites[data.name] = {
            name: data.name,
            startFrame: data.startFrame || 0,
            framesCount: data.framesCount || 1,
            framesPerRow: Math.floor(this.image.width / this.frameWidth)
        };

        this.currentSprite = this.currentSprite || this.sprites[data.name];
    },
    setSprite: function(name) {
        if (this.currentSprite != this.sprites[name]) {
            this.currentSprite = this.sprites[name];
            this.currentFrame = 0;
        }
    },
    update: function() {
        if (this.isFinished) return;
        var newTick = (new Date()).getTime();
        if (newTick - this.lastTick >= this.interval) {
            this.currentFrame++;

            if (this.currentFrame == this.currentSprite.framesCount) {
                if (this.isLooping) this.currentFrame = 0;
                else {
                    this.isFinished = true;
                    if (this.onCompleted) this.onCompleted();
                }

            }
            this.lastTick = newTick;
        }

    },
    draw: function(context) {

        if (this.isFinished) return;
        var realIndex = this.currentSprite.startFrame + this.currentFrame;
        var row = Math.floor(realIndex / this.currentSprite.framesPerRow);
        var col = realIndex % this.currentSprite.framesPerRow;

        context.drawImage(this.image, col * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight, this.left, this.top, this.width, this.height);

    }
}

// CHARACTER
Character.prototype = new AnimatedSprite();
Character.prototype.update = function() {

    var left = this.left + this.speedX;
    var top = this.top + this.speedY;
    var right = left + this.frameWidth;
    var bottom = top + this.frameHeight;

    if (left > 0 && right < this.mapWidth) this.left = left;
    if (top > 0 && bottom < this.mapHeight) this.top = top;
    AnimatedSprite.prototype.update.call(this);
};