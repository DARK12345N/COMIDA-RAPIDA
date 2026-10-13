// Variables globales
let carrito = {
    platos: [],
    bebidas: []
};
const modalCarrito = document.getElementById('modal-carrito');

// Variables globales para el registro de pedidos
let historialPedidos = [];
let totalVentas = 0;

// Elementos del DOM
const btnCarrito = document.getElementById('btn-carrito');
const btnCerrar = document.querySelector('.cerrar');
const itemsCarrito = document.getElementById('items-carrito');
const totalPedido = document.getElementById('total-pedido');
const contadorCarrito = document.getElementById('contador-carrito');
const btnFinalizar = document.getElementById('btn-finalizar');

// Productos disponibles
const productos = {
    'Hamburguesa Clásica': 10,
    'Pizza Margarita': 12,
    'Perro Caliente': 6,
    'Papas Fritas': 5
};

// Event Listeners para botones de ordenar platos
document.querySelectorAll('.btn-ordenar').forEach(btn => {
    btn.addEventListener('click', function() {
        const plato = this.closest('.plato');
        const nombre = plato.querySelector('h3').textContent;
        const cantidad = parseInt(plato.querySelector('.cantidad').textContent);
        const precio = parseFloat(plato.querySelector('.precio').textContent.replace('Bs.', ''));
        
        // Buscar si el plato ya existe en el carrito
        const platoExistente = carrito.platos.find(p => p.nombre === nombre);
        
        if (platoExistente) {
            // Actualizar cantidad y subtotal del plato existente
            platoExistente.cantidad += cantidad;
            platoExistente.subtotal = platoExistente.cantidad * platoExistente.precio;
            
            // Actualizar la visualización
            const itemElement = document.querySelector(`[data-nombre="${nombre}"]`);
            if (itemElement) {
                itemElement.querySelector('.cantidad').textContent = platoExistente.cantidad;
                itemElement.querySelector('.subtotal').textContent = `Bs.${platoExistente.subtotal.toFixed(2)}`;
            }
        } else {
            // Agregar nuevo plato al carrito
            const nuevoPlato = {
                nombre,
                cantidad,
                precio,
                subtotal: precio * cantidad
            };
            carrito.platos.push(nuevoPlato);
            
            // Crear elemento visual
            const itemElement = document.createElement('div');
            itemElement.className = 'carrito-item';
            itemElement.dataset.nombre = nombre;
            itemElement.innerHTML = `
                <span class="nombre">${nombre}</span>
                <span class="cantidad">${cantidad}</span>
                <span class="precio">Bs.${precio.toFixed(2)}</span>
                <span class="subtotal">Bs.${nuevoPlato.subtotal.toFixed(2)}</span>
                <button class="eliminar" onclick="eliminarDelCarrito('${nombre}', 'platos')">×</button>
            `;
            document.getElementById('carrito-platos').appendChild(itemElement);
        }
        
        // Resetear cantidad a 1
        plato.querySelector('.cantidad').textContent = '1';
        
        // Actualizar totales
        actualizarSubtotal('platos');
        actualizarTotal();
        actualizarContador();
        
        // Mostrar carrito
        modalCarrito.style.display = 'flex';
    });
});

// Event Listeners para botones de ordenar bebidas
document.querySelectorAll('.btn-ordenar-bebida').forEach(btn => {
    btn.addEventListener('click', function() {
        const bebida = this.closest('.bebida');
        const nombre = bebida.querySelector('h3').textContent;
        const select = bebida.querySelector('select');
        const cantidad = parseInt(bebida.querySelector('.cantidad').textContent);
        const opcion = select.options[select.selectedIndex];
        const precio = parseFloat(opcion.value);
        
        if (isNaN(precio)) {
            alert('Por favor seleccione un tamaño de bebida');
            return;
        }
        
        // Buscar si la bebida ya existe en el carrito
        const bebidaExistente = carrito.bebidas.find(b => b.nombre === nombre);
        
        if (bebidaExistente) {
            // Actualizar cantidad y subtotal de la bebida existente
            bebidaExistente.cantidad += cantidad;
            bebidaExistente.subtotal = bebidaExistente.cantidad * bebidaExistente.precio;
            
            // Actualizar la visualización
            const itemElement = document.querySelector(`[data-nombre="${nombre}"]`);
            if (itemElement) {
                itemElement.querySelector('.cantidad').textContent = bebidaExistente.cantidad;
                itemElement.querySelector('.subtotal').textContent = `Bs.${bebidaExistente.subtotal.toFixed(2)}`;
            }
        } else {
            // Agregar nueva bebida al carrito
            const nuevaBebida = {
                nombre,
                cantidad,
                precio,
                subtotal: precio * cantidad
            };
            carrito.bebidas.push(nuevaBebida);
            
            // Crear elemento visual
            const itemElement = document.createElement('div');
            itemElement.className = 'carrito-item';
            itemElement.dataset.nombre = nombre;
            itemElement.innerHTML = `
                <span class="nombre">${nombre}</span>
                <span class="cantidad">${cantidad}</span>
                <span class="precio">Bs.${precio.toFixed(2)}</span>
                <span class="subtotal">Bs.${nuevaBebida.subtotal.toFixed(2)}</span>
                <button class="eliminar" onclick="eliminarDelCarrito('${nombre}', 'bebidas')">×</button>
            `;
            document.getElementById('carrito-bebidas').appendChild(itemElement);
        }
        
        // Resetear cantidad a 1
        bebida.querySelector('.cantidad').textContent = '1';
        
        // Actualizar totales
        actualizarSubtotal('bebidas');
        actualizarTotal();
        actualizarContador();
        
        // Mostrar carrito
        modalCarrito.style.display = 'flex';
    });
});

