// identificacion del usuario
function showTurnosDisponibles(turnos) {
    const usuario = "usuario1"; 

// esto verifica si el usuario ya tiene un turno confirmado
    if (localStorage.getItem(usuario)) {
        Swal.fire({
            title: "Error",
            text: "Ya encontramos un turno registrado con este usuario, lo sentimos.",
            icon: "error",
            confirmButtonText: "Cerrar",
            customClass: {
                content: "custom-modal-content",
                confirmButton: "custom-modal-button",
            },
        });
        return;
    }


    // nueva función para desplegar ventana modal de sweetalert

    let html = "<div>";
    for (const fecha in turnos) {
        html += `<div>${fecha}: `;
        for (const hora of turnos[fecha]) {
            html += `
        <label>
            <input type="checkbox" name="turnos" value="${hora}">
            ${hora}
        </label>
        `;
        }
        html += "</div>";
    }
    html += "</div>";

//info del alert de turnos de caballito

    Swal.fire({
        title: "Turnos disponibles",
        html: html,
        icon: "info",
        confirmButtonText: "Confirmar",
        customClass: {
            content: "custom-modal-content",
            confirmButton: "custom-modal-button",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const checkboxes = document.querySelectorAll('input[name="turnos"]');
            let turnoSeleccionado = null;
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    turnoSeleccionado = checkbox.value;
                }
            });
            if (turnoSeleccionado) {
// guardar el turno registrado en el localStorage + confirmacion de turno
                localStorage.setItem(usuario, turnoSeleccionado);

                Swal.fire({
                    title: "Turno confirmado",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    customClass: {
                        content: "custom-modal-content",
                        confirmButton: "custom-modal-button",
                    },
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Debes seleccionar un turno para confirmar.",
                    icon: "error",
                    confirmButtonText: "Cerrar",
                    customClass: {
                        content: "custom-modal-content",
                        confirmButton: "custom-modal-button",
                    },
                });
            }
        }
    });
}



// función para crear las cards
function createCards(data) {
    const container = document.getElementById('card-container');

    data.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const sucursal = document.createElement('h2');
        sucursal.textContent = item.sucursal;

        const descripcion = document.createElement('p');
        descripcion.textContent = item.descripcion;

        const imagen = document.createElement('img');
        imagen.src = item.imagen;

        const boton = document.createElement('button');
        boton.textContent = 'Ver turnos disponibles';

        // evento de click en el botón de turnos disponibles
        boton.addEventListener("click", () => {
            if (item.sucursal === "Palermo" && !item.turnosDisponibles) {
                Swal.fire({
                    title: "No hay turnos disponibles",
                    text:
                        "Lo sentimos, actualmente no hay turnos disponibles en la sucursal de Palermo, selecciona otra sucursal.",
                    icon: "warning",
                    confirmButtonText: "Cerrar",
                    customClass: {
                        content: "custom-modal-content",
                        confirmButton: "custom-modal-button",
                    },
                });
            } else if (item.sucursal === "Belgrano") {
                Swal.fire({
                    title: "No es necesario agendar turno",
                    text:
                        "En esta sucursal no es necesario agendar turno.",
                    icon: "info",
                    confirmButtonText: "Cerrar",
                    customClass: {
                        content: "custom-modal-content",
                        confirmButton: "custom-modal-button",
                    },
                });
            } else {
                showTurnosDisponibles(item.turnosDisponibles);
            }
        });

        card.appendChild(sucursal);
        card.appendChild(descripcion);
        card.appendChild(imagen);
        card.appendChild(boton);

        container.appendChild(card);
        card.classList.add('card-style');
    });
}



// funcion que crea el checkbox de fechas y horarios
function createCheckbox(turnos) {
    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");

    for (const fecha in turnos) {
        const fechaCheckbox = document.createElement("label");
        fechaCheckbox.innerHTML = fecha + ": ";

        for (const hora of turnos[fecha]) {
            const horaCheckbox = document.createElement("input");
            horaCheckbox.type = "checkbox";
            horaCheckbox.name = "turnos";
            horaCheckbox.value = hora;

            const horaLabel = document.createElement("label");
            horaLabel.textContent = hora;

            fechaCheckbox.appendChild(horaCheckbox);
            fechaCheckbox.appendChild(horaLabel);
        }

        checkbox.appendChild(fechaCheckbox);
    }

    return checkbox;
}

// turnos disponibles de caballito
const turnosDisponibles = {
    "20/04": ["10:00", "11:00", "14:00", "17:00"],
    "22/04": ["12:00", "15:00", "16:00", '18:00'],
}



//informacion de las card
const data = [
    {
        sucursal: "Caballito",
        descripcion: "Local ubicado en sobre la conocida avenida Rivadavia y Miro, cuenta con mas de 15 gatitos para disfrutar tu estadia.",
        imagen: "./img/caballito.jpeg",
        turnosDisponibles: turnosDisponibles
    },
    {
        sucursal: "Palermo",
        descripcion: "Nuestro primer local ubicado en la calle Honduras es el que mas felinos tiene gracias al refugio en colaboracion que tenemos con nuestros colaboradores de @MascotasPalermom",
        imagen: "./img/palermo.jpeg"
    },
    {
        sucursal: "Belgrano",
        descripcion: "Nuestra gran apertura cerca de la estacion Echeverria y que en su mayoria esta integrada por gatitos en pleno crecimiento.",
        imagen: "./img/belgrano.jpeg"
    }
];


// función para mostrar las cards si el usuario inicia sesión

//datos que tienen que coicidir
function showCards() {
    const passGuardado = "123456";
    const emailGuardado = "usuario@mail.com";
    const emailUsuario = document.getElementById("emailAddress");
    const passUsuario = document.getElementById("password");

    // si el inicio de sesion esta bien
    if (
        emailGuardado === emailUsuario.value && passGuardado === passUsuario.value
    ) {
        createCards(data);
    } else {
        document.body.append(
            "Usuario o contraseña incorrectos, ingrese de nuevo."
        );
    }
}
const btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener("click", (event) => {
    event.preventDefault();
    showCards();
});

// borra los datos de la sesion al recargar la apgina
window.addEventListener("load", () => {
    const usuario = "usuario1"; 
    localStorage.removeItem(usuario);
});
