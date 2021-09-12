const buttonNumbers = Array.from(document.getElementsByClassName('data-number'));
const buttonOperations = Array.from(document.getElementsByClassName('data-operator'));
const buttonEqual = Array.from(document.getElementsByClassName('data-equal'));
const buttonClear = Array.from(document.getElementsByClassName('data-clear'));
const buttonDelete = Array.from(document.getElementsByClassName('data-delet'));

var result = document.getElementById('result');

//console.log(buttonNumbers);
//console.log(buttonOperations);
//console.log(buttonEqual);
//console.log(buttonClear);
//console.log(result);

var actualOperation = '';
var lastOperation = ''; //resultado anterior
var operation = undefined;
var calculo = '';

buttonNumbers.forEach(function (button) {

    button.addEventListener('click', function () {
        if(calculo !== '')
            clearDisplay();
            
        addNumber(button.innerText);  //mismo que poner value?
    })
});

buttonOperations.forEach(function (button) {
    button.addEventListener('click', function () {
        addOperator(button.innerText);
    })
});

buttonEqual.forEach(function (button) {
    button.addEventListener('click', function () {
        calculate();
        updateDisplay(true);
    })
});

buttonClear.forEach(function (button) {
    button.addEventListener('click', function () {
        clearDisplay();
        updateDisplay();
    })
});

buttonDelete.forEach(function (button) {
    button.addEventListener('click', function () {
        if(actualOperation.length > 0 ){
            actualOperation = actualOperation.substr(0, actualOperation.length - 1);
            updateDisplay();
        }
                
    })
});

function updateDisplay(isFinal=false) {
    if(isFinal===true)
        result.value = "RESULT: " + actualOperation;
    else
        result.value = actualOperation;
}

function clearDisplay() {
    actualOperation = '';
    lastOperation = '';
    operation = undefined;
    calculo = '';
}

function addNumber(number) {
    if (actualOperation !== '') 
        actualOperation = actualOperation.toString() + number.toString();
        //updateDisplay()    //clearDisplay(); //borra el resultado de la operacion anterior
    else
        actualOperation = number.toString(); // 1) actualOperation = 2;  3)actualOperation = 5;
        updateDisplay();
}

function addOperator(op) {
    if (actualOperation === '') 
        return; //si aprieto un operador sin antes un numero, me voy
    
    if (lastOperation !== '') 
        calculate()
    
    operation = op.toString();  //2) operator = +;  lastOperation = 2; actualOperation=''
    lastOperation = actualOperation;
    actualOperation = '';
}

function calculate() {
    //var calculo;
    const last = parseFloat(lastOperation); //2
    const actual = parseFloat(actualOperation);//5

    if (isNaN(last) || isNaN(actual)) 
        return; //isNaN -> is NOT a NUMBER 
    
    switch (operation) {
        case '+':
            calculo = last + actual;
            break;

        case '-':
            calculo = last - actual;
            break;

        case 'X':
            calculo = last * actual;
            break;

        case '/':
            calculo = last / actual;
            break;
            
        default:
            return;
    }
    actualOperation = calculo;
    operation = undefined;
    lastOperation = '';
}