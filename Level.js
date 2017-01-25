Game.Level = function(game) {};


Game.Level.prototype = {

	playerSpeed: 200,
	jumpTimer: 0,
	walkTimer: 0,
	wallJump: false,

	create:function(game){

		bg = game.add.tileSprite(0, 0, 512, 3872, 'backGround');
		this.sound.stopAll();

		this.stage.backgroundColor = '#4422AA';

		this.music = this.add.audio('game', 0.6, true);
		this.music.play();
		jumping = this.add.audio('jumping');
		boton = this.add.audio('boton');
		teleport = this.add.audio('teleport');


		//mapa principal
		map = this.add.tilemap('mundo');
		map.addTilesetImage('tileset', 'tiles');
		layer = map.createLayer('Capa de Patrones 1');
		layer.resizeWorld();
		map.setCollisionBetween(701, 713);

		//limites de los enemigos
		BoLimits = this.add.tilemap('BoLimits');
		BoLimits.addTilesetImage('tileset', 'tiles');
		layer1 = BoLimits.createLayer('Capa de Patrones 1');
		layer1.visible = false;
		BoLimits.setCollisionBetween(755, 756);

		//plataformas especiales
		plataformas = this.add.tilemap('plataformas');
		plataformas.addTilesetImage('tileset', 'tiles');
		layer2 = plataformas.createLayer('Capa de Patrones 1');
		plataformas.setCollisionBetween(710, 715);

		//pinchos
		pinchos = this.add.tilemap('spikes');
		pinchos.addTilesetImage('pinchos', 'tilesPinchos');
		layer3 = pinchos.createLayer('Capa de Patrones 1');
		pinchos.setCollisionBetween(0, 15);

		//player
		eye = this.add.sprite(256, 3830, 'Eye');
		eye.anchor.setTo(0.5, 0.5);

		eye.animations.add('idle', [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3], 12, true); //nombre, frames del spritesheet, framesxframe, loop?
		eye.animations.add('walk', [4, 4, 4, 5, 6, 7], 10, true);
		eye.animations.add('jump', [8], 1, true);
		eye.animations.add('jumpIdle', [0], 1, true);
		eye.animations.add('fall', [9], 1, true);

		//fisica del juego
		this.physics.arcade.enable(eye);
		this.physics.arcade.gravity.y = 1300;

		//Camera
		this.camera.follow(eye);
		this.camera.deadzone = new Phaser.Rectangle(16, 480, 384, 32);

		//Enemies
		enemies = game.add.group();
		CreateEnemies(this);

		controls ={
			right: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
			left: this.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			jump: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
			pause: this.input.keyboard.addKey(Phaser.Keyboard.ESC),
		};



		//////////Pause Menu\\\\\\\\\\\
		button1 = game.add.button(this.camera.x + 200, this.camera.y + 200, 'buttonMenu', function () { //boton del menu
			boton.play();
			game.physics.arcade.isPaused = false;
			this.music.stop();
		 	this.state.start('MainMenu');
		}, this, 2, 1, 0);

		button1.anchor.setTo(0.5, 0.5);
		button1.width = 100;
		button1.height = 50;


		button2 = game.add.button(this.camera.x + 200, this.camera.y + 400, 'buttonResume', function () { //boton de continuar
			boton.play();
			button1.visible = false;
			button2.visible = false;
		 	this.physics.arcade.isPaused = false;
		 	this.music.resume();
		}, this, 2, 1, 0);

		button2.anchor.setTo(0.5, 0.5);
		button2.width = 100;
		button2.height = 50;

		button1.visible = false;
		button2.visible = false;
	},

	update:function(game){

		//Collisions
		//collide(object1, object2, collideCallback, processCallback, callbackContext)

		this.physics.arcade.collide(eye, layer);
		this.physics.arcade.collide(enemies, layer, EnemyTurner, null, this);
		this.physics.arcade.collide(enemies, layer1, EnemyTurner, null, this);
		this.physics.arcade.collide(eye, layer2);

		plataformas.forEach(function (t) { if (t) { t.collideDown = false;} }, game, 0, 0, plataformas.width, plataformas.height, layer2);

		this.physics.arcade.collide(enemies, eye, GameOver, null, this); //si el player choca con Bo llama a este evento
		this.physics.arcade.collide(layer3, eye, GameOver, null, this); //si colisiona con los pinchos llama al evento

		this.camera.x = 64;

		/////////Eye movement\\\\\\\\\\
		if(eye.body.onFloor()) { 
			eye.body.velocity.x = 0; 
			eye.body.velocity.y = 0;
		}

		if(eye.body.onWall()) wallJump = true;
		eye.body.bounce.set(0);
		
		if(controls.right.isDown && this.time.now > this.walkTimer){
			eye.body.velocity.x = 200;
		}

		else if(controls.left.isDown && this.time.now > this.walkTimer){
			eye.body.velocity.x = -200;
		}

		if (eye.body.onFloor() && controls.jump.isDown && this.time.now > this.jumpTimer){
			jumping.play();
			eye.body.velocity.y = -500;
			this.jumpTimer = this.time.now + 200;
			this.wallJump = true;
		}

		else if(eye.body.onWall() && controls.jump.isDown && !eye.body.onFloor() && this.time.now > this.jumpTimer && wallJump){
			jumping.play();
			eye.body.bounce.set(0.8);
			eye.body.velocity.y = -500;
			this.walkTimer = this.time.now + 400;
			this.wallJump = false;

		}

		///////////////AnimacionesEYE\\\\\\\\\\\\\\\\\
		if (eye.body.velocity.x === 0 && eye.body.velocity.y === 0) eye.animations.play('idle');

		if (eye.body.velocity.y === 0) {
			if (eye.body.velocity.x > 0) { eye.animations.play('walk'); eye.scale.setTo(1, 1); }
			else if (eye.body.velocity.x < 0) { eye.animations.play('walk'); eye.scale.setTo(-1, 1); }
		}
		else if (eye.body.velocity.y < 0) {
			if (eye.body.velocity.x > 0) { eye.animations.play('jump'); eye.scale.setTo(1, 1); }
			else if (eye.body.velocity.x < 0) { eye.animations.play('jump'); eye.scale.setTo(-1, 1); }
			else if (eye.body.velocity.x === 0) { eye.animations.play('jumpIdle'); }
		}
		else if (eye.body.velocity.y > 0) eye.animations.play('fall');

		///////////////Win\\\\\\\\\\\\\

		if (eye.x <= 25 && eye.y === 2128){ //si llega arriba tb gana (esto es temporal)
			this.music.stop();
			this.state.start('GameOver', true, false, true);
			//true, clean world; false, clean cache; true, the player won	
		}

		//////////////end map\\\\\\\\\\\
		if(eye.y <= 50){
			teleport.play();
			eye.y = 3830;
		}

		//////////////Death\\\\\\\\\\\\\
		if (eye.x <= 20 || eye.x >= 490) this.state.start('GameOver', true, false, false);

		///////////////Pause\\\\\\\\\\\\\\\

		if (controls.pause.isDown){

			button1.x = this.camera.x + 200; //corregimos la posicion de los botones
			button2.x = this.camera.x + 200;
			button1.y = this.camera.y + 200;
			button2.y = this.camera.y + 400;

			button1.visible = true; //mostramos el menu
			button2.visible = true;

			this.music.pause();
			this.physics.arcade.isPaused = true; //paramos la fisica del juego
			//no paramos el juego en si porque si no los botones no funcionarian

		}

	} 	
}

