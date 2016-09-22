var MOBA = MOBA || {};

// Initialize Phaser, and start our 'main' state 
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'moba');

/* Add in the states */
game.state.add('boot', MOBA.boot);
game.state.add('Preload', MOBA.Preload);
game.state.add('mainMenu', MOBA.mainMenu);
game.state.add('planet', MOBA.planet);
game.state.add('solar', MOBA.solar);
game.state.start('boot');

MOBA.gameTick = null; //will have timer
MOBA.startGame = function() {
	console.log("game start");
	clearInterval(MOBA.gameTick);
	MOBA.gameTick = setInterval(function(){
		MOBA.processPlanets();
	}, 5000);
};

MOBA.pauseGame = function() {
	clearInterval( MOBA.gameTick );
	console.log('game paused');
}

MOBA.processPlanets = function() {
	MOBA.planets.forEach(function(planet, i){
		planet.process();
	});
}


$(function(){
	var isGameInit = false;
	var myRouter = Backbone.Router.extend({
	  routes: {
	  	"menu":"menu",
	  	"game":"game"
	  },

	  menu: function(){
	  	console.log('in menu');
	  },

	  game: function() {
	  	// On game navigation, I'm disabling all routing, keeping it in the game.
	  	// Also triggering an event on the body, incase anyone cares to know
	  	// that the user was trying to go back. Useful for the planet views.
	  	if(isGameInit == false) {
	  		isGameInit = true;
				history.pushState(null, null, '/#/game');
				window.addEventListener('popstate', function () {
					$('body').trigger('back-hit');	
					console.log('on-back-hit');
			    history.pushState(null, null, '/#/game');
				});
			}
	  },
	});
	window.router = new myRouter();
	Backbone.history.start()
  window.router.navigate('menu', {trigger:true, replace:true});
})
