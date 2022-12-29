      // Invocar tooltip
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })

      // Procesar form editar
      $("body").on("submit", "#form-editar", function(event) {
        event.preventDefault();
        if ($("#form-editar").valid()) {
            editarElemento();
        }
      })   
      
      // Procesar form agregar
      $("body").on("submit", "#form-agregar", function(event) {
        event.preventDefault();
        if ($("#form-agregar").valid()) {
          agregarElemento();
        }
      });

      // Función para obtener la lista de registros
      function obtenerLista() {
        fetch("api/usuario.php")
            .then((response) => response.json())
            .then((elementos) => {
                mostrarLista(elementos);
            })
      }

      // Función para mostrar la lista de registros en la tabla
      function mostrarLista(elementos) {
        // Limpiamos la tabla
        document.getElementById("lista-elementos").innerHTML = "";

        // Agregamos cada elemento a la tabla
        elementos.forEach((elemento) => {
            document.getElementById("lista-elementos").innerHTML += `
            <tr>
                <td>${elemento.id}</td>
                <td>${elemento.nombre}</td>
                <td>${elemento.correo}</td>
                <td>
                    <button class="btn btn-primary" onclick="editarModal(${elemento.id})">
                        <i class="fas fa-edit" title="Editar registro"></i>
                    </button>
                    <button class="btn btn-danger" onclick="eliminarModal(${elemento.id})">
                        <i class="fas fa-trash-alt" title="Eliminar registro"></i>
                    </button>
                </td>
            </tr>
            `;
        })
        
      }

      // Función para abrir el modal de edición con los datos del elemento seleccionado
      function editarModal(id){
        // Abrimos el modal
        $("#modal-editar").modal("show");
        // Obtenemos los datos del elemento seleccionado
        fetch(`api/usuario.php?id=${id}`)
            .then((response) => response.json())
            .then((elemento) => {
                // Rellenamos el formulario con los datos del elemento
                document.getElementById("form-editar-id").value = elemento[0].id;
                document.getElementById("form-editar-nombre").value = elemento[0].nombre;
                document.getElementById("form-editar-correo").value = elemento[0].correo;
            })
      }      

      // Función para agregar un elemento
      function agregarElemento() {
        // Obtenemos los datos del formulario
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;

        // Validamos que se haya ingresado un nombre
        if (nombre === "") {
          swal("Error", "Debes ingresar un nombre", "error");
          return;
        }
        // Validamos que se haya ingresado un correo
        if (correo === "") {
          swal("Error", "Debes ingresar el correo", "error");
          return;
        }

        // Enviamos los datos al archivo PHP encargado de insertar el elemento en la base de datos
        fetch("api/usuario.php", {
          method: "POST",
          body: JSON.stringify({ nombre, correo }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((resultado) => {
            // Verificamos si se agregó correctamente
            if (resultado.estado === true) {
              // Cerramos el modal y mostramos un mensaje de éxito
              $("#modal-agregar").modal("hide");
              $(".modal-backdrop").remove();

              // Muestra un mensaje de alerta con SweetAlert
              Swal.fire({
                icon: "success",
                title: "Solicitud exitosa",
                text: "Se ha realizado la solicitud de manera exitosa.",
              });

              // Actualizamos la lista de registros
              obtenerLista();

              //limpiar campos
              document.getElementById('nombre').value = '';
              document.getElementById('correo').value = '';
            } else {
              // Mostramos un mensaje de error
              swal(
                "Error",
                "Ocurrió un error al intentar agregar el elemento",
                "error"
              );
            }
          });
      }

      // Función para editar un elemento
      function editarElemento(){
        // Obtenemos los datos del formulario
        const id = document.getElementById("form-editar-id").value;
        const nombre = document.getElementById("form-editar-nombre").value;
        const correo = document.getElementById("form-editar-correo").value;

        // Validamos que se haya ingresado un nombre
        if (nombre == "") {
            swal("Error", "Debes ingresar un nombre", "error");
            return;
        }
        if (correo == "") {
            swal("Error", "Debes ingresar un correo", "error");
            return;
        }
        // Enviamos los datos al archivo PHP encargado de actualizar el elemento en la base de datos
        fetch(`api/usuario.php?id=${id}&opcion=modificar`, {
            method: "POST",
            body: JSON.stringify({ id, nombre, correo }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((resultado) => {
                // Verificamos si se editó correctamente
                if (resultado.estado === true) {
                    // Cerramos el modal y mostramos un mensaje de éxito
                    $("#modal-editar").modal("hide");

                    // Muestra un mensaje de alerta con SweetAlert
                    Swal.fire({
                        icon: "success",
                        title: "Solicitud exitosa",
                        text: "Se ha realizado la edición de manera exitosa.",
                    });

                    // Actualizamos la lista de registros
                    obtenerLista();
                } else {
                    // Mostramos un mensaje de error
                    swal(
                        "Error",
                        "Ocurrió un error al intentar editar el elemento",
                        "error"
                    );
                }
            });
      }     

      // Función para eliminar un elemento
      function eliminarModal(id) {
        // Mostramos un mensaje de confirmación
        Swal.fire({
          title: "¿Estás seguro?",
          text: "Una vez eliminado, no podrás recuperar el elemento",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, borralo!",
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(`api/usuario.php?id=${id}`, {
              method: "DELETE",
            })
              .then((response) => response.json())
              .then((resultado) => {
                // Verificamos si se eliminó correctamente
                if (resultado.estado === true) {
                  // Muestra un mensaje de alerta con SweetAlert
                  Swal.fire({
                    icon: "success",
                    title: "Solicitud exitosa",
                    text: "Se ha eliminado el registro.",
                  });
                  obtenerLista();
                } else {
                  // Mostramos un mensaje de error
                  swal(
                    "Error",
                    "Ocurrió un error al intentar eliminar el elemento",
                    "error"
                  );
                }
              });
          }
        });
      }

      // Al cargar la página, obtenemos y mostramos la lista de registros
      obtenerLista();
