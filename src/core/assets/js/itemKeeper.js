var itemKeeper = function(){
	console.log( 'The Item Keeper is open for Business.' );
};

itemKeeper.prototype = {

	getPlanetItems(planet) {
		// console.log('get getPlanetItems', planet);
		var possibleItems = _.filter(ITEMS, function(item) {
			var isPossible = false;
			isPossible = item.levelRequirement <= (planet.level+1); //returning items possible next level
			isPossible = isPossible && item.habitationTypes.indexOf(planet.habitation) >= 0;
			isPossible = isPossible && ( (planet.items.getItems(item.name).length < item.canOwn) || item.canOwn == 0 );
			return isPossible;
		});
		return possibleItems;
	}, 

	buyPlanetItem(itemName, planet) {
		console.log('trying to buy a', itemName, ' from the planet ', planet, ' huh?')
		var item = _.find(ITEMS, function(item){
			return item.name == itemName;
		});
		var correctLevel = item.levelRequirement <= planet.level; 
		var correctHabitat = item.habitationTypes.indexOf(planet.habitation) >= 0;
		var gotTheGoods = item.cost.tech <= MOBA.PlayerEmpire.techCredits;
		gotTheGoods = gotTheGoods && item.cost.food <= MOBA.PlayerEmpire.foodCredits;
		gotTheGoods = gotTheGoods && item.cost.happiness <= planet.happiness;
		gotTheGoods = gotTheGoods && item.cost.loyalty <= planet.loyalty;
		gotTheGoods = gotTheGoods && item.cost.people <= planet.population;
		if(correctHabitat && correctLevel && gotTheGoods) {
			MOBA.PlayerEmpire.techCredits -= item.cost.tech;
			MOBA.PlayerEmpire.foodCredits -= item.cost.food;
			planet.happiness -= item.cost.happiness;
			planet.loyalty -= item.cost.loyalty;
			planet.population -= item.cost.people; 
			if(item.affect){
				item.affect(planet, MOBA);
			}
			return item;
		} else {
			console.log('You cant buy this!');
			return false;
		}
	}

}

var ITEMS = [
	{
		name: 'mining-upgrade-1',
		alias: 'Mining Upgrad 1',
		type: 'production',
		levelRequirement: 3,
		habitationTypes: [3],
		canOwn: 1,
		cost: {
			food: 100,
			tech: 100,
			loyalty: 0,
			happiness: 0,
			people: 0
		},
		description: "First upgrade for mining colonies",
		affect: function(planet, MOBA, options) {
			MOBA.PlayerEmpire.addMineralCredits( 100 );
		}
	},
	{
		name: 'early-clicker',
		alias: 'Early Clicker',
		type: 'production',
		levelRequirement: 1,
		habitationTypes: [1],
		canOwn: 1,
		cost: {
			food: 10,
			tech: 10,
			loyalty: 0,
			happiness: 0,
			people: 0
		},
		description: "The space race begins with one click, then many more clicks.",
		clickAffect: function(planet, MOBA, options) {
			MOBA.PlayerEmpire.addFoodCredits( 1 );
			MOBA.PlayerEmpire.addTechCredits( 1 );
			planet.experience++;
		}

	},
	{
		name: 'mid-game-clicker',
		alias: 'Mid Game Clicker',
		type: 'production',
		levelRequirement: 3,
		habitationTypes: [1],
		canOwn: 1,
		cost: {
			food: 10000,
			tech: 10000,
			loyalty: 0,
			happiness: 0,
			people: 0
		},
		description: "With every click, your will drives your people harder.",
		clickAffect: function(planet, MOBA, options) {
			MOBA.PlayerEmpire.addFoodCredits( 10 );
			MOBA.PlayerEmpire.addTechCredits( 10 );
		}
	},
	{
		name:'colony-ship',
		alias:'Colony Ship',
		type:'production',
		levelRequirement: 3,
		habitationTypes: [1,2,3,4],
		canOwn: 0,
		cost: {
			food:100,
			tech: 100,
			loyalty: -5,
			happiness: -5,
			people: 2
		},
		description: "Provides a ship to colonize other planets",
		affect: function(planet, MOBA, options){
			console.log('Colony ships dont have affects');
		}
	},
	{
		name:'space-port',
		alias:'Space Port',
		type:'production',
		levelRequirement: 2,
		habitationTypes: [1,2,3,4],
		canOwn: 1,
		cost: {
			food: 0,
			tech: 200,
			loyalty: 4,
			happiness: 5,
			people: 0
		},
		description: "Bumps a planets experience growth by 10.",
		affect: function(planet, MOBA, options){
			planet.experiencePerTick += 10;
		}
	}
]