// Created By Joseph Shihab Esmaail
//Started 16/08/14
Scene.Game = function(game) { };
Scene.Game.prototype = {	

	create: function() {
		this.floor = 220;
		this.gunTimer = 0;
		this.ammo = 30;
		this.reloading = false;
		this.enemySpawnCount = 1;
		this.playerLives = 3;
		this.score = 0;
		this.checkpoint = 10;
		this.startHealth = 4;
		this.equipmentMaxHealth = 100;
		this.crouching = false;
		this.facingRight = true;
		this.firing = false;
		this.deadObjectives = 0;

		//	-	Game background & World population -	-	-	-	-	-	-	-
		this.equipments = this.game.add.group();
		this.enemies = [];
		this.enemyIndex = 0;
		this.equipments = []
		this.spawnWorld();
		//	-	-	-	-	-	-	-	-	-	-	-	-	-

		//	-	Physics	-	-	-	-	-	-	-	-	-	-	
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		//	-	-	-	-	-	-	-	-	-	-	-	-	-


		//	-	Input	-	-	-	-	-	-	-	-	-	-
		this.game.input.addPointer();
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;
		//	-	-	-	-	-	-	-	-	-	-	-	-	-


		//	-	Groups	-	-	-	-	-	-	-	-	-	-	
		this.bullets = this.game.add.group();
		this.lasers = this.game.add.group();
		this.ammoBullets = this.game.add.group();
		this.hearts = this.game.add.group();
		this.lives = this.game.add.group();		
		//	-	-	-	-	-	-	-	-	-	-	-	-	-
		

		//	-	Audio	-	-	-	-	-	-	-	-	-	-	

		//	-	-	-	-	-	-	-	-	-	-	-	-	-
		

		//	-	Text	-	-	-	-	-	-	-	-	-	-	
		this.scoreTxt = this.game.add.text(550, 10, "" + this.score , {font: "25px Arial", fill: '#fff' });
		this.scoreTxt.fixedToCamera = true;
		//	-	-	-	-	-	-	-	-	-	-	-	-	-

		this.spawnPlayer();		
		this.game.camera.follow(this.player);
	},
	
	update: function(){
		this.scoreTxt.setText("" + this.score);
		this.player.body.velocity.x = 0;
		this.crouching = false;
		
		this.inputHandler();
		this.playerAnimations();
		this.setWeaponPos();
		this.displayAmmo();
		this.displayHealth();
		this.displayLives();
		this.enemyAI();
		this.collisionDetection();
		this.setPlayerFloor();

		this.enemiesAlive = 0;
		for (var i=0; i<this.enemies.length; i++){
			if(this.enemies[i].alive){
				this.enemiesAlive++;
			}
		}
		if(this.enemiesAlive == 0){
			this.spawnEnemies();
		}

		if(this.deadObjectives >= 3){
			this.player.kill();
			this.game.state.start('Death');
		}

		this.bullets.forEachAlive(this.bulletHandler, this);
		this.lasers.forEachAlive(this.bulletHandler, this);
	},

	//Creates backgrounds and equipment
	spawnWorld: function(){
		this.background = this.game.add.sprite(0, 0, 'back');
		this.game.world.setBounds(0, 0, 1200, 300);
		this.spawnEquipment();
	},

	//Creates Equipment objects
	spawnEquipment: function(){
		// for(var i=0; i<3; i++){
		// 	this.equipments.push(new Equipment(this, i, 'equip1', 100));
		// 	this.equipments.push(new Equipment(this, i, 'equip2', 500));
		// 	this.equipments.push(new Equipment(this, i, 'equip3', 900));
		// }

		this.spawnSilver();
		this.spawnBronze();
		this.spawnSteel();
	},

	spawnSilver: function(){
		this.silver = this.game.add.sprite(100, 290, 'equip1');
		this.silver.anchor.set(0, 1);
		game.physics.enable(this.silver, Phaser.Physics.ARCADE);
		this.silver.body.immovable = true;
		this.silver.health = this.equipmentMaxHealth;

		this.barX = this.silver.x + (this.silver.width /2) - 50;
		this.barY = (this.silver.y - this.silver.height)- 20;

		this.silverHBar = this.game.add.sprite(this.barX, this.barY, 'healthbar');
		this.silverHBar.animations.add('100', [0]);
		this.silverHBar.animations.add('90', [1]);
		this.silverHBar.animations.add('80', [2]);
		this.silverHBar.animations.add('70', [3]);
		this.silverHBar.animations.add('60', [4]);
		this.silverHBar.animations.add('50', [5]);
		this.silverHBar.animations.add('40', [6]);
		this.silverHBar.animations.add('30', [7]);
		this.silverHBar.animations.add('20', [8]);
		this.silverHBar.animations.add('10', [9]);
		this.silverHBar.animations.add('00', [10]);
		this.silverHBar.animations.play('100', 1, false);
	},

	silverHit: function(equipment, laser){
		laser.kill();
		this.silver.damage(1);

		if(this.silver.health > 90){
			this.silverHBar.animations.play('90', 1);

		}else if(this.silver.health > 80){
			this.silverHBar.animations.play('80', 1);

		}else if(this.silver.health > 70){
			this.silverHBar.animations.play('70', 1);

		}else if(this.silver.health > 60){
			this.silverHBar.animations.play('60', 1);

		}else if(this.silver.health > 50){
			this.silverHBar.animations.play('50', 1);

		}else if(this.silver.health > 40){
			this.silverHBar.animations.play('40', 1);

		}else if(this.silver.health > 30){
			this.silverHBar.animations.play('30', 1);

		}else if(this.silver.health > 20){
			this.silverHBar.animations.play('20', 1);

		}else if(this.silver.health > 10){
			this.silverHBar.animations.play('10', 1);

		}else if(this.silver.health > 0){
			this.silverHBar.animations.play('00', 1);

		}else if(this.silver.health <= 0){
			this.deadObjectives += 1;
		}
	},

	spawnBronze: function(){
		this.bronze = this.game.add.sprite(500, 290, 'equip2');
		this.bronze.anchor.set(0, 1);
		game.physics.enable(this.bronze, Phaser.Physics.ARCADE);
		this.bronze.body.immovable = true;
		this.bronze.health = this.equipmentMaxHealth;

		this.barX = this.bronze.x + (this.bronze.width /2) - 50;
		this.barY = (this.bronze.y - this.bronze.height)- 20;

		this.bronzeHBar = this.game.add.sprite(this.barX, this.barY, 'healthbar');
		this.bronzeHBar.animations.add('100', [0]);
		this.bronzeHBar.animations.add('90', [1]);
		this.bronzeHBar.animations.add('80', [2]);
		this.bronzeHBar.animations.add('70', [3]);
		this.bronzeHBar.animations.add('60', [4]);
		this.bronzeHBar.animations.add('50', [5]);
		this.bronzeHBar.animations.add('40', [6]);
		this.bronzeHBar.animations.add('30', [7]);
		this.bronzeHBar.animations.add('20', [8]);
		this.bronzeHBar.animations.add('10', [9]);
		this.bronzeHBar.animations.add('00', [10]);
		this.bronzeHBar.animations.play('100', 1, false);
	},

	bronzeHit: function(equipment, laser){
		laser.kill();
		this.bronze.damage(1);

		if(this.bronze.health > 90){
			this.bronzeHBar.animations.play('90', 1);

		}else if(this.bronze.health > 80){
			this.bronzeHBar.animations.play('80', 1);

		}else if(this.bronze.health > 70){
			this.bronzeHBar.animations.play('70', 1);

		}else if(this.bronze.health > 60){
			this.bronzeHBar.animations.play('60', 1);

		}else if(this.bronze.health > 50){
			this.bronzeHBar.animations.play('50', 1);

		}else if(this.bronze.health > 40){
			this.bronzeHBar.animations.play('40', 1);

		}else if(this.bronze.health > 30){
			this.bronzeHBar.animations.play('30', 1);

		}else if(this.bronze.health > 20){
			this.bronzeHBar.animations.play('20', 1);

		}else if(this.bronze.health > 10){
			this.bronzeHBar.animations.play('10', 1);

		}else if(this.bronze.health > 0){
			this.bronzeHBar.animations.play('00', 1);

		}else if(this.bronze.health <= 0){
			this.deadObjectives += 1;
		}
	},

	spawnSteel: function(){
		this.steel = this.game.add.sprite(900, 290, 'equip3');
		this.steel.anchor.set(0, 1);
		game.physics.enable(this.steel, Phaser.Physics.ARCADE);
		this.steel.body.immovable = true;
		this.steel.health = this.equipmentMaxHealth;

		this.barX = this.steel.x + (this.steel.width /2) - 50;
		this.barY = (this.steel.y - this.steel.height)- 20;

		this.steelHBar = this.game.add.sprite(this.barX, this.barY, 'healthbar');
		this.steelHBar.animations.add('100', [0]);
		this.steelHBar.animations.add('90', [1]);
		this.steelHBar.animations.add('80', [2]);
		this.steelHBar.animations.add('70', [3]);
		this.steelHBar.animations.add('60', [4]);
		this.steelHBar.animations.add('50', [5]);
		this.steelHBar.animations.add('40', [6]);
		this.steelHBar.animations.add('30', [7]);
		this.steelHBar.animations.add('20', [8]);
		this.steelHBar.animations.add('10', [9]);
		this.steelHBar.animations.add('00', [10]);
		this.steelHBar.animations.play('100', 1, false);
	},

	steelHit: function(equipment, laser){
		laser.kill();
		this.steel.damage(1);

		if(this.steel.health > 90){
			this.steelHBar.animations.play('90', 1);

		}else if(this.steel.health > 80){
			this.steelHBar.animations.play('80', 1);

		}else if(this.steel.health > 70){
			this.steelHBar.animations.play('70', 1);

		}else if(this.steel.health > 60){
			this.steelHBar.animations.play('60', 1);

		}else if(this.steel.health > 50){
			this.steelHBar.animations.play('50', 1);

		}else if(this.steel.health > 40){
			this.steelHBar.animations.play('40', 1);

		}else if(this.steel.health > 30){
			this.steelHBar.animations.play('30', 1);

		}else if(this.steel.health > 20){
			this.steelHBar.animations.play('20', 1);

		}else if(this.steel.health > 10){
			this.steelHBar.animations.play('10', 1);

		}else if(this.steel.health > 0){
			this.steelHBar.animations.play('00', 1);

		}else if(this.steel.health <= 0){
			this.deadObjectives += 1;
		}
	},

	//Handles spawning FibonacciNumber creation
	fibonacciSpawn: function(n){
		if(n==0){
			return 0;
		}else if(n==1){
			return 1;
		}else{
			return (this.fibonacciSpawn(n-1)) + (this.fibonacciSpawn(n-2));
		}
	},

	//Player spawning
	spawnPlayer: function(){
		this.player = this.game.add.sprite(this.checkpoint, 250, 'player');
		this.player.scale.x = 1.5;
		this.player.scale.y = 1.5;
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds = true;
		this.player.body.gravity.y = 375;
		this.player.health = this.startHealth;
		this.player.animations.add('still', [0]);
		this.player.animations.add('walk', [1, 2, 3]);
		this.player.animations.add('crouch', [4]);
		this.player.animations.add('crouchL', [5]);
		this.player.animations.add('walkL', [6, 7, 8]);
		this.player.animations.add('stillL', [9]);
		this.spawnWeapon();
	},

	//Spawns the Player-weapon
	spawnWeapon: function(){
		this.weapon = this.game.add.sprite(this.player.x + 1, this.player.y + 10, 'weapon');
		this.weapon.animations.add('right', [0]);
		this.weapon.animations.add('left', [1]);
		this.weapon.scale.x = 1.5;
		this.weapon.scale.y = 1.5;
	},

	//Keeps the weapon with the player on every update
	setWeaponPos:function(){
		if(this.facingRight){
			this.weapon.anchor.set(0, 0);
			this.weapon.animations.play('right', 1);
			this.weapon.x = this.player.x + 1;
			this.weapon.y = this.player.y + 38;

		}else{
			this.weapon.anchor.set(1, 0);
			this.weapon.animations.play('left', 1);
			this.weapon.x = this.player.x + 30;
			this.weapon.y = this.player.y + 38;
		}
	},

	//Keeps player at constant floor level
	setPlayerFloor: function(){
		if(this.crouching){
			this.player.body.y = this.floor + 18;
		}else{
			if(this.player.body.y > this.floor ){
				this.player.body.y = this.floor;
			}
		}
	},

	shoot: function(direction){
		this.fireAble = false;
		if(this.facingRight){
			if(direction == 'right'){
				this.weapon.rotation = 0;
				this.spawnX = (this.weapon.x) + 40;
				this.spawnY = (this.weapon.y) - 2;
				this.targetX = (this.spawnX) + 100;
				this.targetY = this.game.rnd.integerInRange(this.spawnY - 3, this.spawnY + 3);
				//this.targetY = (this.spawnY);			
				this.fireAble = true;

			}else if(direction == 'up'){
				this.weapon.rotation = 5.76;	//27, 15
				this.spawnX = (this.weapon.x) + 40;
				this.spawnY = (this.weapon.y) - 26;
				this.targetX = (this.spawnX) + 3;
				this.targetY = this.game.rnd.integerInRange((this.spawnY-1.73) - 0.25, (this.spawnY-1.73) + 0.25);
				//this.targetY = (this.spawnY) - 1.73;
				this.fireAble = true;

			}else if(direction == 'down'){
				this.weapon.rotation = 0.52;
				this.spawnX = (this.weapon.x) + 35;
				this.spawnY = (this.weapon.y) + 21;
				this.targetX = (this.spawnX) + 3;
				this.targetY = (this.spawnY) + 1.73;
				this.fireAble = true;

			}

		}else if(!this.facingRight){
			if(direction == 'left'){
				this.weapon.rotation = 0;
				this.spawnX = (this.weapon.x) - 45;
				this.spawnY = (this.weapon.y) - 2;
				this.targetX = (this.spawnX) - 100;
				this.targetY = this.game.rnd.integerInRange(this.spawnY - 3, this.spawnY + 3);
				//this.targetY = (this.spawnY);
				this.fireAble = true;			

			}else if(direction == 'up'){
				this.weapon.rotation = 0.52;	//5.76
				this.spawnX = (this.weapon.x) - 41;
				this.spawnY = (this.weapon.y) - 25;
				this.targetX = (this.spawnX) - 3;
				this.targetY = this.game.rnd.integerInRange((this.spawnY-1.73) - 0.25, (this.spawnY-1.73) + 0.25);
				this.targetY = (this.spawnY) - 1.73;
				this.fireAble = true;

			}else if(direction == 'down'){
				this.weapon.rotation = 5.76;
				this.spawnX = (this.weapon.x) - 35;
				this.spawnY = (this.weapon.y) + 21;
				this.targetX = (this.spawnX) - 3;
				this.targetY = (this.spawnY) + 1.73;
				this.fireAble = true;

			}
		}

		
		if(this.gunTimer < this.game.time.now && this.fireAble){
			if(this.ammo > 0){
				this.bullet = this.bullets.create(this.spawnX, this.spawnY, 'bullet');
				this.bullet.scale.x = 1.5;
				this.bullet.scale.y = 1.5;
				this.game.physics.enable(this.bullet, Phaser.Physics.ARCADE);

				//this.shootY = this.game.rnd.integerInRange(this.targetY - 0.5, this.targetY + 0.5);

				this.game.physics.arcade.moveToXY(this.bullet, (this.targetX), (this.targetY), 800);
				this.game.physics.arcade.angleToXY(this.bullet, (this.targetX), (this.targetY), 800);
				this.bullet.outOfBoundsKill = true;
				this.bullet.animations.add('muzzle', [0, 1]);
				this.bullet.animations.play('muzzle', 60);
				this.ammo -= 1;

				this.gunTimer = this.game.time.now + 150;
			}
		}
	},
	
	displayHealth: function(){
		this.hearts.removeAll();
		this.x = 10;
		this.y = 35;
		for(var i=1; i<this.player.health; i++){
			this.heart = this.hearts.create(this.x, this.y, 'heart');
			this.heart.fixedToCamera = true;
			this.heart.scale.x = 2;
			this.heart.scale.y = 2;
			this.x += 16;
		}
	},

	displayLives: function(){
		this.lives.removeAll();
		this.x = 10;
		this.y = 10;
		for(var i=0; i<this.playerLives; i++){
			this.life = this.lives.create(this.x, this.y, 'life');
			this.life.fixedToCamera = true;
			this.life.scale.x =0.5;
			this.life.scale.y =0.5;
			this.x += 16;
		}
	},

	displayAmmo: function(){
		this.ammoBullets.removeAll();
		this.x = 580;
		this.y = 280;

		if(this.ammo == 0){
			if(!this.reloading){
				this.reloading = true;
				this.gunTimer = this.game.time.now + 2000;

			}else if(this.gunTimer < this.game.time.now){
				this.ammo = 30;
				this.reloading = false;
			}
			this.ammoBullet = this.ammoBullets.create(500, this.y+1, 'reload');
			this.ammoBullet.fixedToCamera = true;
			this.ammoBullet.scale.x = 1.5;
			this.ammoBullet.scale.y = 1.5;

		}else{
			for(var i=0; i < this.ammo; i++){
				this.ammoBullet = this.ammoBullets.create(this.x, this.y, 'clip');
				this.ammoBullet.fixedToCamera = true;
				this.ammoBullet.bringToTop();
				this.ammoBullet.scale.x = 0.1;
				this.ammoBullet.scale.y = 0.1;
				this.x -= 5;
			}

		}
	},	

	spawnEnemies: function(){
		//this.total = this.fibonacciSpawn(this.enemySpawnCount);
		this.total = this.enemySpawnCount;
		this.enemySpawnCount++;
		this.targetSelect = this.game.rnd.integerInRange(0, 100);

		if(this.targetSelect < 25){
			this.target = this.player;
		}else if(this.targetSelect < 50){
			this.target = this.steel;
		}else if(this.targetSelect < 75){
			this.target = this.silver;
		}else{
			this.target = this.bronze;
		}


		for(var i=0; i<this.total; i++){
			this.x = this.game.rnd.integerInRange(-100, 1300);
			this.y = -100;
			this.enemies.push(new Enemy(this, this.enemyIndex, this.x, this.y, this.target));
			this.enemyIndex++;
		}

		if(this.spawnN < 7){
			this.spawnN++;
		}
	},

	enemyAI: function(){
		for(var i=0; i<this.enemies.length; i++){
			if(this.enemies[i].alive){
				this.enemies[i].move(this.enemies[i].target);
				this.enemies[i].rotateGun(this.enemies[i].target);
				this.enemies[i].update();
				this.game.physics.arcade.overlap(this.bullets, this.enemies[i].enemySprite, this.enemyHit, null, this);

				if(this.enemies[i].fireReady){
					this.enemyFire(this.enemies[i]);
				}				
			}
		} 
	},

	enemyFire: function(enemy){
		this.firingPoint = [];
		this.firingPoint = enemy.getFiringPoint();

		
		this.chance = 2;

		if(this.game.rnd.integerInRange(0, 100) < this.chance){
			this.spawnLaser(this.firingPoint[0], this.firingPoint[1]);
		}
	},

	spawnLaser: function(x, y){
		this.laser = this.lasers.create(x, y, 'laser');
		this.laser.anchor.setTo(0.5, 0.5);
		this.game.physics.enable(this.laser, Phaser.Physics.ARCADE);
		this.accuracy = this.game.rnd.integerInRange(-10, this.player.body.height+10);
		//this.laser.rotation = this.game.physics.arcade.angleToObject(this.player);
		//this.game.physics.arcade.moveToObject(this.laser, this.player,  300);
		this.game.physics.arcade.moveToXY(this.laser, this.player.body.x, this.player.body.y + this.accuracy, 300);
	},

	controls: function(button){
		this.movementSpeed = 150;

		if(button == 'jump'){
			if(this.player.y >= this.floor){
				this.player.body.velocity.y = -200;
			}

		}else if(button == 'crouch'){
			if(this.player.y >= this.floor){		
				this.crouching = true;
			}

		}else if(button == 'right'){
			if(!this.firing){	//if not firing, change direction
				this.weapon.rotation = 0;
				this.facingRight = true;

			}
			this.player.body.velocity.x = this.movementSpeed;

		}else if(button == 'left'){
			if(!this.firing){	//if not firing, change direction
				this.weapon.rotation = 0;
				this.facingRight = false;
			}
			this.player.body.velocity.x = -this.movementSpeed;

		}
	},

	//Handles if and where a player respawns
	respawn: function(){
		if(this.playerLives > 0){
			this.player.health = this.startHealth;
			this.playerLives -= 1;
			this.player.body.x = this.checkpoint;
			this.lasers.forEachAlive(this.cullLasers, this);
		}else{
			this.player.kill();
			this.game.state.start('Death');
		}
	},	
	
	collisionDetection: function(){
		this.game.physics.arcade.collide(this.player, this.lasers, this.playerCollision, null, this);
		
		this.game.physics.arcade.overlap(this.lasers, this.silver, this.silverHit, null, this);
		this.game.physics.arcade.overlap(this.lasers, this.bronze, this.bronzeHit, null, this);
		this.game.physics.arcade.overlap(this.lasers, this.steel, this.steelHit, null, this);		
	},
	
	playerAnimations: function(){
		if(this.facingRight){
			if(this.crouching){
				this.player.animations.play('crouch', 1);
			}else if(this.player.body.velocity.x == 0){
				this.player.animations.play('still', 1);
			}else{
				this.player.animations.play('walk', 5);
			}

		}else{
			if(this.crouching){
				this.player.animations.play('crouchL', 1);
			}else if(this.player.body.velocity.x == 0){
				this.player.animations.play('stillL', 1);
			}else{
				this.player.animations.play('walkL', 5);
			}

		}
	},	
	
	playerCollision: function(player, laser){
		laser.kill();

		if(player.health > 1){
			player.damage(0.33);
		}else{
			this.respawn();
		}
	},

	//Enemy hit by bullet
	enemyHit: function(enemy, bullet){
		bullet.kill();
		if(this.enemies[enemy.name].damage()){
			this.score++;
		}
	},

	//Culls out of sight bullets
	bulletHandler: function(object){
		if(object.body.x > this.player.body.x + 1000 || object.body.x < this.player.body.x - 1000){
			object.kill();
		}
	},

	cullLasers: function(object){
		object.kill();
	},

	inputHandler: function(){
		//Keyboard
		//WASD
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
			this.controls('jump');
		}
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.S)){
			this.controls('crouch');

		}else if(this.game.input.keyboard.isDown(Phaser.Keyboard.D)){
			this.controls('right');

		}else if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)){
			this.controls('left');
		}

		// R - Reload
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.R)){
			this.ammo = 0;
		}

		//Arrows
		if(this.cursors.up.isDown){
			this.shoot('up');
			this.firing = true;

		}else if(this.cursors.right.isDown){
			this.shoot('right');
			this.firing = true;

		}else if(this.cursors.down.isDown){
			//this.shoot('down');
			//this.firing = true;

		}else if(this.cursors.left.isDown){
			this.shoot('left');
			this.firing = true;

		}else{
			this.firing = false;

		}

		//SpaceBar
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			this.controls('fire');
		}

		//Gamepad Controls
		if(this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){		
			this.controls('left');
			
		}else if(this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){		
			this.controls('right');
			
		}

		//Touch-Screen Controls
		if(this.game.input.activePointer.isDown){
			this.touchBound = 300; //Half screen

			if((this.input.pointer1.y < this.player.y) && (this.player.body.y > this.floor)){
				this.controls('jump');
			}
			if(this.input.pointer1.x < this.touchBound){
				this.controls('left');
				
			}else if(this.input.pointer1.x > this.touchBound){
				this.controls('right');
				
			}
		}
	}
};


