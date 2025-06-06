
class CosmicHeart extends Phaser.Scene {
    constructor() {
        super("CosmicHeart");
        this.my = { sprite: {} };
        this.projectiles = [];
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("mainCharacter", "PinkCharacter.png");
        this.load.image("bullet", "heart.png");
        this.load.image("enemySprite", "BlueEnemy.png");
        this.load.image("enemyGreen1", "BlueEnemy.png");
        this.load.image("bulletEnemy", "YellowCircle.png");
    }

    create() {
        this.init_game();

        this.my.sprite.character = this.add.sprite(this.characterX, this.characterY, "mainCharacter");

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;

        // path coordinates for each enemy
        const enemyPaths = [
            [20, 20, 80, 400, 300, 750, 624, 290, 832, 548],
            [256, 222, 264, 408, 162, 532, 182, 702, 628, 720, 818, 652],
            [462, 184, 462, 462, 268, 576, 220, 724],
            [640, 244, 650, 472, 356, 486, 94, 382, 144, 586, 306, 714, 716, 732],
            [852, 252, 840, 416, 486, 412, 324, 188, 148, 428, 84, 660, 546, 678, 722, 742],
            [116, 334, 182, 224, 252, 20, 94, 36, 58, 268, 30, 408, 64, 552, 226, 588, 538, 518, 704, 510, 818, 606, 634, 662, 316, 676, 314, 732],
            [306, 346, 330, 294, 416, 172, 332, 82, 184, 92, 190, 134, 490, 208, 522, 224, 710, 458, 880, 588, 622, 724, 258, 758],
            [538, 350, 426, 288, 878, 206, 926, 128, 844, 38, 310, 90, 90, 90, 132, 470, 196, 610, 494, 468, 774, 682, 404, 742],
            [716, 348, 842, 264, 916, 176, 906, 104, 560, 108, 264, 72, 294, 280, 850, 558, 512, 688],
            [50, 100, 150, 200, 300, 150, 500, 250, 700, 100] 
        ];

        // Draw paths and spawn enemies
        enemyPaths.forEach((points, i) => {
            const curve = new Phaser.Curves.Spline(points);
            const graphics = this.add.graphics();
          //  graphics.lineStyle(2, 0xffffff, 0.5);
            curve.draw(graphics, 64);

            const enemy = this.add.follower(curve, points[0], points[1], "enemyGreen1");
            enemy.setScale(1.2);
            enemy.startFollow({
                duration: 5000 + i * 300, // vary speed per enemy
                repeat: -1,
                yoyo: true,
                rotateToPath: true,
                rotationOffset: -90
            });

            this.enemies.add(enemy);
        });
    }

    init_game() {
        this.characterX = 400;
        this.characterY = 570;
        this.projectiles = [];
        this.frameTime = 0;
        this.isSpacePressed = false;

        // Group - enemy bullets
        this.enemyBullets = this.physics.add.group();

        // Timer - enemies shooting note 1000ms = 1 sec
        this.time.addEvent({
            delay: 1000,
            callback: this.enemyShoot,
            callbackScope: this,
            loop: true
        });

        //  enemy group
        if (this.enemies) this.enemies.clear(true, true);
        this.enemies = this.add.group();

        //  static enemies 
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 5; col++) {
                let enemy = this.add.sprite(100 + col * 100, 100 + row * 80, 'enemySprite');
                this.enemies.add(enemy);
            }
        }
    }

    enemyShoot() {
        // Pick a random enemy to shoot
        const enemies = this.enemies.getChildren().filter(e => e.active);
        if (enemies.length === 0) return;

        const shooter = Phaser.Utils.Array.GetRandom(enemies);
        const bullet = this.add.sprite(shooter.x, shooter.y + 20, 'bulletEnemy'); // reuse 'bullet' sprite or load a different one

        bullet.speed = 3;
        this.enemyBullets.add(bullet);
}


    moveCharacter(dx, dy = 0) {
        this.characterX += dx;
        this.characterY += dy;

        // Clamp X - horizontal within screen bounds (player horizontal bounds)
        this.characterX = Phaser.Math.Clamp(this.characterX, 0, this.gameWidth);

        // Clamp Y so only bottom 1/3 of screen (player vertical bounds)
        const lowerY = this.gameHeight * (2 / 3);
        const upperY = this.gameHeight; 
        this.characterY = Phaser.Math.Clamp(this.characterY, lowerY, upperY);

        this.my.sprite.character.x = this.characterX;
        this.my.sprite.character.y = this.characterY;
}

    emitProjectile() {
        let projectile = this.add.sprite(this.characterX, this.characterY, "bullet");
        projectile.speed = 4;
        this.projectiles.push(projectile);
    }

    update(time, delta) {
        let dx = 0;
        let dy = 0;
        const moveSpeed = 6;

        if (this.aKey.isDown) dx = -moveSpeed;
        if (this.dKey.isDown) dx = moveSpeed;
        if (this.wKey.isDown) dy = -moveSpeed;
        if (this.sKey.isDown) dy = moveSpeed;

       this.moveCharacter(dx, dy);


        if (this.spaceKey.isDown && !this.isSpacePressed) {
            this.emitProjectile();
            this.isSpacePressed = true;
        }
        if (this.spaceKey.isUp) this.isSpacePressed = false;

        // Move projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            let p = this.projectiles[i];
            p.y -= p.speed;

            if (p.y < 0) {
                p.destroy();
                this.projectiles.splice(i, 1);
            }
        }

        // collision detection bullet -> enemy
        this.projectiles.forEach((bullet, bIndex) => {
            this.enemies.getChildren().forEach((enemy) => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), enemy.getBounds())) {
                    bullet.destroy();
                    enemy.destroy();
                    this.projectiles.splice(bIndex, 1);
                }
            });
        });

        //collision detection enemy -> player
        this.enemies.getChildren().forEach((enemy) => {
        if (
            enemy.active && this.my.sprite.character.active &&
            Phaser.Geom.Intersects.RectangleToRectangle(
                enemy.getBounds(),
                this.my.sprite.character.getBounds()
            )
        ) {
            this.scene.start("loseScene");
        }
        });

        // Move enemy bullets
        this.enemyBullets.getChildren().forEach((bullet) => {
            bullet.y += bullet.speed;

        // Destroy bullet if off-screen
        if (bullet.y > this.gameHeight) {
            bullet.destroy();
        }

        // Check collision with player
        if (
            bullet.active && this.my.sprite.character.active &&
            Phaser.Geom.Intersects.RectangleToRectangle(
                bullet.getBounds(),
                this.my.sprite.character.getBounds()
            )
        ) {
            this.scene.start("loseScene");
        }
        });


        // End condition
        if (this.enemies.countActive() === 0) {
            this.scene.start("endScene");
        }
    }
}