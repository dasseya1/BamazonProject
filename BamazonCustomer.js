var mysql = require("mysql");
var fs = require("fs");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "Bamazon"
});

// connect to the database
connection.connect(function(err) {
  if (err) throw err;
});

//These are some variables
var results = "";
var readTable = 'SELECT * FROM products';
var checkQuantity = 'SELECT stock_quantity FROM products WHERE item_id=?';
var updateRecord = 'UPDATE products SET stock_quantity = ? WHERE item_id = ?';
var getPrice = 'SELECT price FROM products WHERE item_id = ?';

var start = function() {
  // Display the table products
  connection.query(readTable, function(err, rows) {
    if (err) {
      throw err;
    } else {
      console.log("| ID | " + "Names |" + " Price |");
      for (var i = 0; i < rows.length; i++) {
        console.log("| " + rows[i].item_id + " | " + rows[i].product_name + " | " + rows[i].price + " |");
      }
    }
  });
  options();
}


var options = function() {
  connection.query(readTable, function(err, rows) {
    //Get product ID and quantity from the buyer
    inquirer.prompt([{
        type: 'input',
        name: 'id',
        message: 'What is the ID of the product you want to buy?',
      },
      {
        type: 'input',
        name: 'quantity',
        message: 'How many units of the product would you like to buy?',
      }
    ]).then(function(answer) {

      //Check the stock on hand before making the sale
      var price = "";
      var newQuantity = "";
      var totalPrice = "";
      var quantityOnHand = "";
      totalPrice = parseInt(answer.quantity) * parseFloat(price);
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].item_id === answer.id) {
          quantityOnHand = rows[i].stock_quantity;
          price = rows[i].price;
          totalPrice = parseInt(answer.quantity) * parseFloat(price);
          newQuantity = parseInt(quantityOnHand) - parseInt(answer.quantity);
        }
      }

      if (quantityOnHand >= answer.quantity) {
        console.log("Thank you for your business!");

        //Update a record
        connection.query(updateRecord, [newQuantity, answer.id], function(err, res) {
          if (err) throw err;
          else {

            console.log('Your total purchase price is $' + totalPrice);
          }
        });
      } else {
        console.log("Insufficient quantity!");
      }
    });
  });
}

start();
