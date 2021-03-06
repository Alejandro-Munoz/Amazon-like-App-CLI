var connection = require("./bamazonConnection.js");
var inquirer = require("inquirer");
var queryString;


function viewProductsForSale(cb){
	queryString = "Select item_id, substring(product_name,1,20)product_name, price, stock_quantity from products where stock_quantity > 0 order by stock_quantity desc";
	// console.log(queryString);
	
	console.log(".");
	console.log("..")
	console.log("...")

	console.log("|-----------------------|")
	console.log("|  Products For Sale    |");
	console.log("|_______________________|")	
	connection.query(queryString, function (error, results) {
		if (error) throw error;
		console.log("| Product Id | Product Name         | Product Price | Product Quantity");
		console.log("| ---------- | -------------------- | ------------- | ----------------");

		for(var i = 0; i < results.length; i++){
			console.log("| " + results[i].item_id + "         | " + results[i].product_name + "      | " + results[i].price + " | " + results[i].stock_quantity + " |");
		}
	cb();	
	});
	//connection.end();
}

function viewLowInventory(cb){
	queryString = "Select item_id, substring(product_name,1,20)product_name, price, stock_quantity from products where stock_quantity < 5 order by stock_quantity desc";
	// console.log(queryString);
	console.log("|-----------------------|")
	console.log("  Low Inventory   ");
	console.log("|-----------------------|")	
	connection.query(queryString, function (error, results) {
		if (error) throw error;
		console.log("| Product Id | Product Name         | Product Price | Product Quantity");
		console.log("| ---------- | -------------------- | ------------- | ----------------");

		for(var i = 0; i < results.length; i++){
			console.log("| " + results[i].item_id + "         | " + results[i].product_name + "      | " + results[i].price + " | " + results[i].stock_quantity + " |");
		}
		cb();
	});	
}


function addToInventory(){
	console.log("|-----------------------|")
	console.log("  Add to Inventory  ");
	console.log("|-----------------------|")	
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

			// connection.end();
			managerView();
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
			message:"Enter Product Department ID:",
			name:"dep_id",
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
		queryString = `Insert into products (product_name, department_id, price, stock_quantity) 
						values('`+ answers.name +`','`+ answers.dep_id+`',
						`+answers.price+`,`+answers.quantity+`)`;
						// console.log(queryString);
		connection.query(queryString, function (error, results) {
			if (error) throw error;
			console.log("|-----------------------|")
			console.log("  New Product Created!!!!  ");
			console.log("|-----------------------|")

			// connection.end();
			managerView();
			
		});
	});		
}


function managerView(){
	console.log("|-------------------------------------------------|")
	console.log("|      W E L C O M E   TO    B A M A Z O N        |");
	console.log("|-------------------------------------------------|")
	console.log("|                 Manager View                    |")
	console.log("|_________________________________________________|")

	//prompt user
	inquirer.prompt([
		{
			type:"list",
			message:"What would you like to do:",
			name:"choice",
			choices:["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add new Product","Exit"]
		}
		
	]).then(function(answers){
		
		switch(answers.choice){
			case "View Products For Sale":
				viewProductsForSale(function(){
					// connection.end();
					// console.log("regresa");
					managerView();
				});
				break;
			case "View Low Inventory":
				viewLowInventory(function(){
					managerView();
				});
				break;
			case "Add To Inventory":
				addToInventory();
				break;
			case "Add new Product":
				createNewProduct();
				break;
			case "Exit":
				connection.end();
				return;
				break;
		}
	});	
	// connection.end();
}

managerView();





