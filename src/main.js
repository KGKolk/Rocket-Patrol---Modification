//Constantine Kolokousis
//Sub Patrol 
//April 21, 2021
//~10 Hour Worktime

// Modifications Made --------------------------------------------------------------
/*Create a new spaceship type (w/ new artwork) 
that's smaller, moves faster, and is worth more points 
(20)

Create new artwork for all of the in-game assets (rocket, spaceships, explosion) 
(20) 

Create and implement a new weapon (w/ new behavior and graphics) 
(20)

Create a new title screen (e.g., new artwork, typography, layout) 
(10)

Implement parallax scrolling 
(10)

Create 4 new explosion SFX and randomize which one plays on impact 
(10)

Create a new scrolling tile sprite for the background 
(5)

Add your own (copyright-free) background music to the Play scene 
(5)
*/

//Credits -----------------------------------------------------------------
//freesound.org for miscellaneous explosions
//Jim Hall - Last Breath royalty free music
//Moises Perez general method of hiding the torpedo under the player sub and recycling the original code to create a projectile
//Pixilart.com for art inspiration


let config = 
{ 
  type: Phaser.CANVAS,
  width: 640,
  height: 480,
  scene: [Menu, Play],
}

let game =  new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let starSpeed = 4;

let keyF, keyR, keyLEFT, keyRIGHT, Mouse1, MouseLEFT, MouseRIGHT;