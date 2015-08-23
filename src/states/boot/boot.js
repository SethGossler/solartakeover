var MOBA = MOBA || {};

MOBA.boot = function(){};


MOBA.boot.prototype = {
  preload: function() {
    var self = this;
    self.load.image('loadbar', 'assets/img/loadbar.png');
  },

  create: function() { 
    var self = this;
    //loading screen will have a black background
    self.game.stage.backgroundColor = '#777';  
    self.state.start('Preload');  

    var myPlanetBuilder = new planetBuilder();
    MOBA.planets = myPlanetBuilder.buildPlanets();
    // Maintain aspect ratio
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    $(".go-full-screen").click(function(){
      gofull()
    });

    function gofull() {

      console.log( "go full screen" );

      var elem = $("body")[0];

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }

        // if (game.scale.isFullScreen)
        // {
        //     game.scale.stopFullScreen();
        // }
        // else
        // {
        //     game.scale.startFullScreen(true);
        // }

    }
  }
 
};

