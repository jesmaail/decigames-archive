//LOAD ASSETS REQUIRED IN PRELOADER AND THEN CALL PRELOADER STATE

var Scene = {};
Scene.Boot = function (game){
	//
};

Scene.Boot.prototype = {
	preload: function(){		
		this.load.image('loading', 'games/ale/assets/loading.png');
		
	},
	create: function(){
		this.game.state.start('Preloader');
	}
};