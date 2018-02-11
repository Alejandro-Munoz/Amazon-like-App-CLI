// var mysql = require("mysql");
var connection = require("./bamazonConnection.js");
var inquirer = require("inquirer");
var queryString;


function getAllProducts(){
	queryString = "Select * from products";

	connection.query(queryString, function (error, results, fields) {
	  if (error) throw error;
	  console.log(results);
	  for(var i = 0; i < results.length; i++){
	  	console.log("Id: " + results[i].item_id + " | Name: " + results[i].product_name + " | Price: " + results[i].price);
	  }
	  
	   askProduct();


	});
}

function checkStockByProduct(productId, cb){
	queryString = "Select stock_quantity from products where item_id=" + productId;
	var stock;
	connection.query(queryString, function (error, results, fields) {
		if (error) throw error;
		//if no error, set stock
		stock = results[0].stock_quantity;
	
		cb(stock);

	});
}

function updateInventory(productId, quantity){

	queryString = "Update products set stock_quantity = stock_quantity-" + quantity + ", product_sales=price*"+ quantity + " where item_id="+ productId;
	connection.query(queryString, function (error, results) {
		
		if (error) throw error;
		
		connection.end();
		
	});
}

function getTotalCostOfPurchase(productId,quantity,cb){
	queryString = "Select (price * " + quantity + ") total from products where item_id="+productId;
	connection.query(queryString, function (error, results) {
		if (error) throw error;
		cb(results[0].total);
		
	});

}

function askProduct(){
	var stock;

	console.log("|-------------------------------------------------|")
	console.log("|      W E L C O M E   TO    B A M A Z O N        |");
	console.log("|-------------------------------------------------|")
	console.log("|                 Customer View                    |")
	console.log("|_________________________________________________|")
	//prompt user
	inquirer.prompt([
		{
			type:"input",
			message:"What is the ID of the product you would like to buy",
			name:"id"
		},
		{
			type:"input",
			message:"How many units of the product you would like to buy",
			name:"units"
		}
	]).then(function(answers){

		var stock = checkStockByProduct(answers.id, function(stock){
		if(stock < answers.units){
			console.log("Insufficient quantity!");
			askProduct();
		}
		else{
			//update inventory
			updateInventory(answers.id,answers.units);
			//show total cost of purchase
			getTotalCostOfPurchase(answers.id,answers.units,function(total){
				
				console.log("|-----------------------------------------|")
				console.log("Total Cost Of Purchase: $",total);
				console.log("|-----------------------------------------|")
			});

		}

		})
	});	
	// connection.end();
}

getAllProducts();






