document.addEventListener('DOMContentLoaded', function() { 
    // Obtener referencias a los elementos del DOM
    const bookList = document.getElementById('bookList');

    /* Carrito (para mostrar/ocultar)*/
    const carrito = document.getElementById('carrito');

    /* Elemento que muestra el total en el carrito*/
    const totalElement = document.getElementById('total');

    /* Carrito (para añadir items) */
    const carritoContainer = document.getElementById('carrito-container');

    /* Boton de icono de carrito */
    const toggleCarritoBtn = document.getElementById('toggle-carrito');
    /* Boton de cerrar carrito*/
    const toggleCerrarCarritoBtn = document.getElementById('cerrar-carrito');
    /* Boton de vaciar carrito*/
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');    
    /* Boton de comprar*/
    const comprar = document.getElementById('comprar');

    /* Buscador de libros*/
    const searchInput = document.getElementById('search-input');

    /* Mensaje para cuando no hay stock*/
    const mensajeNoStock = "Ups! Parece que no queda stock del producto ";

    let carritoProductos = []; // Array para almacenar los productos en el carrito
    let stockDisponible = {}; // Objeto para manejar el stock de cada libro
   

    // Mostrar los libros en la página
    books.forEach(book => {
        // Guardamos el stock inicial de cada libro
        stockDisponible[book.name] = book.stock;

        // Crear el contenedor del libro
        const bookItem = document.createElement('div');
        bookItem.id= book.name;
        bookItem.classList.add('book-item');
         
        // Título del libro
        const title = document.createElement('h2');
        title.textContent = book.name;
        bookItem.appendChild(title);
        
        // Autor del libro
        const author = document.createElement('p');
        author.classList.add('author');
        author.textContent = `Autora: ${book.author}`;
        bookItem.appendChild(author);

        // Imagen del libro
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('imagen');
        const image = document.createElement('img');
        image.src = book.images;
        image.alt = book.name;
        bookItem.appendChild(imageDiv);
        imageDiv.appendChild(image);

        // Descripción del libro
        const description = document.createElement('p');
        description.textContent = book.description;
        description.classList.add('description');
        bookItem.appendChild(description);
        
        // Precio del libro
        const price = document.createElement('p');
        price.textContent = `${book.price.toFixed(2)}€`;
        price.classList.add('price');
        bookItem.appendChild(price);
        
        // Stock del libro
        const stock = document.createElement('p');
        stock.id =  `stock'-${book.name}`;
        stock.textContent = `Unidades disponibles: ${stockDisponible[book.name]}`;
        bookItem.appendChild(stock);
        
        // Botón para agregar al carrito
        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'Me lo llevo';
        addToCartBtn.addEventListener('click', () => agregarAlCarrito(book, stock));
        bookItem.appendChild(addToCartBtn);
        
        // Agregar el libro a la lista en la página
        bookList.appendChild(bookItem);
    });
    
    // Función para agregar un libro al carrito
    function agregarAlCarrito(book, ) {
        //Si hay stock disponible
        if (stockDisponible[book.name] > 0) { 
            //comprobamos si el producto está en el carrito
            let productoEnCarrito = carritoProductos.find(p => p.name === book.name);
            if (productoEnCarrito) { //si está se aumenta la cantidad del carrito
                productoEnCarrito.cantidad++;
            } else {
                carritoProductos.push({ ...book, cantidad: 1 }); //si no está se añade inicializando en 1
            }
            
            stockDisponible[book.name]--; // Reduce el stock disponible
            actualizarStockLibro(book); 
            
            actualizarCarrito(); // Actualiza la vista del carrito
        } else {
            alert(mensajeNoStock);
        }
    }
    
    function restarProductoDelCarrito(book) {
        //Buscamos en el carrito el producto al que se quiere restar un unaidad
        let productoEnCarrito = carritoProductos.find(p => p.name === book.name);
        if (productoEnCarrito.cantidad > 1) { // si tenemos más de uno en el carrito
            productoEnCarrito.cantidad--; //restamos uno 
            stockDisponible[book.name]++; //vuelve al stock
            actualizarStockLibro(book); //actualizamos el stocko
            actualizarCarrito(); // Actualiza el carrito
        } else {
            quitarProductoDelCarrito(book);// si no quitamos todo el produto (como si pulsamos basura)
        }
    }

    function sumarProductoDelCarrito(book) {
        //Buscamos en el carrito el producto
        let productoEnCarrito = carritoProductos.find(p => p.name === book.name);
        if (productoEnCarrito.stock > productoEnCarrito.cantidad) { //si el hya más stock q producto
            productoEnCarrito.cantidad++; // se añade al carrito
            stockDisponible[book.name]--; //se quita del stock
            actualizarStockLibro(book); //actualizamos el stock
            actualizarCarrito();    // actializamos carrito
        } else {
            alert(mensajeNoStock); //Si no hay stock avisamos (qué menos)
        }
    }

    function quitarProductoDelCarrito(book) {
        //Buscamos en el carrito el producto
        let productoEnCarrito = carritoProductos.find(p => p.name === book.name);
        //Devolvemos al stcok todas las unidades del carrito 
        stockDisponible[book.name] += productoEnCarrito.cantidad;
        //Actualiamos el carrito quitando el producto elimnado
        carritoProductos = carritoProductos.filter(p => p.name !== book.name);

        actualizarStockLibro(book); //actualizamos stock
        actualizarCarrito(); // Actualiza la vista del carrito
    }


    function actualizarStockLibro(book) {
        //buscamos el elemnto q muestra el stcok (en html)
        let stockElement = document.getElementById(`stock'-${book.name}`);
        //reemplazmos el texo con el nuevo stcok
        stockElement.textContent = `Unidades disponibles: ${stockDisponible[book.name]}`;
    }

    // Función para actualizar el carrito
    function actualizarCarrito() {
        carritoContainer.innerHTML = ''; // Limpiamos el carrito antes de actualizar
        let total = 0; // Inicializamos el total

        carritoProductos.forEach(producto => {
            const itemCarrito = document.createElement('div'); // Contenedor del producto
            itemCarrito.classList.add('item-carrito');
            
            const nombre = document.createElement('div');
            nombre.textContent = `${producto.name} ${producto.price.toFixed(2)}€ (x${producto.cantidad})`;
            nombre.classList.add('column-name');
            itemCarrito.appendChild(nombre);
            
            const botonEliminar = document.createElement('i');
            botonEliminar.classList.add('fas');
            botonEliminar.classList.add('fa-trash');
            botonEliminar.classList.add('buttonshop')
            botonEliminar.addEventListener('click',() => quitarProductoDelCarrito(producto))
            itemCarrito.appendChild(botonEliminar);

            const botonMas = document.createElement('i');
            botonMas.id = `plus-${producto.name}`;
            botonMas.classList.add('fas');
            botonMas.classList.add('fa-plus');
            botonMas.classList.add('buttonshop')
            botonMas.addEventListener('click',() => sumarProductoDelCarrito(producto))
            itemCarrito.appendChild(botonMas);

            const botonMenos = document.createElement('i');
            botonMenos.classList.add('fas');
            botonMenos.classList.add('fa-minus');
            botonMenos.classList.add('buttonshop');
            botonMenos.addEventListener('click',() => restarProductoDelCarrito(producto))
            itemCarrito.appendChild(botonMenos);

            
            const precio = document.createElement('div');
            precio.textContent = `${(producto.price * producto.cantidad).toFixed(2)}€`;
            itemCarrito.appendChild(precio);
            
            carritoContainer.appendChild(itemCarrito);
            
            total += producto.price * producto.cantidad; // Sumar el precio total
        });
        
        totalElement.textContent = `Total: ${total.toFixed(2)}€`; // Mostrar el total
    }

    // Función para vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => { 
        //recorremos los prodictos para devolver el stock y actualiza la tarjtea 
        carritoProductos.forEach(producto => {
            stockDisponible[producto.name] += producto.cantidad; // Devolver el stock
            actualizarStockLibro(producto);
        });
        
        carritoProductos = []; // Vaciar el array del carrito
        actualizarCarrito(); // Actualizar el carrito
    });

    // Función para mostrar/ocultar el carrito
    toggleCarritoBtn.addEventListener('click', () => {
        carrito.classList.toggle('oculto'); 
    });
    toggleCerrarCarritoBtn.addEventListener('click', () => {
        carrito.classList.add('oculto');
    });

    //filtro buscador cada vez que se despulsa una tecla
    searchInput.addEventListener('keyup',(event) =>{
        //obtenems el texto que se ha escrito
       let textoafiltrar= searchInput.value;
       //recorremos todos los productos
        books.forEach(book => {
        // si el titulo o autor contiene el texto a filtar se muestra quitando la clase ocualta(sila tiene)
        if(book.name.toLowerCase().includes(textoafiltrar.toLowerCase()) || 
            book.author.toLowerCase().includes(textoafiltrar.toLowerCase())){
            document.getElementById(book.name).classList.remove('oculto');
        } // si no contiene el texto se añade la clase oculta
        else {
            document.getElementById(book.name).classList.add('oculto');
        }
        })
    });

    comprar.addEventListener('click', () => {
        alert('Has hecho una compra!');
        carritoProductos = []; // Vaciar el array del carrito
        actualizarCarrito(); // Actualizar carrito y a tener en cuenta sin devolver el stock porque es una compra
        carrito.classList.add('oculto');
    });
});
