var connection = require("./bamazonConnection.js");
var inquirer = require("inquirer");
var queryString;



function viewProductsByDepartment(cb){
	queryString = "Select d.department_name department, sum(p.product_sales) salesbydepartment from products p, departments d where p.department_id = d.department_id group by department";
	
	console.log(".");
	console.log("..")
	console.log("...")

	console.log("|----------------------------------|")
	console.log("|  Products Sales By Department    |");
	console.log("|__________________________________|")	
	connection.query(queryString, function (error, results) {
		if (error) throw error;
		console.log("| Department      | Sales    |");
		console.log("| --------------- | -------- |");

		for(var i = 0; i < results.length; i++){
			console.log("| " + results[i].department + "	| " + results[i].salesbydepartment + " |");
		}
		cb();
	});	
}

//Create new department
function createNewDepartment(){
	console.log("|-----------------------|")
	console.log("  Create New Department  ");
	console.log("|-----------------------|")	

	//prompt user
	inquirer.prompt([
		{
			type:"input",
			message:"Enter Department Name:",
			name:"name"
		},
		{
			type:"input",
			message:"Enter Over Head Costs",
			name:"ohc"
		}
	]).then(function(answers){
		
		queryString = `Insert into departments (department_name, over_head_costs) 
						values('`+ answers.name +`',`+ answers.ohc +`)`;
						console.log(queryString);
		connection.query(queryString, function (error, results) {
			if (error) throw error;
			console.log("|----------------------------|")
			console.log("  New Department Created!!!!  ");
			console.log("|----------------------------|")

			connection.end();
			
		});
	});		
}


function supervisorView(){
	console.log("|-------------------------------------------------|")
	console.log("|      W E L C O M E   TO    B A M A Z O N        |");
	console.log("|-------------------------------------------------|")
	console.log("|                 Supervisor View                 |")
	console.log("|_________________________________________________|")

	//prompt user
	inquirer.prompt([
		{
			type:"list",
			message:"What would you like to do?:",
			name:"choice",
			choices:["View Product Sales by Department", "Create New Department"]
		}
		
	]).then(function(answers){
		
		switch(answers.choice){
			case "View Product Sales by Department":
				viewProductsByDepartment(function(){
					console.log("                                      ");
					console.log("-------------END OF REPORT------------");
					console.log("                                      ");

					supervisorView();
				});
				break;
			case "Create New Department":
				createNewDepartment();
				break;
		}
	});	
}

supervisorView();






