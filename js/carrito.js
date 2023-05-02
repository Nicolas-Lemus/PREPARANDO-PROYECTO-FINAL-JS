//const talles
const talles = [40, 41, 42, 43, 44];
//querySelector
const productosTalles = document.querySelectorAll('.card');
const carrito = document.querySelector('.listado');
const contadorCarrito = document.querySelector('#valorCarrito');
const precioTotal = document.querySelector('#precioTotal');
//variables
let cantidadProductos = 0;
let carritoProductos = [];
// Comprobar si hay datos en el Local Storage
if (localStorage.getItem('carritoProductos')){
    carritoProductos = JSON.parse(localStorage.getItem('carritoProductos'));
    cantidadProductos = carritoProductos.length;
    actualizarCarrito();
    actualizarPrecioTotal();
} 
//guardar en localStorage
function guardarProductosEnLocalStorage() {
    localStorage.setItem('carritoProductos',JSON.stringify(carritoProductos));
    localStorage.setItem('cantidadProductos', cantidadProductos);
}
//actualizar carrito
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
//actualizar precio total
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
//Borrar producto del carrito y de localStorage
carrito.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-producto')) {
    const index = event.target.dataset.index;
    carritoProductos.splice(index, 1);
    guardarProductosEnLocalStorage();
    Swal.fire({
        icon: "error",
        title: "Elemento Borrado",
        showConfirmButton: false,
        timer: 1500,
    });
    cantidadProductos--;
    actualizarCarrito();
    actualizarPrecioTotal();
    }
}); 
//confirmar compra con promise
const botonComprar = document.querySelector("#confirmarCompra");
botonComprar.addEventListener("click", () => {
    new Promise((resolve, reject) => {
    if (parseFloat(precioTotal.textContent.slice(1)) === 0) {
        reject(new Error("Tu Carrito esta vacio!"));
    } else {
        resolve();
    }
    })
    .then(() => {
        Swal.fire({
        icon: "info",
        title: "procesando",
        showConfirmButton: false,
        timer: 2500,
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                carritoProductos = [];
                cantidadProductos = 0;
                actualizarCarrito();
                actualizarPrecioTotal();
                localStorage.removeItem("carritoProductos");
                localStorage.removeItem("cantidadProductos");
            resolve();
            }, 2000);
        });
    })
    .then(() => {
        Swal.fire({
            icon: "success",
            title: "Gracias por su compra",
            showConfirmButton: false,
            timer: 2000,
        });
    })
    .catch((error) => {
        Swal.fire({
            icon: "error",
            title: "Verificar!",
            text: error.message,
            timer: 3000,
        });
    });
});
//CERRAR SECCION
const finalizarSeccion =document.querySelector("#cerrarSeccion");
finalizarSeccion.addEventListener("click", ()=>{
    Swal.fire({
        title:'¡Seccion Finalizada con Exito!'+ '¡Gracias!',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
    .then(() => {
        window.location.href = "../index.html";
    });
});
