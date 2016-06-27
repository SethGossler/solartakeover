/*
* Player Empire
* By Sethie
* The Player Empire object manages all the global vars and functionality of the running
* solar empire. 
*/

var MOBA = MOBA || {};

var PlayerEmpire = function() {
	this.techCredits = 0;
	this.foodCredits = 0;
	this.planets = [];
	this.homeWorld = {};
}

PlayerEmpire.prototype = {

	addFoodCredits: function(newFoodCredits) {
		this.foodCredits = this.foodCredits + newFoodCredits;
	},

	addTechCredits: function(newTechCredits) {
		this.techCredits = this.techCredits + newTechCredits;
	}

}

MOBA.PlayerEmpire = new PlayerEmpire();