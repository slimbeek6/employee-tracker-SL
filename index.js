var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "top_songsDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runCMS();
});

const cmsoptions = ["View All Employees", "View All Employees by Department", "View All Employees by Manager","Add Employee","Remove Employee", "Update Employee Role","Update Employee Manager","View All Roles", "Add Role","Remove Role","Exit"];

function CMS () {
    inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "",
        choices: cmsoptions
    })
    .then(function (answer) {
        switch (answer.action) {
            case "View All Employees":
                showEmployees();
                break;
        
            case "View All Employees by Department":
                searchEmplDept();
                break;

            case "View All Employees by Manager":
                searchEmplMan();
                break;
            
            case "Add Employee":
                addEmpl();
                break;

            case "Remove Employee":
                removeEmpl();
                break;

            case "Update Employee Role":
                updateEmplRole();
                break;
            
            case "Update Employee Manager":
                updateEmplMan();
                break;
            
            case "View All Roles":
                showRoles();
                break;
            
            case "Add Role":
                addRole();
                break;

            case "Remove Role":
                removeRole();
                break;
        }    
   });
}