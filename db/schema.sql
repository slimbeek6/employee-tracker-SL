DROP DATABASE IF EXISTS employee_managementDB;
CREATE DATABASE employee_managementDB;

USE employee_managementDB;

CREATE TABLE departments(
 id INT NOT NULL PRIMARY KEY,
 name VARCHAR(100)
);

CREATE TABLE employees(
 id INT NOT NULL PRIMARY KEY,
 first_name VARCHAR(100),
 last_name VARCHAR(100),
 role_id INT,
 department_id INT,
 manager_id INT
);

CREATE TABLE roles(
 id INT NOT NULL PRIMARY KEY,
 title VARCHAR(100),
 salary DECIMAL (30,2),
 department_id INT
);
