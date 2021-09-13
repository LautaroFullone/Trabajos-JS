const parrafo = document.getElementById("myId");
parrafo.innerText = "Hello Word";

const parrafo2 = document.getElementsByTagName("p")[1];
parrafo2.innerHTML = "<strong>Hello World!<strong>";

const spanes = Array.from(document.getElementsByClassName("myClass"));

spanes.forEach(span => {
  span.setAttribute("style", "font-weight: bolder");
  
});

var tabla = document.getElementsByClassName("myTable")[0];
var contador = 0;

function insertRow() {
  var fila = tabla.insertRow(-1); //-1 seria al final del todo
  var celda; 
  
  for(i=0; i<2; i++){
    celda = fila.insertCell(-1)
    celda.innerHTML = "Nueva celda N°" + contador++;
  }
}

function deleteRow() {
  if(tabla.rows.length > 1){
    tabla.deleteRow(-1);  //-1 seria al final del todo
    contador--; contador--;
  }
    
}