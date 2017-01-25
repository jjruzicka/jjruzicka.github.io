var Game = {};

Game.Boot = function(game) {};

Game.Boot.prototype = {

	init:function(){

	},

	preload:function(){

		this.load.image('preloaderBar', 'assets/preloader_bar.png');
	},

	create:function(){

		this.state.start('Preloader');
	}

}