document.addEventListener('DOMContentLoaded', function() { 
    // Obtener referencias a los elementos del DOM
    const bookList = document.getElementById('bookList');  
    const carrito = document.getElementById('carrito');
    const totalElement = document.getElementById('total');
    const carritoContainer = document.getElementById('carrito-container');
    const toggleCarritoBtn = document.getElementById('toggle-carrito');
    const toggleCerrarCarritoBtn = document.getElementById('cerrar-carrito');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    
    const mensajeNoStock = "Ups! Parece que no queda stock del producto ";

    let carritoProductos = []; // Array para almacenar los productos en el carrito
    let stockDisponible = {}; // Objeto para manejar el stock de cada libro

    // Mostrar los libros en la página
    books.forEach(book => {
        // Guardamos el stock inicial de cada libro
        stockDisponible[book.name] = book.stock;

        // Crear el contenedor del libro
        const bookItem = document.createElement('div');
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
        bookItem.appendChild(description);
        
        // Precio del libro
        const price = document.createElement('p');
        price.textContent = `Precio: ${book.price.toFixed(2)}€`;
        bookItem.appendChild(price);
        
        // Stock del libro
        const stock = document.createElement('p');
        stock.id = book.name;
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
        if (stockDisponible[book.name] > 0) { // Verifica que haya stock disponible
            let productoEnCarrito = carritoProductos.find(p => p.name === book.name);
            if (productoEnCarrito) {
                productoEnCarrito.cantidad++; // Aumenta la cantidad si ya está en el carrito
            } else {
                carritoProductos.push({ ...book, cantidad: 1 }); // Agrega el libro con cantidad 1
            }
            
            stockDisponible[book.name]--; // Reduce el stock disponible
            actualizarStockLibro(book);
            
            actualizarCarrito(); // Actualiza la vista del carrito
        } else {
            alert(mensajeNoStock);
        }
    }
    
    function quitarDelCarrito(book) {
        let productoEnCarrito = carritoProductos.find(p => p.name === book.name);
        if (productoEnCarrito.cantidad > 1) {
            productoEnCarrito.cantidad--;
            stockDisponible[book.name]++;
            actualizarStockLibro(book);
            actualizarCarrito(); // Actualiza la vista del carrito
        } else {
            quitarProductoDelCarrito(book);
        }
    }

    function sumarProductoDelCarrito(book) {
        
        let productoEnCarrito = carritoProductos.find(p => p.name === book.name);
        if (productoEnCarrito.stock > productoEnCarrito.cantidad) {
            productoEnCarrito.cantidad++;
            stockDisponible[book.name]--;
            actualizarStockLibro(book);
            actualizarCarrito();
        } else {
            alert(mensajeNoStock);
        }
    }


    function quitarProductoDelCarrito(book) {
        let productoEnCarrito = carritoProductos.find(p => p.name === book.name);
        stockDisponible[book.name] = stockDisponible[book.name] + productoEnCarrito.cantidad;

        carritoProductos = carritoProductos.filter(p => p.name !== book.name);

        actualizarStockLibro(book);
        actualizarCarrito(); // Actualiza la vista del carrito
    }


    function actualizarStockLibro(book) {
        let stockElement = document.getElementById(book.name);
        stockElement.textContent = `Unidades disponibles: ${stockDisponible[book.name]}`;
    }

    // Función para actualizar el carrito
    function actualizarCarrito() {
        carritoContainer.innerHTML = ''; // Limpiamos el carrito antes de actualizar
        let total = 0; // Inicializamos el total

        carritoProductos.forEach(producto => {
            const itemCarrito = document.createElement('div'); // Contenedor del producto
            itemCarrito.classList.add('item-carrito');
            
            const nombre = document.createElement('p');
            nombre.textContent = `${producto.name} ${producto.price.toFixed(2)}€ (x${producto.cantidad})`;
            itemCarrito.appendChild(nombre);
            
            const botonEliminar = document.createElement('i');
            botonEliminar.classList.add('fas');
            botonEliminar.classList.add('fa-trash');
            botonEliminar.addEventListener('click',() => quitarProductoDelCarrito(producto))
            itemCarrito.appendChild(botonEliminar);

            const botonMas = document.createElement('i');
            botonMas.id = `plus-${producto.name}`;
            botonMas.classList.add('fas');
            botonMas.classList.add('fa-plus');
            botonMas.addEventListener('click',() => sumarProductoDelCarrito(producto))
            itemCarrito.appendChild(botonMas);

            const botonMenos = document.createElement('i');
            botonMenos.classList.add('fas');
            botonMenos.classList.add('fa-minus');
            botonMenos.addEventListener('click',() => quitarDelCarrito(producto))
            itemCarrito.appendChild(botonMenos);

            
            const precio = document.createElement('p');
            precio.textContent = `${(producto.price * producto.cantidad).toFixed(2)}€`;
            itemCarrito.appendChild(precio);
            
            carritoContainer.appendChild(itemCarrito);
            
            total += producto.price * producto.cantidad; // Sumar el precio total
        });
        
        totalElement.textContent = `Total: ${total.toFixed(2)}€`; // Mostrar el total
    }

    // Función para vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {  
        carritoProductos.forEach(producto => {
            stockDisponible[producto.name] += producto.cantidad; // Devolver el stock
            actualizarStockLibro(producto);
        });
        
        carritoProductos = []; // Vaciar el array del carrito
        actualizarCarrito(); // Actualizar la vista
    });

    // Función para mostrar/ocultar el carrito
    toggleCarritoBtn.addEventListener('click', () => {
        carrito.classList.toggle('oculto'); // Mostrar u ocultar el carrito
    });

    toggleCerrarCarritoBtn.addEventListener('click', () => {
        carrito.classList.add('oculto');
    });
});
