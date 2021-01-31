INSERT INTO departments (name) 
VALUES ("Engineering"),
("HR"),
("Finance"),
("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Junior Engineer", 100000, 1),
("Senior Engineer", 150000, 1),
("Principal Engineer", 200000, 1),
("CPO", 175000, 2),
("Compensation", 125000, 2),
("CFO", 250000, 3),
("Business Analyst", 140000,3),
("Sales Associate", 75000, 4);


INSERT INTO employees (first_name, last_name, role_id, department_id, manager_id)
VALUES ("Shaun", "Limbeek", 5, 2, 2);