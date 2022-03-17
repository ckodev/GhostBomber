"use strict";


const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = 450;
canvas.height = 550;



const spaceLaser = {
    title: 'Space Laser',
    playerName: '',
    score: 0,
    isRunning: false,
    currentScreen: '',
    $nameInput: $('#name_input'),
    


    switchScreen(newScreen) {
        $('.screen').hide();
        $(newScreen).show();
        spaceLaser.currentScreen = newScreen;

      
        if (spaceLaser.currentScreen == '#splash_screen') {
            spaceLaser.splashScreen();
        }
        if (spaceLaser.currentScreen == '#game_on_screen') {
            spaceLaser.startGame();
        }
        if (spaceLaser.currentScreen == '#game_over_screen' ) {
            spaceLaser.gameOverScreen();
        }

    },

    splashScreen() {
        // spaceLaser.currentScreen = 'splash_screen'
        $('#start_button').on('click', () => {
            spaceLaser.switchScreen('#game_on_screen');
            
        })
    },

    startGame() {
        clearInterval(gameLoopInterval);
        gameLoopInterval = setInterval(spaceLaser.gameLoop, 1000 / 60);
        if (spaceLaser.$nameInput.val().length > 0  && spaceLaser.$nameInput.val().length < 9) {
            spaceLaser.isRunning = true;
            spaceLaser.playerName = spaceLaser.$nameInput.val();
        } else if (spaceLaser.$nameInput.val().length >= 9){
            alert('your name is too long! 8 charactor max. ');
        } else {
            alert('Please enter your name!');
        }

    },

    gameLoop() {

        if (spaceLaser.isRunning == true) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            bulletController.draw(ctx); 
            player.draw(ctx);  
            enemyController.draw(ctx);  
            enemyController.enemies.forEach((enemy) => {
            if (bulletController.collideWith(enemy)) {
                const index = enemyController.enemies.indexOf(enemy);
                enemyController.enemies.splice(index,1);
            } else if (player.collideWith(enemy)) { 
                spaceLaser.gameOver();
            } else {
                enemy.draw(ctx);    
            }   
          })  
        spaceLaser.scorePoints();
        } 


    },

    scorePoints() {
        if (spaceLaser.isRunning == true) {
            ctx.font = "16px 'Press Start 2P'";
            ctx.fillStyle = "orange";
            ctx.fillText("Score: "+spaceLaser.score, 15, 40);
            ctx.font = "16px 'Press Start 2P'";
            ctx.fillStyle = "orange";
            ctx.fillText(""+spaceLaser.playerName, 300, 40);
        }
    },

    enemySpawnLoop() {   
        if (spaceLaser.isRunning == true) {
            const enemySpawn = Math.random();
            if (enemySpawn > 0.3) {
                const xPos = Math.floor(Math.random()*350) + 40;
                enemyController.enemyMove(xPos, -70, 2, 3);      
            }
        }  
        
    },
    

    gameOver() {
        window.setTimeout(spaceLaser.hideGameScreen, 2000);
        spaceLaser.isRunning = false;
        
        clearInterval(spawnLoopInterval);
        clearInterval(gameLoopInterval);
    },
    
    hideGameScreen () {
        spaceLaser.switchScreen('#game_over_screen');
        
    },

    gameOverScreen() {
        $('#final_name').text(spaceLaser.playerName)
        $('#final_score').text(spaceLaser.score)
        
        $('#play_again').on('click', () => {
            spaceLaser.switchScreen('game_on_screen')
            
            
            

        })
        $('#quit').on('click', () => {
            spaceLaser.switchScreen('#splash_screen');
            spaceLaser.score = 0;
            spaceLaser.playerName = '';
            spaceLaser.resetGameBoard();
            
        })
    },

    resetGameBoard(){
        spaceLaser.score = 0;
        player.x = canvas.width / 2.3;
        player.y = canvas.height / 1.3;
        enemyController.enemies.length = 0;
        console.log('resetting game board');
        spaceLaser.gameLoop();
    }

}


class Player {
    constructor(x, y, bulletController) {
        this.x = x,
        this.y = y,
        this.color = 'orange',
        this.bulletController = bulletController,
        this.width = 50,
        this.height = 70,
        this.speed = 5,

        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
        
    }

    draw(ctx) {
        this.move();
        ctx.strokeStyle = "yellow";
        ctx.fillStyle = this.color;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.shoot();
    }

    collideWith(sprite) {
        
        if (this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
            ) {
                return true;
            }
            return false;
    }

    shoot() {
        if (this.shootPressed) {
            console.log('shoot');
            const speed = 8;
            const delay = 6;
            const damage = 1;
            const bulletX = this.x + this.width/2.3;
            const bulletY = this.y;
            this.bulletController.shoot(bulletX, bulletY, speed, damage, delay);

        }
    }

    move() {
        if (this.upPressed && this.y > 0) {
            this.y -= this.speed;
        }
        if (this.downPressed && this.y < canvas.height-this.height) {
            this.y +=this.speed;
        }
        if (this.leftPressed && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.rightPressed && this.x < (canvas.width-this.width)) {
            this.x +=this.speed;
        }

    }

