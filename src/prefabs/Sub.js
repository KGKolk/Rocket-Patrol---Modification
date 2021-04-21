class Sub extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame) 
    {
        super(scene, x, y, texture, frame);
        this.sfxRocket = scene.sound.add('sfx_rocket');
        scene.add.existing(this);
        this.movementSpeed = 2;
        this.isFiring = false;
    }
    update() 
    {
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.movementSpeed;
            }
            else if(keyRIGHT.isDown && this.x <= game.config.width - 
                borderUISize - this.width) {
                    this.x += this.movementSpeed;
            }
        }
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.movementSpeed;
        }
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }
    reset() 
    {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
    
}