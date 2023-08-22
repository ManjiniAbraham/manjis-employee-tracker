INSERT INTO department (department_name)
VALUES
  ("Engineering"),
  ("Support"),
  ("Human Resource"),
  ("Finance"),
  ("Legal"),
  ("Sales"),
  ("Leadership");


INSERT INTO roles (title, salary, department_id)
VALUES
  ("Software Engineer", 7500, 1),
  ("Associate Support Engineer", 5500, 2),
  ("Senior HR", 6500, 3),
  ("Financial Analyst", 7500, 4),
  ("Legal Advisor", 7500, 5),
  ("Sales Executive", 8500, 6),
  ("Manager", 12000, 7);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Thomas", "Reni", 1, 7),
  ("Jacob", "Mark", 2, 7),
  ("Stanley", "Matthew", 3, NULL),
  ("Joseph", "Sammuel", 4, 13),
  ("Aliya", "Nazir", 5, 13),
  ("Alina", "Ruben", 6, 13),
  ("Maria", "Cherian", 7, NULL),
  ("Jaya", "Ratheesh", 6, 7),
  ("Tara", "Jacob", 4, 7),
  ("Stephen", "Marc", 6, 7),
  ("Roger", "McDonald", 1, 13),
  ("Timothy", "Sam", 1, 13),
  ("Eric", "Straut", 7, 13);
