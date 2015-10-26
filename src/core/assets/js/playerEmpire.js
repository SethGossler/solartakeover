/*
* Player Empire
* By Sethie
* The Player Empire object manages all the global vars and functionality of the running
* solar empire. 
*/

var PlayerEmpire = function() {
	this.techCredits = 0;
	this.foodCredits = 0;
}

PlayerEmpire.prototype = {

	addFoodCredits: function(newFoodCredits) {
		this.foodCredits = this.foodCredits + newFoodCredits;
	},

	addTechCredits: function(newTechCredits) {
		this.techCredits = this.techCredits + newTechCredits;
	}

}