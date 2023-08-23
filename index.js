// Include packages needed for this application
const fs = require('fs');
const inquirer = require('inquirer');
const db = require('./db/connection');

const asciiArt = `
### ###  ##   ##  ### ##   ####      ## ##   ##  ##   ### ###  ### ###           #### ##  ### ##     ##      ## ##   ##  ###  ### ###  ### ##   
 ##  ##   ## ##    ##  ##   ##      ##   ##  ##  ##    ##  ##   ##  ##           # ## ##   ##  ##     ##    ##   ##  ##  ##    ##  ##   ##  ##  
 ##      # ### #   ##  ##   ##      ##   ##  ##  ##    ##       ##                 ##      ##  ##   ## ##   ##       ## ##     ##       ##  ##  
 ## ##   ## # ##   ##  ##   ##      ##   ##   ## ##    ## ##    ## ##              ##      ## ##    ##  ##  ##       ## ##     ## ##    ## ##   
 ##      ##   ##   ## ##    ##      ##   ##    ##      ##       ##                 ##      ## ##    ## ###  ##       ## ###    ##       ## ##   
 ##  ##  ##   ##   ##       ##  ##  ##   ##    ##      ##  ##   ##  ##             ##      ##  ##   ##  ##  ##   ##  ##  ##    ##  ##   ##  ##  
### ###  ##   ##  ####     ### ###   ## ##     ##     ### ###  ### ###            ####    #### ##  ###  ##   ## ##   ##  ###  ### ###  #### ##  
                                                                                                                                                
`;

console.log(asciiArt);

// Create an array of questions for user input
const questions = [
    {
        type: 'list',
        name: 'Question',
        message: 'What would you like to perform today?',
        choices:['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Update employee manager','View employees by manager','View employee by department','View department budget','Exit']
      },
  ];

  // Create a function to initialize app
function employeeTracker() {
    inquirer
      .prompt(questions)
      .then((answers) => {
        switch (answers.Question) { 
          case 'View all departments':
            viewDepartments();
            break;
          case 'View all roles':
            viewRoles();
            break;
          case 'View all employees':
            viewEmployees();
            break;
          case 'Add a department':
            addDepartment();
            break;
          case 'Add a role':
            addRole();
            break;
          case 'Add an employee':
            addEmployee();
            break;
          case 'Update an employee role':
            updateEmployeeRole(); 
            break;
          case 'Update employee manager':
            updateEmployeeManager();
            break;
         case 'View employees by manager':
            viewEmployeesByManager();
            break;
         case 'View employee by department':
            viewEmployeesByDepartment();
            break;
         case 'View department budget':
            viewDepartmentBudget();
            break;
         case 'Exit':
            db.end();
            break;
        }
      })
      .catch((error) => {
        console.error('Error prompting user:', error);
      });
  }


//function to view all department
  function viewDepartments() {
    db.query(`SELECT * FROM department`, (err, result) => {
      if (err) throw err;
      console.log('Viewing All Departments:');
      console.table(result);
      employeeTracker();
    });
  }

//function to view all roles
function viewRoles() {
    const sql = `
      SELECT 
        r.id AS role_id,
        r.title AS role_title,
        r.salary,
        d.department_name
      FROM roles AS r
      INNER JOIN department AS d ON r.department_id = d.id
    `;
  
    db.query(sql, (err, result) => {
      if (err) throw err;
  
      console.log('View All Roles:');
      console.table(result);
      employeeTracker();
    });
  }
  
//function to view all employees
function viewEmployees() {
    const sql = `
      SELECT 
        e.id AS employee_id,
        e.first_name,
        e.last_name,
        r.title AS job_title,
        d.department_name,
        r.salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee AS e
      INNER JOIN roles AS r ON e.role_id = r.id
      INNER JOIN department AS d ON r.department_id = d.id
      LEFT JOIN employee AS m ON e.manager_id = m.id
    `;
  
    db.query(sql, (err, result) => {
      if (err) throw err;
  
      console.log('View All Employees:');
      console.table(result);
      employeeTracker();
    });
  }
//function to add new department
const addDept =[
  {
    type: 'input',
    name: 'Name',
    message:'Please add department name:',
  },
];

function addDepartment() {
  inquirer
  .prompt(addDept)
  .then((answers) => {
    const departmentName = answers.Name;
    const sql = `INSERT INTO department (department_name) VALUES (?)`;
  db.query(sql, [departmentName], (err, result) => {
      if (err) throw err;
      console.log(`Department "${departmentName}" added successfully.`);
      employeeTracker(); 
    });
  })
    .catch((error) => {
    console.error('Error adding department:', error);
    employeeTracker(); 
  });
}

