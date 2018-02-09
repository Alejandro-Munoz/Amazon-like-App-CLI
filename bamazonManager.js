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
		console.log("Record updated!");
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

function viewProductsForSale(){
	queryString = "Select item_id, substring(product_name,1,20)product_name, price, stock_quantity from products where stock_quantity > 0 order by stock_quantity desc";
	// console.log(queryString);
	connection.query(queryString, function (error, results) {
		if (error) throw error;
		console.log("| Product Id | Product Name         | Product Price | Product Quantity");
		console.log("| ---------- | -------------------- | ------------- | ----------------");

		for(var i = 0; i < results.length; i++){
			console.log("| " + results[i].item_id + "         | " + results[i].product_name + "      | " + results[i].price + " | " + results[i].stock_quantity + " |");
		}
	});
}

function viewLowInventory(){
	queryString = "Select item_id, substring(product_name,1,20)product_name, price, stock_quantity from products where stock_quantity < 5 order by stock_quantity desc";
	// console.log(queryString);
	connection.query(queryString, function (error, results) {
		if (error) throw error;
		console.log("| Product Id | Product Name         | Product Price | Product Quantity");
		console.log("| ---------- | -------------------- | ------------- | ----------------");

		for(var i = 0; i < results.length; i++){
			console.log("| " + results[i].item_id + "         | " + results[i].product_name + "      | " + results[i].price + " | " + results[i].stock_quantity + " |");
		}
	});	
}


function addToInventory(){
	
	//prompt user
	inquirer.prompt([
		{
			type:"input",
			message:"What is the ID of the product you would like to update?",
			name:"id"
		},
		{
			type:"input",
			message:"How many units of the product you would like to Add?",
			name:"units"
		}
	]).then(function(answers){
		
		// console.log(answers.id, answers.units);
		queryString = "Update products set stock_quantity = stock_quantity+" + answers.units + " where item_id="+ answers.id;
		connection.query(queryString, function (error, results) {
			if (error) throw error;
			console.log("|-----------------------|")
			console.log("  Inventory Updated!!!!  ");
			console.log("|-----------------------|")

			connection.end();
			
		});
	});	
}

//Create new product
function createNewProduct(){
	console.log("|-----------------------|")
	console.log("  Create New Product  ");
	console.log("|-----------------------|")	

	//prompt user
	inquirer.prompt([
		{
			type:"input",
			message:"Enter Product Name:",
			name:"name"
		},
		{
			type:"input",
			message:"Enter Product Department:",
			name:"department"
		},
		{
			type:"input",
			message:"Enter Product Price:",
			name:"price"
		},
		{
			type:"input",
			message:"Enter Product Stock Quantity:",
			name:"quantity"
		}
	]).then(function(answers){
		
		// console.log(answers.id, answers.units);
		queryString = "Insert into products (item_id, product_name, department_name, price, stock_quantity) values("+")";
		connection.query(queryString, function (error, results) {
			if (error) throw error;
			console.log("|-----------------------|")
			console.log("  New Product Created!!!!  ");
			console.log("|-----------------------|")

			connection.end();
			
		});
	});		
}


function managerView(){
	
	//prompt user
	inquirer.prompt([
		{
			type:"list",
			message:"What would you like to do:",
			name:"choice",
			choices:["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add new Product"]
		}
		
	]).then(function(answers){
		
		console.log(answers.choice);

		switch(answers.choice){
			case "View Products For Sale":
				viewProductsForSale();
				break;
			case "View Low Inventory":
				viewLowInventory();
				break;
			case "Add To Inventory":
				addToInventory();
				// console.log("add inven")
				break;
			case "Add new Product":
				createNewProduct();
				// console.log("add prod")

				break;
		}
	});	
	// connection.end();
}

managerView();

// getAllProducts();
// askProduct();






