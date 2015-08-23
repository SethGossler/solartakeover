var VIEWS = VIEWS || {};

$(function(){

  var TeamRoster = function (argument) {
    var self = this;
    self._tpl = _.template( $("#_teamRoster").html() );
    self.$dom = null;
    self.$content = $("#moba");
    self.init();
    return self;
  };

  TeamRoster.prototype = {
    init: function(){
        
    },

    show: function() {
      var self = this;
      if( !self.$dom ) {
        self.$dom = $(self._tpl( {
          players: self.getTeam(),
          openAgents: MOBA._GameDirector.openAgents
        } ));
        self.$content.append( self.$dom );
        self.bindings();
      }
    },

    getTeam: function(){
      var players = MOBA._TeamManager.team.players;
      return players;
    },

    remove: function() {
      var self = this;
      self.$dom.remove();
      self.$dom = null;
    },

    bindings: function() {
      var self = this;
      var $single = $([1]);
      self.$dom.on("click", "[data-id='current-team'] .btn", function(){
        $single[0] = this;
        self.firePlayer( $single.parent().attr("data-name") );
      });
      self.$dom.on("click", "[data-id='roster'] .btn", function() {
        $single[0] = this;
        self.hirePlayer( $single.parent().attr("data-name") );
      });

      self.$dom.on("click", ".close", function(){
        self.remove();
      });

    },

    firePlayer: function(playerName) {
      var self = this;
      var team = MOBA._TeamManager.team;
      if( team.removePlayer( playerName ) === true ) {
        self.remove();
        self.show();
      }
    },

    hirePlayer: function(playerName) {
      var self = this; 
      var player = MOBA._GameDirector.getOpenAgent( playerName );
      if( player ) {
        if(MOBA._TeamManager.team.addPlayer( player )) {
          MOBA._GameDirector.removeOpenAgent( playerName );
          self.remove();
          self.show();
        }
      }
    }



  };

  VIEWS.TeamRoster = new TeamRoster();
});
