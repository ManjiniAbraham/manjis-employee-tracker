# Employee Tracker
  
  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)]

## Description

The project is to create an application called Employee Tracker to build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Credits](#credits)

## Installation

Install NodeJS. Also install 'inquirer', 'mysql2', 'dotenv' packages. 

## Usage

To run the application, in the correct location, Open integrated terminal and run'node index.js'.

Demo URL:  https://drive.google.com/file/d/11D8ur3cgknLXH6wJz7t8J1b7OuWEHDmF/view


## License

License: [ISC License (ISC)](https://opensource.org/licenses/ISC)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)]


## Credits

https://www.npmjs.com/package/inquirer

https://www.w3schools.com/sql/sql_insert.asp

https://www.npmjs.com/package/dotenv

https://ascii-generator.site/t/

https://www.tutorialspoint.com/sql/sql-using-joins.htm

https://www.youtube.com/watch?v=vncBSUNb4NA

https://www.freecodecamp.org/news/javascript-promise-tutorial-how-to-resolve-or-reject-promises-in-js/

## Features

* The Employee Tracker has the following features:
	* On running the application in the command line, the user is presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, update an employee role, Update employee manager,View employees by manager,View employee by department,View department budget and Exit.
	* On choosing to view all departments, user is presented with a formatted table showing department names and department ids.
    * On choosing to view all roles, user is presented with the job title, role id, the department that role belongs to, and the salary for that role
    * On choosing to view all employees, user is presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.
    * On choosing to add a department, user is prompted to enter the name of the department and that department is added to the database.
    * On choosing to add a role, user is prompted to enter the name, salary, and department for the role and that role is added to the database.
    * On choosing to add an employee, user is prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    * On choosing to update an employee role, user is prompted to select an employee to update and their new role and this information is updated in the database 
    * On choosing to Update employee manager, user is prompted to select an employee to update and to choose the new manager and the information is updated in the database.
    * On selecting View employees by manager, user is prompted to choose a manager and based on the selected manager the list of all employees reporting will be displayed.
    * On selecting View employee by department, user is prompted to choose a department and based on the selection all employees in that department will be listed.
    * On selecting View department budget, user will be prompted to choose a department and the total sum of salaries will be displayed for that chosen department. 
    * On choosing Exit, the user will be able to exit the application.


