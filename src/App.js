import { useState, useEffect } from "react";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ firstName: "", lastName: "", emailId: "", sectorId: "" });
  const [newSector, setNewSector] = useState({ name: "" });

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/employees")
      .then((res) => res.json())
      .then(setEmployees);
    
    fetch("http://localhost:8080/api/v1/sectors")
      .then((res) => res.json())
      .then(setSectors);
  }, []);

  const addEmployee = () => {

    console.log("antes de formatar: ", newEmployee)

    if (!newEmployee.sectorId) {
      console.error("Erro: sectorId está indefinido ou nulo!");
      return; // Interrompe a execução se o setor não for válido
    }

    const formattedEmployee = {
      firstName: newEmployee.firstName,
      lastName: newEmployee.lastName,
      emailId: newEmployee.emailId,
      sector:{ id: newEmployee.sectorId},
    };

    console.log("depois de formatar: ", formattedEmployee)

    fetch("http://localhost:8080/api/v1/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedEmployee),
    })
      .then((res) => res.json())
      .then((data) => setEmployees([...employees, data]));
  };

  const addSector = () => {
    fetch("http://localhost:8080/api/v1/sectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSector),
    })
      .then((res) => res.json())
      .then((data) => setSectors([...sectors, data]));
  };

  return (
    <div>
      <h1>CRUD Employees & Sectors</h1>
      
      <h2>Employees</h2>
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>{emp.firstName} {emp.lastName} - {emp.emailId} - {emp.sector.name}</li>
        ))}
      </ul>
      <input placeholder="First Name" onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })} />
      <input placeholder="Last Name" onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setNewEmployee({ ...newEmployee, emailId: e.target.value })} />
      <select onChange={(e) => setNewEmployee({ ...newEmployee, sectorId: e.target.value })}>
        <option value="">Select Sector</option>
        {sectors.map((sec) => (
          <option key={sec.id} value={sec.id}>{sec.id} - {sec.name}</option>
        ))}
      </select>
      <button onClick={addEmployee}>Add Employee</button>
      
      <h2>Sectors</h2>
      <ul>
        {sectors.map((sec) => (
          <li key={sec.id}>{sec.id} - {sec.name}</li>
        ))}
      </ul>
      <input placeholder="Sector Name" onChange={(e) => setNewSector({ name: e.target.value })} />
      <button onClick={addSector}>Add Sector</button>
    </div>
  );
}

