///////////////////////////////ARMADO DE HTML //////////////////
let contenidoCuenta = document.getElementById("pantallaDatos");
contenidoCuenta.innerHTML = "<div class='contenedor'>" +
"<div class='cuenta-info' id='cuenta-info'>" +
"<span id='nombre'></span><br><br>" +
"<p class='titulo-cuenta' id='titulo-cuenta'></p>" +
"<button class='btn Logueo' id='iniciarSesion'>Iniciar Sesion para visualizar</button>" +
"<h3 id='saldo-cuenta'></h3>" +
"<p id='limite-extraccion'></p>" +
"</div>" +
"</div>";

let contenidoModal = document.getElementById("loginModal");
contenidoModal.innerHTML = "<div class='modal-content'>" +
"<span class='close'>&times;</span>" +
"<form id='loginForm'>" +
"<h1>Inicio Sesion</h1><hr>" +
"<div class='form-group'>" +
"<label for='usuario'>Usuario:</label>" +
"<input type='text' class='form-control' id='usuario' required>" +
"</div>" +
"<div class='form-group'>" +
"<label for='password'>Contraseña:</label>" +
"<input type='password' class='form-control' id='password' required>" +
"</div><hr>" +
"<button type='button' class='btn Iniciar'>Ingresar</button>" +
"</form>" +
"</div>";

let contenidoBotonera = document.getElementById("valores-cuenta");
contenidoBotonera.innerHTML = 
"<button class='links' id='extraerDinero'>Extracción</button>" +
"<button class='links' id='depositarDinero'>Depositar</button>" +
"<button class='links' id='pagarServicio'>Servicios</button>" +
"<button class='links' id='transferirDinero'>Transferencias</button>" +
"<button class='links' id='crearPlazoFijo'>Plazo Fijo</button>" +
"<button class='links' id='generaToken'>Generar Token</button>" +
"<button class='links' id='cargarDatosCliente'>Mis Datos</button>" +
"<button class='links' id='btnBorrarSession'>Borrar Sesion</button>" +
"<button class='links' id='btnBorrarStorage'>Borrar Storage</button>";

///////////////////////TITLE PERSONALIZADO//////////////////////////////////

let titulosPersonalizados = {
  extraerDinero: 'Permite hacer extracciones con un límite proporcionado por el banco',
  depositarDinero: 'Permite hacer depósitos en la cuenta',
  transferirDinero: 'Permite hacer transferencias de tu cuenta hacia otras',
  crearPlazoFijo: 'Simular Plazos Fijos en base a la cantidad de días establecidos',
  generaToken: 'Genera token para hacer transferencias toma el último token generado',
  cargarDatosCliente: 'Ver datos personales',
};

// Obtengo todos los elementos de botón por su clase
let buttons = document.getElementsByClassName('links');
// Recorro los botones y agrego el evento 'mouseover'
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('mouseover', function () {
    // Obtén el ID del botón
    let buttonId = this.id;

    // Verifica si hay un título personalizado para el ID del botón
    if (titulosPersonalizados.hasOwnProperty(buttonId)) {
      // Establece el título personalizado
      this.title = titulosPersonalizados[buttonId];
    } else {
      // Si no hay un título personalizado, utiliza el valor predeterminado
      this.title = this.innerHTML;
    }
  });
}

/////////////////////////MODAL//////////////////////////////////
// Obtener referencias a los elementos del DOM
let loginButton = document.getElementById("iniciarSesion");
let loginModal = document.getElementById("loginModal");
let closeButton = document.getElementsByClassName("close")[0];

// Abrir el modal cuando se hace clic en el botón de inicio de sesión
loginButton.onclick = function () {
  loginModal.style.display = "block";
}

// Cerrar el modal cuando se hace clic en el botón de cerrar (x)
closeButton.onclick = function () {
  loginModal.style.display = "none";
}

//BOTON CERRAR SESION LO ELIMINO SI NO ESTA LOGUEADO
let botonLocal = document.getElementById("btnBorrarStorage");
botonLocal.style.display = "none";

let botonSesion = document.getElementById("btnBorrarSession");
botonSesion.style.display = "none";

