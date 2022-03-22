"use strict";

//gameboard variables
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = 450;
canvas.height = 550;

//player image varaibles
const rol = document.getElementById('rol');
const ghost = document.getElementById('ghost');
const bomb = document.getElementById('bomb');
const dead = document.getElementById('dead');

//splash-screen variables
const instructions = document.getElementById('instructions');
const controls = document.getElementById('controls');

//variable for highscore method
const mostRecentScore = localStorage.getItem('mostRecentScore');
const highScoresName = document.getElementById('high_scores_name');
const highScoresScore = document.getElementById('high_scores_score');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
console.log(highScores);
const MAX_HIGH_SCORES = 10;

// audio variables 
const smoothJazz = document.getElementById('smooth_jazz');
const countDown = document.getElementById('321_audio');
const deadSound = document.getElementById('dead_audio');
const shootSound = document.getElementById('shoot_audio');
const hitSound = document.getElementById('hit_audio');

deadSound.volume = 0.5;
countDown.volume = 0.1;
hitSound.volume = 0.3;
smoothJazz.preload = true;
smoothJazz.loop = true;


// Game object-------------------------------------------------------------------
//-------------------------------------------------------------------------------
const spaceLaser = {
    title: 'Space Laser',
    playerName: '',
    score: 0,
    isRunning: false,
    currentScreen: '',
    $nameInput: $('#name_input'),
    enemySpeed: 2,
    enemyDelay: 3,
    highScore: [],
    soundOn: false, 
    



    shootSound() {
        if (spaceLaser.soundOn ==true){
            shootSound.volume = 0.1;
            shootSound.load();
            shootSound.play();
        } 
    },

    saveHighScore() {
        
        const playerScore = {
            score: spaceLaser.score,
            name: spaceLaser.playerName,
        }

        highScores.push(playerScore)
        highScores.sort( (a,b) => {
            return b.score - a.score;
        } )
        highScores.splice(10);
        localStorage.setItem('highScores', JSON.stringify(highScores))
        highScoresName.innerHTML = highScores.map(playerScore => {
            return `<li class="high-scores" >${playerScore.name}</li>`
        }).join("");
        highScoresScore.innerHTML = highScores.map(playerScore => {
            return `<li class="high-scores" >${playerScore.score}</li>`
        }).join("");
    },
    
    delayStart() {
     
        spaceLaser.startGame();
        countDown.pause();
        countDown.currentTime = 0;
    },

    

// Switch screen method--------------------------------------------------------------
//-----------------------------------------------------------------------------------
    switchScreen(newScreen) {
        $('.screen').hide();
        $(newScreen).show();
        spaceLaser.currentScreen = newScreen;
     
        

    // Game_countdown_screen---------------------------------------------------------
    //-------------------------------------------------------------------------------
        if (spaceLaser.currentScreen === '#game_countdown_screen') {
            window.setTimeout(spaceLaser.delayStart, 2800);
            $('#pause_button').css('display','none'); 
            $('#play_button').css('display','none'); 
        }

    // splash_screen-----------------------------------------------------------------
    //------------------------------------------------------------------------------- 
        if (spaceLaser.currentScreen == '#splash_screen') {

            
            
            $('#start_button').on('click', () => {
                //allow start button to start the game only if the input field has value > 0 or < 9 
            if (spaceLaser.$nameInput.val().length > 0  && spaceLaser.$nameInput.val().length < 9) {
                if (spaceLaser.soundOn == true){
                    smoothJazz.pause();
                    countDown.play();
                }
                spaceLaser.switchScreen('#game_countdown_screen');  
                spaceLaser.isRunning = true;
                spaceLaser.playerName = spaceLaser.$nameInput.val();
            } else if (spaceLaser.$nameInput.val().length >= 9){ 
                alert('your name is too long! 8 charactor max. ');
            } else  if (spaceLaser.$nameInput.val().length <= 0 ){
                alert('Please enter your name!');
            }
        
            }),
             
            $('#instructions-btn').on('click',() => {
                $('#high_scores') .attr('style', 'display:none'); 
                $('#controls') .attr('style', 'display:none'); 
                $('#instructions') .attr('style', 'display:');
                $('#high-scores-btn').removeClass('load')
            })
    
            $('#controls-btn').on('click', () => {
                $('#high_scores') .attr('style', 'display:none');
                $('#instructions').css('display','none'); 
                $('#controls').css('display','block'); 
                $('#high-scores-btn').removeClass('load')
            })

            $('#high-scores-btn').on('click', () => {
                $('#controls') .attr('style', 'display:none');
                $('#instructions').css('display','none'); 
                $('#high_scores').css('display','block'); 
            })

            $('#play_button').on('click', () => {
                spaceLaser.soundOn = true;
                if (spaceLaser.soundOn == true){
                    smoothJazz.play()
                }
                $('#pause_button').css('display','block'); 
                $('#play_button').css('display','none'); 
            })
        
            $('#pause_button').on('click', () => {
                spaceLaser.soundOn = false;
                if (spaceLaser.soundOn == false){
                    smoothJazz.pause()
                }
                $('#pause_button').css('display','none'); 
                $('#play_button').css('display','block'); 
            })
        }


    // Game_on_screen------------------------------------------------------------
    //---------------------------------------------------------------------------
        if (spaceLaser.currentScreen == '#game_on_screen') {
            if (spaceLaser.soundOn == true){
                $('#pause_button').css('display','block'); 
                $('#play_button').css('display','none'); 
            } else {
                $('#pause_button').css('display','none'); 
                $('#play_button').css('display','block');
            }

            
        }
    // Game_over_screen----------------------------------------------------------
    //---------------------------------------------------------------------------
        if (spaceLaser.currentScreen == '#game_over_screen' ) {
            if (spaceLaser.soundOn == true){
                $('#pause_button').css('display','block'); 
                $('#play_button').css('display','none'); 
            } else {
                $('#pause_button').css('display','none'); 
                $('#play_button').css('display','block');
            }
        spaceLaser.gameOverScreen();
            
        }
    },

// start game method--------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
    startGame() {
                if (spaceLaser.soundOn == true){
                    smoothJazz.currentTime = 0;
                    smoothJazz.play();
                }
            spaceLaser.switchScreen('#game_on_screen');
            spaceLaser.resetGameBoard();
            clearInterval(gameLoopInterval);
            clearInterval(spawnLoopInterval);
            clearInterval(increaseDifficultyInterval);
            gameLoopInterval = setInterval(spaceLaser.gameLoop, 1000 / 60);
            spawnLoopInterval = setInterval(spaceLaser.enemySpawnLoop, 300);

            increaseDifficultyInterval = setInterval(() => {
               spaceLaser.enemySpeed = spaceLaser.enemySpeed * 1.2;
               spaceLaser.enemyDelay = spaceLaser.enemyDelay/2;
            }, 10000);

    },

// game loop method---------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
    gameLoop() {

        if (spaceLaser.isRunning == true) {
            ctx.fillStyle = "#D0A380";
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

// score points method------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
    scorePoints() {
        if (spaceLaser.isRunning == true) {

            ctx.font = "16px 'Press Start 2P'";
            ctx.fillStyle = "black";
            ctx.fillText("Score: "+spaceLaser.score, 15, 535);
            ctx.font = "16px 'Press Start 2P'";
            ctx.fillStyle = "black";
            ctx.fillText(""+spaceLaser.playerName, 300, 535);
        }
    },

// enemy spawn method--------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
    enemySpawnLoop() {
        if (spaceLaser.isRunning == true) 
        {
            // spaceLaser.enemySpeed = spaceLaser.enemySpeed;
            const enemySpawn = Math.random();
            if (enemySpawn > 0.3) {
                const xPos = Math.floor(Math.random()*350) + 40;
                enemyController.enemyMove(xPos, -70, spaceLaser.enemySpeed, spaceLaser.enemyDelay);      
            }
        }  
    },

// game over method---------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
    gameOver() {
        window.setTimeout(spaceLaser.hideGameScreen, 3000);
        spaceLaser.isRunning = false;

        
        clearInterval(spawnLoopInterval);
        clearInterval(gameLoopInterval);
        clearInterval(increaseDifficultyInterval);
        
    },

// hide game screen method--------------------------------------------------------------------
// when player "dies" there is a 3 sec pause before game over screen appears------------------ 

    hideGameScreen () {
        
        
        spaceLaser.switchScreen('#game_over_screen');
    },

// game over screen method--------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

    gameOverScreen() {
        localStorage.setItem('mostRecentScore', spaceLaser.score);
        spaceLaser.saveHighScore(spaceLaser.score);

        // personalized message based on score achieved----------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------
        if (spaceLaser.score < 50) {
            $('#final_name').text('C\'mon ' + spaceLaser.playerName+'! I expected more from you. ')
            $('#final_score').text('Score: '+spaceLaser.score+' points!')
        }
        if (spaceLaser.score >= 50 && spaceLaser.score < 100) {
            $('#final_name').text('So you scored some points... big whoop, wanna fight about? Take your anger out on the court '+ spaceLaser.playerName+'!')
            $('#final_score').text('Score: '+spaceLaser.score+' points!')
        }
        if (spaceLaser.score >= 100 && spaceLaser.score < 200) {
            $('#final_name').text('I am impressed '+ spaceLaser.playerName+'! Nice work!')
            $('#final_score').text('Score: '+spaceLaser.score+' points!')
        }
        if (spaceLaser.score >= 200 && spaceLaser.score < 400) {
            $('#final_name').text('Thats quite the score '+ spaceLaser.playerName+'! Righteous dude!')
            $('#final_score').text('Score: '+spaceLaser.score+' points!')
        }
        if (spaceLaser.score >400) {
            $('#final_name').text(spaceLaser.playerName+' You are stone cold killer')
            $('#final_score').text('Score: '+spaceLaser.score+' points!')
        }


        $('#pause_button').css('display','none'); 
        $('#play_button').css('display','block');
        
    // play again method triggered by 'click'----------------
    // re triggers countdown screen -------------------------
    // ------------------------------------------------------

        $('#play_again').on('click', () => {
            spaceLaser.isRunning = true;
            if (spaceLaser.soundOn == true){
                smoothJazz.pause();
                countDown.currentTime = 0;
                countDown.play();
            }

            clearInterval(spawnLoopInterval);
            clearInterval(gameLoopInterval);
            clearInterval(increaseDifficultyInterval);
            spaceLaser.switchScreen('#game_countdown_screen');
        })

    // quit game method triggered by 'click'-----------------
    // send player back to splash screen --------------------
    // ------------------------------------------------------
        $('#quit').on('click', () => {
            if (spaceLaser.soundOn == true){
                smoothJazz.play();
            }
            
            spaceLaser.switchScreen('#splash_screen');
            spaceLaser.score = 0;
            spaceLaser.playerName = '';
            $('#name_input').val('');
        })
    },

// reset game board method--------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
    resetGameBoard(){
        spaceLaser.score = 0;
        player.x = canvas.width / 2.3;
        player.y = canvas.height / 1.3;
        enemyController.enemies.length = 0;
        bulletController.bullets.length = 0;
        spaceLaser.gameDifficulty = 1; 
        spaceLaser.enemySpeed = 2;
        spaceLaser.enemyDelay = 3;
        console.log('resetting game board');
    }
}

// Player class ------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

class Player {

    constructor(x, y, bulletController) {
        this.x = x,
        this.y = y,
        this.color = 'orange',
        this.bulletController = bulletController,
        this.width = 40,
        this.height = 40,
        this.speed = 5,
    
        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
    }

    //player draw method-------------------------------------------
    //-------------------------------------------------------------
    draw(ctx) {
        this.move();
        this.shoot();
        ctx.drawImage(rol,this.x, this.y, this.width, this.height);
    }
    //player collideWith method------------------------------------
    //-------------------------------------------------------------
    collideWith(sprite) {
        
        if (this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
            ) {
                
                //player contact with enemy triggers
                    if (spaceLaser.soundOn == true){
                        smoothJazz.pause();
                        deadSound.play();
                    }
                
                //color over player image and then draw player dead image   
                ctx.fillStyle = '#D0A380';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.drawImage(dead,this.x, this.y, this.width, this.height);
                return true;
            }
            return false;
    }
    //player shoot method------------------------------------------
    //-------------------------------------------------------------
    shoot() {
        if (this.shootPressed) {
            const speed = 8;
            const delay = 10;
            const damage = 1;
            const bulletX = this.x + this.width/3;
            const bulletY = this.y - this.height/2.5;
            this.bulletController.shoot(bulletX, bulletY, speed, damage, delay);
        }
    }
    //player move method-------------------------------------------
    //-------------------------------------------------------------
    move() {
        if (this.upPressed && this.y > 350) {
            this.y -= this.speed;
        }
        if (this.downPressed && this.y < (canvas.height-this.height * 2.5)) {
            this.y +=this.speed;
        }
        if (this.leftPressed && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.rightPressed && this.x < (canvas.width-this.width)) {
            this.x +=this.speed;
        }
    }

    //player event listener keydown method-------------------------
    //-------------------------------------------------------------
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

    //player event listener keyup method---------------------------
    //-------------------------------------------------------------
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


// Bullet controller class -------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

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
                if (spaceLaser.soundOn == true){
                    spaceLaser.shootSound();
                }
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

    // removes bullet from the bullets array if bullet has made contact with enemy. 
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

// bullet class ------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
class Bullet {
    constructor(x, y, speed, damage) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = damage;

        this.color = "red";
        this.width = 15;
        this.height = 25;
    }

    draw(ctx) {
        // fillStyle specifies color, gradient or pattern to be used inside of a shape 
        ctx.drawImage(ghost,this.x, this.y, this.width, this.height);
        // ctx.fillStyle = this.color;
        // this "-=" is what moves the bullet up the screen
        this.y -= this.speed;
        // fillRect colors in the bullet
        // ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collideWith(sprite) {
        if (this.x < sprite.x +sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y +sprite.height &&
            this.x + this.height >sprite.x
            ) {
                if (spaceLaser.soundOn == true){
                    hitSound.play();
                }

                spaceLaser.score = spaceLaser.score +10;
                return true;
            }
            return false;
    }
    
}

// enemy controller class --------------------------------------------------------------------
// has similar functionality to bullet controller --------------------------------------------
//--------------------------------------------------------------------------------------------
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

// enemy class ------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
class Enemy {
    constructor(x, y, speed  ) {
        this.x = x;
        this.y = y;
        this.speed = speed;

        this.color = 'black';
        this.width = 35;
        this.height = 30;

    }

    draw(ctx) {
        // fillStyle specifies color, gradient or pattern to be used inside of a shape 
        ctx.drawImage(bomb,this.x, this.y, this.width, this.height);
        // ctx.fillStyle = this.color;
        // this moves the enemy down the screen
        this.y += this.speed;
        // fillRect colors in the enemy
        // ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    
}

// CLASS VARIABLES
let gameLoopInterval = null;
let spawnLoopInterval = setInterval(spaceLaser.enemySpawnLoop, 500);
let increaseDifficultyInterval = setInterval(spaceLaser.increaseDifficulty, 20000)

const enemy = new Enemy(canvas);
const enemyController = new EnemyController(canvas);
const bulletController = new BulletController(canvas);
const player = new Player(canvas.width / 2.3, canvas.height / 1.3, bulletController);


// document ready------------------------------------------------------------------------
// initializes the splash screen --------------------------------------------------------

$(document).ready(() => {

    //fires switch screen method which triggers everything under splash screen conditional.
    spaceLaser.switchScreen('#splash_screen');

    // adds an underline to the highhscore menu which is shown first on splash screen
    $('#high-scores-btn').addClass('load')

    // loads highscores & coresponding names from local storage array and returns them as <li>'s
    highScoresName.innerHTML = highScores.map(playerScore => {
        return `<li class="high-scores" >${playerScore.name}</li>`
    }).join("");
    highScoresScore.innerHTML = highScores.map(playerScore => {
        return `<li class="high-scores" >${playerScore.score}</li>`
    }).join("");

    // music is initialized as off.  Event listeners on play and pause buttons to start and stop game music. 
    $('#play_button').on('click', () => {
        spaceLaser.soundOn = true;
        if (spaceLaser.soundOn == true){
            smoothJazz.play()
        }
        $('#pause_button').css('display','block'); 
        $('#play_button').css('display','none'); 
    })

    $('#pause_button').on('click', () => {
        spaceLaser.soundOn = false;
        if (spaceLaser.soundOn == false){
            smoothJazz.pause()
        }
        $('#pause_button').css('display','none'); 
        $('#play_button').css('display','block'); 
    })
})



