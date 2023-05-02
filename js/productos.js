//convertimos OBJETO calzados en archivo data.json 
// ../data/data.json
//filtrado por precio
const inputPrecioMaximo = document.getElementById('precioMaximo');
inputPrecioMaximo.addEventListener('input', function() {
    const precioMaximo = parseInt(this.value);
    filtrarPorPrecio(precioMaximo);
});
//mostramos card de precios
const productos = document.querySelectorAll('.card');
function filtrarPorPrecio(precioMaximo) {
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        const precio = parseInt(producto.querySelector('p').textContent.split('$')[1]);
        if (precio > precioMaximo) {
            producto.classList.add('filtro');
        } else {
            producto.classList.remove('filtro');
        }
    }
}
//talles
const talles = [40, 41, 42, 43, 44];
//querySelectors
const productosTalles = document.querySelectorAll('.card');
const carrito = document.querySelector('.listado');
const contadorCarrito = document.querySelector('#valorCarrito');
const precioTotal = document.querySelector('#precioTotal');
let cantidadProductos = 0;
let carritoProductos = [];
//async
const getCalzados = async () => {
    const response = await fetch("../data/dataCalzados.json");
    const calzados = await response.json();
//filtro de tipo
    const buscadorTipo = document.querySelector("#buscarTipo");
    let tipoBuscado = "";
    buscadorTipo.addEventListener("keyup", e => {
        if (e.target.matches("#buscarTipo")) {
            tipoBuscado = e.target.value.toLowerCase();
            for (const calz of calzados) {
                if (calz.tipo.toLowerCase().includes(tipoBuscado)) {
                    const elemento = document.getElementById(calz.id);
                    if (elemento) {
                    elemento.classList.remove("filtro");
                    }
                } else {
                    const elemento = document.getElementById(calz.id);
                    if (elemento) {
                        elemento.classList.add("filtro");
                    }
                }
            }
        }
    });
//filtro de nombre
    const buscadorNombre = document.querySelector("#buscar");
    buscadorNombre.addEventListener("keyup", e => {
        if (e.target.matches("#buscar")) {
            const nombreBuscado = e.target.value.toLowerCase();
            for (const calz of calzados) {
                if (calz.nombre.toLowerCase().includes(nombreBuscado)) {
                    const elemento = document.getElementById(calz.id);
                    if (elemento) {
                        elemento.classList.remove("filtro");
                    }
                }else {
                    const elemento = document.getElementById(calz.id);
                    if (elemento) {
                        elemento.classList.add("filtro");
                    }
                }
            }
        }
    });
};
//llamamos a la promesa
getCalzados();
// Comprobar si hay datos en el Local Storage
if (localStorage.getItem('carritoProductos')){
    carritoProductos = JSON.parse(localStorage.getItem('carritoProductos'));
    cantidadProductos = carritoProductos.length;
    actualizarCarrito();
    actualizarPrecioTotal();
}
//guardar localStorage
function guardarProductosEnLocalStorage() {
    localStorage.setItem('carritoProductos',JSON.stringify(carritoProductos));
    localStorage.setItem('cantidadProductos', cantidadProductos);
} 
//funcion actualizar carrito
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
//selecionar talle para agregar al carrito
productosTalles.forEach((producto) => {
    const nombreProducto = producto.querySelector('.card-title').textContent;
    const precioProducto = producto.querySelector('.card-text').textContent;
    const botonesTalles = producto.querySelectorAll('.btn-outline-secondary');
    const imgProducto = producto.querySelector(".card-img-top").src;
    let talleSeleccionado;
    let cantidad =0;
    //evento click remover seleccion de talle
    botonesTalles.forEach(botonTalle => {
        botonTalle.addEventListener('click', () => {
            botonesTalles.forEach(boton => {
                boton.classList.remove('seleccionado');
            });
            botonTalle.classList.add('seleccionado');
            talleSeleccionado = botonTalle.textContent;
        });
    });
//funcion  agregar al carrito si selecciono talle
    const botonTarjeta = producto.querySelector('.btn-primary');
    botonTarjeta.addEventListener('click', () => {
        if (!talleSeleccionado) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ingrese talle',
                showConfirmButton: false,
                timer: 1200
            })
            return;
        }
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Producto Agregado',
            showConfirmButton: false,
            timer: 1200
        })
        const productoSeleccionado = {
            nombre: nombreProducto,
            precio:precioProducto,
            talle: talleSeleccionado,
            img: imgProducto,
            cantidad:cantidad
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
//ACTUALIZAR PRECIO TOTAL
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
//agregar productos al carrito
function agregarProductoAlCarrito(nombreProducto, precioProducto, talleSeleccionado, imgProducto) {
        carritoProductos.push({
            nombre: nombreProducto,
            precio:parseFloat(precioProducto),
            talle: talleSeleccionado,
            img: imgProducto
        });
// Actualizar la cantidad de productos y el precio total en el carrito
    cantidadProductos++;
    actualizarCarrito();
    actualizarPrecioTotal();
    guardarProductosEnLocalStorage();
}
//efecto imagenes zoom
const imagenesProducto = document.querySelectorAll('.card-img-top');
imagenesProducto.forEach((imagen) => {
    imagen.addEventListener('click', () => {
    const imageUrl = imagen.src;
        Swal.fire({
            title: imagen.alt,
            imageUrl: imageUrl,
            imageWidth: 800,
            imageHeight: 400,
            imageAlt: 'Imagen de producto ampliada',
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
})
