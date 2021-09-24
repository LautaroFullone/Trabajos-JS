class Company {
    constructor(id, name) {
        this.id = id;
        this.name = name
    }
}

class Employee {
    constructor(id, company, firstName, lastName, email) {
        this.id = id;
        this.company = company;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}

const apiUrl = 'https://utn-lubnan-api-2.herokuapp.com/api/';
const urlEmployees = apiUrl + 'Employee';
const urlCompanies = apiUrl + 'Company';

const formulario = document.querySelector('#formulario-empleado')
const employeesTable = document.querySelector('#employees-table');
const pepe = new Employee(4, new Company(2, "Accenture"), "Juan", "Nares", "peperoldan@gmail.com");

const CANT_REGISTROS = 2000;

var employeesList = [];
var companiesList = [];

window.onload = function () {
    getAllEmployeesWithCompany();  

}

formulario.addEventListener('submit', (event) => {
    //event.preventDefault(); //para que muestre los logs
    insertEmployee();
})

function callApiGET(url) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json'; //si no hay nada es texto

        request.onload = function () {
            if (request.status == 200)
                resolve(request.response);
            else
                reject(Error("Los archivos no llegaron. Codigo error: " + request.statusText));
        }

        request.onerror = function () {
            reject(Error("Upa! Algo salio mal con la api."))
        }

        request.send();
    })
};

function callApiPOST(url, data=null) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('POST', url);
        
        request.onload = function () {
            if (request.status == 200 || request.status == 201) 
                resolve(request.response);
            else
                reject(Error("Los archivos no se enviaron. Codigo error: " + request.status));
        }
        request.onerror = function () {
            reject(Error("Upa! Algo salio mal con la api."))
        }

        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(data));
    
    })
};

function callApiDELETE(url) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('DELETE', url);

        request.onload = function () {
            if (request.status == 200 || request.status == 201)
                resolve(request.response)
            else
                reject(Error("Los archivos no eliminaron. Codigo error: " + request.status));
        }
        request.onerror = function () {
            reject(Error("Upa! Algo salio mal con la api."))
        }

        request.send();
    })
};


async function insertEmployee() {
    var companyId = document.getElementById('companyId').value
    var firstName = document.getElementById('firstName').value
    var lastName = document.getElementById('lastName').value
    var email = document.getElementById('email').value

    var jsonEmployee = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        companyId: parseInt(companyId)
    };

    await callApiPOST(urlEmployees, jsonEmployee)
}

async function getAllEmployeesWithCompany() {

    companiesList = []; employeesList=[];

    var promiseCompanies = callApiGET(urlCompanies);
    var promiseEmployees = callApiGET(urlEmployees);
    
    companiesList = mapearCompanies(await promiseCompanies);
    employeesList = mapearEmployees(await promiseEmployees)

    renderizeEmployees(employeesTable, employeesList,1500);
}

function mapearCompanies(list) {
    var companiesListClass = [];
    console.log("companiesList EN MAPEAR COMPANIES");

    console.log(list);

    list.forEach((c) => {
        companiesListClass.push(new Company(c.companyId, c.name));
    })
    return companiesListClass;
}

//must have mapped companies list before execute him
function mapearEmployees(list) {
    employeesListClass = [];
    console.log("companiesList EN MAPEAR EMPLEYEES");

    list.forEach((e) => {
        var employeeCompany = companiesList.find(company => company.id == e.companyId);
        employeeCompany = (employeeCompany !== undefined) ? employeeCompany : new Company(000, "Empresa Fantasma");
        employeesListClass.push(new Employee(e.employeeId, employeeCompany, e.firstName, e.lastName, e.email));
    })

    return employeesListClass;
}

function renderizeEmployees(table, employeeList, cant) {

    var e = undefined;
    employeeList.reverse();
    
    if(cant>employeeList.length) cant=employeeList.length-1;

    for (i = 0; i <= cant; i++) {
        e = employeeList[i];

        var row = table.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerText =e.id;

        cell = row.insertCell(-1);
        cell.innerText = e.firstName;

        cell = row.insertCell(-1);
        cell.innerText = e.lastName;

        cell = row.insertCell(-1);
        cell.innerText = e.company.name;

        cell = row.insertCell(-1);
        cell.innerText = e.email;

        cell = row.insertCell(-1);
        var button = document.createElement('button');
        button.setAttribute('class', 'btn btn-outline-danger');
        button.textContent = 'Delete';
        button.dataset.employee = e.id;
        button.addEventListener('click', deleteEmployee);  //luego recibo el evento
        cell.appendChild(button);
    }
}

function deleteEmployee(evento) {
    console.log("Hello");
    var idEmployee = evento.target.dataset.employee;
    console.log(idEmployee)

    callApiDELETE(urlEmployees + '/' + idEmployee)
        .then(response => {
           window.location.reload();
        })
        .catch((response) => {
            console.log(response);
        })

}


function convertToJSON(employee) {
    var json = {};
    json.employeeId = employee.id;
    json.companyId = employee.company.id;
    json.firstName = employee.firstName;
    json.lastName = employee.lastName;
    json.email = employee.email;

    return json;
}


