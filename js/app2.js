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
    sprChar = new player({
        gameWidth: canvas.width,
        gameHeight: canvas.height,
        image: image,
        spritesheetWidth: 32,
        spritesheetHeight: 48,
        secondsPerFrame: 50, //framespersecond
        x: 10, // initial location of sprite, x
        y: 10, // initial location of sprite, y
    });

    sprChar.addSprite({
        directionname: "down",
        start: 0,
        frames: 4
    });

    sprChar.addSprite({
        directionname: "left",
        start: 4,
        frames: 4
    });
    sprChar.addSprite({
        directionname: "right",
        start: 8,
        frames: 4
    });
    sprChar.addSprite({
        directionname: "up",
        start: 12,
        frames: 4
    });
    sprChar.addSprite({
        directionname: "idle",
        start: 16,
        frames: 4
    });
    sprChar.setSprite("idle");
    setInterval(function() {
        sprChar.animate();
        canvas.width = canvas.width; //erase traces of previous sprite animations
        sprChar.draw(ctx);
    }, 1000 / 60);
};

image.src = 'img/test3.png';

function player(zeldaSkeleton) {
    this.gameWidth = zeldaSkeleton.gameWidth;
    this.gameHeight = zeldaSkeleton.gameHeight;
    this.xcoord = 0;
    this.ycoord = 0;
    this.startSprite(zeldaSkeleton);
}


// initiate
var spriteToBeUsed = function(zeldaSkeleton) {
    this.startSprite(zeldaSkeleton);
    this.currentSprite = null;
    this.currentFrame = 0;
    this.oldSeconds = 0;
};

 spriteToBeUsed.prototype = { //use prototype to attach new properties (needed as animation changes as key is pressed)    
    startSprite: function(zeldaSkeleton) {
        if (zeldaSkeleton) {
            this.isLooping = zeldaSkeleton.isLooping;
            if (typeof this.isLooping != "boolean") this.isLooping = true;
            this.image = zeldaSkeleton.image;
            this.spritesheetWidth = zeldaSkeleton.spritesheetWidth;
            this.spritesheetHeight = zeldaSkeleton.spritesheetHeight;
            this.sprites = [];
            this.secondsPerFrame = zeldaSkeleton.secondsPerFrame;
            this.x = zeldaSkeleton.x;
            this.y = zeldaSkeleton.y;
            this.width = this.spritesheetWidth;
            this.height = this.spritesheetHeight;
        }
    },
    addSprite: function(zeldaSkeleton) {
        this.sprites[zeldaSkeleton.directionname] = {
            directionname: zeldaSkeleton.directionname,
            start: zeldaSkeleton.start || 0,
            frames: zeldaSkeleton.frames || 1,
            framesPerRow: Math.floor(this.image.width / this.spritesheetWidth) //divide the width per frame for every single animation
        };
        this.currentSprite = this.currentSprite || this.sprites[zeldaSkeleton.directionname];
    },
    setSprite: function(directionname) { //setSprite based on current movement (idle/not)
        if (this.currentSprite != this.sprites[directionname]) {
            this.currentSprite = this.sprites[directionname];
            this.currentFrame = 0;
        }
    },
    animate: function() {
        var newSeconds = (new Date()).getTime();
        if (newSeconds - this.oldSeconds >= this.secondsPerFrame) {
            this.currentFrame++;
            if (this.currentFrame == this.currentSprite.frames) {
                if (this.isLooping) this.currentFrame = 0; //show current animation frame
            }
            this.oldSeconds = newSeconds;
        }
    },
    draw: function(ctx) {
        var locSprite = this.currentSprite.start + this.currentFrame; // current frame start + currentframe's start being executed
        var r = Math.floor(locSprite / this.currentSprite.framesPerRow);
        var c = locSprite % this.currentSprite.framesPerRow;
        ctx.drawImage(this.image, c * this.spritesheetWidth, r * this.spritesheetHeight, this.spritesheetWidth, this.spritesheetHeight, this.x, this.y, this.width, this.height);
    }
}
player.prototype = new spriteToBeUsed();
player.prototype.animate = function() {

    var x = this.x + this.xcoord;
    var y = this.y + this.ycoord;
    var xplus = x + this.spritesheetWidth;
    var yplus = y + this.spritesheetHeight;

    if (x > 0 && xplus < this.gameWidth) this.x = x;
    if (y > 0 && yplus < this.gameHeight) this.y = y;
    spriteToBeUsed.prototype.animate.call(this);
};