    keydown = (e) => {
        if (e.code === "ArrowUp") {
            this.upPressed = true;
        }
        if (e.code === "ArrowDown") {
            this.downPressed = true;
        }
        if (e.code === "ArrowLeft") {
            this.leftPressed = true;
        }
        if (e.code === "ArrowRight") {
            this.rightPressed = true;
        }
        if (e.code === 'Space') {
            this.shootPressed = true;
        }
    }

    keyup = (e) => {
        if (e.code === "ArrowUp") {
            this.upPressed = false;
        }
        if (e.code === "ArrowDown") {
            this.downPressed = false;
        }
        if (e.code === "ArrowLeft") {
            this.leftPressed = false;
        }
        if (e.code === "ArrowRight") {
            this.rightPressed = false;
        }
        if (e.code === 'Space') {
            this.shootPressed = false;
        }
    }
}

class BulletController {
    // array that stores all of the bullets
    bullets = [];
    // variable for gap between bullets 
    timeUntilNextBullet = 0;
    constructor(canvas) {
        this.canvas = canvas;
    }

    // this method creates the bullet and pushes it into the array
    // these parameters are declared in player.shoot method
    shoot (x, y, speed, damage, delay) {
        // allowed to fire a bullet if 
        if (this.timeUntilNextBullet <= 0) {
            // allowed to continue firing bullets if array length is < 3
            if (this.bullets.length < 2) {
                // pushes bullet onto array/params are set in bullet class
                this.bullets.push(new Bullet(x, y, speed, damage));
                // sets timeUntilNextBullet to 6
                this.timeUntilNextBullet = delay;
            }
        }
        //   
        this.timeUntilNextBullet--;
       
    }
  
    draw(ctx) {
        //console logs length of array
        // console.log(this.bullets.length);
        // forEach calls function for each element in an array
        this.bullets.forEach((bullet) => {
                //if bullet is off screen remove bullet from array
                if (this.bulletOffScreen(bullet)) {
                    //create variable equal to item in array
                    const index = this.bullets.indexOf(bullet);
                    //splice removes 1st occurance of index starting at 1st slot in array
                    this.bullets.splice(index, 1);
                }
            bullet.draw(ctx)});
    }

    collideWith(sprite){
        return this.bullets.some(bullet => {
            if (bullet.collideWith(sprite)) {
                this.bullets.splice(this.bullets.indexOf(bullet),1);
                return true;
            }
            return false;
        })
    }
    
    //  method returning if bullet y coordinate is less then or equal to the top of screen
    bulletOffScreen(bullet) {
        return bullet.y <= -bullet.height;
    }
}

// bullet class 

class Bullet {
    constructor(x, y, speed, damage) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = damage;

        this.color = "red";
        this.width = 5;
        this.height = 8;
    }

    draw(ctx) {
        // fillStyle specifies color, gradient or pattern to be used inside of a shape 
        ctx.fillStyle = this.color;
        // this "-=" is what moves the bullet up the screen
        this.y -= this.speed;
        // fillRect colors in the bullet
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collideWith(sprite) {
        if (this.x < sprite.x +sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y +sprite.height &&
            this.x + this.height >sprite.x
            ) {
                spaceLaser.score = spaceLaser.score +10000;
                return true;
            }
            return false;
    }
    
}

class EnemyController {
    // array to store enemies 
    enemies = [];
    // gap between enemies
    timeUntilNextEnemy = 0; 
    constructor(canvas) {
        this.canvas = canvas;
    }

    enemyMove(x, y, speed, delay) {
        // put enemy on screen 
        if (this.timeUntilNextEnemy <= 0){
            if (this.enemies.length < 10) {
                this.enemies.push(new Enemy(x, y, speed));
                this.timeUntilNextEnemy = delay;
            }
        }
        this.timeUntilNextEnemy--;
    }

    draw(ctx) {
        // console.log(this.enemies.length);
        this.enemies.forEach((enemy) => {
            if (this.enemyOffScreen(enemy)){
                const index = this.enemies.indexOf(enemy);
                this.enemies.splice(index,1);
            } 
        enemy.draw(ctx)});
    }

    
  
    enemyOffScreen(enemy) {
        return enemy.y >= canvas.height;
    }
}
class Enemy {
    constructor(x, y, speed  ) {
        this.x = x;
        this.y = y;
        this.speed = speed;

        this.color = 'white';
        this.width = 40;
        this.height = 60;

    }

    draw(ctx) {
        // fillStyle specifies color, gradient or pattern to be used inside of a shape 
        ctx.fillStyle = this.color;
        // this moves the enemy down the screen
        this.y += this.speed;
        // fillRect colors in the enemy
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    
}

// CLASS VARIABLES
let gameLoopInterval = null;
const spawnLoopInterval = setInterval(spaceLaser.enemySpawnLoop, 500);

const enemy = new Enemy(canvas);
const enemyController = new EnemyController(canvas);
const bulletController = new BulletController(canvas);
const player = new Player(canvas.width / 2.3, canvas.height / 1.3, bulletController);


// document ready
$(document).ready(() => {
    spaceLaser.switchScreen('#splash_screen');
})



