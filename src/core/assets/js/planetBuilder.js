var planetBuilder = function(){
	this.planets = [
		{
			name: "Earth",
			scale: 0.15,
			image: "planet",
			tint: 0xaaddee,
			radius: 400,
			period: 1,
			startOffset: 0
		},
		{
			name: "Nepture",
			scale: 0.3,
			image: "planet",
			tint: 0xbbbbaa,
			radius: 900,
			period: 0.5,
			startOffset: 1
		}
	]
};

planetBuilder.prototype = {
	
	buildPlanets: function() {
		return this.planets;
	},

	buildNewPlanet: function() {
		var newPlanet = {};
		newPlanet.name = generatePlanetName();
		newPlanet.scale = Math.randomInt();
		return newPlanet;
	}
}