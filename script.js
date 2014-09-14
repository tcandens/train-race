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
        orderObject[key] -= 1;
        console.log(orderObject[key]);
        totalCost -= Materials[key].price;
        console.log(totalCost);
      };
    };
    // Assign supplies and subtract order
    this.adjustRevenue(-totalCost);
    this.setSupplies(orderObject);
  };
};

// Constructor for building materials
Material = function(name, price, consumptionRate) {
  this.name = name;
  this.price = price;
  this.consumptionRate = consumptionRate;
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
  var companyName = prompt("Whats your companies name?");
  // Build order array
  var companyOrder = []
  companyOrder[0] = prompt("How much wood?");
  companyOrder[1] = prompt("How much steel?");
  companyOrder[2] = prompt("How many workers?");
  // Create order object
  var order = new Order(companyOrder);
  // Build company
  Player = new Railway(companyName);
  // Grant contract deposit
  Player.adjustRevenue(Route.contractDeposit);

  Player.makeOrder(order);
};

// Initiate opponent company
Race.buildOpponent = function() {
  // Name company
  var opponentName = "Central"
  Opponent = new Railway(opponentName);
  // Grant contract deposit
  Opponent.adjustRevenue(Route.contractDeposit);
  // REDO TO INCLUDE .makeOrder()
  // Select amount of supplies to order based on Players order plus/minus a randomized coeffient
  for ( key in Materials ) {
    var rand = Math.random();
    // Empty order array
    var oppOrder = [];
    // Switch that decides whether to increment up or down
    var plusMinus = Math.round(Math.random());
    if ( plusMinus ) {
      for ( i=0; i<=2; i++) {
        // Fill in order array
        oppOrder[i] = Math.floor(Player.supplies[key] * ( 1 + rand ));
        // Build new order
        var order = new Order(oppOrder);
        // Submit order
        Opponent.makeOrder(order);
      };
    } else {
      for ( i=0; i<2; i++) {
        oppOrder[i] = Math.floor(Player.supplies[key] * ( 1 - rand));
        var order = new Order(oppOrder);
        Opponent.makeOrder(order);
      };
    };
  };
  // Calculate totalCost of order
  var totalCost = 0;
  for ( key in Materials ) {
    totalCost += Materials[key].price * Opponent.supplies[key];
  };
  // Subtract totalCost from Opponent revenue
  Opponent.adjustRevenue(-totalCost);
};


// Generic object for basic race route information
var Route = {
  distance: 1900,
  unit: "miles",
  contractDeposit: 20000
};


// Create Object to reference HTML elements and Classes
// Assets{}...
var Assets = new Object();
