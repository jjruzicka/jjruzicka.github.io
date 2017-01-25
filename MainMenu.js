Game.MainMenu = function (game) {};


Game.MainMenu.prototype = {
	init:function(playing){
		afirmativo = playing;
	},
	create:function (game){
		if (!afirmativo){
			this.music = this.add.audio('menu', 0.5, true);
			this.music.play();
		}
		boton = this.add.audio('boton');

		this.stage.backgroundColor = '#000';

		this.createButton(game, 'buttonPlay', this.camera.x + 200, this.camera.y + 400, 100, 50, function(){
			boton.play();
			this.music.stop();
			this.state.start('Level');
		});

		title = game.add.sprite(this.camera.x + 200, this.camera.y + 200, 'title');
		title.anchor.setTo(0.5, 0.5);
	},

	update:function (game){


	},

	createButton:function (game, boton, x, y, w, h, callback){
		var button1 = game.add.button(x, y, boton, callback, this, 2, 1, 0);

		button1.anchor.setTo(0.5, 0.5);
		button1.width = w;
		button1.height = h;
	}

};