//Enemy Object
Enemy = function(game, index, x, y, target){
	this.x = x;
	this.y = y;
	this.alive = true;
	this.health = 4;
	this.facingLeft = true;	
	this.fireReady = false;
	this.target = target;

	this.enemySprite = game.add.sprite(x, y, 'enemy');
	this.enemySprite.animations.add('full', [0]);
	this.enemySprite.animations.add('dmg1', [1]);
	this.enemySprite.animations.add('dmg2', [2]);
	this.enemySprite.animations.add('dmg3', [3]);
	this.enemySprite.animations.add('hit', [4]);	
	this.enemySprite.animations.add('hitR', [5]);
	this.enemySprite.animations.add('dmg3R', [6]);
	this.enemySprite.animations.add('dmg2R', [7]);
	this.enemySprite.animations.add('dmg1R', [8]);
	this.enemySprite.animations.add('fullR', [9]);
	this.enemySprite.animations.play('full', 1);

	game.physics.enable(this.enemySprite, Phaser.Physics.ARCADE);
	this.enemySprite.immovable = true;
	this.enemySprite.name = index.toString();

	this.gunX = (x+14);		
	this.gunY = (y+62);
	this.enemyGun = game.add.sprite(this.gunX, this.gunY, 'enemyGun');
	this.enemyGun.animations.add('left', [0]);
	this.enemyGun.animations.add('right', [1]);
	this.enemyGun.animations.play('left', 1);
	this.enemyGun.anchor.set(1, 0);
	this.enemyGun.bringToTop();	
};

