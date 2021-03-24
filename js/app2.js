var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var sprChar;

canvas.onkeydown = function(e) {
    sprChar.xcoord = 0;
    sprChar.ycoord = 0;
    switch (e.keyCode) {
    case 65:
        sprChar.setSprite("left");
        sprChar.xcoord--;
        break;
    case 87: 
        sprChar.setSprite("up");
        sprChar.ycoord--;
        break;
    case 68: 
        sprChar.setSprite("right");
        sprChar.xcoord++;
        break;
    case 83:
        sprChar.setSprite("down");
        sprChar.ycoord++;
        break;
    default:
        break;
    }
};
canvas.onkeyup = function(e) {
    sprChar.setSprite("idle");
    sprChar.xcoord = 0;
    sprChar.ycoord = 0;
};
var image = new Image();

image.onload = function() {
    sprChar = new Character({
        gameWidth: canvas.width,
        gameHeight: canvas.height,
        image: image,
        spritesheetWidth: 32,
        spritesheetHeight: 48,
        interval: 100,
        left: 10,
        top: 10,
    });

    sprChar.addSprite({
        name: "down",
        start: 0,
        frames: 4
    });

    sprChar.addSprite({
        name: "left",
        start: 4,
        frames: 4
    });
    sprChar.addSprite({
        name: "right",
        start: 8,
        frames: 4
    });
    sprChar.addSprite({
        name: "up",
        start: 12,
        frames: 4
    });
    sprChar.addSprite({
        name: "idle",
        start: 16,
        frames: 4
    });
    sprChar.setSprite("idle");
    setInterval(function() {
        sprChar.update();
        canvas.width = canvas.width;
        sprChar.draw(ctx);
    }, 1000 / 60);
};

image.src = 'img/test3.png';

// CHARACTER

function Character(data) {

    this.gameWidth = data.gameWidth;
    this.gameHeight = data.gameHeight;

    this.xcoord = 0;
    this.ycoord = 0;

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
    // this.isFinished = false;
    this.currentFrame = 0;
    },        
    init: function(data) {
        if (data) {

            this.isLooping = data.isLooping;
            if (typeof this.isLooping != "boolean") this.isLooping = true;

            this.image = data.image;
            this.spritesheetWidth = data.spritesheetWidth;
            this.spritesheetHeight = data.spritesheetHeight || this.spritesheetWidth;

            this.sprites = [];
            this.interval = data.interval;

            this.left = data.left;
            this.top = data.top;
            this.width = data.width || this.spritesheetWidth;
            this.height = data.hegiht || this.spritesheetHeight;

            this.onCompleted = data.onCompleted;
        }
    },
    addSprite: function(data) {
        this.sprites[data.name] = {
            name: data.name,
            start: data.start || 0,
            frames: data.frames || 1,
            framesPerRow: Math.floor(this.image.width / this.spritesheetWidth)
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

            if (this.currentFrame == this.currentSprite.frames) {
                if (this.isLooping) this.currentFrame = 0;
                else {
                    this.isFinished = true;
                    if (this.onCompleted) this.onCompleted();
                }

            }
            this.lastTick = newTick;
        }

    },
    draw: function(ctx) {

        if (this.isFinished) return;
        var realIndex = this.currentSprite.start + this.currentFrame;
        var row = Math.floor(realIndex / this.currentSprite.framesPerRow);
        var col = realIndex % this.currentSprite.framesPerRow;

        ctx.drawImage(this.image, col * this.spritesheetWidth, row * this.spritesheetHeight, this.spritesheetWidth, this.spritesheetHeight, this.left, this.top, this.width, this.height);

    }
}

// CHARACTER
Character.prototype = new AnimatedSprite();
Character.prototype.update = function() {

    var left = this.left + this.xcoord;
    var top = this.top + this.ycoord;
    var right = left + this.spritesheetWidth;
    var bottom = top + this.spritesheetHeight;

    if (left > 0 && right < this.gameWidth) this.left = left;
    if (top > 0 && bottom < this.gameHeight) this.top = top;
    AnimatedSprite.prototype.update.call(this);
};