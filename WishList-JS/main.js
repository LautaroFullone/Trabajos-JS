const deseados = document.getElementById("deseados");
const productos = Array.from(document.getElementById("productos").getElementsByTagName("li"));

productos.forEach(function (item) {
    item.addEventListener('click', ()=> {
        agregarDeseado(item);
    })
})

var listaAgregados = new Array();

var palabra = "Lautaro-cak";
console.log(palabra.substring(0, palabra.length - 4));

function agregarDeseado(item){
    var rta = listaAgregados.includes(item.innerText);
    if(rta){
        console.log("lo tiene");
        alert("El producto "+item.innerText+" ya se encuentra en sus deseados!")

    }else{
        console.log("no lo tiene"); 
        item.setAttribute("style", "color: red") ;     
        var li = document.createElement('li')
        li.appendChild(document.createTextNode(item.innerText));
        li.setAttribute("id", item.id+"-deseado");
        li.setAttribute("class", "list-group-item");
        li.setAttribute("style", "color: green");
        li.setAttribute("onClick", "eliminarDeseado(id)")
        
        deseados.appendChild(li);
        listaAgregados.push(item.innerText); //agrega id del item al array para usar de referencia

        //var nuevo = item.cloneNode(true); //el booleano es para que copie TODOS los atributos del elemento
    }
}


function eliminarDeseado(idItem){
    var toEliminateHTML = document.getElementById(idItem);
    
    if (listaAgregados.includes(toEliminateHTML.innerText)) {
        deseados.removeChild(toEliminateHTML);

        var posicionElemento = listaAgregados.indexOf(toEliminateHTML.innerText);
        listaAgregados.splice(posicionElemento,1);

        var toChangeColor = toEliminateHTML.id.substring(0, toEliminateHTML.id.length - 8); //del id 'mtb-deseado' lo pasa a 'mtb'
        document.getElementById(toChangeColor).setAttribute("style", "color: none")
    }
    else{
        alert("error en eliminar "+idItem);
    }
}

