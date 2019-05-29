Scene.Death = function (game){ };

Scene.Death.prototype = {
	create: function(){
		this.background = this.game.add.sprite(0, 0, 'dead');
		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.finalScore = this.game.state.states['Game'].score;

		this.timer = this.game.time.now + 2000;
		this.timer2 = this.game.time.now + 4000;
		this.timer3 = this.game.time.now + 8000;
		this.timer4 = this.game.time.now + 10000;

		this.mountain = this.game.add.sprite(96, 11, 'mountain');
		this.mountain.alpha = 0;
		this.stirring = this.game.add.sprite(127, 46, 'stirring');
		this.stirring.alpha = 0;
		this.waking = this.game.add.sprite(310, 46, 'waking');
		this.waking.alpha = 0;
		if(this.finalScore == 1){
			this.scoreContent = "You scored " + this.finalScore + " point!";
		}else{
			this.scoreContent = "You scored " + this.finalScore + " points!";
		}
		this.scoreTxt = this.game.add.text(170, 259, this.scoreContent, {font: "18px Lucida Console", fill: '#FFF'});
		this.scoreTxt.alpha = 0;
	},
	
	update: function(){
		this.game.add.tween(this.mountain).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true);

		if(this.timer < this.game.time.now){
			this.game.add.tween(this.stirring).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true);		
		}

		if(this.timer2 < this.game.time.now){
			this.game.add.tween(this.waking).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true);
		}

		if(this.timer3 < this.game.time.now){
			this.game.add.tween(this.scoreTxt).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true);
		}

		if(this.timer4 < this.game.time.now){
			if(this.cursors.up.isDown){
				this.game.state.start('Preloader');
			}
		}
	}
};