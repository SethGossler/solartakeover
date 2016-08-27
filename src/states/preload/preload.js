var MOBA = MOBA || {};

//loading the game assets
MOBA.Preload = function(){};

MOBA.Preload.prototype = {
  preload: function() {
    //show loading bar
    this.preloadBar = this.add.sprite(100, 100, 'loadbar');
    this.load.setPreloadSprite(this.preloadBar);

    // after here, we will load our assets for the game ( this can be a long list );
    this.load.image('menu_bg', 'assets/img/mainMenu.jpg');
    this.load.image('space_bg', 'assets/img/space-the-stars.jpg');
    this.load.image('planet', 'assets/img/planet.png');
    this.load.image('solar-star', 'assets/img/solar-star.png');
    this.load.image('circle', 'assets/img/circle-bg.png');
  },

  create: function() {
    var self = this;
    console.log( "Done Preloading" );
    self.state.start('mainMenu');
  }

};