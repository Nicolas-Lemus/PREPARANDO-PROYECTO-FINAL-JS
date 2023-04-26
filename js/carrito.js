
const productosTalles = document.querySelectorAll('.card');
const carrito = document.querySelector('.listado');
const contadorCarrito = document.querySelector('#valorCarrito');
const precioTotal = document.querySelector('#precioTotal');
let cantidadProductos = 0;
let carritoProductos = [];

// Comprobar si hay datos en el Local Storage
if (localStorage.getItem('carritoProductos')){
    carritoProductos = JSON.parse(localStorage.getItem('carritoProductos'));
    cantidadProductos = carritoProductos.length;
    actualizarCarrito();
    actualizarPrecioTotal();
}

function guardarProductosEnLocalStorage() {
    localStorage.setItem('carritoProductos',JSON.stringify(carritoProductos));
    localStorage.setItem('cantidadProductos', cantidadProductos);
} 


function actualizarCarrito() {
    carrito.innerHTML = '';
    carritoProductos.forEach((producto, index) => {
        const li = document.createElement('li');
        li.classList.add('producto-carrito');
        li.innerHTML = `
            <img src="${producto.img}"class="imgCarrito">
            <span class="nombre">${producto.nombre}</span>
            <span class="talle">Talle ${producto.talle}</span>
            <span class="precio">${producto.precio}</span>
            <button class="eliminar-producto" data-index="${index}">X</button>
        `;
        carrito.appendChild(li);
    });
    contadorCarrito.textContent = cantidadProductos;
}
productosTalles.forEach((producto,) => {
    const nombreProducto = producto.querySelector('.card-title').textContent;
    const precioProducto = producto.querySelector('.card-text').textContent;
    const botonesTalles = producto.querySelectorAll('.btn-outline-secondary');
    const imgProducto = producto.querySelector(".card-img-top").src;

    let talleSeleccionado;

    botonesTalles.forEach(botonTalle => {
        botonTalle.addEventListener('click', () => {
            botonesTalles.forEach(boton => {
                boton.classList.remove('seleccionado');
            });
            botonTalle.classList.add('seleccionado');
            talleSeleccionado = botonTalle.textContent;
        });
    });

    const botonTarjeta = producto.querySelector('.btn-primary');
    botonTarjeta.addEventListener('click', () => {
        if (!talleSeleccionado) {
            return;
        }
        const productoSeleccionado = {
            nombre: nombreProducto,
            precio: precioProducto,
            talle: talleSeleccionado,
            img: imgProducto
        };
        carritoProductos.push(productoSeleccionado);
        guardarProductosEnLocalStorage();
        const index = carritoProductos.length - 1;
        const li = document.createElement('li');
        li.classList.add('producto-carrito');
        li.innerHTML = `

            <img src="${imgProducto}"class="imgCarrito">
            <span class="nombre">${nombreProducto}</span>
            <span class="talle">Talle ${talleSeleccionado}</span>
            <span class="precio">${precioProducto}</span>
            <button class="eliminar-producto" data-index="${index}">X</button>
        `;
        carrito.appendChild(li);
        talleSeleccionado = null;
        botonesTalles.forEach(boton => {
            boton.classList.remove('seleccionado');
        });
        cantidadProductos++;
        contadorCarrito.textContent = cantidadProductos;
        actualizarPrecioTotal();
    });
});

function actualizarPrecioTotal() {
    let precioTotalCarrito = 0;
    const preciosProductos = document.querySelectorAll('.precio');
    preciosProductos.forEach(precioProducto => {
        const precioProductoNumerico = parseFloat(precioProducto.textContent.replace('Precio: $', ''));
        if (!isNaN(precioProductoNumerico)) {
            precioTotalCarrito += precioProductoNumerico;
        }
    });
    precioTotal.textContent  = `$${precioTotalCarrito.toFixed(2)}`;
}

carrito.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-producto')) {
    const index = event.target.dataset.index;
    carritoProductos.splice(index, 1);
    guardarProductosEnLocalStorage();
    cantidadProductos--;
    actualizarCarrito();
    actualizarPrecioTotal();
    }
}); 
const botonComprar = document.querySelector("#confirmarCompra");
botonComprar.addEventListener("click", () => {
    if (parseFloat(precioTotal.textContent.slice(1)) === 0) {
        Swal.fire({
            icon: 'error',
            title: "Verificar!",
            text: 'Tu Carrito esta vacio!',
            timer: 3000,
            })
    } else {
    Swal.fire({
        icon: "success",
        title: "Gracias por su compra",
        showConfirmButton: false,
        timer: 3000,
    });
    carritoProductos = [];
    cantidadProductos = 0;
    actualizarCarrito();
    actualizarPrecioTotal();
    localStorage.removeItem("carritoProductos");
    localStorage.removeItem("cantidadProductos");
    }
});