// Event Listeners para botones de cantidad
document.querySelectorAll('.btn-mas').forEach(btn => {
    btn.addEventListener('click', function() {
        const cantidadElement = this.parentElement.querySelector('.cantidad');
        let cantidad = parseInt(cantidadElement.textContent);
        cantidadElement.textContent = cantidad + 1;
    });
});

document.querySelectorAll('.btn-menos').forEach(btn => {
    btn.addEventListener('click', function() {
        const cantidadElement = this.parentElement.querySelector('.cantidad');
        let cantidad = parseInt(cantidadElement.textContent);
        if (cantidad > 1) {
            cantidadElement.textContent = cantidad - 1;
        }
    });
});

// Función para eliminar del carrito
function eliminarDelCarrito(nombre, tipo) {
    carrito[tipo] = carrito[tipo].filter(item => item.nombre !== nombre);
    const itemElement = document.querySelector(`[data-nombre="${nombre}"]`);
    if (itemElement) {
        itemElement.remove();
    }
    actualizarSubtotal(tipo);
    actualizarTotal();
    actualizarContador();
}

// Función para actualizar subtotal
function actualizarSubtotal(tipo) {
    const subtotal = carrito[tipo].reduce((total, item) => total + item.subtotal, 0);
    document.getElementById(`subtotal-${tipo}`).textContent = `Subtotal: Bs.${subtotal.toFixed(2)}`;
}

// Función para actualizar total
function actualizarTotal() {
    const totalPlatos = carrito.platos.reduce((total, item) => total + item.subtotal, 0);
    const totalBebidas = carrito.bebidas.reduce((total, item) => total + item.subtotal, 0);
    const total = totalPlatos + totalBebidas;
    document.getElementById('total').textContent = `Total: Bs.${total.toFixed(2)}`;
}

// Función para actualizar contador
function actualizarContador() {
    const totalItems = carrito.platos.reduce((total, item) => total + item.cantidad, 0) +
                      carrito.bebidas.reduce((total, item) => total + item.cantidad, 0);
    contadorCarrito.textContent = totalItems;
}

// Event Listeners para botones del carrito
btnCarrito.addEventListener('click', () => {
    modalCarrito.style.display = 'flex';
});

