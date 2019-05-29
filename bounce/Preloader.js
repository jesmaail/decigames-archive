Scene.Preloader = function (game) {
	this.background = null; // define background
	this.preloadBar = null; // define loader bar
};

Scene.Preloader.prototype = {
	preload: function () {
		this.background = this.add.sprite(0, 0, 'loading');
		this.imgPath = 'games/bounce/assets/';
		
		//this.load.image('background', 'bounce/assets/map.png');
		this.load.image('black', this.imgPath + 'black.png');
		this.load.image('wall', this.imgPath + 'wall.png');
		this.load.image('floor', this.imgPath + 'floor.png');
		
		this.load.image('heart', this.imgPath + 'heart.png');
		
		this.load.image('red', this.imgPath + 'red.png');
		this.load.image('blue', this.imgPath + 'blue.png');
		this.load.image('yellow', this.imgPath + 'yellow.png');
		
		this.load.image('beard', this.imgPath + 'beard.png');
		this.load.image('ben',  this.imgPath + 'ben.png');
		this.load.image('gav',  this.imgPath + 'gav.png');
		this.load.image('rachel',  this.imgPath + 'rachel.png');
		this.load.image('shaun',  this.imgPath + 'shaun.png');
		this.load.image('tindal',  this.imgPath + 'tindal.png');
		this.load.image('vice',  this.imgPath + 'vice.png');
		this.load.image('cov',  this.imgPath + 'cov.png');
		this.load.image('tom',  this.imgPath + 'tom.png');
		this.load.image('marcus',  this.imgPath + 'marcus.png');
		this.load.image('mog',  this.imgPath + 'mog.png');
		
		this.load.image('splash', this.imgPath + 'splash.png');
		this.load.spritesheet('select', this.imgPath + 'select.png', 60, 60, 2);
		
		this.load.audio('menu', this.imgPath + 'menu.mp3');
		this.load.audio('theme', this.imgPath + 'theme.mp3');
		this.load.audio('bounce_sound', this.imgPath + 'bounce.mp3');
		this.load.audio('hurt', this.imgPath + 'hurt.mp3');
		
	},

	create: function () {
		this.moveTimer = 0;
		this.character = "";
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;
		
		this.background = this.add.sprite(0, 0, 'splash');
		this.selector = this.add.sprite(45, 121, 'select');
		this.selector.animations.add('flash', [0, 1]);
		this.selector.animations.play('flash', 2, true);
		
		this.startMusic = this.game.add.audio('menu');
		this.startMusic.loop = true;
		this.startMusic.play();		
	},
	
	update: function(){	
		if(this.moveTimer < this.game.time.now){
		
			if( (this.selector.x < 395) && (this.cursors.right.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) ){
				this.moveTimer = this.game.time.now + 250;
				this.selector.x += 70;
			}
			
			if( (this.selector.x > 45) && (this.cursors.left.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) ){
				this.moveTimer = this.game.time.now + 250;
				this.selector.x -= 70;
			}
			
			if( (this.selector.y == 191) && (this.cursors.up.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) ){
				this.moveTimer = this.game.time.now + 250;
				this.selector.y -= 70;
			}
			
			if( (this.selector.y == 121) && (this.cursors.down.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) ){
				this.moveTimer = this.game.time.now + 250;
				this.selector.y += 70;
			}
		}
		
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.pad1.isDown(Phaser.Gamepad.XBOX360_START)){
			this.characterSelect();
			this.startMusic.stop();
			this.game.state.start('Game');
		}
		
		if(this.game.input.pointer1.isDown){
			this.touchSelect();
			this.startMusic.stop();
			this.game.state.start('Game');
		}
	},
	
	characterSelect: function(){
		if(this.selector.y ==121){
			if(this.selector.x == 45){
				this.character = 'beard';
			}else if(this.selector.x == 115){
				this.character = 'ben';
			}else if(this.selector.x == 185){
				this.character = 'gav';
			}else if(this.selector.x == 255){
				this.character = 'tindal';
			}else if(this.selector.x == 325){
				this.character = 'marcus';
			}else{
				this.character = 'mog';
			}
		}else{
			if(this.selector.x == 45){
				this.character = 'rachel';
			}else if(this.selector.x == 115){
				this.character = 'shaun';
			}else if(this.selector.x == 185){
				this.character = 'vice';
			}else if(this.selector.x == 255){
				this.character = 'tom';
			}else if(this.selector.x == 325){
				this.character = 'cov';
			}else{
				this.randomCharacter();
			}
		}
	},
	
	touchSelect: function(){
		if(this.input.pointer1.y >= 121 && this.input.pointer1.y <= 181){
			if(this.input.pointer1.x >= 45 && this.input.pointer1.x <= 105){
				this.character = 'beard';
			}else if(this.input.pointer1.x >= 115 && this.input.pointer1.x <= 175){
				this.character = 'ben';
			}else if(this.input.pointer1.x >= 185 && this.input.pointer1.x <= 245){
				this.character = 'gav';
			}else if(this.input.pointer1.x >= 255 && this.input.pointer1.x <= 315){
				this.character = 'tindal';
			}else if(this.input.pointer1.x >= 325 && this.input.pointer1.x <= 385){
				this.character = 'marcus';
			}else if(this.input.pointer1.x >= 395 && this.input.pointer1.x <= 455){
				this.character = 'mog';
			}
		}else if(this.input.pointer1.y >= 191 && this.input.pointer1.y <= 251){
			if(this.input.pointer1.x == 45 && this.input.pointer1.x <= 105){
				this.character = 'rachel';
			}else if(this.input.pointer1.x >= 115 && this.input.pointer1.x <= 175){
				this.character = 'shaun';
			}else if(this.input.pointer1.x >= 185 && this.input.pointer1.x <= 245){
				this.character = 'vice';
			}else if(this.input.pointer1.x >= 255 && this.input.pointer1.x <= 315){
				this.character = 'tom';
			}else if(this.input.pointer1.x >= 325 && this.input.pointer1.x <= 385){
				this.character = 'cov';
			}else if(this.input.pointer1.x >= 395 && this.input.pointer1.x <= 455){
				this.randomCharacter();
			}
		}
	},
	
	randomCharacter: function(){
		this.random = (this.game.rnd.integerInRange(0, 110) / 10);
		
		if(this.random < 1){		
			this.character = 'beard';
			
		}else if(this.random < 2){		
			this.character = 'ben';
			
		}else if(this.random < 3){
			this.character = 'gav';
			
		}else if(this.random < 4){
			this.character = 'tindal';
			
		}else if(this.random < 5){
			this.character = 'rachel';
			
		}else if(this.random < 6){
			this.character = 'shaun';
			
		}else if(this.random < 7){
			this.character = 'vice';
			
		}else if(this.random < 8){
			this.character = 'marcus';
			
		}else if(this.random < 9){
			this.character = 'mog';
			
		}else if(this.random < 10){
			this.character = 'tom';
		
		}else{
			this.character = 'cov';
		
		}
	}
};