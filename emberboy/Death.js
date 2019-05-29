Scene.Death = function (game){ };

Scene.Death.prototype = {
	create: function(){				
		this.loseMusic = this.game.add.audio('gameOver');
		this.musicPlay = false;
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;
		
		if(this.game.state.states['Game'].victorious){
			this.timer = this.game.time.now + 1000;
			this.timer2 = this.game.time.now + 5000;
			this.timer3 =this.game.time.now + 12000;
			this.background = this.add.sprite(0, 0, 'win');
			this.background2 = this.add.sprite(0, 0, 'win2');
			this.background2.alpha = 0;
			this.background3 = this.add.sprite(0, 0, 'win3');
			this.background3.alpha = 0;
			
		}
		
		if(this.game.state.states['Game'].dead){
			this.loseMusic.play();
			this.timer = this.game.time.now + 1000;
			this.background = this.add.sprite(0, 0, 'dead');
			this.background.animations.add('still', [0]);
			this.background.animations.add('flash', [1, 2]);
			this.background.animations.play('still', 1);
		}
	},
	
	update: function(){				
		if(this.timer < this.game.time.now){
			if(this.game.state.states['Game'].dead){
				this.background.animations.play('flash', 1, true);
				
				if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.pointer1.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_START)){
					this.loseMusic.stop();
					this.game.state.start('Game');
				}
				
			}else if(this.game.state.states['Game'].victorious){
				this.background2.bringToTop();
				this.game.add.tween(this.background2).to({alpha:1}, 3000, Phaser.Easing.Linear.None, true);
				if(this.timer2 < this.game.time.now){
					if(this.musicPlay == false){					
						this.loseMusic.play();
						this.musicPlay = true;
					}
					this.background3.bringToTop();
					this.game.add.tween(this.background3).to({alpha:1}, 3000, Phaser.Easing.Linear.None, true);
				}
				if(this.timer3 < this.game.time.now){
					this.game.state.start('Preloader');
				}
			}
		}
	}
};