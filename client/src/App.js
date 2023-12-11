import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    console.log('Effect running');
    const storedEntries = JSON.parse(localStorage.getItem('employeeEntries')) || [];
    console.log('Loaded entries from local storage:', storedEntries);
    setEntries(storedEntries);
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('employeeEntries', JSON.stringify(entries));
      console.log('Saved entries to local storage:', entries);
    }
  }, [entries]);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleCheckboxChange = () => {
    setIsSameAddress(!isSameAddress);

    // If the checkbox is checked, update permanent address with current address
    if (!isSameAddress) {
      setPermanentAddress(currentAddress);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting data:', { name, salary, dob, age, currentAddress, permanentAddress, department, designation });
  
    fetch('/api/addEmployee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        salary,
        dob,
        age,
        currentAddress,
        permanentAddress: isSameAddress ? currentAddress : permanentAddress,
        department,
        designation,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Server response:', data);
        if (data.success) {
          console.log('Employee data added successfully');
          const newEntry = { name, salary, dob, age, currentAddress, permanentAddress, department, designation };
          setEntries([...entries, newEntry]);
          setName('');
          setSalary('');
          setDob('');
          setAge('');
          setCurrentAddress('');
          setPermanentAddress('');
          setIsSameAddress(false);
          setDepartment('');
          setDesignation('');
          setIsSubmitted(true);
        } else {
          console.error('Error adding employee data:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  const resetForm = () => {
    setName('');
    setSalary('');
    setDob('');
    setAge('');
    setCurrentAddress('');
    setPermanentAddress('');
    setIsSameAddress(false);
    setDepartment('');
    setDesignation('');
    setIsSubmitted(false);
  };

  const handleResetLocalStorageClick = () => {
    localStorage.removeItem('employeeEntries');
    setEntries([]);
  };

  const handleDobChange = (event) => {
    setDob(event.target.value);
    const newAge = calculateAge(event.target.value);
    setAge(newAge);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">IRIS COMPANY</div>
        <div className="navbar-right">
          <button type="button" onClick={handleResetLocalStorageClick}>
            Reset
          </button>
        </div>
      </nav>

      <div className="app-container">
        <h3>We Welcome you to the IRIS company's employee details form page </h3>
        {isSubmitted ? (
          <div className="modal">
            <p>Form submitted successfully!</p>
            <button onClick={resetForm}>Submit Another Entry</button>
          </div>
        ) : (
          <form>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <br />
            <label>Salary:</label>
            <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} />
            <br />
            <label>Date of Birth:</label>
            <input type="date" value={dob} onChange={handleDobChange} />
            <br />
            <label>Age:</label>
            <input type="text" value={age} readOnly />
            <br />
            <label>Current Address:</label>
            <input type="text" value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} />
            <br />
            <label>Permanent Address:</label>
            <input
              type="text"
              value={isSameAddress ? currentAddress : permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
              readOnly={isSameAddress}
            />
            <br />
            <label>Same as Current Address:</label>
            <input type="checkbox" checked={isSameAddress} onChange={handleCheckboxChange} />
            <br />
            <label>Department:</label>
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
            <br />
            <label>Designation:</label>
            <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} />
            <br />
            <button type="button" onClick={handleSubmit}>
              Submit
            </button>
          </form>
        )}

        {entries.length > 0 && (
          <div>
            <h2>Employee Entries</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Salary</th>
                  <th>Date of Birth</th>
                  <th>Age</th>
                  <th>Current Address</th>
                  <th>Permanent Address</th>
                  <th>Department</th>
                  <th>Designation</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.salary}</td>
                    <td>{entry.dob}</td>
                    <td>{entry.age}</td>
                    <td>{entry.currentAddress}</td>
                    <td>{entry.permanentAddress}</td>
                    <td>{entry.department}</td>
                    <td>{entry.designation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
