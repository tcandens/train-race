// Contructor for creating each player, including main player and opponent
Railway = function(name) {
  this.name = name;
  this.beginningMiles = 0;
  this.currentMiles = 0;
  this.supplies = {
    wood: 0,
    steel: 0,
    labor: 0,
  };
  this.revenue = 0;
  // Method the adjusts the players mile count and progress
  this.adjustMiles = function(amount) {
    this.currentMiles += amount;
  };
  // Adjusts the amount of revenue either up or down
  this.adjustRevenue = function(amount) {
    this.revenue += amount;
  };
  // Initializes company supply stock, and can then be reused
  this.setSupplies = function(orderObject) {
    this.supplies.wood = orderObject['wood'];
    this.supplies.steel = orderObject['steel'];
    this.supplies.labor = orderObject['labor'];
  };
  // Method for making orders that check if total cost of order exceeds available revenue
  // And then increments each order item down until cost is met
  this.makeOrder = function(orderObject) {
    var totalCost = 0;
    // Calculate totalCost of original order
    for ( key in orderObject ) {
      totalCost += orderObject[key] * Materials[key].price;
    };
    // When order exceeds revenue, increment order items downward and recalculate total cost
    while ( totalCost > this.revenue ) {
      console.log("Your order is to large!");
      for ( key in orderObject ) {
        // Make sure inventory is >= 0
        if ( orderObject[key] > 0 ) {
          orderObject[key] -= 1;
          console.log(orderObject[key]);
          totalCost -= Materials[key].price;
          console.log(totalCost);
        } else if ( orderObject[key] == 0 ) {
          orderObject[key] = 0;
        };
      };
    };
    // Assign supplies and subtract order
    this.adjustRevenue(-totalCost);
    this.setSupplies(orderObject);
  };

  // Check to see if supplies are depleted
  this.checkSupplies = function() {
    for ( key in this.supplies ) {
      if ( this.supplies[key] > 0) {
        return true;
      } else {
        return false;
        break;
      };
    };
  };
};

// Constructor for building materials
Material = function(name, price, consumptionRate) {
  this.name = name;
  this.price = price; // Price per unit
  this.consumptionRate = consumptionRate; // The amount of material needed to build one mile of track
};

// Generic order with an indexed array passes as an argument
Order = function(array) {
  this.wood = array[0];
  this.steel = array[1];
  this.labor = array[2];
}

// Create material properties within object
var Materials = new Object();
Materials.wood = new Material("wood",5,100);
Materials.steel = new Material("steel",10,50);
Materials.labor = new Material("labor",100,0);

// Create object for Race holding all major methods
var Race = new Object();
// Initiate main players company
Race.buildPlayer = function() {
  // Pick which company
  // var companyName = prompt("Whats your companies name?");
  // Build order array
  var companyOrder = []
  companyOrder[0] = prompt("How much wood?");
  companyOrder[1] = prompt("How much steel?");
  companyOrder[2] = prompt("How many workers?");
  // Create order object
  var order = new Order(companyOrder);
  // Build company
  Player = new Railway("jt");
  // Grant contract deposit
  Player.adjustRevenue(Route.contractDeposit);

  Player.makeOrder(order);
  console.log(Player.supplies);
};