//function to add new role
  const addingRole = [
  {
    type: 'input',
    name: 'Role',
    message: 'Adding New Role -> Please add a title:',
  },
  {
    type: 'input',
    name: 'Salary',
    message: 'Adding New Role -> Please add salary:',
  },
  {
    type: 'checkbox',
    name: 'Department',
    message: 'Adding New Role -> Please choose the department:',
    choices: () => {
      return getDeptChoices(); // Fetch role choices dynamically
    },
  },
];

function addRole() {
    inquirer
      .prompt(addingRole)
      .then((answers) => {
        const roleName = answers.Role;
        const salary = answers.Salary;
        const departmentName = answers.Department; 


// Fetch the department_id based on the chosen department name
        getDepartmentId(departmentName)
          .then((departmentId) => {
            const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
  
            db.query(sql, [roleName, salary, departmentId], (err, result) => {
              if (err) {
                console.error('Error adding role:', err);
              } else {
                console.log(`Role "${roleName}" added successfully to department "${departmentName}".`);
              }
              employeeTracker(); 
            });
          })
          .catch((error) => {
            console.error('Error getting department ID:', error);
            employeeTracker(); 
          });
      })
      .catch((error) => {
        console.error('Error prompting for role information:', error);
        employeeTracker(); 
      });
  }
  
  // Function to fetch department ID based on department name
  function getDepartmentId(departmentName) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM department WHERE department_name = ?`;
      db.query(sql, [departmentName], (err, result) => {
        if (err) {
          reject(err);
        } else if (result.length === 0) {
          reject(new Error(`Department "${departmentName}" not found.`));
        } else {
          const departmentId = result[0].id;
          resolve(departmentId);
        }
      });
    });
  }
//function to get list of department names
 function getDeptChoices() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT department_name FROM department`;
      db.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const departmentNames = result.map((row) => row.department_name);
          resolve(departmentNames);
        }
      });
    });
  }

//to add a new employee
const addEmp = [
  {
    type: 'input',
    name: 'FirstName',
    message: 'Adding New Employee -> Please enter first name:',
  },
  {
    type: 'input',
    name: 'LastName',
    message: 'Adding New Employee -> Please add last name:',
  },
  {
    type: 'list',
    name: 'EmpRole',
    message: 'Adding New Employee -> Please choose the role:',
    choices: () => {
      return getRoleChoices(); // Fetch role choices dynamically
    },
  },
  {
    type: 'list',
    name: 'ManagerId', // Corrected name here
    message: 'Adding New Employee -> Please choose manager ID:',
    choices: () => {
      return getManagerChoices(); // Fetch Manager choices dynamically
    },
  },
];

// Function to fetch role choices from the database
function getRoleChoices() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT title FROM roles`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const roleTitles = result.map((row) => row.title);
        resolve(roleTitles);
      }
    });
  });
}

function getRoleId(roleTitle) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM roles WHERE title = ?`;
    db.query(sql, [roleTitle], (err, result) => {
      if (err) {
        reject(err);
      } else if (result.length === 0) {
        reject(new Error(`Role "${roleTitle}" not found.`));
      } else {
        const roleId = result[0].id;
        resolve(roleId);
      }
    });
  });
}

// Function to fetch department choices from the database
function getDeptChoices() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT department_name FROM department`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const departmentNames = result.map((row) => row.department_name);
        resolve(departmentNames);
      }
    });
  });
}

function getManagerChoices() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT DISTINCT CONCAT(e.first_name, ' ', e.last_name) AS manager_name
      FROM employee AS e
      JOIN roles AS r ON e.role_id = r.id
      WHERE r.title LIKE '%Manager%'
      ORDER BY manager_name;
    `;

    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        // Add "No manager" as the first choice
        const managerNames = ['No manager', ...result.map((row) => row.manager_name)];
        resolve(managerNames);
      }
    });
  });
}

