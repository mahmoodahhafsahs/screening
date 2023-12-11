const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 5000;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'pop',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API to handle POST requests for adding employee data
app.post('/api/addEmployee', (req, res) => {
  const { name, salary, dob, age, currentAddress, permanentAddress, department, designation } = req.body;

  const insertQuery = `INSERT INTO employees (name, salary, dob, age, currentAddress, permanentAddress, department, designation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    insertQuery,
    [name, salary, dob, age, currentAddress, permanentAddress, department, designation],
    (err, result) => {
      if (err) {
        console.error('Error inserting employee:', err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        console.log('Employee added successfully');
        res.json({ success: true });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
