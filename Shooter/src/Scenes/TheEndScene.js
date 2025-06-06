class TheEndScene extends Phaser.Scene {
    constructor() {
        super('endScene');
        this.imageX = 400;
        this.imageY = 350;
    }

    preload(){
            this.load.setPath('./assets/');
            this.load.image('theEnd', 'theEnd.png'); 

    }

    create() {

        this.add.image(500, 500, 'theEnd')
            .setScale(3); //size of img

        //  this.input.keyboard.once('keydown-R', () => {
        //      this.scene.start("CosmicHeart");
        // });

    }
    
}