////////////////////////DECLARACION DE VARIABLES LET/////////////////////////////////
const fechaActual = new Date();
let sesionIniciada = false; // Variable para controlar si la sesión ha sido iniciada
const cliente = {
  nombreUsuario: "Leonel Fernandez",
  usuario: "lfernandez",
  saldoCuenta: 500000,
  limiteExtraccion: 60000,
  claveCorrecto: 1234,
  fechaNacimiento: "1995-12-03",
  cuentaAmigo1: 1234567,
  domicilio: "Chile 2529",
};

////////////////////////RESTAURAR E INICIO DE SESION/////////////////////////////////////////////
// Obtén la referencia al botón "Ingresar" por su clase
let ingresarButton = document.querySelector("#loginForm .Iniciar");
// Asigna el evento de clic al botón
ingresarButton.addEventListener("click", function (event) {
  event.preventDefault();
  // Obtén los valores de usuario y contraseña
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  // Realiza la validación de usuario y contraseña
  if (usuario !== cliente.usuario || password !== cliente.claveCorrecto.toString()) {
    console.log("Usuario o Contraseña incorrecta. Por favor, inténtalo de nuevo.");
    return;
  } else {
    // Guardar los valores en sessionStorage
    sessionStorage.setItem("usuario", usuario);
    sessionStorage.setItem("password", password);
    // Convertir el objeto cliente a una cadena JSON
    const clienteJSON = JSON.stringify(cliente);
    // Guardar la cadena JSON en el almacenamiento local
    localStorage.setItem("cliente", clienteJSON);
    // Cerrar el modal
    loginModal.style.display = "none";
    restaurarSesion();
  }
});

// Función para restaurar la sesión
function restaurarSesion() {
  const saldoCuenta = obtenerSaldoDeAlmacenamiento();
  const usuario = sessionStorage.getItem("usuario");
  const password = sessionStorage.getItem("password");
  if (saldoCuenta && usuario && password) {
    cliente.saldoCuenta = parseInt(saldoCuenta);
    // Acciones a realizar cuando la sesión se restaura correctamente
    loginButton.style.display = "none";
    botonLocal.style.display = "block"; // Hago visible el botón Eliminar Local Storage
    botonSesion.style.display = "block"; //  Hago visible el botón Eliminar Sesion Storage
    // Cargar las funciones para visualizar el contenido en pantalla
    cargarVisual();
    cargarNombreEnPantalla();
    actualizarSaldoEnPantalla();
    actualizarLimiteEnPantalla();
    sesionIniciada = true; // Actualizar el estado de la sesión
  }
}

function separadorDeMiles(numero) {
  // Convierto el número a string.
  let str = numero.toString();
  // Aquí almacenaremos los resultados.
  let resultado = "";

  // Recorremos el string con for "str.length" veces.
  for (let i = 0; i < str.length; i++) {
    // Cada número, lo concatenamos a "resultado".
    resultado += str[i];

    // y luego de concatenar el número, verifico si el iterador es un múltiplo de 3.
    // ponemos "i < str.length - 1" para evitar que el punto se agregue al final del string.
    if ((str.length - i - 1) % 3 === 0 && i < str.length - 1) {
      resultado += ".";
    }
  }

  return resultado;
}


/////////////////////////////////////FUNCIONES INTERACTIVAS////////////////////////////////////

let cargarDatosCliente = document.getElementById("cargarDatosCliente");
cargarDatosCliente.onclick = () => {
  // Recuperar los datos del cliente del localStorage
  const clienteGuardado = JSON.parse(localStorage.getItem("cliente"));

  // Actualizar los elementos HTML con los valores correspondientes
  console.log("Nombre: " + clienteGuardado.nombreUsuario +
    "\nSaldo de cuenta: $" + clienteGuardado.saldoCuenta +
    "\nClave correcta: " + clienteGuardado.claveCorrecto +
    "\nLímite de extracción: $" + clienteGuardado.limiteExtraccion +
    "\nFecha de nacimiento: " + clienteGuardado.fechaNacimiento +
    "\nCuenta amiga 1: " + clienteGuardado.cuentaAmigo1 +
    "\nDomicilio: " + clienteGuardado.domicilio);

  // Actualizar otros elementos según sea necesario

  console.log("Los datos del cliente han sido cargados en la pantalla.");
}

