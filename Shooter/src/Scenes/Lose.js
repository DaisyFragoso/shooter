class LoseScene extends Phaser.Scene {
    constructor() {
        super('loseScene');
        this.imageX = 400;
        this.imageY = 350;
    }

    preload(){
            this.load.setPath('./assets/');
            this.load.image('lose', 'Lose.png'); 
            console.log("in lose");

    }

    create() {

        console.log("in lose");
        this.add.image(500, 500, 'lose')
          //  .setOrigin(0.5)
            .setScale(2); //size of img

         this.input.keyboard.once('keydown-R', () => {
             this.scene.start("CosmicHeart");
         });

    }
    
}