function getManagerId(managerName) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?`;
    db.query(sql, [managerName], (err, result) => {
      if (err) {
        reject(err);
      } else if (result.length === 0) {
        reject(new Error(`Manager "${managerName}" not found.`));
      } else {
        const managerId = result[0].id;
        resolve(managerId);
      }
    });
  });
}

function addEmployee() {
  inquirer
    .prompt(addEmp)
    .then((answers) => {
      const firstName = answers.FirstName;
      const lastName = answers.LastName;
      const selectedRole = answers.EmpRole;
      const managerName = answers.ManagerId; // Manager name from user's choice

      // Fetch the role ID dynamically based on the selected role title
      getRoleId(selectedRole)
        .then((roleId) => {
          if (managerName === 'No manager') {
            // If user chose "No manager", set managerId to null
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, NULL)`;
            db.query(sql, [firstName, lastName, roleId], (err, result) => {
              if (err) {
                console.error('Error adding employee:', err);
              } else {
                console.log(`Employee "${firstName} ${lastName}" added successfully.`);
              }
              employeeTracker(); // Continue the application
            });
          } else {
            // Fetch the manager's ID based on the manager's name
            getManagerId(managerName)
              .then((managerId) => {
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                db.query(sql, [firstName, lastName, roleId, managerId], (err, result) => {
                  if (err) {
                    console.error('Error adding employee:', err);
                  } else {
                    console.log(`Employee "${firstName} ${lastName}" added successfully.`);
                  }
                  employeeTracker(); // Continue the application
                });
              })
              .catch((error) => {
                console.error('Error getting manager ID:', error);
                employeeTracker(); // Continue the application after an error
              });
          }
        })
        .catch((error) => {
          console.error('Error getting role ID:', error);
          employeeTracker(); // Continue the application after an error
        });
    })
    .catch((error) => {
      console.error('Error prompting for employee information:', error);
      employeeTracker(); // Continue the application after an error
    });
}

//Update Employee role
const updateEmpRole = [
  {
    type: 'list',
    name: 'EmployeeToUpdate',
    message: 'Select an employee to update their role:',
    choices: () => {
      return getEmployeeChoices(); // Fetch employee choices dynamically
    },
  },
  {
    type: 'list',
    name: 'NewRole',
    message: 'Select the new role for the employee:',
    choices: () => {
      return getRoleChoices(); // Fetch role choices dynamically
    },
  },
];

function updateEmployeeRole() {
    inquirer
      .prompt(updateEmpRole)
      .then((answers) => {
        const employeeToUpdate = answers.EmployeeToUpdate;
        const newRole = answers.NewRole;
  
        // Fetch the employee ID and role ID based on user's choices
        Promise.all([getEmployeeId(employeeToUpdate), getRoleId(newRole)])
          .then(([employeeId, roleId]) => {
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            db.query(sql, [roleId, employeeId], (err, result) => {
              if (err) {
                console.error('Error updating employee role:', err);
              } else {
                console.log(`Employee "${employeeToUpdate}" updated with new role "${newRole}".`);
              }
              employeeTracker(); 
            });
          })
          .catch((error) => {
            console.error('Error updating employee role:', error);
            employeeTracker(); 
          });
      })
      .catch((error) => {
        console.error('Error prompting for update information:', error);
        employeeTracker(); 
      });
  }
  
  // Function to fetch employee choices from the database
  function getEmployeeChoices() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT CONCAT(first_name, ' ', last_name) AS employee_name FROM employee`;
      db.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const employeeNames = result.map((row) => row.employee_name);
          resolve(employeeNames);
        }
      });
    });
  }
  
  // Function to fetch employee ID based on employee name
  function getEmployeeId(employeeName) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?`;
      db.query(sql, [employeeName], (err, result) => {
        if (err) {
          reject(err);
        } else if (result.length === 0) {
          reject(new Error(`Employee "${employeeName}" not found.`));
        } else {
          const employeeId = result[0].id;
          resolve(employeeId);
        }
      });
    });
  }

