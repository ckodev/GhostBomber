# Ghost Bomber
Ghost Bomber (formerly Space Laser)

My final project for Web Scripting 1. 

The game has been tested in Chrome, Firefox and Safari.  It works as expected in all three but I had to remove the sound from the safari version as it was causing a major lag in the game play.  I did this by changing the css property of the play and pause button to display none for safari browser only.  I can imagine there is probably a better way to do this.  

On that note, the sound fx and music cause a small but noticeable lag in game play in chrome and firefox as well but the game still works pretty well.  The player has the option to turn the sound on/off at any point.  I imagine there's a better way to add sound fx and music to a game such that it doesn't cause laggy-ness.  

I added a dark mode for fun!  You'll see that I did this by adding class of "dark" to everything that needed to be changed which required me to go into my css and duplicate everything that needed to be dark mode and changing the color.  If I were to do this again I would use css variables and/or a second style sheet.  This way I would only need to use javascript to change one thing instead of multiple. 

My player pieces are png's.  They are sized by hardcoding their width and height.  They seem to me to be a bit pixelated. I was unsure of how to size them based on the actual image width and height.  Also they all have squares around them that is the same color as the background meaning that their contact points are outside of the actual shapes of the pieces.  I was unsure of how to make the shapes involved in the collide methods to be circles or at least squares that are less than the size of the character being displayed. 

My favourite part is the High Scores list.  It really gives the game purpose.  Thats really what ghost bomber is all about. Trying to get on the high scores list.  Its currently using the browsers local storage so when you open the game on your computer the high scores list will be empty but each time you play it will add the name inputted and the score you got to the list.  It displays up to 10 high scores and has a method for sorting based on score.  

The final step before I make ghost bomber live to the world is to change the highscores method to use server side storage so that everyone can battle eachother for the highscore.   Unfortunately I haven't been able to figure this out yet! 

Overall I am very pleased with how Ghost Bomber turned out!  I look forward to hearing your feedback!

Thanks for all your help josh!

-cory     

