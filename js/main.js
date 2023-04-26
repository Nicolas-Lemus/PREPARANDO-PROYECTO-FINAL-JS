

/// INICIO DE SECCION 
const formInicio = document.querySelector('#formularioInicio'),
    apellidoInput = document.querySelector('#apellido'),
    tarjetaInput = document.querySelector('#tarjeta'),
    alertaInicio = document.querySelector('#alertaInicio'),
    enviar = document.querySelector("#botonregistrar");

formInicio.addEventListener('submit',function(e){
    e.preventDefault();
    const apellido = apellidoInput.value;
    const tarjeta = tarjetaInput.value;
        if (!apellido || !tarjeta) {
            Swal.fire({
                icon: "error",
                title: "Ingrese Apellido y Tarjeta",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExistente = usuariosRegistrados.find(usuario => usuario.apellido === apellido && usuario.tarjeta === tarjeta);
    if (!usuarioExistente) {
        Swal.fire({
            icon: 'error',
            title: "Error",
            text: 'Usuario no registrado!',
            timer: 3000,
            })
        return;
    }else{
        Swal.fire({
            icon: "success",
            title: "¡Bienvenido!" + " " + apellido,
            showConfirmButton: false,
            timer:4000,
            });
    setTimeout(()=>{
        window.location.href = "pages/compras.html";
    },3000)
    }
});

