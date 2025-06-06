// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    physics: {
        default: 'arcade', 
        arcade: {
            debug: false
    }},
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    //width: 800, height: 600
    width: 1000,
    height: 900,
   // scene: [Smiley],
   fps: {
    forceSetTimeOut: true,
    target: 30
},
    
    scene: [CosmicHeart, TheEndScene, LoseScene]
}

const game = new Phaser.Game(config);