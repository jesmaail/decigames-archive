// Created By Joseph Shihab Esmaail
Scene.Game = function(game) { };
Scene.Game.prototype = {	

	create: function() {
		this.game.stage.backgroundColor = '#C0C0C0';
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.world.setBounds(0, 0, 500, 300);
		this.game.input.addPointer();
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;
		
		this.blackBack = this.add.sprite(0, 0, 'black');
		this.blackBack.alpha = 0;
		
		this.music = this.game.add.audio('theme');
		this.music.loop = true;
		this.music.play();		
		this.bounce_sound = this.game.add.audio('bounce_sound');
		
		this.sprite = this.game.state.states['Preloader'].character;
		
		this.startTime = 0;		
		this.walkSpeed = 150;
		this.movement = true;
		this.faceRight = true;
		this.floor = 294;
		this.sizeLimit = 0.05;
		this.wave = 1;
		this.waveInterval = 10000;
		this.spawnInterval = 5000;
		this.startTime = this.game.time.now + this.waveInterval;
		this.breakTime = 0;
		this.intermission = false;
			
		this.spawnTimer = 0;
		this.deathTimer = 0;
		this.dead = false;
		
		this.balls = this.game.add.group();
		this.walls = this.game.add.group();	
		this.hearts = this.game.add.group();		
		
		this.spawnPlayer();		
		this.spawnWorld();		
		this.ballHandler();
		
		this.waveTxt = this.game.add.text(420, 20, "Wave: " + this.wave , {font: "15px Arial", fill: '#000' });
		this.completeTxt = this.game.add.text(175, 100, "", {font: "20px Arial", fill: '#000' });
		this.healthTxt = this.game.add.text(20, 20, "", {font: "15px Arial", fill: '#000' });
	},	
	
	update: function(){	
		this.keyboardControls();
		this.setPlayerFloor();
		this.displayHealth();
		this.collisionDetection();
		this.waveTxt.setText("Wave: " + this.wave);
		
		if(!this.intermission){
			this.intermission = false;
			this.completeTxt.setText("");			
			this.ballHandler();
			
			if(this.startTime < this.game.time.now){
				this.intermission = true;
				this.breakTime = this.game.time.now + 3000;
			}
			
		}else{
			//this.completeTxt.setText("Wave Complete!");			
			if(this.breakTime < this.game.time.now){
				this.intermission = false;
				this.startTime = this.game.time.now + this.waveInterval;
				this.spawnInterval -= 200;
				this.wave += 1;
				this.waveInterval += 5000;
			}
		}

		if(this.dead){
			this.endHandler();
		}
		
		//console.log(this.spawnInterval);
	},
	
	spawnPlayer: function(){
		this.player = this.game.add.sprite(200, 296, this.sprite);
		this.player.anchor.setTo(0, 1);
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds = true;
		this.player.body.fixedRotation = true;
		this.player.body.gravity.y = 375;
		this.player.health = 4;
	},
	
	spawnWorld: function(){	
		this.leftWall = this.walls.create(0, 0, 'wall');
		this.game.physics.enable(this.leftWall, Phaser.Physics.ARCADE);	
		this.leftWall.body.immovable = true;
		
		this.rightWall = this.walls.create(496, 0, 'wall');
		this.game.physics.enable(this.rightWall, Phaser.Physics.ARCADE);	
		this.rightWall.body.immovable = true;
		
		this.floor = this.game.add.sprite(4, 296, 'floor');
		this.game.physics.enable(this.floor, Phaser.Physics.ARCADE);	
		this.floor.body.immovable = true;
	},
	
	displayHealth: function(){
		this.hearts.removeAll();
		this.x = 20;
		this.y = 20;
		for(var i=1; i<this.player.health; i++){
			this.heart = this.hearts.create(this.x, this.y, 'heart');
			this.heart.fixedToCamera = true;
			this.x += 16;
		}
	},
	
	keyboardControls: function(){
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		if(this.movement){
			if(this.cursors.left.isDown){
				this.player.body.velocity.x = -this.walkSpeed;
				if(this.faceRight){
					this.player.scale.x *= -1;
					this.player.anchor.setTo(1, 1);
					this.faceRight = false;
				}
				
			}else if(this.cursors.right.isDown){			
				this.player.body.velocity.x = this.walkSpeed;
				if(!this.faceRight){
					this.player.scale.x *= -1;
					this.player.anchor.setTo(0, 1);
					this.faceRight = true;
				}
			}		
			if(this.cursors.up.isDown && this.player.body.y >= this.floor){
				//this.player.body.velocity.y = -200;
			}
			
			if(this.game.input.activePointer.isDown){
				this.touchControls();
			}
			this.gamepadControls();
		}
	},
	
	touchControls: function(){
		this.player.body.velocity.x = 0;
		
		this.touchBound = 320; //Half screen
		if((this.input.pointer1.y < this.player.y) && (this.player.body.y > this.floor)){
			//this.player.body.velocity.y = -200;
		}
		if(this.input.pointer1.x < this.touchBound){
			this.player.body.velocity.x = -this.walkSpeed;
			if(this.faceRight){
				this.player.scale.x *= -1;
				this.player.anchor.setTo(1, 1);
				this.faceRight = false;
			}
		}else if(this.input.pointer1.x > this.touchBound){
			this.player.body.velocity.x = this.walkSpeed;
			if(!this.faceRight){
				this.player.scale.x *= -1;
				this.player.anchor.setTo(0, 1);
				this.faceRight = true;
			}
		}
	},
	
	gamepadControls: function(){	
		if(this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){		
			this.player.body.velocity.x = -this.walkSpeed;
			if(this.faceRight){
				this.player.scale.x *= -1;
				this.player.anchor.setTo(1, 1);
				this.faceRight = false;
			}
			
		}else if(this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){		
			this.player.body.velocity.x = this.walkSpeed;
			if(!this.faceRight){
				this.player.scale.x *= -1;
				this.player.anchor.setTo(0, 1);
				this.faceRight = true;
			}
			
		}		
	},
	
	setPlayerFloor: function(){
		if(this.player.body.y > this.floor ){
			this.player.body.y = this.floor;
		}
	},
	
	collisionDetection: function(){
		this.game.physics.arcade.collide(this.player, this.balls, this.playerCollision, null, this);
	
		this.game.physics.arcade.collide(this.balls, this.floor, this.floorCollision, null, this);
		this.game.physics.arcade.collide(this.player, this.floor);
		//this.game.physics.arcade.collide(this.player, this.wall);
		this.game.physics.arcade.collide(this.balls, this.balls, this.ballToBallCollision, null, this);
		this.game.physics.arcade.collide(this.balls, this.walls, this.wallCollision, null, this);
	},
	
	playerAnimations: function(){
		
	},
	
	spawnBall: function(x, y, size, velocityX, velocityY){
		this.colour = 'blue'
		if(size >= this.sizeLimit){
			this.ranColour = (this.game.rnd.integerInRange(0, 300) / 10);
			
			if(this.ranColour < 10){
				this.colour = 'blue';
			}else if (this.ranColour < 20){
				this.colour = 'yellow';
			}else{
				this.colour = 'red';
			}
			
			this.ball = this.balls.create(x, y, this.colour);
			this.ball.anchor.setTo(0.5, 0);
			this.ball.scale.x = size;
			this.ball.scale.y = size;
			this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);			
			this.ball.body.collideWorldBounds = true;
			this.ball.body.bounce.set(0.8);
			this.ball.body.gravity.set(0, 180);;
			this.ball.body.velocity.x = velocityX;
			this.ball.body.velocity.y = velocityY;
		}
	},
	
	ballHandler: function(){
		this.randomX = (this.game.rnd.integerInRange(0, 5000) / 10);
	
		if(this.spawnTimer < this.game.time.now){
			this.spawnTimer = this.game.time.now + this.spawnInterval;
			if(this.wave  < 3){
				this.spawnBall(this.randomX, 0, 0.125, 0, 180);
			}			
			if(this.wave > 5){
				this.spawnBall(this.randomX, 0, 0.75, 0, 180);
			}		
			if(this.wave > 2){
				this.spawnBall(this.randomX, 0, 0.5, 0, 180);
			}
		}		
	},
	
	floorCollision: function(obj1, obj2){
		if(obj2.scale.x >= this.sizeLimit){
			this.spawnBall((obj2.body.x - (obj2.body.width / 2)), obj2.body.y, (obj2.scale.x / 2), (-100), -200);
			this.spawnBall(obj2.body.x + (obj2.body.width / 2), obj2.body.y, (obj2.scale.x / 2), (100), -200);
			obj2.kill();
			this.bounce_sound.play();
		}else{
			this.game.physics.arcade.collide(this.balls, this.floor);
		}
	},
	
	ballToBallCollision: function(obj1, obj2){
		this.bounce_sound.play();
	},
	
	wallCollision: function(obj1, obj2){
		this.bounce_sound.play();
	},
	
	playerCollision: function(obj1, obj2){
		obj2.kill();
		if(obj1.health > 1){
			obj1.damage(1);
		}else{
			this.music.stop();	
			obj1.kill();
			this.blackBack.bringToTop();
			this.game.add.tween(this.blackBack).to({alpha:1}, 3000, Phaser.Easing.Linear.None, true);
			this.dead = true;
			this.deathTimer = this.game.time.now + 3000;			
		}
	},
	
	endHandler: function(){
		if(this.deathTimer < this.game.time.now){
			this.game.state.start('Death');
		}
	}
	
};