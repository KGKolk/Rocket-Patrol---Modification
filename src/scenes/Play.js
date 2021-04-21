class Play extends Phaser.Scene 
{
    constructor() {
        super("playScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('Torpedo', './assets/torpedo.png');
        this.load.image('Sub', './assets/sub.png');
        this.load.image('Shark', './assets/shark.png');
        this.load.image('NeedleShark', './assets/needleshark.png');
        this.load.image('oceanfield', './assets/oceanfield.png');
        this.load.image('forwardframe', './assets/forwardFrame.png');
        this.load.image('Torpedo', './assets/torpedo.png');
        this.load.audio('lastBreath', './assets/Jim Hall - Last Breath.mp3');
        this.load.audio('exp1', './assets/Exp1.wav');
        this.load.audio('exp2', './assets/Exp2.wav');
        this.load.audio('exp3', './assets/Exp3.wav');
        this.load.audio('exp4', './assets/Exp4.wav');


        
        // load spritesheet
        this.load.spritesheet('gore', './assets/gore.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
    }

    create() 
    {
        // place oceanfield
        this.oceanfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'oceanfield').setOrigin(0, 0);
        this.laxField = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'forwardframe').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width,
        borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add Sub (player 1)
        this.p1sub = new Sub(this, game.config.width/2, game.config.height - 
        borderUISize - borderPadding, 'Sub').setOrigin(0.5, 0);
        
        // add Torpedo
        this.torpedo = new Torpedo(this, game.config.width/2, game.config.height - 
        borderUISize - borderPadding, 'Torpedo').setOrigin(0.5, 0);


        // add Shark (x3)
        this.shark01 = new Shark(this, game.config.width + borderUISize * 6, borderUISize * 4, 'Shark', 0, 30).setOrigin(0, 0);
        this.shark02 = new Shark(this, game.config.width + borderUISize * 3, borderUISize * 5, 'Shark', 0, 20).setOrigin(0, 0);
        this.shark03 = new Shark(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'Shark', 0, 10).setOrigin(0, 0);
        this.needleShark = new NeedleShark(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'NeedleShark', 0, 55).setOrigin(0, 0);


        // define keys
        
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('gore', 
            {
                start: 0,
                end: 9,
                first: 0
            }),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        
        let scoreConfig = 
        {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize
        + borderPadding * 2, this.p1Score, scoreConfig);


        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => 
        {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu',
            scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        this.music = this.sound.add('lastBreath');
        this.booms = this.sound.add('exp1');
        this.booms = this.sound.add('exp2');
        this.booms = this.sound.add('exp3');
        this.booms = this.sound.add('exp4');
        
        this.music.play();

    }

    update() 
    {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) 
        {
            this.music.stop();
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) 
        {
            this.music.stop();
            this.scene.start("menuScene");
        }

        this.oceanfield.tilePositionX -= starSpeed;
        this.laxField.tilePositionX -= starSpeed/2.5;


        if (!this.gameOver) 
        {
            this.torpedo.update();
            this.p1sub.update();             // update Sub sprite
            this.shark01.update();           // update Sharks (x3)
            this.shark02.update();
            this.shark03.update(); 
            this.needleShark.update();  
        }

        

        // check collisions

            if(this.torpedo.y <= borderUISize * 3 + borderPadding) 
            {
                this.ResetTorpedo(this.torpedo, this.p1sub)
            }

            if(this.checkCollision(this.torpedo, this.shark03)) 
            {
                this.ResetTorpedo(this.torpedo, this.p1sub);
                this.SharkExplode(this.shark03);
            }
            
            else if(this.checkCollision(this.torpedo, this.shark02)) 
            {
                this.ResetTorpedo(this.torpedo, this.p1sub);
                this.SharkExplode(this.shark02);
    
            }
    
            else if(this.checkCollision(this.torpedo, this.shark01)) 
            {
                this.ResetTorpedo(this.torpedo, this.p1sub);
                this.SharkExplode(this.shark01);
    
            }
    
            else if(this.checkCollision(this.torpedo, this.needleShark)) 
            {
                this.ResetTorpedo(this.torpedo, this.p1sub);
                this.SharkExplode(this.needleShark);
            }

        


    }

    checkCollision(Torpedo, Shark) 
    {
        // simple AABB checking
        if(Torpedo.x < Shark.x + Shark.width &&
            Torpedo.x + Torpedo.width > Shark.x &&
            Torpedo.y < Shark.y + Shark.height &&
            Torpedo.height + Torpedo.y > Shark.y) {
                return true;
        } 
        else 
        {
            return false;
        }
            
    }

    SharkExplode(Shark) 
    {
        // temporarily hide Shark
        Shark.alpha = 0;
        // create gore sprite at Shark's position
        let boom = this.add.sprite(Shark.x, Shark.y, 'gore').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            Shark.reset();                       // reset Shark position
            Shark.alpha = 1;                     // make Shark visible again
            boom.destroy();                     // remove gore sprite
        });
        // score add and repaint
        this.p1Score += Shark.points;
        this.scoreLeft.text = this.p1Score;
        this.booms.play();
    }


    ResetTorpedo(Torpedo, Sub)
    {
        this.torpedo.reset();
        Torpedo.x = Sub.x;
        Torpedo.y = Sub.y;
    }

    
}