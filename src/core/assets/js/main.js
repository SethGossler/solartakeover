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