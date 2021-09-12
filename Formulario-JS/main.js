const inputs = Array.from(document.querySelectorAll("input"));
const formulario = document.getElementById("formulario");




formulario.addEventListener('submit', function (event) {
    var name = inputs[0].value;
    var lastName = inputs[1].value;
    var email = inputs[2].value;
    var pass = inputs[3].value;
    var age = inputs[4].value;
    console.log("-----------"); 
    console.log(name);
    console.log(lastName);
    console.log(email);
    console.log(pass);
    
    event.preventDefault();  //para que muestre los logs
    var person = new Person(name, lastName, age, email, pass );
    console.log(person);
 })

console.log(!isNaN(''));

inputs.forEach(function (input) {
    input.addEventListener('change', function () {

        switch (input.id) {
            case 'nombre':
                if (dataRules(input.value, 'nombre')) //si encuentra errores devuelve true
                    input.value = '';
                break;

            case 'apellido':
                if (dataRules(input.value, 'apellido')) //si encuentra errores devuelve true
                    input.value = '';
                break;

            case 'edad':
                if (edadRules(input.value))
                    input.value = '';
                break;

            case 'contrasenia':
                if (contraseñaRules(input.value)) //si encuentra errores devuelve true
                    input.value = '';
                break;
            case 'email':
                if (emailRules(input.value)) //si encuentra errores devuelve true
                    input.value = '';
                break;


            default:
                alert("Incorrecto");
                break;
        }
    })
})

function dropAlert(campo) {
    alert("El campo '" + campo + "' no cumple las normas de seguridad");
}

function emailRules(email) {
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    
    if (emailRegex.test(email)) //devuelve true si es valido
        return false;

    dropAlert("email");
    return true; 
}

function contraseñaRules(contra) {
    if (contra.length < 9 || contra.length > 20 || !has(contra, "minusculas") ||
        !has(contra, "mayusculas") || !has(contra, "numeros")) {
        dropAlert("contraseña");
        return true;
    }
    return false;
}

function has(texto, type) {
    var contenido = '';

    switch (type) {
        case 'minusculas':
            contenido = "abcdefghijklmnñopqrstuxyz";
            break;
        case 'mayusculas':
            contenido = "ABCDEFGHIJKLMNÑOPQRSTUXYZ";
            break;
        case 'numeros':
            contenido = "0123456789";
            break;
        default:
            alert("ERROR CON TYPE");
            break;
    }
    for (i = 0; i < texto.length; i++) {

        if (contenido.indexOf(texto.charAt(i)) != -1) {
            return true;
        }
    }
    return false;
}

function dataRules(dato, campo) {
    if (dato === '' || dato.length > 20) {
        dropAlert(campo);
        return true;
    }
    return false;
}

function edadRules(edad) {
    if (isNaN(parseInt(edad)) || edad<0 ||edad>100) {
        dropAlert("edad");
        return true;
    }
    return false;
}

class Person{
    constructor(nombre, apellido, edad, email, contraseña){
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.email = email;
        this.contraseña = contraseña;
    }
}