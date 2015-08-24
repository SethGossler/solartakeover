var planetBuilder = function(){
	this.planets = [
		{
			name: "Earth",
			habitation: 1,
			scale: 0.15,
			image: "planet",
			tint: 0xaaddee,
			radius: 400,
			period: 1,
			startOffset: 0
		},
		{
			name: "Nepture",
			habitation: 0,
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
		newPlanet.name = self.generatePlanetName();
		newPlanet.scale = self.generateScale();
		newPlanet.image = self.generatePlanetImage();
		newPlanet.tint = self.generateTint();//'0x'+(Math.random()*0xFFFFFF<<0).toString(16);
		newPlanet.radius = self.generateRadius();
		newPlanet.startOffset = self.generateOffset();
		return newPlanet;
	},

	generatePlanetName: function() {
		return "Derp Herp";
	},

	generateScale: function() {

	}

}