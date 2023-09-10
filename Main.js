const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);
let gravity = 0.7

// Make a background

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    }, 
    imageSrc: './Image/Background.png'
})

// Make a shop animation

const shop = new Sprite({
    position: {
        x: 630,
        y: 128
    }, 
    imageSrc: './Image/shop_anim.png',
    scale: 2.75,
    FramesMax: 6
})

// Create a new sprite for the player
const player = new Fighter({
    position: {
        x: 120,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './Image/Martial Hero/Sprites/Idle.png',
    FramesMax: 8,
    scale: 2.5,
    offset : {
        x: 215,
        y: 126
    },
    sprites: {
        idle: {
            imageSrc: './Image/Martial Hero/Sprites/Idle.png',
            FramesMax: 8
        },
        run: {
            imageSrc: './Image/Martial Hero/Sprites/Run.png',
            FramesMax: 8
        },
        jump: {
            imageSrc: './Image/Martial Hero/Sprites/Jump.png',
            FramesMax: 2
        },
        fall: {
            imageSrc: './Image/Martial Hero/Sprites/Fall.png',
            FramesMax: 2
        },
        attack1: {
            imageSrc: './Image/Martial Hero/Sprites/Attack1.png',
            FramesMax: 6
        },
        takeHit: {
            imageSrc: './Image/Martial Hero/Sprites/Take Hit - white silhouette.png',
            FramesMax: 4
        },
        death: {
            imageSrc: './Image/Martial Hero/Sprites/Death.png',
            FramesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100, 
            y: 75
        },
        width: 160,
        height: 50
    }
});

// Create a new sprite for the enemy
const enemy = new Fighter({
    position: {
        x: canvas.width - 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './Image/Martial Hero 2/Sprites/Idle.png',
    FramesMax: 4,
    scale: 2.5,
    offset : {
        x: 215,
        y: 140
    },
    sprites: {
        idle: {
            imageSrc: './Image/Martial Hero 2/Sprites/Idle.png',
            FramesMax: 4
        },
        run: {
            imageSrc: './Image/Martial Hero 2/Sprites/Run.png',
            FramesMax: 8
        },
        jump: {
            imageSrc: './Image/Martial Hero 2/Sprites/Jump.png',
            FramesMax: 2
        },
        fall: {
            imageSrc: './Image/Martial Hero 2/Sprites/Fall.png',
            FramesMax: 2
        },
        attack1: {
            imageSrc: './Image/Martial Hero 2/Sprites/Attack1.png',
            FramesMax: 4
        },
        takeHit: {
            imageSrc: './Image/Martial Hero 2/Sprites/Take hit.png',
            FramesMax: 3
        },
        death: {
            imageSrc: './Image/Martial Hero 2/Sprites/Death.png',
            FramesMax: 7
        }
        
    },
    attackBox: {
        offset: {
            x: -170, 
            y: 75
        },
        width: 170,
        height: 50
    }
});
decreaseTimer()
// Object of keys to see if they are pressed
const keys = {
    a : {
        pressed: false
    },
    d : {
        pressed: false
    },
    ArrowRight : {
        pressed: false
    },
    ArrowLeft : {
        pressed: false
    }
}
function animate(){

    // Call the function in a infinite loop
    window.requestAnimationFrame(animate);

    // Remove the path left by the player or enemy
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Call the function for the background
    background.update();

    // Call the function for the shop
    shop.update();

    // Update their positions
    player.update();
    enemy.update();

    // To reset the velocity
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player Movement 
    if (keys.a.pressed) {
        player.velocity.x = -5;
        player.lastKey = 'a';
        player.switchSprite("run")
    } else if (keys.d.pressed) {
        player.velocity.x = 5;
        player.lastKey = 'd';
        player.switchSprite("run")
    } else {
        player.velocity.x = 0;
        player.switchSprite("idle")
    }
    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite("jump")
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall")
    } 

    // Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
        enemy.velocity.x = -5;
        enemy.lastKey = 'ArrowLeft';
        enemy.switchSprite("run")
    } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
        enemy.velocity.x = 5;
        enemy.lastKey = 'ArrowRight';
        enemy.switchSprite("run")
    } else {
        enemy.velocity.x = 0;
        enemy.switchSprite("idle")
    }
    // jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump")
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall")
    } 

    // Detect for collision
    if (rC({rectangle1 : player, rectangle2 : enemy}) && player.isAttacking && player.FrameCurrent == 4){
        player.isAttacking = false;
        enemy.takeHit()
        document.querySelector("#enemyHealth").style.width = enemy.health + "%"
    }
    if(player.isAttacking && player.FrameCurrent == 4){
        player.isAttacking = false;
    }
    if (rC({rectangle1 : enemy, rectangle2 : player}) && enemy.isAttacking && enemy.FrameCurrent == 2){
        enemy.isAttacking = false;
        player.takeHit()
        document.querySelector("#playerHealth").style.width = player.health + "%"
    }
    if(enemy.isAttacking && enemy.FrameCurrent == 2){
        enemy.isAttacking = false;
    }
    // End the game based on health
    if (enemy.health <= 0 || player.health <= 0) output({player, enemy, timerId})
}
animate()
window.addEventListener("keydown", (event) => {
    if (!player.dead){
    // Check for eack moving key to set the values
        switch (event.key){

            // Check for eack moving key for the player to set the values
            case "d":
                keys.d.pressed = true;
                lastKey = "d"
                break
            case "a":
                keys.a.pressed = true;
                lastKey = "a"
                break
            case "w":
                player.velocity.y = -20;
                break
            case "s":
                player.attack()
                break
        }
    }
    // Check for eack moving key for the enemy to set the values
    if (!enemy.dead){
        switch (event.key){
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastKey = "ArrowRight"
                break
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft"
                break
            case "ArrowUp":
                enemy.velocity.y = -20;
                break
            case "ArrowDown":
                enemy.attack()
                break
        }
    }
})
window.addEventListener("keyup", (event) => {
    // Check for eack moving key for the player to set the values to false
    switch (event.key){
        case "d":
            keys.d.pressed = false;
            break
        case "a":
            keys.a.pressed = false;
            break
    }
    // Check for eack moving key for the enemy to set the values to false
    switch (event.key){
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break
    }
})