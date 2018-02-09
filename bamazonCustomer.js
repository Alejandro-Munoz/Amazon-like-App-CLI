// var mysql = require("mysql");
var connection = require("./bamazonConnection.js");
var inquirer = require("inquirer");
var queryString;

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'bamazon'
// });

function getAllProducts(){
	queryString = "Select * from products";

	connection.query(queryString, function (error, results, fields) {
	  if (error) throw error;
	  console.log(results);
	  for(var i = 0; i < results.length; i++){
	  	console.log("Id: " + results[i].item_id + " | Name: " + results[i].product_name + " | Price: " + results[i].price);
	  }
	  // connection.end();
	  //return;
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
		//close connection
		// connection.end();
		//return stock
		cb(stock);

	});
}

function updateInventory(productId, quantity){
	queryString = "Update products set stock_quantity = stock_quantity-" + quantity + " where item_id="+ productId;
	connection.query(queryString, function (error, results) {
		
		if (error) throw error;
		
		console.log("|-----------------------|")
		console.log("  Record Updated!  ");
		console.log("|-----------------------|")
		
		connection.end();
		
	});
}

function getTotalCostOfPurchase(productId,quantity,cb){
	queryString = "Select (price * " + quantity + ") total from products where item_id="+productId;
	connection.query(queryString, function (error, results) {
		if (error) throw error;
		cb(results[0].total);
		// console.log("total: ",results[0].total);
		
	});

}

function askProduct(){
	var stock;
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
		
		console.log(answers.id, answers.units);
		var stock = checkStockByProduct(answers.id, function(stock){
			console.log("desd cb", stock);
		if(stock < answers.units){
			console.log("Insufficient quantity!");
			askProduct();
		}
		else{
			//update inventory
			updateInventory(answers.id,answers.units);
			//show total cost of purchase
			getTotalCostOfPurchase(answers.id,answers.units,function(total){
				
				console.log("|-----------------------|")
				console.log("Total Cost Of Purchase:",total);
				console.log("|-----------------------|")
			});

		}

		})
	});	
	// connection.end();
}



getAllProducts();
// askProduct();