// Initiate opponent company
Race.buildOpponent = function() {
  // Name company
  var opponentName = "Central"
  var oppOrder = [];
  Opponent = new Railway(opponentName);
  // Grant contract deposit
  Opponent.adjustRevenue(Route.contractDeposit);
  // Select amount of supplies to order based on Players order plus/minus a randomized coeffient
  // Loop through the number of materials in Players supply
  for ( i = 0; i < Object.keys(Player.supplies).length; i++ ) {

    // Switch that decides whether to increment up or down
    var plusMinus = Math.round(Math.random());
    var rand = Math.random()
    console.log("accessed " + Object.keys(Player.supplies)[i] );

    // Build order array
    if ( plusMinus ) {
      oppOrder[i] = Math.floor(Object.keys(Player.supplies)[i] * ( 1 + rand ));
      console.log(oppOrder[i]);
    } else {
      oppOrder[i] = Math.floor(Object.keys(Player.supplies)[i] * ( 1 - rand ));
      console.log(oppOrder[i]);
    };
  };

  // Build order object from order array
  var order = new Order(oppOrder);
  // Submit order
  Opponent.makeOrder(order);
  console.log(Opponent.supplies);

    // if ( plusMinus ) {
    //   for ( i=0; i<=2; i++) {
    //     // Fill in order array
    //     var rand = Math.random();
    //     oppOrder[i] = Math.floor(Player.supplies[key] * ( 1 + rand ));
    //     // Build new order
    //     var order = new Order(oppOrder);
    //     // Submit order
    //     Opponent.makeOrder(order);
    //   };
    // } else {
    //   for ( i=0; i<2; i++) {
    //     var rand = Math.random();
    //     oppOrder[i] = Math.floor(Player.supplies[key] * ( 1 - rand));
    //     var order = new Order(oppOrder);
    //     Opponent.makeOrder(order);
    //   };
    // };
  // // Calculate totalCost of order
  // var totalCost = 0;
  // for ( key in Materials ) {
  //   totalCost += Materials[key].price * Opponent.supplies[key];
  // };
  // // Subtract totalCost from Opponent revenue
  // Opponent.adjustRevenue(-totalCost);
};

// Main Race Method | Takes bother Player and Opponent objects as arguments
Race.initRace = function (player, opponent) {
  // Assign objects to arguments
  var player = player;
  var opponent = opponent;
  // Both players progress
  var progress = function() {
    return player.currentMiles + opponent.currentMiles;
  };
  // Find material properties
  var wood = Materials['wood'];
  var steel = Materials['steel'];
  var labor = Materials['labor'];

  // Check players have not converged
  while ( progress() < Route.distance ) {

    // Run loop for at least the length of Route.distance
    for ( i = 0; i < Route.distance; i++ ) {
      if ( player.checkSupplies() && opponent.checkSupplies() ) {
        // Build one mile for player
        for ( key in Materials ) {
          // Subtract amount of supply used to make one mile of track
          player.supplies[key] -= Materials[key].consumptionRate;
          opponent.supplies[key] -= Materials[key].consumptionRate;
          // Subtract price of material just used
          var cost = Materials[key].consumptionRate * Materials[key].price;
          player.adjustRevenue(cost);
          opponent.adjustRevenue(cost);
          // Advance player
          player.currentMiles++;
          opponent.currentMiles++;
          // Update progress
          return progress();
        };
      // When player runs out of supplies but opponent continues
      } else if ( player.checkSupplies() == false && opponent.checkSupplies() == true ) {
        // Loop through materials
        for ( key in Materials ) {
          // Build a mile for opponent
          opponent.supplies[key] -= Materials[key].consumptionRate;
          // Subtract cost of mile from opponent bank
          var cost = Materials[key].consumptionRate * Materials[key].price;
          opponent.adjustRevenue(cost);
          // Update progress
          return progress();
        };
        // When opponent depletes supplies but Player continues
      } else if ( player.checkSupplies() == true && opponent.checkSupplies() == false ) {
        // Loop through materials
        for ( key in Materials ) {
          // Build mile for player
          player.supplies[key] -= Materials[key].consumptionRate;
          // Subtract cost of mile
          var cost = Materials[key].consumptionRate * Materials[key].price;
          player.adjustRevenue(cost);
          // Update progress
          return progress();
        };
      } else if ( player.checkSupplies() == false && opponent.checkSupplies() == false ) {
          // See whats up
          return progress();
      };
    };
  };
};


// Generic object for basic race route information
var Route = {
  distance: 1900,
  unit: "miles",
  contractDeposit: 20000,
  mileReward: 10
};


// Create Object to reference HTML elements and Classes
// Assets{}...
var Assets = new Object();
