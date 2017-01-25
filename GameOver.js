Game.GameOver = function (game) {};


Game.GameOver.prototype = {
	init:function(result){
		success = result;
	},

	create:function(game) {
		this.music = this.add.audio('menu', 0.5, true);
		this.music.play();
		boton = this.add.audio('boton');


		this.stage.backgroundColor = '#000';

		this.createButton(game, 'buttonMenu', this.camera.x + 200, this.camera.y + 400, 100, 50, function(){
			boton.play();
			this.state.start('MainMenu', true, false, true);
		});

		if (success){ //if true, means the player won
			title = game.add.sprite(this.camera.x + 200, this.camera.y + 200, 'win');
			title.anchor.setTo(0.5, 0.5);
		}

		else {
			title = game.add.sprite(this.camera.x + 200, this.camera.y + 200, 'gameover');
			title.anchor.setTo(0.5, 0.5);
		}
	},

	update:function(){},

	createButton:function (game, boton, x, y, w, h, callback){
		var button1 = game.add.button(x, y, boton, callback, this, 2, 1, 0);

		button1.anchor.setTo(0.5, 0.5);
		button1.width = w;
		button1.height = h;
	}

};