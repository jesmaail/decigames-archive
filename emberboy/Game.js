// Created By Joseph Shihab Esmaail
Scene.Game = function(game) { };
Scene.Game.prototype = {	

	create: function() {
		this.worldLength = 0;
		this.walkSpeed = 150;
		this.umbrellaTimer = 0;
		this.enemyTimer = 0;
		this.checkpoint = 3;
		this.lives = 3;
		this.floor = 200;
		this.startHealth = 9;
		this.barrelCount = 0;	
		this.cityLength = 0;
		this.movement = true;
		this.endTimer = 0;
		this.deathTimer = 0;
		this.dead = false;
		this.victoryTimer = 0;
		this.victorious = false;
	
		//Game Background
		this.backgrounds = this.game.add.group();
		this.deadBack = this.add.sprite(0, 0, 'dead');
		this.deadBack.fixedToCamera = true;
		this.deadBack.alpha = 0;
		this.winBack = this.add.sprite(0, 0, 'win');
		this.winBack.fixedToCamera = true;
		this.winBack.alpha = 0;
		this.spawnWorld();
		this.game.world.setBounds(0, 0, this.worldLength, 300);
		
		
		this.game.physics.startSystem(Phaser.Physics.ARCADE);		
		this.game.time.advancedTiming = true;

		//Sprite-Groups
		this.buildings = this.game.add.group();
		this.puddles = this.game.add.group();
		this.canopys = this.game.add.group();
		this.rainDrops = this.game.add.group();
		this.umbrellas = this.game.add.group();
		this.winds = this.game.add.group();
		this.barrels = this.game.add.group();
		this.hearts = this.game.add.group();
		this.enemies = this.game.add.group();
		
		//Populate Game
		this.spawnBuildings();
		this.spawnPuddles();		
		
		//Player Sprite
		this.player = this.game.add.sprite(3, this.floor, 'player');
		this.player.animations.add('still', [0, 1, 2]);		
		this.player.animations.add('walkR', [3, 4 ,5]);
		this.player.animations.add('walkL', [6, 7 ,8]);
		this.player.animations.add('jumpR', [9]);
		this.player.animations.add('jumpL', [10]);
		this.player.animations.add('stillDam', [11]);
		this.player.animations.add('walkRDam', [12, 13, 14]);
		this.player.animations.add('walkLDam', [15, 16, 17]);
		this.player.animations.add('jumpRDam', [18]);
		this.player.animations.add('jumpLDam', [19]);	
		this.player.animations.add('death', [20, 21, 22, 23]);
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds = true;
		this.player.body.immovable = true;
		this.player.body.gravity.y = 375;
		this.player.health = this.startHealth;
		this.player.scale.x = 1.5;
		this.player.scale.y = 1.5;
		
		//Water-Girl Sprite
		this.water = this.game.add.sprite(20, this.floor + 5, 'waterGirl');
		this.game.physics.enable(this.water, Phaser.Physics.ARCADE);
		this.water.animations.add('still', [0]);
		this.water.animations.add('lake', [1]);
		this.water.scale.x = 1.5;
		this.water.scale.y = 1.5;
		this.water.animations.play('still', 5);
		
		//End-Goal Logs Sprite
		this.logs = this.game.add.sprite(this.worldLength - 224, this.floor, 'logs');
		this.logs.animations.add('still', [0]);
		this.logs.animations.add('end', [1, 2, 3]);
		this.game.physics.enable(this.logs, Phaser.Physics.ARCADE);
		this.logs.body.immovable = true;
		this.logs.scale.x = 1.5;
		this.logs.scale.y = 1.5;
		this.logs.animations.play('still', 1);
		
		//Screen Displays
		this.game.camera.follow(this.player);
		this.livesText = this.game.add.text(570, 20, "Lives: " + this.lives , {font: "15px Arial", fill: '#fff' });
		this.livesText.fixedToCamera = true;
		this.gameOverTxt = this.game.add.text(165, 125, "", {font: "50px Arial", fill: '#ff0000' });
		this.gameOverTxt.fixedToCamera = true;
		this.gameOverTxt.alpha = 0;
		
		//Game Input
		this.game.input.addPointer();
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;

		//Audio
		this.music = this.game.add.audio('theme');
		this.music.loop = true;
		this.music.play();
		this.rain_sound = this.game.add.audio('rain');
		this.rain_sound.loop = true;
		this.rain_sound.play();
		
		this.jump_sound = this.game.add.audio('jump_sound');
		this.extinguish = this.game.add.audio('extinguish');
		//this.light = this.game.add.audio('light');
		this.die = this.game.add.audio('die');
		this.winMusic = this.game.add.audio('gameWin');
		
		this.spawnEnemies();
	},	
	
	update: function(){	
		this.player.body.velocity.x = 0;
		this.displayHealth();
		this.keyboardControls();		
		//this.touchControls();
		this.playerAnimations();
		this.collisionDetection();
		this.setPlayerFloor();		
		this.waterGirlHandler();
		this.endingHandler();
		
		//console.log("Rain: " + this.rainDrops.countLiving() + " | Umbrellas: " +this.umbrellas.countLiving() + " | Enemies: " + this.enemies.countLiving() + " | Death timer: " + this.deathTimer);
		
		if(this.player.body.x < this.cityLength){
			for(var i=0; i<10; i++){
				this.rain();
			}
			
			if(this.umbrellaTimer < this.game.time.now){
				this.umbrellaTimer = this.game.time.now + 3000;			
				this.spawnUmbrellas();			
			}
			if(this.enemyTimer < this.game.time.now){
				this.enemyTimer = this.game.time.now + 3000;
				this.spawnEnemies();
			}
		}else{
			this.umbrellas.forEachAlive(this.umbrellaHandler, this);
			this.rain_sound.stop();
		}
	},
	
	spawnWorld: function(){		
		this.max = 3;
		for(var i=0; i<=this.max; i++){			
			if(i < this.max){
				this.background = this.backgrounds.create(this.worldLength, 0, 'background');
				this.cityLength += 1782;
				this.worldLength += 1782;
			}else{
				this.background = this.backgrounds.create(this.worldLength, 0, 'backgroundEnd');
				this.worldLength += 1782;
			}	
		}
		
	},
	
	displayHealth: function(){
		this.hearts.removeAll();
		this.x = 20;
		this.y = 20;
		for(var i=1; i<this.player.health; i++){
			this.heart = this.hearts.create(this.x, this.y, 'heart');
			this.heart.fixedToCamera = true;
			this.x += 10;
		}
	},
	
	keyboardControls: function(){
		if(this.movement){
			if(this.cursors.left.isDown){
				this.player.body.velocity.x = -this.walkSpeed;
			}else if(this.cursors.right.isDown){			
				this.player.body.velocity.x = this.walkSpeed;
			}		
			if(this.cursors.up.isDown && this.player.body.y > this.floor){
				this.player.body.velocity.y = -200;
				this.jump_sound.play();
			}
			
			if(this.game.input.activePointer.isDown){
				this.touchControls();
				this.jump_sound.play();
			}
			this.gamepadControls();
		}
	},
	
	touchControls: function(){
		this.player.body.velocity.x = 0;
		
		this.touchBound = 320;
		this.touchBound.fixedToCamera = true;
		if((this.input.pointer1.y < this.player.y) && (this.player.body.y > this.floor)){
			this.player.body.velocity.y = -200;
		}
		if(this.input.pointer1.x < this.touchBound){
			this.player.body.velocity.x = -this.walkSpeed;
		}else if(this.input.pointer1.x > this.touchBound){
			this.player.body.velocity.x = this.walkSpeed;
		}
	},
	
	gamepadControls: function(){	
		if(this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
			this.player.body.velocity.x = -this.walkSpeed;
		}else if(this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){
			this.player.body.velocity.x = this.walkSpeed;
		}		
		
		if(this.pad1.isDown(Phaser.Gamepad.XBOX360_A) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1){
			if(this.player.body.y > this.floor){
				this.player.body.velocity.y = -200;
				this.jump_sound.play();
			}
		}
	},
	
	setPlayerFloor: function(){
		if(this.player.body.y > this.floor ){
			this.player.body.y = this.floor;
		}
	},
	
	collisionDetection: function(){
		if(this.game.state.states['Preloader'].collide){
			this.game.physics.arcade.collide(this.rainDrops, this.player, this.playerCollision, null, this);
			this.game.physics.arcade.overlap(this.enemies, this.player, this.enemyCollision, null, this);
			this.game.physics.arcade.overlap(this.puddles, this.player, this.puddleCollision, null, this);
		}
		
		this.game.physics.arcade.collide(this.rainDrops, this.canopys, this.shelterCollision, null, this);
		this.game.physics.arcade.collide(this.rainDrops, this.umbrellas, this.shelterCollision, null, this);			
		this.game.physics.arcade.overlap(this.barrels, this.player, this.barrelCollision, null, this);
		this.game.physics.arcade.overlap(this.player, this.logs, this.endPointCollision, null, this);
	},
	
	playerAnimations: function(){
		if(this.player.health > 5){
			//Still
			if(this.player.body.velocity.x == 0){
				//Jump
				if(this.player.body.y < this.floor){
					this.player.animations.play('jumpR', 5);
				}else{	//onFloor
					this.player.animations.play('still', 5);
				}
			//Right
			}else if(this.player.body.velocity.x > 0){
				//Jump
				if(this.player.body.y < this.floor){
					this.player.animations.play('jumpR', 5);
				}else{	//onFloor
					this.player.animations.play('walkR', 5);
				}
			//Left
			}else if(this.player.body.velocity.x < 0){
				//Jump
				if(this.player.body.y < this.floor){
					this.player.animations.play('jumpL', 5);
				}else{	//onFloor
					this.player.animations.play('walkL', 5);
				}
			}
		}else{
			//Still
			if(this.player.body.velocity.x == 0){
				//Jump
				if(this.player.body.y < this.floor){
					this.player.animations.play('jumpRDam', 5);
				}else{	//onFloor
					this.player.animations.play('stillDam', 5);
				}
			//Right
			}else if(this.player.body.velocity.x > 0){
				//Jump
				if(this.player.body.y < this.floor){
					this.player.animations.play('jumpRDam', 5);
				}else{	//onFloor
					this.player.animations.play('walkRDam', 5);
				}
			//Left
			}else if(this.player.body.velocity.x < 0){
				//Jump
				if(this.player.body.y < this.floor){
					this.player.animations.play('jumpLDam', 5);
				}else{	//onFloor
					this.player.animations.play('walkLDam', 5);
				}
			}
		}
		
	},
	
	waterGirlHandler: function(){
		if(this.water.body.x <= this.cityLength + 50){
			this.water.body.velocity.x = 200;
		}else{
			this.water.body.velocity.x = 0;
		}
		
		if(this.water.body.x > this.cityLength){
			if(this.player.body.x > this.cityLength + 25){				
				if(this.water.body.x < this.worldLength - 80){
					this.water.body.velocity.x = 160;
				}else{
					this.water.body.velocity.x = 0;
					this.water.animations.play('lake', 5);
				}
				
				if(this.player.body.x > this.worldLength - 300){
					this.endTimer += 1;
					if(this.endTimer < 50){
						this.player.body.x - 0;
						this.movement = false;
					}else{
						this.movement = true;
					}
				}
			}
		}
	},
	
	rain: function(){
		this.min = this.player.body.x - 600;
		this.max = (this.player.body.x + this.player.body.width) + 600;
		
		this.ranX = this.game.rnd.integerInRange(this.min, this.max);	
		
		this.rainDrop = this.rainDrops.create(this.ranX, 0, 'rain');
		this.game.physics.enable(this.rainDrop, Phaser.Physics.ARCADE);
		this.rainDrop.body.velocity.y = 400;
		this.rainDrop.body.velocity.x = 100;
		this.rainDrop.checkWorldBounds = true;
		this.rainDrop.outOfBoundsKill = true;
	},
	
	spawnPuddles: function(){
		this.mapLimit = 1735;
		this.minGap = 100;
		this.maxGap = 300;
		
		this.currentSpawnLocation = 50;
		
		while(this.currentSpawnLocation < this.cityLength){
			this.xCoord = this.game.rnd.integerInRange(this.currentSpawnLocation, (this.currentSpawnLocation + this.maxGap));
			this.gapLength = this.game.rnd.integerInRange(this.minGap, this.maxGap);
			
			this.puddle = this.puddles.create(this.xCoord, this.floor + 35, 'puddle');
			this.game.physics.enable(this.puddle, Phaser.Physics.ARCADE);
			this.puddle.body.immovable = true;
			
			this.currentSpawnLocation = (this.xCoord + this.gapLength);
		}
	},
	
	spawnEnemies: function(){
		this.chance = 25;
		
		if(this.game.rnd.integerInRange(0, 100) < this.chance){
			this.enemy = this.enemies.create(this.player.body.x + 610, this.floor + 24, 'enemy');
			this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
			this.enemy.outOfBoundsKill = true;
			this.enemy.body.immovable = true;
			this.enemy.body.velocity.x = -50;
			this.enemy.scale.x = 1.5;
			this.enemy.scale.y = 1.5;
			this.enemy.animations.add('move', [0, 1, 2]);
			this.enemy.animations.add('death', [3, 4, 5, 6]);
			this.enemy.animations.play('move', 5, true);
		}
		this.enemies.forEachAlive(this.enemyHandler, this);
	},
	
	enemyHandler: function(object){
		if(object.body.x < this.player.body.x - 600){
			object.kill();
		}
	},
	
	spawnBarrel: function(x){
		this.barrel = this.barrels.create(x, this.floor - 5, 'barrel');
		this.barrel.animations.add('still', [0]);
		this.barrel.animations.add('active', [1, 2, 3]);
		this.barrel.animations.play('still', 1);
		
		this.game.physics.enable(this.barrel, Phaser.Physics.ARCADE);
		this.barrel.body.immovable = true;
		this.barrel.scale.x = 1.5;
		this.barrel.scale.y = 1.5;
	},
	
	spawnBuildings: function(){		
		//this.mapLimit = 1735;
		this.maxGap = 75;
		this.minGap = 15;
		this.buildingLength = 245;		
		this.currentSpawnLocation = -13;		
		
		this.randomBuilding(-36);
		this.spawnCanopy(0);
		this.currentSpawnLocation += (this.buildingLength + this.minGap);
				
		while(this.currentSpawnLocation < this.cityLength - 245){
			this.xCoord = this.game.rnd.integerInRange(this.currentSpawnLocation, (this.currentSpawnLocation + this.maxGap));
			this.gapLength = this.game.rnd.integerInRange(this.minGap, this.maxGap);			
			this.randomBuilding(this.xCoord);			
			this.currentSpawnLocation = this.xCoord + (this.buildingLength + this.gapLength);
		}
	},
	
	randomBuilding: function(x){
		this.colourPick = this.game.rnd.integerInRange(0, 150);
		this.name = 'buildingA';
		this.chance = 50;
		
		if(this.colourPick < 50){
			this.name = 'buildingB';
		}else if(this.colourPick < 100){
			this.name = 'buildingC'
		}
		
		this.building = this.buildings.create(x, 10, this.name);
		
		if(this.game.rnd.integerInRange(0, 100) < this.chance){
			this.spawnCanopy(x + 35);
		}
	},
	
	spawnCanopy: function(x){
		this.name = 'canopy';
		//this.chance = 25;
		
		this.canopy = this.canopys.create(x, 90, this.name);
		this.game.physics.enable(this.canopy, Phaser.Physics.ARCADE);
		this.canopy.body.immovable = true;
		
		this.barrelCount += 1;
		if(this.barrelCount == 2){
			this.spawnBarrel(x + 50);
			this.barrelCount = 0;
		}
	},
	
	spawnUmbrellas: function(){		
		if(this.umbrellas.countLiving() >= 4){
			this.umbrellas.forEachAlive(this.umbrellaHandler, this);
			this.winds.forEachAlive(this.umbrellaHandler, this);
		}
	
		if(this.umbrellas.countLiving() < 4){		
			if(this.player.body.x < 600){
				this.spawnUmbrella(-5);
			}else{
				this.spawnUmbrella(this.player.body.x - 400);
			}
		}
	},
	
	spawnUmbrella: function(x){
		this.speed = this.game.rnd.integerInRange(95, 120);
	
		this.umbrella = this.umbrellas.create(x, 40, 'umbrella');
		this.game.physics.enable(this.umbrella, Phaser.Physics.ARCADE);
		this.umbrella.body.immovable = true;
		this.umbrella.body.velocity.x = this.speed;
		this.umbrella.checkWorldBounds = true;
		this.umbrella.scale.x = 1.5;
		this.umbrella.scale.y = 1.5;
		
		
		this.wind = this.winds.create(x - 38, 40, 'wind');
		this.game.physics.enable(this.wind, Phaser.Physics.ARCADE);
		this.wind.body.velocity.x = this.speed;
		this.wind.checkWorldBounds = true;
		this.wind.scale.x = 1.5;
		this.wind.scale.y = 1.5;
		this.wind.animations.add('blow', [0, 1, 2]);
		this.wind.animations.play('blow', 5, true);
	},
	
	umbrellaHandler: function(object){
		if(object.body.x > this.player.body.x + 800){
			object.kill();
		}
		if(object.body.x > this.cityLength){
			object.body.velocity.y = -200;
			
		}
		if(object.body.y + object.body.height < -5){
			object.kill();
		}
	},
	
	respawn: function(){
		this.die.play();
	
		if(this.lives > 0){
			this.player.health = this.startHealth;
			this.lives -=1;
			this.livesText.setText("Lives: " + this.lives);
			this.player.body.x = this.checkpoint;
			this.player.body.y = 245;
		}else{
			this.music.stop();
			this.player.kill();
			this.deathTimer = this.game.time.now + 3000;
			this.gameOver();
		}
	},
	
	shelterCollision: function(obj1, obj2){
		obj1.kill();
	},
	
	playerCollision: function(obj1, obj2){
		obj2.kill();
		
		if(obj1.health > 1){
			obj1.damage(0.5);
		}else if(obj1.health <= 1){
			this.respawn();
		}		
	},
	
	puddleCollision: function(obj1, obj2){
		if(obj1.health > 1){
			obj1.damage(0.08);
		}else if(obj1.health <= 1){
				this.respawn();
		}	
	},
	
	barrelCollision: function(obj1, obj2){
		obj2.animations.play('active', 5, true);
		obj1.health = 9;
		this.checkpoint = obj2.body.x;
		//this.light.play();
	},
	
	enemyCollision: function(obj1, obj2){
			obj2.animations.play('death', 15, false, true);
			this.respawn();
			
			//do also for player sprite.
			//obj2.events.onAnimationComplete.add(function(){
				//obj2.kill();
			//	this.respawn();
			//}, this);
	},
	
	endPointCollision: function(obj1, obj2){
		obj1.kill();
		obj2.animations.play('end', 5, true);
		this.endSequence();
		this.music.stop();
		this.winMusic.play();
	},
	
	endingHandler: function(){
		if(this.dead){
			if(this.deathTimer < this.game.time.now){
				this.game.state.start('Death');
				this.music.stop()
				this.rain_sound.stop();
			}	
		}
		if(this.victorious){
			if(this.victoryTimer < this.game.time.now){
				this.game.state.start('Death');
				this.music.stop()
				this.rain_sound.stop();
			}
		}
	},
	
	gameOver: function(){
		this.deadBack.bringToTop();
		this.game.add.tween(this.deadBack).to({alpha:1}, 3000, Phaser.Easing.Linear.None, true);
		this.movement = false;
		this.dead = true;
	},
	
	endSequence: function(){
		this.victorious = true;
		this.winBack.bringToTop();
		this.game.add.tween(this.winBack).to({alpha:1}, 3000, Phaser.Easing.Linear.None, true);
		//this.gameOverTxt.setText("You Win!");
		this.victoryTimer = this.game.time.now + 4000;
	}
	
};