Enemy.prototype.rotateGun = function(target){
	if(this.facingLeft){
		this.angleBetween = game.physics.arcade.angleBetween(this.enemyGun, target) + 3.14;

		if(this.angleBetween > 5.5){
			this.fireReady = true;
			this.enemyGun.rotation = this.angleBetween;
		}else{
			this.fireReady = false;
		}
	}else{
		this.angleBetween = game.physics.arcade.angleBetween(this.enemyGun, target);

		if(this.angleBetween > 0){
			this.fireReady = true;
			this.enemyGun.rotation = this.angleBetween;
		}else{
			this.fireReady = false;
		}
	}
}

Enemy.prototype.getX = function(){
	return this.x;
}

Enemy.prototype.getY = function(){
	return this.y;
}

Enemy.prototype.getFiringPoint = function(){
	//end of gun = -29, 0
	this.gunEnd = [];
	if(this.facingLeft){
		this.gunEnd[0] = (this.enemyGun.x - 29);
		this.gunEnd[1] = (this.enemyGun.y + 10);
	}else{
		this.gunEnd[0] = (this.enemyGun.x + 29);
		this.gunEnd[1] = (this.enemyGun.y + 10);
	}
	return this.gunEnd;
}

Enemy.prototype.move = function(target){
	this.distance = game.physics.arcade.distanceBetween(this.enemySprite, target);


	if(this.enemySprite.body.x < target.body.x){
		this.facingLeft = false;
	}else if(this.enemySprite.body.x > target.body.x){
		this.facingLeft = true;
	}

	if(this.distance < 125){
		this.fireReady = true;
	}else{
		this.fireReady = false;
	}

	if(this.distance > 300 || this.distance < -300){
		game.physics.arcade.moveToObject(this.enemySprite, target);
	}if(this.distance < 150){

		if(this.enemySprite.y > 150){
			this.enemySprite.body.velocity.y = game.rnd.integerInRange(-300, 0);

		}else if (this.enemySprite.y < 40){
			this.enemySprite.body.velocity.y = game.rnd.integerInRange(0, 300);

		}else{
			this.enemySprite.body.velocity.y = game.rnd.integerInRange(-300, 300);
		}
		
	}
}

