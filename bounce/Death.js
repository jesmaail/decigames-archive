Scene.Death = function (game){ };

Scene.Death.prototype = {
	create: function(){
		this.background = this.add.sprite(0, 0, 'black');
		this.wave = this.game.state.states['Game'].wave;
		this.waveTxt = this.game.add.text(175, 170, "", {font: "15px Arial", fill: '#FFF' });	
		
		if((this.wave - 1) == 1){
			this.waveTxt.setText("You survived " + (this.wave - 1) + " wave.");
		}else{
			this.waveTxt.setText("You survived " + (this.wave - 1) + " waves.");
		}
		
		this.timer = this.game.time.now + 8000;
	},
	
	update: function(){				
		if(this.timer < this.game.time.now){
			this.game.state.start('Preloader');
		}
	}
};