//extraigo dinero, mientras cumpla con los requisitos de validacion.
let extraerDinero = document.getElementById("extraerDinero");
extraerDinero.onclick = () => {
  if (!sesionIniciada) {
    console.log("Debes iniciar sesión antes de consultar el saldo.");
    return;

  } else {
    let dineroAExtraer = 15000; //prompt("Ingrese la cantidad de dinero a extraer");
    console.log("Se extrajo el valor " + dineroAExtraer)
    let numeroDineroAExtraer = parseInt(dineroAExtraer);
    if (Number.isNaN(numeroDineroAExtraer)) {
      return;
    }
    if (dineroAExtraer == null || dineroAExtraer == "") {
      return;
    }
    if (!haySaldoEnLaCuenta(numeroDineroAExtraer)) {
      //console.log("No hay saldo en tu cuenta para extraer esa cantidad de dinero.");
      console.log("No hay saldo en tu cuenta para extraer esa cantidad de dinero.");
      return;
    }
    if (superaLimiteDeExtraccion(dineroAExtraer)) {
      //console.log("La cantidad de dinero a extraer supera tu límite por transacción");
      console.log("La cantidad de dinero a extraer supera tu límite por transacción");
      return;
    }
    if (!esMultiploDe100(dineroAExtraer)) {
      //console.log("Solo puede retirar en billetes de $100. Procure que el monto corresponda a uno de sus múltiplos.");
      console.log("Solo puede retirar en billetes de $100. Procure que el monto corresponda a uno de sus múltiplos.");
      return;
    }
    let saldoAnterior = cliente.saldoCuenta;
    restarDinero(numeroDineroAExtraer);
    actualizarSaldoEnPantalla();
    let mensajeExtraccion =
      "El saldo a extraer es de $ " +
      dineroAExtraer +
      "\nEl saldo anterior era de $ " +
      saldoAnterior +
      "\n El saldo actual es de $ " +
      cliente.saldoCuenta;
    //console.log(mensajeExtraccion);
    console.log(mensajeExtraccion);
  }
}

let depositarDinero = document.getElementById("depositarDinero");
depositarDinero.onclick = () => {
  if (!sesionIniciada) {
    console.log("Debes iniciar sesión antes de consultar el saldo.");
    return;

  } else {
    let dineroADepositar = 10000;//prompt("Ingrese la cantidad de dinero a depositar");
    let numeroDineroADepositar = parseInt(dineroADepositar);
    if (Number.isNaN(numeroDineroADepositar)) {
      return;
    }
    if (dineroADepositar == null || dineroADepositar == "") {
      return;
    }
    let saldoAnterior = cliente.saldoCuenta;
    sumarDinero(numeroDineroADepositar);
    actualizarSaldoEnPantalla();
    let mensajeDeposito =
      "El saldo a depositar es de $ " +
      dineroADepositar +
      "\nEl saldo anterior era de $ " +
      saldoAnterior +
      "\n El saldo actual es de $ " +
      cliente.saldoCuenta;
    console.log(mensajeDeposito);
  }
}

let pagarServicio = document.getElementById("pagarServicio");
pagarServicio.onclick = () => {
  if (!sesionIniciada) {
    console.log("Debes iniciar sesión antes de consultar el saldo.");
    return;
  } else {
    let agua = 1350;
    let telefono = 825;
    let luz = 2210;
    let internet = 7570;

    let servicios = ["Agua", "Teléfono", "Luz", "Internet"];
    let opcionElegida = 4;//parseInt(prompt("Ingrese el número que corresponda con el servicio que quieres pagar:\n" +
      //"1 - " + servicios[0] +"--> Valor a abonar $" + agua + "\n" +
      //"2 - " + servicios[1] +"--> Valor a abonar $" + telefono + "\n" +
      //"3 - " + servicios[2] +"--> Valor a abonar $" + luz + "\n" +
      //"4 - " + servicios[3] +"--> Valor a abonar $" + internet
    //));

    if (opcionElegida >= 1 && opcionElegida <= servicios.length) {
    let saldoAnterior = cliente.saldoCuenta;

      switch (opcionElegida) {
        case 1: // Agua
          if (!haySaldoEnLaCuenta(agua)) {
            console.log("No hay saldo suficiente para pagar el servicio de Agua.");
            return;
          }
          restarDinero(agua);
          console.log("Has pagado $" + agua + " del servicio de Agua.\nSaldo anterior: $" + saldoAnterior + "\nSaldo actual: $" + cliente.saldoCuenta);
          break;
        case 2: // Teléfono
          if (!haySaldoEnLaCuenta(telefono)) {
            console.log("No hay saldo suficiente para pagar el servicio de Teléfono.");
            return;
          }
          restarDinero(telefono);
          console.log("Has pagado $" + telefono + " del servicio Teléfono.\nSaldo anterior: $" + saldoAnterior + "\nSaldo actual: $" + cliente.saldoCuenta);
          break;
        case 3: // Luz
          if (!haySaldoEnLaCuenta(luz)) {
            console.log("No hay saldo suficiente para pagar el servicio de Luz.");
            return;
          }
          restarDinero(luz);
          console.log("Has pagado $" + luz + " del servicio de Luz.\nSaldo anterior: $" + saldoAnterior + "\nSaldo actual: $" + cliente.saldoCuenta);
          break;
        case 4: // Internet
          if (!haySaldoEnLaCuenta(internet)) {
            console.log("No hay saldo suficiente para pagar el servicio de Internet.");
            return;
          }
          restarDinero(internet);
          console.log("Has pagado $" + internet + " del servicio de Internet.\nSaldo anterior: $" + saldoAnterior + "\nSaldo actual: $" + cliente.saldoCuenta);
          break;
        default:
          console.log("Opción inválida. Por favor, ingresa un número del 1 al 4.");
          return;
      }
      actualizarSaldoEnPantalla();
    } else {
      console.log("Opción inválida. Por favor, ingresa un número del 1 al 4.");
      return;
    }
  }
}

