class Persona {

    constructor(userId, firstName, lastName, email, gender, lastConnectedAddress) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.lastConnectedAddress = lastConnectedAddress;
    }
}

const tablaPersonas = document.querySelector('#tablaPersonas');
console.log(tablaPersonas);
const apiUrl = 'https://utn-lubnan-api-1.herokuapp.com/api/User';
var personasJSON = [];
var personasObject = [];


window.onload = getPersonas(10);

function callApiPersons(url) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        //request.responseType('JSON');

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

var personasObject = [];

function getPersonas(cant) {
    callApiPersons(apiUrl)
        .then((response) => {
            personasJSON = JSON.parse(response).filter(function (persona) {
                return persona.userId < parseInt(cant) + 1;
            });

            personasJSON.forEach(p => {
                personasObject.push(new Persona(p.userId, p.firstName, p.lastName, p.email, p.gender, p.lastConnectedAddress));
            })

            renderizarTabla();
        })
        .catch((reason) => {
            console.log(reason);
        })
}

function renderizarTabla() {
    personasObject.forEach(function (persona) {

        var fila = tablaPersonas.insertRow(-1);
        var celda = fila.insertCell(-1);
        celda.innerText = persona.userId;

        celda = fila.insertCell(-1);
        celda.innerText = persona.firstName;

        celda = fila.insertCell(-1);
        celda.innerText = persona.lastName;

        celda = fila.insertCell(-1);
        celda.innerText = persona.email;

        celda = fila.insertCell(-1);
        celda.innerText = persona.gender;

        celda = fila.insertCell(-1);
        celda.innerText = persona.lastConnectedAddress;
    })
}