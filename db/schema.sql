-- Drop the database if it already exists
DROP DATABASE IF EXISTS employee_db;

-- Create a new database named "employee_db"
CREATE DATABASE employee_db;

-- Use the newly created database
USE employee_db;

-- Create a table to store department information
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

-- Create a table to store role information
CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) 
  REFERENCES department(id)
  ON DELETE CASCADE
);

-- Create a table to store employee information
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) 
    REFERENCES roles(id)
    ON DELETE CASCADE
);