let transferirDinero = document.getElementById("transferirDinero");
transferirDinero.onclick = () => {
  if (!sesionIniciada) {
    console.log("Debes iniciar sesión antes de realizar una transferencia.");
    return;
  }

  const montoATransferir = 10000;//parseInt(prompt("Ingrese el monto a transferir:"));
  if (Number.isNaN(montoATransferir)) {
    return;
  }
  if (montoATransferir === null || montoATransferir === "") {
    return;
  } else if (!haySaldoEnLaCuenta(montoATransferir)) {
    console.log("No hay saldo suficiente en tu cuenta para transferir esa cantidad de dinero.");
    return;
  }
  const cuentaAmigaIngresada = 1234567; //prompt("Ingrese el número de cuenta amiga:");
  const clienteGuardado = JSON.parse(localStorage.getItem("cliente"));
  const cuentaAmigoGuardadaenLocal = clienteGuardado.cuentaAmigo1;
  // Verificar si la cuenta ingresada coincide con la cuentaAmigo guardada
  if (cuentaAmigaIngresada == cuentaAmigoGuardadaenLocal) {
    const ultimoToken = localStorage.getItem("ultimoToken");
    const tokenIngresado = ultimoToken;//prompt("Ingrese el último token generado:");
    if (tokenIngresado !== ultimoToken) {
      console.log("El token ingresado no es válido. La transferencia no puede ser realizada.");
      return;
    }

  } else {
    console.log("Solo puedes transferir dinero a una cuenta amiga previamente configurada.");
    return;
  }
  restarDinero(montoATransferir);
  actualizarSaldoEnPantalla();
  console.log("Se ha transferido $" + montoATransferir + cuentaAmigaIngresada);
}

let crearPlazoFijo = document.getElementById("crearPlazoFijo");
crearPlazoFijo.onclick = () => {
  if (!sesionIniciada) {
    console.log("Debes iniciar sesión antes de consultar el saldo.");
    return;

  } else {
    let montoPlazoFijo = 10000;//parseInt(prompt("Ingrese el monto a invertir en plazo fijo:"));
    if (Number.isNaN(montoPlazoFijo)) {
      return;
    }
    if (montoPlazoFijo == null || montoPlazoFijo == "") {
      return;
    }
    if (!haySaldoEnLaCuenta(montoPlazoFijo)) {
      console.log("No hay saldo en tu cuenta para invertir esa cantidad de dinero en plazo fijo.");
      return;
    }
    let diasPlazoFijo =30; //parseInt(prompt("Ingrese la cantidad de días para el plazo fijo:"));
    if (Number.isNaN(diasPlazoFijo)) {
      return;
    }
    if (diasPlazoFijo == null || diasPlazoFijo == "") {
      return;
    }
    let interesPlazoFijo = calcularPlazoFijo(montoPlazoFijo, diasPlazoFijo);
    if (interesPlazoFijo > 0) {
      restarDinero(montoPlazoFijo);
      actualizarSaldoEnPantalla();
      console.log(
        "Has creado un plazo fijo de $" +
        montoPlazoFijo +
        " a " +
        diasPlazoFijo +
        " días.\nInterés ganado: $" +
        interesPlazoFijo +
        "\nSaldo actual: $" +
        cliente.saldoCuenta
      );
    } else {
      console.log(
        "No es posible crear un plazo fijo con los datos ingresados."
      );
    }
  }
}

