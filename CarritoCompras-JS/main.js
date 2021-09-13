window.onload = function () {
        
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

    var carrito = [];
    var total = 0;

     // Eventos
     DOMbotonVaciar.addEventListener('click', vaciarCarrito);

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
            miNodoPrecio.textContent = zapatilla.precio + '$';

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
        const carritoSinDuplicados = new Set(carrito);
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = productos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}€`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
    }

        /**
         * Evento para borrar un elemento del carrito
         */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Calculamos de nuevo el precio
        calcularTotal();
    }

    function calcularTotal() {
        console.log(carrito);
        total = 0;
        carrito.forEach((item) => {// De cada elemento del carrito obtenemos su precio
            
            const miItem = productos.filter((zapatilla) => {  //crea un nuevo array con los elementos que cumplen la funcion
                return zapatilla.id === parseInt(item);
            });

            console.log(miItem);

            total = total + miItem[0].precio;
        });
        DOMtotal.textContent = total;
    }

    /**
     * Varia el carrito y vuelve a dibujarlo
     */
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        calcularTotal();
    }


}
        
    
