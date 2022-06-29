"use strict";




//gameboard variables
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const videoElement = document.getElementById('hiddenVid').play();


            

if (window.innerWidth < 600){
    canvas.width = 320;
    canvas.height = 550;
} else {
    canvas.width = 450;
    canvas.height = 550;
}

// let draggable = false;

// canvas.onmousedown = (e) => {
//     console.log('mousedown', e.layerX, e.layerY);
// }

//player image varaibles
const rol = document.getElementById('rol');
const rolDark = document.getElementById('rol_dark');
const ghost = document.getElementById('ghost');
const ghostDark = document.getElementById('ghost_dark');
const bomb = document.getElementById('bomb');
const bombDark = document.getElementById('bomb_dark');
const dead = document.getElementById('dead');
const deadDark = document.getElementById('dead_dark');

//splash-screen variables
const instructions = document.getElementById('instructions');
const controls = document.getElementById('controls');


// audio variables 
const darkAmbience = document.getElementById('dark_ambience');
const smoothJazz = document.getElementById('smooth_jazz');
const countDown = document.getElementById('321_audio');
const deadSound = document.getElementById('dead_audio');
const shootSound = document.getElementById('shoot_audio');
const hitSound = document.getElementById('hit_audio');

deadSound.volume = 0.5;
countDown.volume = 0.1;
hitSound.volume = 0.3;
smoothJazz.volume = 0.7;
shootSound.preload = true;
smoothJazz.preload = true;
smoothJazz.loop = true;
darkAmbience.volume = 0.3;
darkAmbience.preload = true;
darkAmbience.loop = true;



// Light & dark Mode ---------------------------------------
// ---------------------------------------------------------

// darkmode button variable 
const darkModeBtn = document.getElementById('moon_button');
darkModeBtn.addEventListener('click', darkMode) 
darkModeBtn.addEventListener('mousedown', function(e){
    e.preventDefault();
});

// lightmode button variable
const lightModeBtn = document.getElementById('sun_button');
lightModeBtn.addEventListener('click', lightMode)
lightModeBtn.addEventListener('mousedown', function(e){
    e.preventDefault();
});

// dark mode item variables
const button = document.querySelectorAll('button');
const menuItem1 = document.querySelector('.menu-button1');
const menuItem2 = document.querySelector('.menu-button2');
const menuItem3 = document.querySelector('.menu-button3');
const menuItem5 = document.querySelector('.menu-button5');
const instructionsBtn = document.getElementById('instructions-btn');
const controlsBtn = document.getElementById('controls-btn');
const highScoresBtn = document.getElementById('high-scores-btn');
const bugsBtn = document.getElementById('bugs-btn');
const nameInput = document.getElementById('name_input');
const startBtn = document.getElementById('start_button');
const splash = document.getElementById('splash_screen');
const count = document.getElementById('game_countdown_screen');
const playAgain = document.getElementById('play_again');
const quit = document.getElementById('quit');
const over = document.getElementById('game_over_screen');
const gameOnScreen = document.getElementById('game');
const credits = document.getElementById('credits-btn');
const menuButtonWrapper = document.getElementById('menu-button-wrapper');
 
