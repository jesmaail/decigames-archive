Scene.Preloader = function (game) {
	this.background = null; // define background
	this.preloadBar = null; // define loader bar
};

Scene.Preloader.prototype = {
	preload: function () {
		this.imgPath = 'games/fire/assets/';
		
		this.background = this.add.sprite(0, 0, 'loading');
		
		this.load.image('background', this.imgPath + 'background.png');
		this.load.image('backgroundEnd', this.imgPath + 'background2.png');
		this.load.spritesheet('player', this.imgPath + 'fireSprite.png', 24, 36, 24);
		this.load.spritesheet('enemy', this.imgPath + 'enemy.png', 29, 20, 7);
		this.load.spritesheet('barrel', this.imgPath + 'barrel.png', 11, 32, 4);
		this.load.image('buildingA', this.imgPath + 'buildingA.png');
		this.load.image('buildingB', this.imgPath + 'buildingB.png');
		this.load.image('buildingC', this.imgPath + 'buildingC.png');
		this.load.image('rain', this.imgPath + 'rain.png');
		this.load.image('canopy', this.imgPath + 'canopy.png');
		this.load.image('umbrella', this.imgPath + 'umbrella.png');
		this.load.spritesheet('wind', this.imgPath + 'wind.png', 38, 31, 3);
		this.load.image('puddle', this.imgPath + 'puddle.png');
		this.load.image('heart', this.imgPath + 'heart.png');
		this.load.spritesheet('waterGirl', this.imgPath + 'waterGirl.png', 22, 24, 2);
		this.load.spritesheet('logs', this.imgPath + 'logs.png', 25, 36, 4);
		
		this.load.spritesheet('dead', this.imgPath + 'dead.png', 640, 300, 3);
		this.load.image('win', this.imgPath + 'win.png');
		this.load.image('win2', this.imgPath + 'win2.png');
		this.load.image('win3', this.imgPath + 'win3.png');
		
		this.load.audio('splashTheme', this.imgPath + 'splashScreen.mp3')
		this.load.audio('theme', this.imgPath + 'theme.mp3')
		this.load.audio('gameOver', this.imgPath + 'gameOver.mp3')
		this.load.audio('gameWin', this.imgPath + 'gameWin.mp3')
		this.load.audio('jump_sound', this.imgPath + 'jump.mp3')
		
		this.load.audio('die', this.imgPath + 'die.mp3')
		this.load.audio('rain', this.imgPath + 'rain.mp3')
	},

	create: function () {
		this.collide = true;
		this.background = this.add.sprite(0, 0, 'splash');
		this.startMusic = this.game.add.audio('splashTheme');
		this.startMusic.loop = true;
		this.startMusic.play();
		
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;
	},
	
	update: function(){
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.pointer1.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_START)){
			this.startMusic.stop();
			this.game.state.start('Game');
		}
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.J) && this.game.input.keyboard.isDown(Phaser.Keyboard.S) && this.game.input.keyboard.isDown(Phaser.Keyboard.E)){
			this.startMusic.stop();
			this.collide = false;
			this.game.state.start('Game');
		}
	}
};