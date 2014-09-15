// Contructor for creating each player, including main player and opponent
Railway = function(name) {
  this.name = name;
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
      console.log("Your order is too large!");
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
      if ( this.supplies[key] <= Materials[key].consumptionRate ) {
        return false;
      } else {
        return true;
      };
    };
  };

  // For building one mile of track. First, checks if supplies are depleted
  this.buildMile = function() {
    if ( this.checkSupplies() ) {
      for ( key in this.supplies ) {
        this.supplies[key] -= Materials[key].consumptionRate;
      };
      this.currentMiles++;
      this.adjustRevenue(Route.mileReward);
      return true;
    } else {
      return false;
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
Race.buildPlayer = function(name, wood, steel, labor) {

  var companyName = name;
  var companyOrder = [];
  companyOrder[0] = wood;
  companyOrder[1] = steel;
  companyOrder[2] = labor;
  // Create order object
  var order = new Order(companyOrder);
  // Build company
  Player = new Railway(companyName);
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
  for ( key in Player.supplies ) {

    var supply = Player.supplies[key];
    // Switch that decides whether to increment up or down
    var plusMinus = Math.round(Math.random());
    var rand = Math.random();

    console.log("Player has " + supply);

    // Build order array
    if ( plusMinus ) {
      console.log("Plus!")
      switch ( key ) {
        case "wood":
          oppOrder[0] = Math.floor(supply * ( 1 + rand ));
          console.log(oppOrder[0])
          break;
        case 'steel':
          oppOrder[1] = Math.floor(supply * ( 1 + rand ));
          console.log(oppOrder[1])
          break;
        case 'labor':
          oppOrder[2] = Math.floor(supply * ( 1 + rand ));
          console.log(oppOrder[2])
          break;
      };
    } else {
      console.log("Minus!");
      switch ( key ) {
        case "wood":
          oppOrder[0] = Math.floor(supply * ( 1 - rand ));
          console.log(oppOrder[0])
          break;
        case 'steel':
          oppOrder[1] = Math.floor(supply * ( 1 - rand ));
          console.log(oppOrder[1])
          break;
        case 'labor':
          oppOrder[2] = Math.floor(supply * ( 1 - rand ));
          console.log(oppOrder[2])
          break;
      };
    };
  };

  // Build order object from order array
  var order = new Order(oppOrder);
  // Submit order
  console.log(oppOrder);
  Opponent.makeOrder(order);
  console.log(Opponent.supplies);
};

// Race method to check progress. Sum of players current miles
Race.progress = function () {
  return Player.currentMiles + Opponent.currentMiles;
};

// Main Race Method | Takes bother Player and Opponent objects as arguments
Race.turn = function (player, opponent) {

  if ( this.progress() < Route.distance ) {
    player.buildMile();
    opponent.buildMile();
  } else {
    console.log("Race over!");
  };
};

Race.run = function () {

  for ( i = 0; i < Route.distance; i++ ) {
    this.turn(Player, Opponent);
    console.log(this.progress());
  };

};

Race.init = function () {
  this.buildPlayer("Eastern", 1000,1200,10);
  this.buildOpponent();
  this.run();
}



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
