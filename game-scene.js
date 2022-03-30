var background;
var floor;
var robot;
var bullet;
var gameSpeed;
var enemies;
var respawnTime = 0;
var enemy;
var gameOver = false;
var score = 0;

var SceneGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function(){
        Phaser.Scene.call(this,{'key': 'SceneGame' });
    },
    init: function(){ },

    preload: function (){
        gameSpeed = 2; // velocidad del suelo y fondo

        this.load.image('background','assets/background.png');
        this.load.image('floor','assets/floor.png');
        this.load.image('bullet','assets/bullet.png');
        this.load.spritesheet('robot','assets/robot.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('ball','assets/ball.png', {frameWidth: 32, frameHeight: 32});

        this.cursors = this.input.keyboard.createCursorKeys()

    },

    create: function(){

        this.cameras.main.fadeIn(500);

        background = this.add.tileSprite(0, 600, 800, 600, 'background').setOrigin(0, 1);

        // hago una plataforma invisible
        platforms = this.physics.add.staticGroup();
        platforms.create(0, 551).setScale(600, 2).refreshBody(); // tamano de plataforma invisible

        floor = this.add.tileSprite(0, 600, 800, 81, 'floor').setOrigin(0, 1);

        scoreText = this.add.text(15, 15, 'Score: 0', {fontSize: '900 32px', fill: '#ffa500'});

        robot = this.physics.add.sprite(40, 300, 'robot')
            .setScale(4)
            .setSize(15,25) // tamano de hitbox
            .setCollideWorldBounds(true)
            .setBounce(0.3)
            .setGravityY(5000); // gravedad a la que baja

        enemies = this.physics.add.group(); 
        
        this.physics.add.collider(robot, platforms);
        this.physics.add.collider(enemies, platforms);
        
        this.anims.create({
            key: 'robot-run',
            frames: this.anims.generateFrameNumbers('robot',{start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'ball-jump',
            frames: this.anims.generateFrameNumbers('ball',{start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.overlap(robot, enemies, hitEnemy, null, this); // poniendo overlap en vez de collider parece que lo arreglo
    },
    
    placeEnemy(){ 
        const enemyNum = Math.floor(Math.random() * 6);
        const distance = Phaser.Math.Between(100, 400); // intervalo en el que salen los enemigos
        let enemy;

        if (enemyNum > 3){
            enemy = enemies.create(600 + distance, 520,'bullet')
            .setScale(3)
            .setSize(20,20)
            .setOrigin(0,1);
        } else {
            enemy = enemies.create(600 + distance , 300, 'ball') // 520 para volver a la normalidad
            .setScale(3)
            .setSize(20,20)
            .setOrigin(0,1)
            .setBounce(1); // 0.5 para volver a la normalidad
            enemy.play('ball-jump', 1);
            enemy.body.offset.y = +10;
        }
    },

    update: function(time, delta){

        if (gameOver){
            this.time.addEvent({
                delay: 1000,
                loop: false,
                callback: () => {
                    this.scene.start('SceneGameOver', {
                        'highscore': score
                    })
                }
            })
            return;
        }
            
        
        background.tilePositionX += gameSpeed/2;
        floor.tilePositionX += gameSpeed;

        if (time%10 == 0){
            score++;
            gameSpeed += 0.1;
        }

        scoreText.setText('Score '+ score);

        Phaser.Actions.IncX(enemies.getChildren(), -gameSpeed); // velocidada a la que se mueven los enemigos

        respawnTime += delta ;

        if (respawnTime >= 1500){ // cada cuanto aparece un enemigo (1seg 50ms)
            this.placeEnemy();
            respawnTime = 0;
        }

        enemies.getChildren().forEach(enemy => { // borro enemigos que se van de la pantalla
            if (enemy.getBounds().right < 0){
                enemy.destroy();
            }
        })

        robot.anims.play('robot-run', true);

        
        if (this.cursors.left.isDown){ 
            robot.setVelocityX(-150);
        }
        else if (this.cursors.right.isDown){ 
            robot.setVelocityX(100);
        } 
        else {
            robot.setVelocityX(0);
        }
        

        if (this.cursors.up.isDown && robot.body.touching.down){
            robot.setVelocityY(-1600); // altura que salta 
        }
    }
})

function hitEnemy(robot, enemy){
    this.physics.pause();

    robot.setTint(0xff0000);
    robot.anims.stop(true);
    enemies.getChildren().forEach(enemy => {
        enemy.anims.stop(true);
    })
    
    gameOver = true;
}