let generaToken = document.getElementById("generaToken");
generaToken.onclick = () => {
  if (!sesionIniciada) {
    console.log("Debes iniciar sesión antes de consultar el saldo.");
    return;

  } else {
    let token = tokenGenerado();
    localStorage.setItem("ultimoToken", token);
    console.log("Se ha generado el siguiente token para transferencias: " + token);
    return token;
  }
}

// Generar un token para transferencias
function tokenGenerado() {
  const longitudToken = 6;
  let token = "";
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < longitudToken; i++) {
    token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return token;
}



/////////////////////////////////////////FUNCIONES////////////////////////////////////////////////////////

/// Sumar dinero a la cuenta
function sumarDinero(dinero) {
  cliente.saldoCuenta += dinero;
  actualizarSaldoEnAlmacenamiento();
}

// Restar dinero de la cuenta
function restarDinero(dinero) {
  cliente.saldoCuenta -= dinero;
  actualizarSaldoEnAlmacenamiento();
}

// Actualizar el saldo en pantalla
function actualizarSaldoEnPantalla() {
  const saldoEnPantalla = document.getElementById("saldo-cuenta");
  saldoEnPantalla.innerText = "$" + separadorDeMiles(cliente.saldoCuenta);
}

// Función para obtener el saldo almacenado en el almacenamiento local
function obtenerSaldoDeAlmacenamiento() {
  const clienteJSON = localStorage.getItem("cliente");
  if (clienteJSON) {
    const cliente = JSON.parse(clienteJSON);
    return cliente.saldoCuenta;
  } else {
    return null;
  }
}

// Función para actualizar el saldo en el almacenamiento local
function actualizarSaldoEnAlmacenamiento() {
  const clienteJSON = JSON.stringify(cliente);
  localStorage.setItem("cliente", clienteJSON);
}

// Actualizar el límite de extracción en pantalla
function actualizarLimiteEnPantalla() {
  let limiteEnPantalla = document.getElementById("limite-extraccion");
  limiteEnPantalla.innerText = "Tu límite de extracción es: $" + separadorDeMiles(cliente.limiteExtraccion);
}

// Verificar si hay saldo suficiente en la cuenta
function haySaldoEnLaCuenta(dinero) {
  return cliente.saldoCuenta >= dinero;
}

// Verificar si el monto a extraer supera el límite de extracción
function superaLimiteDeExtraccion(dinero) {
  return dinero > cliente.limiteExtraccion;
}

// Verificar si el monto a extraer es múltiplo de 100
function esMultiploDe100(dinero) {
  return dinero % 100 === 0;
}

// Calcular el interés para un plazo fijo
function calcularPlazoFijo(monto, dias) {
  const tasaInteres = 0.03; // Tasa de interés fija del 3%
  return monto * tasaInteres * (dias / 365);
}

// Cargar nombre en pantalla
function cargarNombreEnPantalla() {
  let nombreEnPantalla = document.getElementById("nombre");
  nombreEnPantalla.innerText = "Hola, " + cliente.nombreUsuario + "!";
}

function cargarVisual() {
  let contenidoSaldo = document.getElementById("titulo-cuenta");
  contenidoSaldo.innerHTML = "Tu Saldo es:";

  let contenidoExtraccion = document.getElementById("limite-extraccion");
  contenidoExtraccion.innerHTML = "Tu límite de extracción es:";

}
const btnBorrarStorage = document.getElementById("btnBorrarStorage");
btnBorrarStorage.onclick = () => {
  localStorage.clear();
  console.log("Se Borro el Almacenamiento Local");
  location.reload(); // Recargo la ventana
}

const btnBorrarSession = document.getElementById("btnBorrarSession");
btnBorrarSession.onclick = () => {
  //eliminar todo el sessionStorage
  sessionStorage.clear();
  console.log("Se cerrará la Sesion");
  location.reload(); // Recargo la ventana
}

restaurarSesion();