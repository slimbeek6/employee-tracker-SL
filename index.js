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


const cmsoptions = ["View All Employees", "View All Employees by Department", "View All Employees by Manager","Add Employee","Remove Employee", "View All Departments","View All Roles", "Add Role","Remove Role","Exit"];

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

            case "View All Departments":
                showDepartments();
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

            case "Exit":
                connection.end();
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

var departmentArr = ["Engineering","HR","Finance","Sales"];

function searchEmplDept() {
    inquirer
    .prompt({
        name: "department",
        type: "list",
        message: "What department would you like to see?",
        choices: departmentArr
    })
    .then(function(answer) {
        var departmentid = departmentArr.indexOf(answer.department) + 1;
        // console.log(departmentid);
        connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, managers.name FROM employees LEFT JOIN roles ON roles.id = employees.role_id INNER JOIN departments ON employees.department_id = departments.id AND employees.department_id = ? LEFT JOIN managers ON managers.employee_id = employees.manager_id;", departmentid, function(err, res) {
            console.table(res);
            console.log("What would you like to do?");
            runCMS();
        });
    });
}

var managerArr = [];

function searchEmplMan () {
    connection.query("SELECT name FROM managers", function(err, res) {
        for (var i=0; i < res.length; i++) {
            managerArr.push(res[i].name);
        }
    
        inquirer
        .prompt({
            name: "manager",
            type: "list",
            message: "What manager's team would you like to see?",
            choices: managerArr
        })
        .then(function(answer) {
            var managername = answer.manager;
            connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, managers.name FROM employees LEFT JOIN roles ON roles.id = employees.role_id LEFT JOIN departments ON employees.department_id = departments.id INNER JOIN managers ON managers.employee_id = employees.manager_id AND managers.name =?;", managername, function(err, res) {
                console.table(res);
                console.log("What would you like to do?");
                runCMS();
            });
        });
    });    
}

var rolesArr = [];

function addEmpl () {
    connection.query("SELECT * FROM managers", function(err, res) {
        for (var i=0; i < res.length; i++) {
            // console.log(res);
            var obj = {name: res[i].name, id: res[i].employee_id};
            managerArr.push(obj);
        }

        var mgrArr = [];
        for (var j = 0; j < managerArr.length; j++) {
            mgrArr.push(managerArr[j].name);
        }

        connection.query("SELECT title FROM roles;", function(err, res) {
            for (var i=0; i < res.length; i++) {
                rolesArr.push(res[i].title);
            }
            // console.log(managerArr);

            inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the employee's first name?"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the employee's last name?"
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the employee's role?",
                    choices: rolesArr
                },
                {
                    name: "department",
                    type: "list",
                    message: "What is the employee's department?",
                    choices: departmentArr
                },
                {
                    name: "manager",
                    type: "list",
                    message: "What is the employee's first name?",
                    choices: mgrArr
                },
            ])
            .then(function(answer) {
                var first_name = answer.first_name;
                var last_name = answer.last_name;
                var role_id = rolesArr.indexOf(answer.role) +1;
                var department_id = departmentArr.indexOf(answer.department) +1;
                var mgr1 = mgrArr.indexOf(answer.manager);
                // console.log(managerArr);
                
                var manager_id = managerArr[mgr1].id;
                // console.log(managerId);
                connection.query("INSERT INTO employees SET ?;", { first_name, last_name, role_id, department_id, manager_id} , function(err) {
                    if (err) throw err;
                    console.log("Your employee was saved successfully!");
                    console.log("What would you like to do?");
                    runCMS();
                });
            });
        });
    });
}

var emplArr = [];
var emplNames = [];

function removeEmpl () {
    connection.query("Select first_name, last_name, id FROM employees", function(err, res) {
        for (var i =0; i < res.length; i++) {
            var fullName = res[i].first_name + " " + res[i].last_name;
            var obj = {fullName: fullName, id: res[i].id}
            emplArr.push(obj);
            emplNames.push(fullName);
        }        

        // console.log(emplArr);

        inquirer
        .prompt({
            name: "employee",
            type: "list",
            message: "Which employee do you want to delete?",
            choices: emplNames
        })
        .then(function(answer) {
            var emplind = emplNames.indexOf(answer.employee);
            var emplname = answer.employee;
            var emplid = emplArr[emplind].id;

            connection.query("DELETE FROM employees WHERE ?", {id: emplid}, function(err) {
                if (err) throw err;
                console.log("Employee "+ emplname + " has been removed");
                runCMS();
            });
        });
    });  
}

function showRoles () {
    connection.query("SELECT * FROM roles;", function(err, res) {
        // console.log("\n");
        console.table(res);
        console.log("What would you like to do?");
        runCMS();
    });
}

var deptArr = [];
var deptNames = [];

function addRole () {
    connection.query("Select * FROM departments", function(err, res) {
        for (var i =0; i < res.length; i++){
            var obj = {department_name : res[i].department_name, id: res[i].id};
            deptArr.push(obj);
            deptNames.push(res[i].department_name)
        }

        inquirer
        .prompt([
            {
                name: "role",
                type: "input",
                message: "What is the name of the role?"
            },
            {
                name: "department",
                type: "list",
                message: "What department is this role in?",
                choices: deptNames
            },
            {
                name: "salary",
                type: "decimal",
                message: "What is the salary for this role?"
            }
        ])
        .then(function(answer) {
            var roleName = answer.role;
            var departmentName = answer.department; 
            var salaryAmt = answer.salary;
            var deptInd = deptNames.indexOf(departmentName);
            var deptid = deptArr[deptInd].id;
            connection.query("INSERT INTO roles SET ?", {title: roleName, salary: salaryAmt, department_id: deptid}, function(err) {
                if (err) throw err;
                console.log("New role "+ roleName + " has been added to the role list");
            });
            runCMS();
        });
    });
}

var roleArr = [];
var roleNames = [];

function removeRole() {
    connection.query("SELECT * FROM roles", function(err, res) {
        for (var i =0; i < res.length; i++) {
            roleNames.push(res[i].title);
            var obj = {title: res[i].title, id: res[i].id};
            roleArr.push(obj);
        }
        console.log(roleNames);
        inquirer
        .prompt({
            name: "role",
            type: "list",
            message: "Which role would you like to delete?",
            choices: roleNames
        })
        .then(function(answer) {
            var roleNm = answer.role;
            var role_ind = roleNames.indexOf(roleNm);
            var role_id = roleArr[role_ind].id;

            connection.query("DELETE FROM roles WHERE ?", {id: role_id}, function(err) {
                if (err) throw err;
                console.log("The role "+ roleNm + "was removed.");
                runCMS();
            });
        });
    });
}


function showDepartments () {
    connection.query("SELECT * FROM departments;", function(err, res) {
        // console.log("\n");
        console.table(res);
        console.log("What would you like to do?");
        runCMS();
    });
}