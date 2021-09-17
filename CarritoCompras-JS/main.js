//window.onload = function () {
        
    const productos = [{
        id: 1,
        marca: 'Nike',
        nombre: 'Air Max Impact',
        precio: 175,
        imagen: 'imagenes/airmaximpact.jpg'
    },
    {
        id: 2,
        marca: "Nike",
        nombre: 'Kyrie 6 Oreo',
        precio: 265,
        imagen: 'imagenes/durant.jpg'
    },
    {
        id: 3,
        marca: "Adidas",
        nombre: 'DAME 7',
        precio: 250,
        imagen: 'imagenes/dame 7.jpg'
    },
    {
        id: 4,
        marca: 'Nike',
        nombre: "Lebron 16",
        precio: 220,
        imagen: 'imagenes/lebron 16.jpg'
    },
    {
        id: 5,
        marca: "Nike",
        nombre:'Kyrie Flytrap 4',
        precio: 130,
        imagen: 'imagenes/kryrie 4.jpg'
    },];

    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonComprar = document.querySelector('#boton-comprar');


    var carrito = [];
    var total = 0;

     // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    
    DOMbotonComprar.addEventListener('click', ()=>{
        alert("Gracias vuelva prontos :D")
        location.reload();  //recargar pagina
    });


     // Inicio
    renderizarProductos();

    function renderizarProductos() {
        productos.forEach((zapatilla) => {
            var miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-5');

            var miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');

            var miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.innerHTML = "<strong>"+zapatilla.marca+"</strong> - "+zapatilla.nombre;

            var miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', zapatilla.imagen);

            var miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.setAttribute("id", "precio"+zapatilla.id);  //despues lo uso para calcular el total del carrito
            miNodoPrecio.textContent = '$'+ zapatilla.precio;

            var miNodoBoton = document.createElement('button');
            miNodoBoton.setAttribute('class', 'btn btn-outline-secondary');
            miNodoBoton.textContent = 'Agregar al Carrito';
            miNodoBoton.setAttribute('id', zapatilla.id);
            miNodoBoton.addEventListener('click', añadirProductoAlCarrito);
            
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }
    
    function añadirProductoAlCarrito(evento) {  //como sabe que se envia el evento??
        carrito.push(evento.target.getAttribute('id'))  //si un produto se agrega 2 veces, tambien se agrega dos veces su id en el carrito
        //trae el id del boton y lo carga al array del carrito
        calcularTotal();
        renderizarCarrito();
    }

    
    function renderizarCarrito() {
        DOMcarrito.textContent = '';

        const carritoSinDuplicados = new Set(carrito);  //automaticamentre elimina los duplicado
        
        //console.log(carritoSinDuplicados);
        //console.log(productos);
        carritoSinDuplicados.forEach((itemIdCarrito) => {  //creo una fila nueva por producto distinto
            
            const miItem = productos.filter((zapatilla) => {  
                // Guardo en un array el producto de la 'base de dato' que coincide con el id de producto de mi carrito
                return zapatilla.id === parseInt(itemIdCarrito);
            });
           
            // Cuenta el número de veces que se repite el producto en el carrito
            const numeroUnidadesItem = carrito.reduce((acumulador, itemId) => {
                //si el id del producto en carrito coincide con la bd  -> le suma 1 al contador, sino lo deja como estaba
                return itemId === itemIdCarrito ? acumulador += 1 : acumulador; // ¿Coincide las id? Incremento el contador, en caso contrario lo mantengo
            }, 0); //acumulador es el contador definido por el metodo que se inicializa con el valor de 0 (como indica el ultimo parametro)
           
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = numeroUnidadesItem+' x '+miItem[0].nombre+' - $'+miItem[0].precio;

            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-outline-danger', 'mx-3');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.productoId = itemIdCarrito; //<button data-producto-id="2">Hola</button>  es una referencia para acceder dsp
            miBoton.addEventListener('click', borrarItemCarrito);

            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
    }

      
    function borrarItemCarrito(evento) { //evento.target hace referencia al nodo que envio el evento
        console.log(evento.target); //en este caso, event.target= <button onCLick="borrarItemCarrito" data-producto-id="1">X</button>
        const id = evento.target.dataset.productoId; //trae el id del producto
        var isEliminadoElPrimero = false;
        
        // Borramos la primer referencia a ese producto
        carrito.forEach((item) => {
            if(item == id && isEliminadoElPrimero == false){
                carrito.splice( carrito.indexOf(item), 1);
                isEliminadoElPrimero = true;
            }
        });
        
        renderizarCarrito();
        calcularTotal();
    }

    function calcularTotal() {
        //console.log(carrito);
        total = 0;
        carrito.forEach((itemId) => {// De cada elemento del carrito obtenemos su precio
            
            var precio = document.getElementById("precio"+itemId).innerText; //$150
            precio = parseFloat(precio.substr(1)); //150
            
            total += precio;
            /*const item = productos.filter((producto) => {  //crea un nuevo array con los elementos que cumplen la funcion
                return producto.id === parseInt(itemId);
            });
            console.log(item);
            total = total + item[0].precio;*/ 
        });
        DOMtotal.textContent = total;
    }

    /**
     * Varia el carrito y vuelve a dibujarlo
     */
    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        calcularTotal();
    }


//}
        
    