//Update Employee Manager
const updateEmpManager = [
    {
      type: 'list',
      name: 'EmpToUpdate',
      message: 'Select an employee to update their manager:',
      choices: () => {
        return getEmployeeChoices(); // Fetch employee choices dynamically
      },
    },
    {
      type: 'list',
      name: 'NewManager',
      message: 'Select the new manager for the employee:',
      choices: () => {
        return getManagerChoices(); // Fetch manager choices dynamically
      },
    },
  ];

  function updateEmployeeManager() {
    inquirer
      .prompt(updateEmpManager)
      .then((answers) => {
        const empToUpdate = answers.EmpToUpdate;
        const newManager = answers.NewManager;
  
        Promise.all([getEmployeeId(empToUpdate), getManagerId(newManager)])
          .then(([employeeId, managerId]) => {
            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
            db.query(sql, [managerId, employeeId], (err, result) => {
              if (err) {
                console.error('Error updating employee manager:', err);
              } else {
                console.log(`Employee "${empToUpdate}" updated with new manager "${newManager}".`);
              }
              employeeTracker();
            });
          })
          .catch((error) => {
            console.error('Error updating employee manager:', error);
            employeeTracker();
          });
      })
      .catch((error) => {
        console.error('Error prompting for manager update:', error);
        employeeTracker();
      });
  }
  //View employee by Manager
  const viewEmpByManager = [
    {
      type: 'list',
      name: 'Manager',
      message: 'Select a manager to view their employees:',
      choices: () => {
        return getManagerChoices(); // Fetch manager choices dynamically
      },
    },
  ];
  
  function viewEmployeesByManager() {
    inquirer
      .prompt(viewEmpByManager)
      .then((answers) => {
        const selectedManager = answers.Manager;
  
        if (selectedManager === 'No manager') {
          // Query employees with no manager
          const sql = `
            SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.department_name, r.salary, 'No manager' AS manager_name
            FROM employee AS e
            JOIN roles AS r ON e.role_id = r.id
            JOIN department AS d ON r.department_id = d.id
            WHERE e.manager_id IS NULL;
          `;
          db.query(sql, (err, result) => {
            if (err) {
              console.error('Error fetching employees by manager:', err);
            } else {
              console.log('Employees with no manager:');
              console.table(result);
            }
            employeeTracker(); 
          });
        } else {
          // Fetch manager's ID based on the selected manager's name
          getManagerId(selectedManager)
            .then((managerId) => {
              // Query employees by manager
              const sql = `
                SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
                FROM employee AS e
                JOIN roles AS r ON e.role_id = r.id
                JOIN department AS d ON r.department_id = d.id
                LEFT JOIN employee AS m ON e.manager_id = m.id
                WHERE e.manager_id = ?;
              `;
              db.query(sql, [managerId], (err, result) => {
                if (err) {
                  console.error('Error fetching employees by manager:', err);
                } else {
                  console.log(`Employees managed by "${selectedManager}":`);
                  console.table(result);
                }
                employeeTracker(); 
              });
            })
            .catch((error) => {
              console.error('Error getting manager ID:', error);
              employeeTracker(); 
            });
        }
      })
      .catch((error) => {
        console.error('Error prompting for manager selection:', error);
        employeeTracker(); 
      });
  }
    
  
  //View Employee by department 
  const viewEmpByDepartment = [
    {
      type: 'list',
      name: 'Department',
      message: 'Select a department to view employees:',
      choices: () => {
        return getDeptChoices(); // Fetch department choices dynamically
      },
    },
  ];
  
  function viewEmployeesByDepartment() {
    inquirer
      .prompt(viewEmpByDepartment)
      .then((answers) => {
        const selectedDepartment = answers.Department;
  
        // Fetch department ID based on the selected department name
        getDepartmentId(selectedDepartment)
          .then((departmentId) => {
            const sql = `
              SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
              FROM employee AS e
              JOIN roles AS r ON e.role_id = r.id
              JOIN department AS d ON r.department_id = d.id
              LEFT JOIN employee AS m ON e.manager_id = m.id
              WHERE d.id = ?;
            `;
            db.query(sql, [departmentId], (err, result) => {
              if (err) {
                console.error('Error fetching employees by department:', err);
              } else {
                console.log(`Employees in department "${selectedDepartment}":`);
                console.table(result);
              }
              employeeTracker(); 
            });
          })
          .catch((error) => {
            console.error('Error getting department ID:', error);
            employeeTracker(); 
          });
      })
      .catch((error) => {
        console.error('Error prompting for department selection:', error);
        employeeTracker(); 
      });
  }
  

 //Viewing total budget used by a department
  const viewDeptBudget = [
    {
      type: 'list',
      name: 'Deptbudget',
      message: 'Select a department to view the total utilized budget:',
      choices: () => {
        return getDeptChoices(); // Fetch department choices dynamically
      },
    },
  ];
  
  function viewDepartmentBudget() {
    inquirer
      .prompt(viewDeptBudget)
      .then((answers) => {
        const selectedDepartment = answers.Deptbudget;
  
        // Fetch department ID based on the selected department name
        getDepartmentId(selectedDepartment)
          .then((departmentId) => {
            const sql = `
              SELECT SUM(r.salary) AS total_budget
              FROM employee AS e
              JOIN roles AS r ON e.role_id = r.id
              JOIN department AS d ON r.department_id = d.id
              WHERE d.id = ?;
            `;
            db.query(sql, [departmentId], (err, result) => {
              if (err) {
                console.error('Error calculating department budget:', err);
              } else {
                const totalBudget = result[0].total_budget;
                console.log(`Total utilized budget of department "${selectedDepartment}": $${totalBudget}`);
              }
              employeeTracker(); 
            });
          })
          .catch((error) => {
            console.error('Error getting department ID:', error);
            employeeTracker(); 
          });
      })
      .catch((error) => {
        console.error('Error prompting for department selection:', error);
        employeeTracker(); 
      });
  }
  
 // Connect to database
db.connect((err) => {
    if (err) throw err;
    console.log(`Connected to the employee_db database.`);
    employeeTracker(); 
  });