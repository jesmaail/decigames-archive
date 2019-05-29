Scene.Preloader = function (game) {
	this.background = null; // define background
	this.preloadBar = null; // define loader bar
};

Scene.Preloader.prototype = {
	preload: function () {	
		this.imgPath = 'games/ale/assets/';
		
		this.load.image('loading', this.imgPath + 'loading.png');		
		this.loading = this.game.add.sprite(0, 0, 'loading');
		this.load.image('splash', this.imgPath + 'splash.png');
		this.load.image('splash2', this.imgPath + 'splash2.png');
		this.load.image('dead', this.imgPath + 'deadBack.png');
		this.load.image('mountain', this.imgPath + 'mountain.png');
		this.load.image('stirring', this.imgPath + 'stirring.png');
		this.load.image('waking', this.imgPath + 'waking.png');
		
		this.load.spritesheet('player', this.imgPath + 'player.png', 21, 47, 10);
		this.load.spritesheet('enemy', this.imgPath + 'aleyen.png', 33, 102, 10);
		this.load.spritesheet('keg', this.imgPath + 'kegAnim.png', 26, 66, 5);
		this.load.spritesheet('weapon', this.imgPath + 'weapon.png', 29, 6, 2);
		this.load.spritesheet('bullet', this.imgPath + 'bullet.png', 6, 6, 2);
		this.load.spritesheet('enemyGun', this.imgPath + 'aleyenGun.png', 30, 12, 2);
		
		//this.load.image('weapon', 'ale/assets/weapon.png');		
		this.load.image('clip', this.imgPath + 'ammo.png');
		this.load.image('reload', this.imgPath + 'reload.png');
		this.load.image('heart', this.imgPath + 'ale.png');
		this.load.image('life', this.imgPath + 'keg.png');

		this.load.image('back', this.imgPath + 'background.png');
		this.load.image('equip1', this.imgPath + 'equipment1.png');
		this.load.image('equip2', this.imgPath + 'equipment2.png');
		this.load.image('equip3', this.imgPath + 'kegs.png');

		this.load.spritesheet('healthbar', this.imgPath + 'healthbar.png', 102, 9, 11);
		// this.load.image('bar', 'ale/assets/bar.png');
		// this.load.image('health', 'ale/assets/health.png');
		
		//30, 12
		//this.load.image('enemyGun', 'ale/assets/aleyenGun.png');
		this.load.image('laser', this.imgPath + 'laser.png');

		this.load.spritesheet('arrow', this.imgPath + 'arrow.png', 31, 23, 2);

		this.content = "--- GENERAL'S REPORT: ---\n\nTHIS PARTICULAR SPECIMEN\nSEEMS PERSISTENT IN HIS\nEFFORTS TO PREVENT US\nFROM EXTRACTING THE\nHARVESTED STONKONIUM FROM\nTHIS PLANET.\n\nAND NOT ONLY DOES HE HAVE\nTHE AUDACITY TO USE OUR\nLIFEBLOOD AS A MEANS\nFOR INEBRIATION, BUT HIS\nKIND ALSO REFER TO\nTHE PRECIOUS ELEMENT AS...\nALE? MONGRELS!\n\nTHIS BLATANT MOCKERY OF\nTHE ALE-YEN RACE, OUR\nGLORIOUS RACE, DEMANDS\nTHESE INTERLOPERS PAY WITH\nTHEIR BLOOD.\n\nALL VICE-CLASS SHIPS ARE\nORDERED TO MAKE A DIRECT\nSLIPSPACE JUMP TO JOIN THE\nFRONTLINES, AT THE\nSTONKONIUM REFINERIES\nWITHIN THE VALLEYS.\n\nI WILL FACE THIS\n'MIGHTY DRAGON' MYSELF!";
	},

	create: function () {
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;

		this.loading.alpha = 0;
		this.background = this.game.add.sprite(0, 0, 'splash');
		this.background2 = this.game.add.sprite(0, 0, 'splash2');
		this.background2.alpha = 0;

		this.arrow = this.game.add.sprite(300, 210, 'arrow');
		this.arrow.alpha = 0;
		this.arrow.animations.add('flash',[0, 1]);
		this.arrow.animations.play('flash', 2, true);

		this.scrollTime = 25000;

		this.text = this.game.add.text(300, 300, this.content, {font: "18px Lucida Console", fill: '#00FF00'});

		this.game.add.tween(this.text).to({x: 300, y: -520}, this.scrollTime).start();
		this.timer = this.game.time.now + this.scrollTime;


		//this.startMusic = this.game.add.audio('menu');
		//this.startMusic.loop = true;
		//this.startMusic.play();		
	},
	
	update: function(){			
		if(this.timer < this.game.time.now){
			this.game.add.tween(this.background).to({alpha:0}, 1000, Phaser.Easing.Linear.None, true);
			this.game.add.tween(this.background2).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true);
			//this.game.add.tween(this.arrow).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true);
			if(this.cursors.up.isDown){
		 		this.game.state.start('Game');
		 	}

		 	// if(this.arrow.y == 210){
		 	// 	if(this.cursors.down.isDown){
		 	// 		this.arrow.y = 262;
		 	// 	}else if(this.cursors.right.isDown){
		 	// 		this.game.state.start('Game');
		 	// 	}
		 	// }else if(this.arrow.y == 262){
		 	// 	if(this.cursors.up.isDown){
		 	// 		this.arrow.y = 210;
		 	// 	}else if(this.cursors.right.isDown){
		 	// 		//this.game.state.start('Game2');
		 	// 	}
		 	// }
		
		}else{
			if(this.cursors.up.isDown){
				this.timer = this.game.time.now + 50;
				this.text.alpha = 0;
			}
		}
		
		//this.game.state.start('Game');

	}
};