//dark mode function 
function darkMode() {
    
    if (ghostBomber.soundOn == true) {
        smoothJazz.pause();
        smoothJazz.currentTime = 0;
        darkAmbience.play();
        $('#pause_button').css('display','block'); 
        $('#play_button').css('display','none'); 
    }
    

    darkModeBtn.style.display = 'none';
    lightModeBtn.style.display = 'block';
    lightModeBtn.classList.add('dark');
    document.body.classList.add('dark');
    menuItem1.classList.add('dark');
    menuItem2.classList.add('dark');
    menuItem3.classList.add('dark');
    menuItem5.classList.add('dark');
    instructionsBtn.classList.add('dark');
    controlsBtn.classList.add('dark');
    highScoresBtn.classList.add('dark');
    bugsBtn.classList.add('dark');
    nameInput.classList.add('dark');
    startBtn.classList.add('dark');
    splash.classList.add('dark');
    count.classList.add('dark');
    playAgain.classList.add('dark');
    quit.classList.add('dark');
    over.classList.add('dark');
    gameOnScreen.classList.add('dark');
    credits.classList.add('dark');
    menuButtonWrapper.classList.add('dark');

    
}
//dark mode function
function lightMode() {
    
    if (ghostBomber.soundOn == true) {
        darkAmbience.pause();
        darkAmbience.currentTime = 0;
        smoothJazz.play();
        $('#pause_button').css('display','block'); 
        $('#play_button').css('display','none');
    }
    

    darkModeBtn.style.display = 'block';
    lightModeBtn.style.display = 'none';
    document.body.classList.remove('dark');
    menuItem1.classList.remove('dark');
    menuItem2.classList.remove('dark');
    menuItem3.classList.remove('dark');
    menuItem5.classList.remove('dark');
    instructionsBtn.classList.remove('dark');
    controlsBtn.classList.remove('dark');
    highScoresBtn.classList.remove('dark');
    bugsBtn.classList.remove('dark');
    nameInput.classList.remove('dark');
    startBtn.classList.remove('dark');
    splash.classList.remove('dark');
    count.classList.remove('dark');
    playAgain.classList.remove('dark');
    quit.classList.remove('dark');
    over.classList.remove('dark');
    gameOnScreen.classList.remove('dark');
    credits.classList.remove('dark');
    menuButtonWrapper.classList.remove('dark');

}

//variables for highscore method
// const mostRecentScore = localStorage.getItem('mostRecentScore');
const highScoresName = document.getElementById('high_scores_name');
const highScoresScore = document.getElementById('high_scores_score');
let highScoreFromPHP = [];
let finalData = [];




if (videoElement !== undefined) {
    videoElement.then(function() {
    // Automatic playback started!
    }).catch(function() {
    // Automatic playback failed.
    // Show a UI element to let the user manually start playback.
    startBtn.style.display = 'none';
    nameInput.style.display = 'none';
    menuButtonWrapper.style.display = 'none';
    const warning = document.getElementById('warning');
    warning.style.display = 'block';
    
    });
} 



// Pauses game music on browser minimise. Plays game music on re-open. 
function handleVisibilityChange() {
    if (document.hidden){
        if (lightModeBtn.style.display == 'block') {
            darkAmbience.pause();
        } else {
            smoothJazz.pause();
        }
    }else{
        $('#pause_button').css('display','none'); 
        $('#play_button').css('display','block');
    }
}
document.addEventListener("visibilitychange", handleVisibilityChange, false);



