var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  /* Figure out what we're doing from the user */
	prompting: function() {
    var done = this.async();
    var that = this;
    this.prompt([{
      type    : 'list',
      name    : 'direction',
      message : 'What do you need?',
      choices: [
        {name:"Core JS Object", value:"core"},
        {name:"Phaser State Module", value:"state"}
      ]
    },{
      when    : function(answers){ return answers.direction == "core"; },
      type    : 'input',
      name    : 'name',
      message : 'Name your core object',
    },{
      when    : function(answers){ return answers.direction == "state"; },
      type    : 'input',
      name    : 'name',
      message : 'Name your state module',
    }], function (answers) {
      this.answers = answers;
      done();
    }.bind(this));
	},
  /* Roll that beautiful scaffolding footage */
  writing: function () {
    if(this.answers.direction == "core") {
        this.template('core.js', "core/assets/js/"+this.answers.name+".js");
        this.log( "\n*********\nRemember, include the new core file into the index.html file. I'm lazy and haven't figured this out yet.\n*********\n" )
    }
    if(this.answers.direction == "state") {
        this.template('statename.html', "states/"+this.answers.name+"/"+this.answers.name+".html");
        this.template('statename.js', "states/"+this.answers.name+"/"+this.answers.name+".js");
        this.template('statename.scss', "states/"+this.answers.name+"/"+this.answers.name+".scss");
    }
  }

});