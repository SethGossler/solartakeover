var MOBA = MOBA || {};

MOBA.mainMenu = function(){};

MOBA.mainMenu.prototype = {
  // preload any files you didn't preload in the preload state.
  preload: function() {

  },
  // Create the scene
  create: function() { 
    console.log('mainMenu');
    var self = this;
    self._tpl = $("#mainMenu_tpl");
    self.$el = $(self._tpl.html());
    self.bindings();
    self.renderLayout();
    window.setTimeout(function(){
      self.$el.addClass('ready');
      setTimeout(function(){
        self.$el.addClass('scene-1');
      },1500);
    },500);
  },

  // Create and show your view
  renderLayout: function() {
    var self = this;
    $("#game_view").append(self.$el);
    self.$el.show();
  },

  bindings: function() {
    var self = this;
    self.$el.on('click', '.start.btn', function(){
      window.router.navigate('game', {trigger:true});
      self.$el.removeClass('ready');
      setTimeout(function(){
        self.state.start('solar');  
      },1000);
    });

  },

  // render tick / redraw
  render: function() {
    var self = this;
  },

  shutdown: function() {
    var self = this;
    self.$el.remove();
  }



};