// Game object-------------------------------------------------------------------
//-------------------------------------------------------------------------------
const ghostBomber = {
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
    timeBonus: 0,
    
    // saves the high scores in local storage 
    saveHighScore() {

        // the player score object which holds and sets the name value pairs that will be pushed onto the highscores array each time a player completes a round of the game
        const playerScore = {
            score: ghostBomber.score + ghostBomber.timeBonus,
            name: ghostBomber.playerName,
        }

        fetch('highscore-processing.php', { method: 'POST', 
                    headers: {'Content-Type': 'application/json',
                }, body: JSON.stringify(playerScore)})
            .then(res => res.text())

        
            .then((highScoreDataFromPHP) => {

                // the string returned from php needs to be parsed twice. 
                highScoreFromPHP = JSON.parse(highScoreDataFromPHP);
                finalData = JSON.parse(highScoreFromPHP);
                // console.log(finalData);

                // setting the HTML display of the highScores NAME
                highScoresName.innerHTML = finalData.map(playerScore => {
                    return `<li class="high-scores" >${playerScore.name}</li>`
                }).join("");
        
                 // setting the HTML display of the highScores SCORE 
                highScoresScore.innerHTML = finalData.map(playerScore => {
                    return `<li class="high-scores" >&nbsp-&nbsp${playerScore.score}</li>`
                }).join("");
               
        })
        
    },

    // plays the ghost soundfx when player shoots weapon
    shootSound() {
        if (ghostBomber.soundOn == true){
            shootSound.volume = 0.1;
            shootSound.load();
            shootSound.play();
        } 
    },

// Switch screen method--------------------------------------------------------------
//-----------------------------------------------------------------------------------
    switchScreen(newScreen) {
        $('.screen').hide();
        $(newScreen).show();
        ghostBomber.currentScreen = newScreen;
     
        
        // Game_countdown_screen---------------------------------------------------------
        //-------------------------------------------------------------------------------
        if (ghostBomber.currentScreen === '#game_over_screen') {
            ghostBomber.gameOverScreen();
            
        }
        // Game_countdown_screen---------------------------------------------------------
        //-------------------------------------------------------------------------------
        if (ghostBomber.currentScreen === '#game_countdown_screen') {
            window.setTimeout(ghostBomber.delayStart, 2800);
            
        }
    
        // splash_screen-----------------------------------------------------------------
        //------------------------------------------------------------------------------- 
        if (ghostBomber.currentScreen == '#splash_screen') {

            //allows start button to start the game only if the input field has value > 0 or < 9
            // triggers switchScreen('#game_countdown_screen') 
            $('#start_button').on('click', () => {
            if (ghostBomber.$nameInput.val().length > 0  && ghostBomber.$nameInput.val().length < 9) {
                if (ghostBomber.soundOn == true){
                    if (lightModeBtn.style.display == 'block') {
                        // darkAmbience.pause();
                        // countDown.play()
                    } else {
                        // smoothJazz.pause();
                        // countDown.play();
                    } 
                }
                ghostBomber.switchScreen('#game_countdown_screen');  
                ghostBomber.isRunning = true;
                ghostBomber.playerName = ghostBomber.$nameInput.val();
            } else if (ghostBomber.$nameInput.val().length >= 9){ 
                alert('your name is too long! 8 charactor max. ');
            } else  if (ghostBomber.$nameInput.val().length <= 0 ){
                alert('Please enter your name!');
            }
        
            }),
             
            // splash screen menu options buttons display----------------
            // ----------------------------------------------------------
            $('#instructions-btn').on('click',() => {
                $('#high_scores') .attr('style', 'display:none'); 
                $('#controls') .attr('style', 'display:none');
                $('#credits').css('display','none');  
                $('#bugs').css('display','none');  
                $('#instructions') .attr('style', 'display:');
                $('#high-scores-btn').removeClass('load')
            })
    
            $('#controls-btn').on('click', () => {
                $('#high_scores') .attr('style', 'display:none');
                $('#instructions').css('display','none'); 
                $('#credits').css('display','none');
                $('#bugs').css('display','none');  
                $('#controls').css('display','block'); 
                $('#high-scores-btn').removeClass('load')
            })
            $('#credits-btn').on('click', () => {
                $('#high_scores') .attr('style', 'display:none');
                $('#instructions').css('display','none');
                $('#bugs').css('display','none'); 
                $('#controls') .attr('style', 'display:none'); 
                $('#credits').css('display','block'); 
                $('#high-scores-btn').removeClass('load')
            })

            $('#high-scores-btn').on('click', () => {
                $('#controls') .attr('style', 'display:none');
                $('#instructions').css('display','none');
                $('#bugs').css('display','none'); 
                $('#credits').css('display','none');  
                $('#high_scores').css('display','block'); 
            })
            $('#bugs-btn').on('click', () => {
                $('#controls') .attr('style', 'display:none');
                $('#instructions').css('display','none');
                $('#bugs').css('display','block'); 
                $('#credits').css('display','none');  
                $('#high_scores').css('display','none'); 
                $('#high-scores-btn').removeClass('load')
            })

        }
        
    
   
    },

// stops countdown soundfx and runs start game
// triggered from switchSCreen(game_countdown_screen)  
    delayStart() {
        ghostBomber.startGame();
        countDown.pause();
        countDown.currentTime = 0;
        if (ghostBomber.soundOn == true){
            if (lightModeBtn.style.display == 'block'){
                darkAmbience.play();
            } else {
                smoothJazz.play();
            }
        }
    },

// start game method--------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
    startGame() {

        
            ghostBomber.switchScreen('#game_on_screen');
            ghostBomber.resetGameBoard();
            clearInterval(gameLoopInterval);
            clearInterval(spawnLoopInterval);
            clearInterval(increaseDifficultyInterval);
            clearInterval(timeBonusInterval);
            gameLoopInterval = setInterval(ghostBomber.gameLoop, 1000 / 60);
            spawnLoopInterval = setInterval(ghostBomber.enemySpawnLoop, 300);

            increaseDifficultyInterval = setInterval(() => {
               ghostBomber.enemySpeed = ghostBomber.enemySpeed * 1.2;
               ghostBomber.enemyDelay = ghostBomber.enemyDelay/2;
            }, 10000);
            timeBonusInterval = setInterval(() => {
               ghostBomber.timeBonus++;
            }, 3000);

            // if (videoElement !== undefined) {
            //     videoElement.then(function() {
            //     // Automatic playback started!
            //     }).catch(function() {
            //     // Automatic playback failed.
            //     // Show a UI element to let the user manually start playback.
            //     canvas.style.display = 'none';
            //     });
            // } 



    },

// game loop method---------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
    gameLoop() {

        if (ghostBomber.isRunning == true) {
            if (lightModeBtn.style.display == 'block') {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = "#D0A380";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            bulletController.draw(ctx); 
            player.draw(ctx);  
            enemyController.draw(ctx);  
            enemyController.enemies.forEach((enemy) => {
            if (bulletController.collideWith(enemy)) {
                const index = enemyController.enemies.indexOf(enemy);
                enemyController.enemies.splice(index,1);
            } else if (player.collideWith(enemy)) { 
                ghostBomber.gameOver();
                
            } else {
                enemy.draw(ctx);    
            }   
          })  
        ghostBomber.scorePoints();
        
        } 


    },

// score points method, draws the points on game screen---------------------------------------
//--------------------------------------------------------------------------------------------
    scorePoints() {
        if (ghostBomber.isRunning == true) {
            if (lightModeBtn.style.display == 'block'){
                if (window.innerWidth < 600){
                    ctx.font = "16px 'press_start_2pregular'";
                    ctx.fillStyle = "#ffb703";
                    ctx.fillText((ghostBomber.score + ghostBomber.timeBonus), 250, 28);
                    ctx.font = "16px 'press_start_2pregular'";
                    ctx.fillStyle = "#ffb703";
                    ctx.fillText(ghostBomber.playerName, 20, 28);
                }else {
                    ctx.font = "16px 'press_start_2pregular'";
                    ctx.fillStyle = "#ffb703";
                    ctx.fillText((ghostBomber.score + ghostBomber.timeBonus), 390, 535);
                    ctx.font = "16px 'press_start_2pregular'";
                    ctx.fillStyle = "#ffb703";
                    ctx.fillText(ghostBomber.playerName, 20, 535);
                }
                
            }else {
                if (window.innerWidth < 600){
                    ctx.font = "16px 'press_start_2pregular'";
                    ctx.fillStyle = "black";
                    ctx.fillText((ghostBomber.score + ghostBomber.timeBonus), 250, 28);
                    ctx.font = "16px 'press_start_2pregular'";
                    ctx.fillStyle = "black";
                    ctx.fillText(ghostBomber.playerName, 20, 28);
                }else {
                    ctx.font = "16px 'press_start_2pregular'";
                    ctx.fillStyle = "black";
                    ctx.fillText((ghostBomber.score + ghostBomber.timeBonus), 390, 535);
                    ctx.font = "16px 'press_start_2pregular'";
                    ctx.fillStyle = "black";
                    ctx.fillText(ghostBomber.playerName, 20, 535);
                }
            }
            
        }
    },

// enemy spawn method--------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
    enemySpawnLoop() {
        if (ghostBomber.isRunning == true) {
            const enemySpawn = Math.random();
            if (enemySpawn > 0.3) {
                if (window.innerWidth < 600) {
                    const xPos = Math.floor(Math.random()*290);
                    enemyController.enemyMove(xPos, -50, ghostBomber.enemySpeed, ghostBomber.enemyDelay); 
                }else {
                    const xPos = Math.floor(Math.random()*420);
                    enemyController.enemyMove(xPos, -50, ghostBomber.enemySpeed, ghostBomber.enemyDelay); 
                }
                     
            }
        }  
    },

// game over method---------------------------------------------------------------------------
// triggered by player collision with enemy.--------------------------------------------------
    gameOver() {
        window.setTimeout(ghostBomber.hideGameScreen, 3000);
        ghostBomber.isRunning = false;
        ghostBomber.saveHighScore(ghostBomber.score,ghostBomber.timeBonus);
        
        clearInterval(spawnLoopInterval);
        clearInterval(gameLoopInterval);
        clearInterval(increaseDifficultyInterval);
        clearInterval(timeBonusInterval);
        
    },

// hide game screen method--------------------------------------------------------------------
// when player "dies" there is a 3 sec pause before game over screen appears------------------ 

    hideGameScreen () {
        ghostBomber.switchScreen('#game_over_screen');
    },

// game over screen method--------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

    gameOverScreen() {
        
        // personalized message based on score achieved-------------------------------
        //----------------------------------------------------------------------------
        if (ghostBomber.score < 50) {
            $('#final_name').text('C\'mon ' + ghostBomber.playerName+'! I expected more from you. ')
            $('#final_score').text((ghostBomber.score + ghostBomber.timeBonus)+' points!')
        }
        if (ghostBomber.score >= 50 && ghostBomber.score < 100) {
            $('#final_name').text('So you scored some points... big whoop, wanna fight about? Take your anger out on the court '+ ghostBomber.playerName+'!')
            $('#final_score').text((ghostBomber.score + ghostBomber.timeBonus)+' points!')
        }
        if (ghostBomber.score >= 100 && ghostBomber.score < 200) {
            $('#final_name').text('I am impressed '+ ghostBomber.playerName+'! Nice work!')
            $('#final_score').text((ghostBomber.score + ghostBomber.timeBonus)+' points!')
        }
        if (ghostBomber.score >= 200 && ghostBomber.score < 400) {
            $('#final_name').text('Thats quite the score '+ ghostBomber.playerName+'! Righteous dude!')
            $('#final_score').text((ghostBomber.score + ghostBomber.timeBonus)+' points!')
        }
        if (ghostBomber.score >400) {
            $('#final_name').text(ghostBomber.playerName+' You are stone cold killer')
            $('#final_score').text((ghostBomber.score + ghostBomber.timeBonus)+' points!')
        }
        if (ghostBomber.soundOn == true){
            if (lightModeBtn.style.display == 'block') {
                darkAmbience.play();
            } else {
                smoothJazz.play();
            }
        } 
        
        
    // play again method triggered by 'click'----------------
    // re triggers countdown screen -------------------------
    // ------------------------------------------------------

        $('#play_again').on('click', () => {
            ghostBomber.isRunning = true;
            // countDown.currentTime = 0;
            if (ghostBomber.soundOn == true){
                if (lightModeBtn.style.display == 'block') {
                    // darkAmbience.pause();
                    // countDown.play();
                } else {
                    // smoothJazz.pause();
                    // countDown.play();
                }  
            }
            clearInterval(spawnLoopInterval);
            clearInterval(gameLoopInterval);
            clearInterval(increaseDifficultyInterval);
            clearInterval(timeBonusInterval);

            ghostBomber.switchScreen('#game_countdown_screen');
        })

    // quit game method triggered by 'click'-----------------
    // send player back to splash screen --------------------
    // ------------------------------------------------------
        $('#quit').on('click', () => {
            ghostBomber.switchScreen('#splash_screen');
            ghostBomber.score = 0;
            $('#name_input').val(ghostBomber.playerName);
            $('#controls') .attr('style', 'display:none');
            $('#instructions').css('display','none');
            $('#credits').css('display','none');  
            $('#high_scores').css('display','block');
            $('#bugs').css('display','none');
        
        })
    },

// reset game board method--------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
    resetGameBoard(){
        ghostBomber.score = 0;
        ghostBomber.timeBonus = 0;
        player.x = canvas.width / 2.3;
        player.y = canvas.height / 1.3;
        enemyController.enemies.length = 0;
        bulletController.bullets.length = 0;
        ghostBomber.gameDifficulty = 1; 
        ghostBomber.enemySpeed = 2;
        ghostBomber.enemyDelay = 3;  
        console.log('resetting game board');
    }
}

// Player class ------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

class Player {

    constructor(x, y, bulletController, mobileWidth, mobileHeight) {
        this.x = x,
        this.y = y,
        this.color = 'black'
        this.bulletController = bulletController,
        this.width = mobileWidth,
        this.height = mobileHeight,
        this.speed = 5,
        this.draggable = false,
        this.touches = [],
        this.touchEngaged = false,

        window.addEventListener('touchstart', e => {
            // e.preventDefault();
            console.log('start');
            this.touchEngaged = true;

            
            
        });

        
        window.addEventListener('touchmove', e => {
            e.preventDefault();
            console.log('move');
            console.log(e);
            

            if (e.targetTouches[0].clientX - canvas.offsetLeft > this.width/2 && 
                e.targetTouches[0].clientX - canvas.offsetLeft < (canvas.width-(this.width/2))){
                let touchLocation = e.targetTouches[0];
                this.x = touchLocation.clientX - canvas.offsetLeft - this.width / 2;
                
            }
            
        }); 

        window.addEventListener('touchend', e => {
            e.stopPropagation();
            console.log('end');
            this.touchEngaged = false;
        });


        
        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
    }


    //player draw method-------------------------------------------
    //-------------------------------------------------------------
    draw(ctx) {
        this.move();
        this.shoot();
        
        

        if (lightModeBtn.style.display == 'block'){
            ctx.drawImage(rolDark,this.x, this.y, this.width, this.height);
        }else {
            ctx.drawImage(rol,this.x, this.y, this.width, this.height);
        }
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
                if (ghostBomber.soundOn == true){
                    if (lightModeBtn.style.display == 'block') {
                        darkAmbience.pause();
                        deadSound.play();
                    } else {
                        smoothJazz.pause();
                        deadSound.play();
                    }
                    
                }
                
                //color over player image and then draw player dead image 
                
                if (lightModeBtn.style.display == 'block'){
                    ctx.fillStyle = 'black';
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    ctx.drawImage(deadDark,this.x, this.y, this.width, this.height);
                }else {
                    ctx.fillStyle = '#D0A380';
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    ctx.drawImage(dead,this.x, this.y, this.width, this.height);
                }
                
                
                return true;
            }
            return false;
    }
    //player shoot method------------------------------------------
    //-------------------------------------------------------------
    shoot() {
       
        
        if (this.touchEngaged == true){
            const speed = 8;
            const delay = 10;
            const damage = 1;
            const bulletX = this.x + this.width/3;
            const bulletY = this.y - this.height/2.5;
            this.bulletController.shoot(bulletX, bulletY, speed, damage, delay);
        }
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
                if (ghostBomber.soundOn == true){
                    ghostBomber.shootSound();
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
        this.smWidth = 12;
        this.smHeight = 22;
    }

    draw(ctx) {
        // fillStyle specifies color, gradient or pattern to be used inside of a shape
        if (window.innerWidth < 600) {
            if (lightModeBtn.style.display == 'block'){
                ctx.drawImage(ghostDark,this.x, this.y, this.smWidth, this.smHeight);
            }else {
                ctx.drawImage(ghost,this.x, this.y, this.smWidth, this.smHeight);
            }
        } else {
            if (lightModeBtn.style.display == 'block'){
                ctx.drawImage(ghostDark,this.x, this.y, this.width, this.height);
            }else {
                ctx.drawImage(ghost,this.x, this.y, this.width, this.height);
            }
        }
        
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
                if (ghostBomber.soundOn == true){
                    hitSound.play();
                }

                ghostBomber.score = ghostBomber.score +10;
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
        this.smWidth = 30;
        this.smHeight = 25;

        

    }

    draw(ctx) {
        // fillStyle specifies color, gradient or pattern to be used inside of a shape 
        if (window.innerWidth < 600) {
            if (lightModeBtn.style.display == 'block'){
                ctx.drawImage(bombDark,this.x, this.y, this.smWidth, this.smHeight);
            }else {
                ctx.drawImage(bomb,this.x, this.y, this.smWidth, this.smHeight);
            }
        }else {
            if (lightModeBtn.style.display == 'block'){
                ctx.drawImage(bombDark,this.x, this.y, this.width, this.height);
            }else {
                ctx.drawImage(bomb,this.x, this.y, this.width, this.height);
            }
        }
        
        // ctx.fillStyle = this.color;
        // this moves the enemy down the screen
        this.y += this.speed;
        // fillRect colors in the enemy
        // ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    
}


// Interval variables
let gameLoopInterval = null;
let spawnLoopInterval = setInterval(ghostBomber.enemySpawnLoop, 500);
let increaseDifficultyInterval = setInterval(ghostBomber.increaseDifficulty, 20000)
let timeBonusInterval = setInterval(ghostBomber.timeBonus, 3000);
let mobileWidth = 40;
let mobileHeight = 40;

if (window.innerWidth < 600){
    mobileWidth = 33;
    mobileHeight = 33;

}
// CLASS VARIABLES
const enemy = new Enemy(canvas);
const enemyController = new EnemyController(canvas);
const bulletController = new BulletController(canvas);
const player = new Player(canvas.width / 2.3, canvas.height / 2, bulletController, mobileWidth, mobileHeight);



// document ready------------------------------------------------------------------------
// initializes the splash screen --------------------------------------------------------

$(document).ready(() => {
    //fires switch screen method which triggers everything under splash screen conditional.
    ghostBomber.switchScreen('#splash_screen');
    darkMode();
    // adds an underline to the highhscore menu which is shown first on splash screen
    $('#high-scores-btn').addClass('load')
    
    ghostBomber.saveHighScore();
    // loads highscores & coresponding names from local storage array and returns them as <li>'s
    // highScoresName.innerHTML = finalData.map(playerScore => {
    //     return `<li class="high-scores" >${playerScore.name}</li>`
    // }).join("");
    // highScoresScore.innerHTML = finalData.map(playerScore => {
    //     return `<li class="high-scores" >${playerScore.score}</li>`
    // }).join("");

    // music is initialized as off.  Event listeners on play and pause buttons to start and stop game music. 

    $('#play_button').on('click', () => {
        ghostBomber.soundOn = true;
        if (ghostBomber.soundOn == true){
            if (lightModeBtn.style.display == 'block') {
                darkAmbience.play();
            } else {
                smoothJazz.play()
            }
            
        }
        $('#pause_button').css('display','block'); 
        $('#play_button').css('display','none'); 
    })

    $('#pause_button').on('click', () => {
        ghostBomber.soundOn = false;
        if (ghostBomber.soundOn == false){
            if (lightModeBtn.style.display == 'block') {
                darkAmbience.pause();
            } else {
                smoothJazz.pause()
            }
        }
        $('#pause_button').css('display','none'); 
        $('#play_button').css('display','block'); 
    })
})



