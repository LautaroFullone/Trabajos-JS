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
const employeesTable = document.querySelector('#employees-table');
const pepe = new Employee(4, new Company(100, "Accenture"), "Pepe", "Roldan", "peperoldan@gmail.com");

var employeesList = [];
var companiesList = [];

window.onload = function () {
    getAllEmployeesWithCompany();

    insertEmployee(pepe);
   
}

function callApiGET(url) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json'; //si no hay nada es texto

        request.onload = function () {
            if (request.status = 200)
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

async function getAllEmployeesWithCompany() {
    var urlEmployees = apiUrl + 'Employee';
    var urlCompanies = apiUrl + 'Company';

    employeesList = callApiGET(urlEmployees);
    companiesList = callApiGET(urlCompanies);

    employeesList = await employeesList;
    companiesList = await companiesList;

    companiesList = mapearCompanies(companiesList);
    employeesList = mapearEmployees(employeesList)

    renderizeEmployees(employeesTable, employeesList, 5);
}

async function insertEmployee(employee) {
    employee = convertToJSON(employee);
    console.log(employee);
    var promise = await callApiPOST(employee);

    var list = await callApiGET(apiUrl);
    
    console.log(list.find(e => e.name == "Pepe"));

}

function mapearCompanies(list) {
    var companiesListClass = [];

    list.forEach((c) => {
        companiesListClass.push(new Company(c.companyId, c.name));
    })
    return companiesListClass;
}

//must have mapped companies list before execute him
function mapearEmployees(list) {
    employeesListClass = [];

    list.forEach((e) => {
        var employeeCompany = companiesList.find(company => company.id == e.companyId);
        employeeCompany = (employeeCompany !== undefined) ? employeeCompany : -1;
        employeesListClass.push(new Employee(e.employeeId, employeeCompany, e.firstName, e.lastName, e.email));
    })

    return employeesListClass;
}

function renderizeEmployees(table, employeeList, tableSize) {
    var e = undefined;

    for (i = 0; i < tableSize; i++) {
        e = employeeList[i];

        var row = table.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerText = e.id;

        cell = row.insertCell(-1);
        cell.innerText = e.firstName;

        cell = row.insertCell(-1);
        cell.innerText = e.lastName;

        cell = row.insertCell(-1);
        cell.innerText = e.company.name;

        cell = row.insertCell(-1);
        cell.innerText = e.email;
    }

}

function callApiPOST(employeeJSON) {
    var urlEmployees = apiUrl + 'Employee';

    console.log(urlEmployees);
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('POST', urlEmployees);

        request.setRequestHeader("content-type", "application/json");

        //request.send("{\"employeeId\":0,\"companyId\":0,\"firstName\":\"string\",\"lastName\":\"string\",\"email\":\"string\"}");
request.send(employeeJSON.toString())

        if (request.status == 201) {
            alert("Uploaded!");
        } else {
            console.log("status "+request.status);
            console.log(request.responseText);
            alert("Something went wrong!");
        }
    })
};

function convertToJSON(employee) {
    var json = {};
    json.employeeId = employee.id;
    json.companyId = employee.company.id;
    json.firstName = employee.firstName;
    json.lastName = employee.lastName;
    json.email = employee.email;

    return json;
}