function Enemy(name, game, x, y){

	//'bo' -----> sprite name
	
	this.bo = enemies.create(x, y, 'bo');
	this.bo.anchor.setTo(0.5, 0.5);
	this.bo.name = name;
	this.bo.animations.add('walk', [0, 1], 2, true);

	//game.physics.enable(this.bo, Phaser.Physics.ARCADE);
	game.physics.arcade.enable(this.bo);
	this.bo.body.allowGravity = false;
	this.bo.body.velocity.x = -100;
	this.bo.body.bounce.setTo(1, 1);

	this.bo.animations.play('walk');
	this.bo.scale.setTo(1, 1);
}


function CreateEnemies(game){

	new Enemy('Bo1', game, 256, 3471);
	new Enemy('Bo2', game, 256, 3328);
	new Enemy('Bo3', game, 256, 2975);
	new Enemy('Bo4', game, 256, 1920);
	new Enemy('Bo5', game, 256, 1455);
	new Enemy('Bo6', game, 256, 945);
	new Enemy('Bo7', game, 300, 785);
	new Enemy('Bo8', game, 260, 510);
	new Enemy('Bo9', game, 130, 430);
	new Enemy('Bo10', game, 400, 350);
	new Enemy('Bo11', game, 180, 175);
	new Enemy('Bo12', game, 310, 110);
	new Enemy('Bo13', game, 180, 52);
}

function EnemyTurner(enemy){
	if(enemy.body.velocity.x > 0)
		enemy.scale.setTo(-1, 1);
	else 
		enemy.scale.setTo(1, 1);
}

function GameOver(){
	this.state.start('GameOver', true, false, false);
	//true, clean world; false, clean cache; false, the player lost
	this.music.stop();
}


