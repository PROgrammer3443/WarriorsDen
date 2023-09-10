class Sprite {
    constructor({position, imageSrc, scale=1, FramesMax = 1, offset={x:0, y: 0}}) {
        this.position = position;
        this.width = 80;
        this.height = 180;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.FramesMax = FramesMax;
        this.FrameCurrent = 0;
        this.FramesElapsed = 0;
        this.FramesHold = 5;
        this.offset = offset
    }

    draw() {
        c.drawImage(this.image,
                    this.FrameCurrent * (this.image.width / this.FramesMax),
                    0,
                    this.image.width / this.FramesMax,
                    this.image.height,
                    this.position.x - this.offset.x,
                    this.position.y - this.offset.y,
                    (this.image.width / this.FramesMax) * this.scale,
                    this.image.height * this.scale);
    }
    animateFrames(){
        this.FramesElapsed++;
        if (this.FramesElapsed % this.FramesHold === 0) {
            if (this.FrameCurrent < this.FramesMax - 1) {
                this.FrameCurrent++;
            } else {
                this.FrameCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({position,
                 velocity, 
                 color = "red", 
                 offset = { x: 0, y: 0 }, 
                 imageSrc, 
                 scale=1, 
                 FramesMax = 1,
                 sprites, 
                 attackBox = { offset: {}, width: undefined, height: undefined}}) {
        super({
            position,
            imageSrc,
            scale,
            FramesMax,
            offset
          });
        this.velocity = velocity;
        this.width = 80;
        this.height = 180;
        this.lastKey;
        this.color = color;
        this.health = 100;
        this.isAttacking = false;
        this.sprites = sprites;
        this.dead = false;
        for (const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            height: attackBox.height,
            width: attackBox.width,
            offset : attackBox.offset
        }
    }

    update() {
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        this.draw();
        if (!this.dead) this.animateFrames();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 300.2999999999999
        } else {
            this.velocity.y += gravity;
        }
    }
    attack(){
        this.switchSprite("attack1")
        this.isAttacking = true;
    }
    takeHit(){
        this.health -= 5;
        if (this.health <= 0) this.switchSprite("death")
        else this.switchSprite("takeHit")
    }
    switchSprite(sprite) {
        if (this.image == this.sprites.death.image){ 
            if (this.FrameCurrent === this.sprites.death.FramesMax - 1) this.dead = true;
            return
        }
        if(this.image == this.sprites.attack1.image && this.FrameCurrent < this.sprites.attack1.FramesMax - 1) return
        if (this.image == this.sprites.takeHit.image && this.FrameCurrent < this.sprites.takeHit.FramesMax - 1) return
        switch (sprite) {
          case 'idle':
            if (this.image !== this.sprites.idle.image) {
              this.image = this.sprites.idle.image
              this.FramesMax = this.sprites.idle.FramesMax
              this.FrameCurrent = 0
            }
            break
          case 'run':
            if (this.image !== this.sprites.run.image) {
              this.image = this.sprites.run.image
              this.FramesMax = this.sprites.run.FramesMax
              this.FrameCurrent = 0
            }
            break
          case 'jump':
            if (this.image !== this.sprites.jump.image) {
              this.image = this.sprites.jump.image
              this.FramesMax = this.sprites.jump.FramesMax
              this.FrameCurrent = 0
            }
            break
    
          case 'fall':
            if (this.image !== this.sprites.fall.image) {
              this.image = this.sprites.fall.image
              this.FramesMax = this.sprites.fall.FramesMax
              this.FrameCurrent = 0
            }
            break
          case 'attack1':
            if (this.image !== this.sprites.attack1.image) {
                this.image = this.sprites.attack1.image
                this.FramesMax = this.sprites.attack1.FramesMax
                this.FrameCurrent = 0
            }
            break
          case 'takeHit':
            if (this.image !== this.sprites.takeHit.image) {
            this.image = this.sprites.takeHit.image
            this.FramesMax = this.sprites.takeHit.FramesMax
            this.FrameCurrent = 0
            }
            break
          case 'death':
            if (this.image !== this.sprites.death.image) {
            this.image = this.sprites.death.image
            this.FramesMax = this.sprites.death.FramesMax
            this.FrameCurrent = 0
            }
            break
        }
    }
}