document.querySelector('.btn-finalizar').addEventListener('click', function() {
    if (carrito.platos.length === 0 && carrito.bebidas.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    finalizarPedidoDirecto();
});

document.querySelector('.cerrar').addEventListener('click', function() {
    modalCarrito.style.display = 'none';
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function(event) {
    if (event.target === modalCarrito) {
        modalCarrito.style.display = 'none';
    }
});

// Función para finalizar pedido directamente sin nueva ventana
function finalizarPedidoDirecto() {
    // Pedir datos del cliente
    let nombreCliente = prompt('Ingrese el nombre y apellido del cliente:');
    if (!nombreCliente) nombreCliente = '__________________________';
    let carnetCliente = prompt('Ingrese el número de carnet del cliente:');
    if (!carnetCliente) carnetCliente = '__________________________';

    // Generar número de pedido correlativo por 24 horas
    const numeroPedido = generarNumeroPedido();

    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();

    // Encabezado institucional
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('U. E. SIMON BOLIVAR 1', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('FASTFOOD EXPRESS - RECIBO', 105, 22, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 26, 190, 26);

    // Número de pedido, fecha y hora
    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-BO');
    const horaStr = fecha.toLocaleTimeString('es-BO');
    doc.setFontSize(11);
    doc.text('Pedido: ' + numeroPedido, 25, 33);
    doc.text('Fecha: ' + fechaStr + '   Hora: ' + horaStr, 120, 33);

    // Datos del cliente
    doc.setFontSize(12);
    doc.text('Cliente: ' + nombreCliente, 25, 42);
    doc.text('Carnet:  ' + carnetCliente, 25, 48);

    // Detalle del pedido
    doc.setFontSize(12);
    doc.text('Detalle del Pedido:', 25, 56);
    doc.setLineWidth(0.2);
    doc.line(20, 58, 190, 58);
    doc.setFontSize(11);
    doc.text('Cantidad', 25, 63);
    doc.text('Producto', 55, 63);
    doc.text('Subtotal', 150, 63);
    doc.line(20, 65, 190, 65);

    let y = 71;
    let total = 0;
    
    // Platos
    carrito.platos.forEach(function(item) {
        doc.text(item.cantidad.toString(), 27, y);
        doc.text(item.nombre, 55, y);
        doc.text('Bs. ' + item.subtotal.toFixed(2), 155, y, { align: 'right' });
        total += item.subtotal;
        y += 7;
    });
    
    // Bebidas
    carrito.bebidas.forEach(function(item) {
        doc.text(item.cantidad.toString(), 27, y);
        doc.text(item.nombre, 55, y);
        doc.text('Bs. ' + item.subtotal.toFixed(2), 155, y, { align: 'right' });
        total += item.subtotal;
        y += 7;
    });
    
    // Línea separadora
    doc.line(20, y, 190, y);
    y += 7;
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL: Bs. ' + total.toFixed(2), 150, y);
    y += 10;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text('Contacto: 72857225', 25, y);
    y += 6;
    doc.text('SIMON BOLIVAR 1', 25, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont(undefined, 'italic');
    doc.text('¡Gracias por preferirnos!', 105, y, { align: 'center' });

    // Guardar PDF
    doc.save('pedido_' + numeroPedido + '.pdf');

    // Limpiar carrito y cerrar modal
    limpiarCarrito();
}

// Función para generar número de pedido correlativo por 24 horas
function generarNumeroPedido() {
    const ahora = new Date();
    const fechaActual = ahora.toDateString(); // Solo fecha, sin hora
    
    // Obtener datos guardados
    const datosGuardados = localStorage.getItem('pedidoData');
    let contador = 1;
    let fechaGuardada = fechaActual;
    
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        if (datos.fecha === fechaActual) {
            // Mismo día, incrementar contador
            contador = datos.contador + 1;
        }
        // Si es diferente día, contador vuelve a 1
    }
    
    // Guardar nuevos datos
    localStorage.setItem('pedidoData', JSON.stringify({
        contador: contador,
        fecha: fechaActual
    }));
    
    return 'PED-' + contador;
}

// Función para limpiar el carrito
function limpiarCarrito() {
    carrito.platos = [];
    carrito.bebidas = [];
    document.getElementById('carrito-platos').innerHTML = '';
    document.getElementById('carrito-bebidas').innerHTML = '';
    document.getElementById('subtotal-platos').textContent = 'Subtotal: Bs.0.00';
    document.getElementById('subtotal-bebidas').textContent = 'Subtotal: Bs.0.00';
    document.getElementById('total').textContent = 'Total: Bs.0.00';
    actualizarContador();
    modalCarrito.style.display = 'none';
}

function calcularTotal() {
    return carrito.platos.reduce((total, item) => total + item.precio, 0) + carrito.bebidas.reduce((total, item) => total + item.precio, 0);
}

function actualizarCarrito() {
    itemsCarrito.innerHTML = '';
    const counts = {};
    carrito.platos.forEach(item => {
        counts[item.nombre] = (counts[item.nombre] || 0) + 1;
    });
    carrito.bebidas.forEach(item => {
        counts[item.nombre] = (counts[item.nombre] || 0) + 1;
    });

    for (const item in counts) {
        const div = document.createElement('div');
        div.className = 'item-carrito';
        div.innerHTML = `
            <span>${counts[item]}x ${item} - Bs.${(calcularTotal() * counts[item]).toFixed(2)}</span>
            <button onclick="eliminarItemCompleto('${item}')">Eliminar</button>
        `;
        itemsCarrito.appendChild(div);
    }
    totalPedido.textContent = `Total: Bs.${calcularTotal().toFixed(2)}`;
}

function eliminarItemCompleto(nombre) {
    carrito.platos = carrito.platos.filter(item => item.nombre !== nombre);
    carrito.bebidas = carrito.bebidas.filter(item => item.nombre !== nombre);
    actualizarContador();
    actualizarCarrito();
}

function registrarPedido() {
    const platos = carrito.platos.map(item => ({
        nombre: item.nombre,
        precio: item.precio
    }));

    const bebidas = carrito.bebidas.map(item => ({
        nombre: item.nombre,
        precio: item.precio
    }));

    const pedido = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        platos: platos,
        bebidas: bebidas,
        total: calcularTotalPedido(platos, bebidas)
    };

    historialPedidos.push(pedido);
    totalVentas += pedido.total;
    actualizarHistorial();
    guardarDatos();
}

function calcularTotalPedido(platos, bebidas) {
    const totalPlatos = platos.reduce((sum, plato) => sum + plato.precio, 0);
    const totalBebidas = bebidas.reduce((sum, bebida) => sum + bebida.precio, 0);
    return totalPlatos + totalBebidas;
}

function actualizarHistorial() {
    const historialContainer = document.getElementById('historial-pedidos');
    if (!historialContainer) return;

    historialContainer.innerHTML = `
        <h3>Historial de Pedidos</h3>
        <div class="total-ventas">Total Ventas: Bs.${totalVentas.toFixed(2)}</div>
        <div class="lista-pedidos">
            ${historialPedidos.map(pedido => `
                <div class="pedido-item">
                    <div class="pedido-header">
                        <span>Pedido #${pedido.id}</span>
                        <span>${pedido.fecha} ${pedido.hora}</span>
                    </div>
                    <div class="pedido-detalles">
                        ${pedido.platos.map(plato => `
                            <div class="detalle-item">
                                <span>${plato.nombre}</span>
                                <span>Bs.${plato.precio.toFixed(2)}</span>
                            </div>
                        `).join('')}
                        ${pedido.bebidas.map(bebida => `
                            <div class="detalle-item">
                                <span>${bebida.nombre}</span>
                                <span>Bs.${bebida.precio.toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="pedido-total">
                        Total: Bs.${pedido.total.toFixed(2)}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function guardarDatos() {
    localStorage.setItem('historialPedidos', JSON.stringify(historialPedidos));
    localStorage.setItem('totalVentas', totalVentas.toString());
}

function cargarDatos() {
    const historialGuardado = localStorage.getItem('historialPedidos');
    const totalGuardado = localStorage.getItem('totalVentas');
    
    if (historialGuardado) {
        historialPedidos = JSON.parse(historialGuardado);
    }
    if (totalGuardado) {
        totalVentas = parseFloat(totalGuardado);
    }
    
    actualizarHistorial();
}

function generarPDFComprobante(productos, total) {
    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();

    // Generar número de pedido único (fecha + número aleatorio)
    const numeroPedido = `PED-${new Date().getTime().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // Agregar escudo
    doc.addImage('imagenes/Captura de pantalla 2026-08-11 145800.png', 'JPEG', 20, 10, 30, 30);

    // Título principal
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('COMPROBANTE DE PAGO', 105, 15, { align: 'center' });

    // Número de pedido con marco
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.rect(60, 20, 90, 10); // Marco para el número de pedido
    doc.text(`N° Pedido: ${numeroPedido}`, 105, 27, { align: 'center' });

    // Encabezado institucional
    doc.setFontSize(13);
    doc.setFont(undefined, 'normal');
    doc.text('FASTFOOD EXPRESS', 105, 40, { align: 'center' });
    doc.setFontSize(15);
    doc.setFont(undefined, 'bold');
    doc.text('U. E. SIMON BOLIVAR 1', 105, 48, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('SISTEMAS', 105, 54, { align: 'center' });
    doc.text('FASFOOD-SIMON BOLIVAR 1', 105, 59, { align: 'center' });

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(20, 63, 190, 63);

    // Fecha y hora a la derecha
    const fechaHora = new Date().toLocaleString('es-BO', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    });
    doc.setFontSize(11);
    doc.text(`Fecha: ${fechaHora}`, 180, 70, { align: 'right' });

    // Área a la derecha
    doc.setFontSize(12);
    doc.text('SISTEMAS INFORMÁTICOS', 180, 77, { align: 'right' });

    // Tabla de productos
    let y = 90;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    
    // Encabezados de la tabla
    doc.rect(20, y-5, 170, 10); // Marco del encabezado
    doc.text('Cant.', 30, y);
    doc.text('Producto', 70, y);
    doc.text('P. Unit.', 130, y, { align: 'right' });
    doc.text('Subtotal', 180, y, { align: 'right' });
    
    doc.setFont(undefined, 'normal');
    y += 10;

    // Separar productos en categorías
    const platos = productos.filter(item => !item.nombre.toLowerCase().includes('bebida'));
    const bebidas = productos.filter(item => item.nombre.toLowerCase().includes('bebida'));

    // Función para obtener la ruta de la imagen del producto
    const obtenerRutaImagen = (nombre) => {
        const nombreLimpio = nombre.toLowerCase().replace(/\s+/g, '');
        if (nombre.toLowerCase().includes('bebida')) {
            return `imagenes/bebidas/${nombre}.jpg`;
        }
        return `imagenes/${nombre}.jpg`;
    };

    // Función para dibujar una fila de producto
    const dibujarFilaProducto = (item) => {
        doc.rect(20, y-5, 170, 15); // Marco de la fila
        doc.text(String(item.cantidad), 30, y);
        
        // Intentar agregar la imagen del producto
        try {
            const rutaImagen = obtenerRutaImagen(item.nombre);
            doc.addImage(rutaImagen, 'JPEG', 45, y-3, 10, 10);
        } catch (error) {
            console.log('No se pudo cargar la imagen para:', item.nombre);
        }
        
        doc.text(item.nombre, 70, y);
        doc.text(`Bs. ${item.precio.toFixed(2)}`, 130, y, { align: 'right' });
        doc.text(`Bs. ${item.subtotal.toFixed(2)}`, 180, y, { align: 'right' });
        y += 15;
    };

    // Agregar platos principales
    if (platos.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.text('PLATOS PRINCIPALES', 105, y, { align: 'center' });
        y += 10;
        doc.setFont(undefined, 'normal');
        platos.forEach(dibujarFilaProducto);
    }

    // Agregar bebidas
    if (bebidas.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.text('BEBIDAS', 105, y, { align: 'center' });
        y += 10;
        doc.setFont(undefined, 'normal');
        bebidas.forEach(dibujarFilaProducto);
    }

    // Línea separadora antes del total
    y += 5;
    doc.setLineWidth(0.5);
    doc.line(120, y, 190, y);
    y += 10;

    // Total
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Total :', 130, y);
    doc.text('Bs.', 160, y);
    doc.text(total.toFixed(2), 180, y, { align: 'right' });

    // Mensaje de agradecimiento
    y += 18;
    doc.setFontSize(12);
    doc.setFont(undefined, 'italic');
    doc.text('¡Gracias por tu compra!', 105, y, { align: 'center' });

    // Información de contacto al pie
    y += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Sistemas informáticos', 20, y);
    y += 6;
    doc.text('Contáctanos', 20, y);
    y += 6;
    doc.text('Tel.: 78183036', 20, y);
    y += 6;
    doc.text('SIMON BOLIVAR 1', 20, y);

    // Guardar PDF con el número de pedido en el nombre
    doc.save(`comprobante_pedido_${numeroPedido}.pdf`);
}

// Función para actualizar los totales
function actualizarTotales() {
    // Calcular subtotal de platos
    const platos = document.querySelectorAll('#carrito-platos .carrito-item');
    let subtotalPlatos = 0;
    platos.forEach(item => {
        const precio = parseFloat(item.querySelector('span:nth-child(2)').textContent.replace('Bs.', ''));
        subtotalPlatos += precio;
    });
    document.getElementById('subtotal-platos').textContent = `Subtotal Platos: Bs.${subtotalPlatos}`;

    // Calcular subtotal de bebidas
    const bebidas = document.querySelectorAll('#carrito-bebidas .carrito-item');
    let subtotalBebidas = 0;
    bebidas.forEach(item => {
        const precio = parseFloat(item.querySelector('span:nth-child(2)').textContent.replace('Bs.', ''));
        subtotalBebidas += precio;
    });
    document.getElementById('subtotal-bebidas').textContent = `Subtotal Bebidas: Bs.${subtotalBebidas}`;

    // Calcular total general
    const total = subtotalPlatos + subtotalBebidas;
    document.getElementById('total').textContent = `Total: Bs.${total}`;
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    // ... resto del código existente ...
}); 