var mysql = require("mysql");
var express = require("express");
var inquirer = require("inquirer");

var app = express();

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employee_managementDB"
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connection.connect(function(err) {
  if (err) throw err;
  runCMS();
});


const cmsoptions = ["View All Employees", "View All Employees by Department", "View All Employees by Manager","Add Employee","Remove Employee", "Update Employee Role","Update Employee Manager","View All Roles", "Add Role","Remove Role","Exit"];

function runCMS () {
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

function showEmployees() {
    connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, managers.name FROM employees LEFT JOIN roles ON roles.id = employees.role_id LEFT JOIN departments ON employees.department_id = departments.id LEFT JOIN managers ON managers.employee_id = employees.manager_id;", function(err, res) {
        // console.log("\n");
        console.table(res);
        console.log("What would you like to do?");
        runCMS();
    });
}

function searchEmplDept() {
    connection.query("SELECT * FROM employees", function(err, res) {
        // console.log("\n");
        console.table(res);
        console.log("What would you like to do?");
        runCMS();
    });
}

