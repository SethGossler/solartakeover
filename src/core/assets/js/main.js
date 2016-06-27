var MOBA = MOBA || {};

// Initialize Phaser, and start our 'main' state 
var game = new Phaser.Game(1366, 768, Phaser.AUTO, 'moba');

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
	MOBA.gameTick = setInterval(function(){
		// console.log('do some logic');
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