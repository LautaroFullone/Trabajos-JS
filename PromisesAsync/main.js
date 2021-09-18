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
const tablaPersonasPaginadas = document.querySelector('#tablaPersonasPaginate');
const apiUrl = "https://utn-lubnan-api-1.herokuapp.com/api/User";

const botonNext = document.querySelector('#next-button');
const botonPrevious = document.querySelector('#previous-button');


var personasJSON = [];
var personasObject = [];
var totalPersonas = 0;

const SIZE = 200;
var actualPage = 0;

window.onload = async () =>{

    getAllPersonas(3);

    //totalPersonas = await getTotalPersonas();  //await siempre debe ser sobre el return de una promise SI O SI

    /*getTotalPersonas()
        .then((response) => {

            totalPersonas = response;

            console.log("totalPersonas-> " + totalPersonas); 
            
            getPersonasPaginado(actualPage, SIZE);
        })
        .catch((response) => {
            console.log(response);
        })
    */
        console.log("Antes del get Total");
        totalPersonas = await getTotalPersonas();
        console.log("Despues del get Total: Cant " + totalPersonas);
        
        console.log("Antes del get Paginado");
        var promise2 = await getPersonasPaginadoAsyc(actualPage, SIZE);

        console.log(promise2);
        var listado= new Array();
        promise2.forEach(p => {
            listado.push(new Persona(p.userId, p.firstName, p.lastName, p.email, p.gender, p.lastConnectedAddress));
        })
        console.log("Despues del get Paginado");
        renderizarTabla(tablaPersonasPaginadas, listado);
        console.log("Antes del renderizado");
        
   

};


botonPrevious.addEventListener('click', function () {
    if ( actualPage<=0 )
        alert("Te pasaste");
    else{
         clearTable(tablaPersonasPaginadas);
        actualPage--;
        var from = actualPage * SIZE;

        getPersonasPaginado(from + 1, from + SIZE);
    }
})

botonNext.addEventListener('click', function () {
    
    if (actualPage + 1 >= totalPersonas / SIZE) 
        alert("No hay tanto para mostrar");
    else{
        clearTable(tablaPersonasPaginadas);
        actualPage++;
        var from = actualPage * SIZE;
        getPersonasPaginado(from+1,from+SIZE);
    }
})

function getPersonasPaginado(from, to) {
    var url = apiUrl + '/' + from + '/' + to;

    callApiPersons(url)
        .then((response) => {

            personasJSON = response;

            personasJSON.forEach(p => {
                personasObject.push(new Persona(p.userId, p.firstName, p.lastName, p.email, p.gender, p.lastConnectedAddress));
            })

            renderizarTabla(tablaPersonasPaginadas, personasObject);
        })
        .catch((reason) => {
            console.log(reason);
        })
}

function getPersonasPaginadoAsyc(from, to) {
    var url = apiUrl + '/' + from + '/' + to;

    return callApiPersons(url);
}


function callApiPersons(url) {
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

function getTotalPersonas() {
    var url = apiUrl + '/Total';
    return callApiPersons(url); //hago un pasamanos de la promise 
    
    /*callApiPersons(url)
        .then((response) => {
            console.log("response-> " + response);
            totalPersonas = response;
            console.log("totalPersonas despues -> "+totalPersonas);
        })
        .catch((reason) => {
            console.log(reason);
        })*/ 
}

function renderizarTabla(tabla, listadoPersonas) {
    listadoPersonas.forEach(function (persona) {

        var fila = tabla.insertRow(-1);
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
    personasJSON = [];
    personasObject = [];
}

function getAllPersonas(cant) {
    callApiPersons(apiUrl)
        .then((response) => {
            personasJSON = response.filter(function (persona) {
                return persona.userId < parseInt(cant) + 1;
            });

            personasJSON.forEach(p => {
                personasObject.push(new Persona(p.userId, p.firstName, p.lastName, p.email, p.gender, p.lastConnectedAddress));
            })

            renderizarTabla(tablaPersonas, personasObject);
        })
        .catch((reason) => {
            console.log(reason);
        })
}

function clearTable(table) {
    table.innerHTML =
        '<thead class="thead-dark">' +
        '    <tr>' +
        '<th scope="col">ID</th>' +
        '<th scope="col">FIRSTNAME</th>' +
        '<th scope="col">LASTNAME</th>' +
        '<th scope="col">EMAIL</th>' +
        '<th scope="col">GENDER</th>' +
        '<th scope="col">LAST CONNECTED ADDRESS</th>' +
        '</tr>' +
        '</thead>'
}