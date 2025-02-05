import {BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/v1";

function fetchData(url, setData) {
  fetch(url)
    .then((res) => res.json())
    .then(setData)
    .catch((err) => console.error("Erro ao buscar dados: ", err));
}


function SectorList() {
  const [sectors, setSectors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(`${API_URL}/sectors`, setSectors);
  }, []);

  const deleteSector = (id) => {
    fetch(`${API_URL}/sectors/${id}`, { method: "DELETE" })
      .then(() => setSectors(sectors.filter((s) => s.id !== id)))
      .catch((err) => console.error("Erro ao excluir setor:", err));
  };

  return (
    <div className="container">
      <h1>Setores</h1>
      <button onClick={() => navigate("/sectors/new")}>Novo Setor</button>
      <ul>
        {sectors.map((sec) => (
          <li key={sec.id}>
            {sec.name}
            <button onClick={() => navigate(`/sectors/edit/${sec.id}`)}>Editar</button>
            <button onClick={() => deleteSector(sec.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectorForm() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/sectors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then(() => navigate("/sectors"));
  };

  return (
    <div className="container">
      <h1>Novo Setor</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome do Setor" value={name} onChange={(e) => setName(e.target.value)} required />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(`${API_URL}/employees`, setEmployees);
  }, []);

  const deleteEmployee = (id) => {
    fetch(`${API_URL}/employees/${id}`, { method: "DELETE" })
      .then(() => setEmployees(employees.filter((e) => e.id !== id)))
      .catch((err) => console.error("Erro ao excluir funcionário:", err));
  };

  return (
    <div className="container">
      <h1>Funcionários</h1>
      <button onClick={() => navigate("/employees/new")}>Novo Funcionário</button>
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            {emp.firstName} {emp.lastName} - {emp.emailId} ({emp.sector?.name || "Sem setor"})
            <button onClick={() => navigate(`/employees/edit/${emp.id}`)}>Editar</button>
            <button onClick={() => deleteEmployee(emp.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmployeeForm() {
  const [employee, setEmployee] = useState({ firstName: "", lastName: "", emailId: "", sectorId: "" });
  const [sectors, setSectors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(`${API_URL}/sectors`, setSectors);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...employee, sector: { id: Number(employee.sectorId) } }),
    }).then(() => navigate("/employees"));
  };

  return (
    <div className="container">
      <h1>Novo Funcionário</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={employee.firstName} onChange={(e) => setEmployee({ ...employee, firstName: e.target.value })} required />
        <input placeholder="Sobrenome" value={employee.lastName} onChange={(e) => setEmployee({ ...employee, lastName: e.target.value })} required />
        <input placeholder="Email" value={employee.emailId} onChange={(e) => setEmployee({ ...employee, emailId: e.target.value })} required />
        <select value={employee.sectorId} onChange={(e) => setEmployee({ ...employee, sectorId: e.target.value })} required>
          <option value="">Selecione um setor</option>
          {sectors.map((sec) => (
            <option key={sec.id} value={sec.id}>{sec.name}</option>
          ))}
        </select>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/sectors">Setores</Link>
        <Link to="/employees">Funcionários</Link>
      </nav>
      <Routes>
        <Route path="/sectors" element={<SectorList />} />
        <Route path="/sectors/new" element={<SectorForm />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/new" element={<EmployeeForm />} />
      </Routes>
    </Router>
  );
}


/*
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
*/