Enemy.prototype.damage = function(){
	this.health -=1;

	if(this.facingLeft){
		this.enemySprite.animations.play('hit', 1);
	}else{
		this.enemySprite.animations.play('hitR', 1);
	}

	if(this.health <= 0){
		this.alive = false;
		this.enemySprite.kill();
		this.enemyGun.kill();
		return true;
	}
}

Enemy.prototype.update = function(){
	if(this.facingLeft){
		this.enemyGun.anchor.set(1, 0);
		this.enemyGun.animations.play('left', 1);
		this.enemyGun.x = this.enemySprite.x + 14;
		this.enemyGun.y = this.enemySprite.y + 62;
	}else{
		this.enemyGun.anchor.set(0, 0);
		this.enemyGun.animations.play('right', 1);
		this.enemyGun.x = this.enemySprite.x + 14;
		this.enemyGun.y = this.enemySprite.y + 62;
	}	

	if(this.facingLeft){
		if(this.health == 4){
			this.enemySprite.animations.play('full', 1);
		}else if(this.health == 3){
			this.enemySprite.animations.play('dmg1', 1);
		}else if(this.health == 2){
			this.enemySprite.animations.play('dmg2', 1);
		}else if(this.health == 1){
			this.enemySprite.animations.play('dmg2', 1);
		}

	}else{	
		if(this.health == 4){
			this.enemySprite.animations.play('fullR', 1);
		}else if(this.health == 3){
			this.enemySprite.animations.play('dmg1R', 1);
		}else if(this.health == 2){
			this.enemySprite.animations.play('dmg2R', 1);
		}else if(this.health == 1){
			this.enemySprite.animations.play('dmg2R', 1);
		}
	}
	
};