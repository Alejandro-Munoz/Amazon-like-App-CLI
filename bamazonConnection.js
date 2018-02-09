
var mysql = require("mysql");
// var inquirer = require("inquirer");
// var queryString;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon'
});


module.exports = connection;