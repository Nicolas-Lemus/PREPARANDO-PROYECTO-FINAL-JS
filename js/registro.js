//la solucion que encontre fue poner en distintos JS porque los dos en MAIN.JS
// EL REGISTRO NO ME FUNCIONABA ME HACIA REFERENCIA AL MISMO "SUBMIT" Y NO SABIA COMO ARREGLARLO 

//Registro

const formRegistro = document.querySelector('#registroNuevo');
const apellidoNuevoInput = document.querySelector('#apellidoNuevo');
const tarjetaNuevaInput = document.querySelector('#tarjetaNueva');

formRegistro.addEventListener('submit',function(e){
    e.preventDefault();
    const apellidoNuevo = apellidoNuevoInput.value;
    const tarjetaNueva = tarjetaNuevaInput.value;
    if (!apellidoNuevo || !tarjetaNueva) {
        Swal.fire({
            icon: "error",
            title: "Ingrese Apellido y Tarjeta",
            showConfirmButton: false,
            timer: 1500,
        });
        return;
    }
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExistente = usuariosRegistrados.find(usuario => usuario.apellido === apellidoNuevo && usuario.tarjeta === tarjetaNueva);
    if (usuarioExistente) {
        Swal.fire({
            title: 'El usuario ya existe',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
        return;
    }
    const usuarioNuevo = {
        apellido: apellidoNuevo,
        tarjeta: tarjetaNueva
    };
    usuariosRegistrados.push(usuarioNuevo);
    localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));
    Swal.fire({
        icon: "success",
        title: "Registro Exitoso!",
        showConfirmButton: false,
        timer: 2500,
    }).then(() => {
        formRegistro.reset();
        window.location.href = "../index.html";
    });
});

