// ===============================
// 🟩 PROYECTO: VAO POS MULTIHOJA — STAGING
// 📍 googlesheet: victoralvarezojeda@gmail.com
// 📍 Claude: patagonia.salvaje.comidas@gmail.com
// 📍 Deepseek: patagonia.salvaje.comidas@gmail.com
// 🌐 URL: https://vao-pos-staging.vercel.app/
// 📁 Repo: https://github.com/vitocoo/SmartPOS-VAO-Sistemas-STAGING
// 📊 Planilla: Copia de SmartPOS_VAO_Sistemas_Planilla_Staging
// 🧩 Arquitectura: 1 planilla, multihojas por cliente
// 🎯 Origen: POS Lupino + funciones maduras de Copihue
// ⚠️ ESTE ES EL SISTEMA DE PRUEBAS — NO PRODUCCIÓN
// ⚠️ Producción vive en: vaopos.vercel.app
// 📅 Última edición: 15/09/2026
// ===============================

const SISTEMA = {
  proyecto:      'VAO POS MULTIHOJA STAGING',
  entorno:       'staging',
  googlesheet:   'victoralvarezojeda@gmail.com',
  claude:        'patagonia.salvaje.comidas@gmail.com',
  deepseek:      'patagonia.salvaje.comidas@gmail.com',
  url:           'https://vao-pos-staging.vercel.app/',
  repo:          'vitocoo/SmartPOS-VAO-Sistemas-STAGING',
  planilla:      'Copia de SmartPOS_VAO_Sistemas_Planilla_Staging',
  arquitectura:  '1 planilla, multihojas por cliente',
  origen:        'POS Lupino + funciones de Copihue',
  produccion:    {
    url:      'https://vaopos.vercel.app/',
    repo:     'vitocoo/SmartPOS-VAO-Sistemas',
    planilla: 'SmartPOS_VAO_Sistemas_Planilla'
  },
  version:       'v012',
  ultimaEdicion: '20/09/2026'
};

// ===============================
// VAO SmartPOS — Motor API (STAGING)
// ===============================
// Columnas VENDEDORES:  A=Prefijo B=Nombre C=Teléfono D=Correo E=Categoría F=Fecha Alta G=Activo H=Comision% I=Alias Pago J=Link MP K=Notas
// ⚠️  Token MP NO va en Sheets — se guarda en Script Properties (seguro)
//     Para cargar tokens: ejecutar setTokenMP('PREFIJO', 'APP_USR-...')
// Columnas INVENTARIO:  A=Código B=Producto C=Stock D=P.Costo E=P.Venta F=Proveedor G=Categoría H=Reservada I=Reservada
// Columnas VENTAS:      A=Fecha B=Producto C=Cantidad D.P.Venta E=Modo de pago F=Total
// ===============================


function doGet(e) {
  const action  = e.parameter.action  || '';
  const prefijo = (e.parameter.prefijo || 'NE').toUpperCase();
  const data    = e.parameter.data ? JSON.parse(decodeURIComponent(e.parameter.data)) : {};

  var result;
  try {
    if      (action === 'getInfo')            { result = getInfo(); }
    else if (action === 'getVendedores')      { result = getVendedores(data, prefijo); }
    else if (action === 'crearVendedor')      { result = crearVendedor(data); }
    else if (action === 'getProductos')       { result = getProductos(data, prefijo); }
    else if (action === 'vender')             { result = registrarVenta(data, prefijo); }
    else if (action === 'ingresarMercaderia') { result = ingresarMercaderia(data, prefijo); }
    else if (action === 'ajustarStock')       { result = ajustarStock(data, prefijo); }
    else if (action === 'getEstadisticas')    { result = getEstadisticas(data, prefijo); }
    else if (action === 'getVentas')          { result = getVentas(data, prefijo); }
    else if (action === 'getVentasDiarias')   { result = getVentasDiarias(data, prefijo); }
    else if (action === 'getTokenMP')         { result = getTokenMP(data, prefijo); }
    else if (action === 'crearPreferenciaMP') { result = crearPreferenciaMP(data, prefijo); }
    else if (action === 'adminLogin')         { result = adminLogin(data); }
    else if (action === 'clienteLogin')       { result = clienteLogin(data); }
    else if (action === 'cerrarSesion')       { result = cerrarSesionCliente(data, prefijo); }
    else if (action === 'getConfig')          { result = getConfig(prefijo, data.token || ''); }
    else if (action === 'getResumenAdmin')    { result = getResumenAdmin(data.token || ''); }
    else if (action === 'activarCliente')     { result = activarCliente(data); }
    else if (action === 'suspenderCliente')   { result = suspenderCliente(data); }
    // Historial
    else if (action === 'getHistorial')       { result = getHistorial(data, prefijo); }
    // Fiados
    else if (action === 'crearFiado')         { result = crearFiado(data, prefijo); }
    else if (action === 'listarFiados')       { result = listarFiados(data, prefijo); }
    else if (action === 'abonarFiado')        { result = abonarFiado(data, prefijo); }
    else if (action === 'consultarFiado')     { result = consultarFiadoPorTelefono(data, prefijo); }
    // Préstamos
    else if (action === 'crearPrestamo')      { result = crearPrestamo(data, prefijo); }
    else if (action === 'listarPrestamos')    { result = listarPrestamos(data, prefijo); }
    else if (action === 'pagarPrestamo')      { result = registrarPagoPrestamo(data, prefijo); }
    // Caja
    else if (action === 'abrirCaja')          { result = abrirCaja(data, prefijo); }
    else if (action === 'cerrarCaja')         { result = cerrarCaja(data, prefijo); }
    else if (action === 'getCajaActual')      { result = getCajaActual(data, prefijo); }
    else if (action === 'movimientoCaja')     { result = registrarMovimientoCaja(data, prefijo); }
    else if (action === 'getMovimientosCaja') { result = getMovimientosCaja(data, prefijo); }
    // Salidas
    else if (action === 'registrarSalida')    { result = registrarSalida(data, prefijo); }
    else if (action === 'getSalidas')         { result = getSalidas(data, prefijo); }
    // Multicompra
    else if (action === 'configurarMulticompra') { result = configurarMulticompra(data, prefijo); }
    else if (action === 'getMulticompraActivas') { result = getMulticompraActivas(data, prefijo); }
    // Ofertas
    else if (action === 'getOfertas')         { result = calcularOfertas(data, prefijo); }
    else if (action === 'configurarOferta')   { result = configurarOferta(data, prefijo); }
    // Planes
    else if (action === 'listarPlanes')       { result = listarPlanes(data); }
    else if (action === 'aplicarPlan')        { result = aplicarPlan(data); }
    else                                      { result = { error: 'Acción no reconocida: ' + action }; }
  } catch (err) {
    result = { error: err.message };
  }

  return respuestaJSON(result);
}

// ===============================
// GESTIÓN SEGURA DE TOKENS MP
// Los tokens NUNCA se guardan en Sheets — viven en Script Properties
// ===============================

// Ejecutar manualmente UNA VEZ desde el editor para cargar el token:
// setTokenMP('NE', 'APP_USR-...')
// setTokenMP('VA', 'APP_USR-...')
function setTokenMP(prefijo, token) {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('MP_TOKEN_' + prefijo.toUpperCase(), token);
  Logger.log('Token guardado para ' + prefijo);
}

// Eliminar token de un vendedor
function deleteTokenMP(prefijo) {
  var props = PropertiesService.getScriptProperties();
  props.deleteProperty('MP_TOKEN_' + prefijo.toUpperCase());
  Logger.log('Token eliminado para ' + prefijo);
}

// Ver qué prefijos tienen token cargado (SIN mostrar el token)
function listarTokensConfigurados() {
  var props = PropertiesService.getScriptProperties().getProperties();
  var configurados = [];
  for (var key in props) {
    if (key.startsWith('MP_TOKEN_')) {
      configurados.push(key.replace('MP_TOKEN_', ''));
    }
  }
  Logger.log('Tokens configurados: ' + configurados.join(', '));
  return configurados;
}

// Endpoint que devuelve el token al POS — solo si el prefijo coincide
// El token sale del servidor cifrado en HTTPS, nunca se guarda en Sheets
function getTokenMP(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, null);
  if (!auth.ok) return { error: auth.error };
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('MP_TOKEN_' + prefijo) || '';
  // El token real NUNCA sale del servidor — el frontend solo necesita
  // saber si está configurado. Para generar el QR de cobro, usar
  // crearPreferenciaMP(), que hace el llamado a MercadoPago del lado
  // servidor y devuelve únicamente la URL de pago.
  return { configurado: !!token };
}

// Genera la preferencia de pago en MercadoPago del lado servidor — el
// token de acceso nunca viaja al navegador. El frontend solo recibe la
// URL final para armar el QR.
function crearPreferenciaMP(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, null);
  if (!auth.ok) return { error: auth.error };

  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('MP_TOKEN_' + prefijo) || '';
  if (!token) return { configurado: false };

  var total = parseFloat(data.total) || 0;
  if (total <= 0) return { error: 'Total inválido' };

  var payload = {
    items: [{ title: (data.descripcion || 'Venta'), quantity: 1, unit_price: total, currency_id: 'ARS' }],
    payment_methods: { excluded_payment_types: [] },
    back_urls: { success: data.backUrl || '' },
    auto_return: 'approved'
  };

  try {
    var resp = UrlFetchApp.fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    var json = JSON.parse(resp.getContentText());
    if (json.id && json.init_point) {
      return { success: true, configurado: true, initPoint: json.init_point };
    }
    return { error: json.message || 'MercadoPago no devolvió una preferencia válida' };
  } catch (e) {
    return { error: 'Error al conectar con MercadoPago: ' + e.message };
  }
}

// ===============================
// INFO DEL SISTEMA
// Endpoint: ?action=getInfo
// Devuelve los datos del proyecto.
// ===============================
function getInfo() {
  // Público a propósito (ping de diagnóstico), por eso se devuelve solo lo
  // no sensible — nunca correos, repo ni nombre real de la planilla.
  return {
    ok: true,
    sistema: { proyecto: SISTEMA.proyecto, entorno: SISTEMA.entorno, version: SISTEMA.version, ultimaEdicion: SISTEMA.ultimaEdicion },
    fechaConsulta: new Date().toISOString()
  };
}

// ===============================
// HELPERS COMPARTIDOS (migrados de Copihue)
// ===============================

/**
 * Helper central para armar respuestas JSON en el Web App de GAS.
 * Recibe cualquier objeto JS y devuelve un ContentService.TextOutput
 * con el JSON serializado y el MIME type correcto, listo para
 * retornar desde doGet/doPost.
 */
function respuestaJSON(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * _parseNumeroFlexible
 * Convierte a número cualquier valor que venga de una celda de Google Sheets,
 * sin importar el formato: número real, texto plano, formato argentino
 * ("1.500,50"), con coma decimal ("1,6"), con símbolo de moneda ("$1.500"),
 * vacío, null o undefined. Si no logra interpretar el valor, devuelve 0.
 */
function _parseNumeroFlexible(valor) {
  if (valor === null || valor === undefined || valor === '') return 0;
  if (typeof valor === 'number') return isNaN(valor) ? 0 : valor;
  if (typeof valor !== 'string') return 0;
  var texto = valor.trim();
  if (texto === '') return 0;
  texto = texto.replace(/[^0-9.,-]/g, '');
  if (texto === '' || texto === '-') return 0;
  var tieneComa = texto.indexOf(',') !== -1;
  var tienePunto = texto.indexOf('.') !== -1;
  if (tieneComa && tienePunto) {
    texto = texto.replace(/\./g, '').replace(',', '.');
  } else if (tieneComa) {
    texto = texto.replace(',', '.');
  } else if (tienePunto) {
    var partes = texto.split('.');
    var ultimaParte = partes[partes.length - 1];
    if (partes.length === 2 && ultimaParte.length === 3) {
      texto = texto.replace('.', '');
    }
  }
  var numero = parseFloat(texto);
  return isNaN(numero) ? 0 : numero;
}

/**
 * _esActivoFlag_: normaliza distintos valores de una planilla de
 * Google Sheets para determinar si representan "activo" (true) o no (false).
 * Acepta: true, "SI", "SÍ", "TRUE", "VERDADERO", "X", "1" (sin importar
 * mayúsculas/minúsculas ni espacios al inicio/final). Cualquier otro
 * valor (false, null, undefined, "", otros textos) devuelve false.
 */
function _esActivoFlag_(valor) {
  if (valor === true) return true;
  if (typeof valor !== 'string') return false;
  var normalizado = valor.trim().toUpperCase();
  var valoresActivos = ['SI', 'SÍ', 'TRUE', 'VERDADERO', 'X', '1'];
  return valoresActivos.indexOf(normalizado) !== -1;
}

function getHojaInv(prefijo) {
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName('INVENTARIO_' + prefijo);
  if (!hoja) throw new Error('No existe hoja INVENTARIO_' + prefijo);
  return hoja;
}

function getHojaVentas(prefijo) {
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName('VENTAS_' + prefijo);
  if (!hoja) throw new Error('No existe hoja VENTAS_' + prefijo);
  return hoja;
}

function getVendedores(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, null);
  if (!auth.ok) return { error: auth.error };

  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName('VENDEDORES');
  if (!hoja) throw new Error('No existe hoja VENDEDORES');

  // Mapa prefijo → fila de CLIENTES_VAO (identidad/estado real). Si el prefijo
  // todavía no tiene fila ahí (transición), se usa lo que haya en VENDEDORES.
  var mapaCli = {};
  var hCli = ss.getSheetByName('CLIENTES_VAO');
  if (hCli) {
    var datosCli = hCli.getDataRange().getValues();
    for (var c = 1; c < datosCli.length; c++) {
      var pc = String(datosCli[c][0] || '').trim().toUpperCase();
      if (pc) mapaCli[pc] = datosCli[c];
    }
  }

  var datos = hoja.getDataRange().getValues();
  var vendedores = [];
  for (var i = 1; i < datos.length; i++) {
    var f = datos[i];
    var prefFila = f[0] ? String(f[0]).trim().toUpperCase() : '';
    if (!prefFila) continue;
    if (prefFila !== prefijo) continue; // SEGURIDAD: solo el propio cliente, nunca los demás
    // VENDEDORES: A=Prefijo B=Nombre C=Teléfono D=Correo E=Categoría F=Fecha Alta G=Activo H=Comision% I=Alias Pago J=Link MP K=Notas
    // CLIENTES_VAO (si existe fila): B=Nombre Negocio D=Teléfono E=Correo G=Estado J=Alias Pago K=Link MP
    var fc = mapaCli[prefFila];
    vendedores.push({
      prefijo:   prefFila,
      nombre:    fc ? String(fc[1]  || '').trim() : String(f[1] || '').trim(),
      telefono:  fc ? String(fc[3]  || '').trim() : String(f[2] || '').trim(),
      correo:    fc ? String(fc[4]  || '').trim() : String(f[3] || '').trim(),
      categoria: String(f[4]  || '').trim(),
      fechaAlta: f[5] ? Utilities.formatDate(new Date(f[5]), Session.getScriptTimeZone(), 'dd/MM/yyyy') : '',
      activo:    fc ? (String(fc[6] || '').trim().toUpperCase() === 'ACTIVO') : (String(f[6] || '').trim().toLowerCase() === 'si'),
      comision:  parseFloat(f[7]) || 0,
      aliasPago: fc ? String(fc[9]  || '').trim() : String(f[8] || '').trim(),
      linkMP:    fc ? String(fc[10] || '').trim() : String(f[9] || '').trim(),
      notas:     String(f[10] || '').trim()
      // tokenMP: NUNCA se devuelve desde getVendedores — se pide por separado con getTokenMP
    });
  }
  return { vendedores: vendedores };
}

function generarPinAleatorio() {
  return String(Math.floor(100000 + Math.random() * 900000)); // siempre 6 dígitos
}

function crearHojaConfigDefault(ss, prefijo, nombre, telefono, correo, aliasPago) {
  var nombreConfig = 'CONFIG_' + prefijo;
  if (ss.getSheetByName(nombreConfig)) return; // ya existe, no se toca

  var hoja = ss.insertSheet(nombreConfig);

  var datos = [
    ['campo', 'valor', 'notas'],
    ['', '', '--- IDENTIDAD ---'],
    ['title', 'Catalogo - ' + nombre, ''],
    ['slogan', '', ''],
    ['nombre_empresa', nombre, ''],
    ['telefono', telefono, ''],
    ['direccion', '', ''],
    ['email', correo, ''],
    ['ciudad', '', ''],
    ['descripcion', '', ''],
    ['logo_url', '', ''],
    ['url_sitio', '', ''],
    ['', '', '--- APARIENCIA ---'],
    ['tema_actual', 'T3', ''],
    ['color_primario', '#1E88E5', 'VAO Blue'],
    ['color_secundario', '#2CCB6F', 'VAO Green'],
    ['color_acento', '#FF9800', 'VAO Sunset'],
    ['', '', '--- PAGOS ---'],
    ['alias_transferencia', aliasPago, ''],
    ['qr_pago', '', ''],
    ['', '', '--- WIFI ---'],
    ['wifi_ssid', '', ''],
    ['wifi_clave', '', ''],
    ['qr_wifi', '', ''],
    ['', '', '--- RECIEN LLEGADOS ---'],
    ['RECIEN_LLEGADOS_PRECIO_MIN', 2000, ''],
    ['RECIEN_LLEGADOS_LIMITE', 60, ''],
    ['RECIEN_LLEGADOS_DIAS', 15, ''],
    ['', '', '--- SEGURIDAD ---'],
    ['PIN', '', 'inerte — el PIN real vive en Script Properties'],
    ['sesion_dias', 7, ''],
    ['intentos_max', 3, ''],
    ['', '', '--- MODULOS BASE (siempre TRUE) ---'],
    ['ventas', 'TRUE', ''],
    ['cobrar', 'TRUE', ''],
    ['ticket_wa', 'TRUE', ''],
    ['buscador', 'TRUE', ''],
    ['', '', '--- PACK 1 (default FALSE, activar manualmente) ---'],
    ['pack1_ingreso', 'FALSE', ''],
    ['pack1_hoy', 'FALSE', ''],
    ['pack1_recargar', 'FALSE', ''],
    ['pack1_notificaciones', 'FALSE', ''],
    ['pack1_info', 'FALSE', ''],
    ['', '', '--- PACK 2 (default FALSE) ---'],
    ['pack2_editor_stock', 'FALSE', ''],
    ['pack2_reportes', 'FALSE', ''],
    ['', '', '--- PACK 3 (default FALSE) ---'],
    ['pack3_editor_categoria', 'FALSE', ''],
    ['pack3_editor_nombre', 'FALSE', ''],
    ['pack3_finanzas', 'FALSE', ''],
    ['', '', '--- EXTRA (default FALSE) ---'],
    ['extra_horarios', 'FALSE', 'requiere CONF_DIARIA_' + prefijo],
    ['extra_ultimas_unidades', 'FALSE', ''],
    ['extra_prestamos', 'FALSE', ''],
    ['extra_retiro_caja', 'FALSE', ''],
    ['extra_retiro_local', 'FALSE', ''],
    ['extra_fiados', 'FALSE', ''],
    ['extra_lista_compras', 'FALSE', ''],
    ['extra_generador_flyer', 'FALSE', ''],
    ['extra_config_ofertas', 'FALSE', ''],
    ['extra_carga_foto', 'FALSE', ''],
    ['extra_herramientas', 'FALSE', ''],
    ['extra_raspadita', 'FALSE', ''],
    ['extra_tragamonedas', 'FALSE', ''],
    ['', '', '--- NUEVOS MÓDULOS (default FALSE) ---'],
    ['extra_historial', 'FALSE', ''],
    ['extra_caja', 'FALSE', 'incluye Caja + Caja_Movimientos'],
    ['extra_salidas', 'FALSE', 'merma / consumo interno'],
    ['', '', '--- OFERTAS (requiere extra_config_ofertas=TRUE) ---'],
    ['ofertas_relampago_limite', 3, ''],
    ['ofertas_relampago_hora_inicio', '', 'vacío = todo el día. Ej: 18'],
    ['ofertas_relampago_hora_cierre', '', 'vacío = todo el día. Ej: 21'],
    ['ofertas_destacadas_limite', 6, ''],
    ['ofertas_especiales_limite', 3, ''],
    ['ofertas_ultimas_stock_max', 3, 'stock igual o menor = "últimas unidades"'],
    ['ofertas_dia_tematico_activo', 'FALSE', 'ej: generaliza "Jueves Cervecero" a cualquier día/categoría'],
    ['ofertas_dia_tematico_dia', 4, '0=domingo...6=sábado. 4=jueves'],
    ['ofertas_dia_tematico_categoria', '', 'texto a buscar en categoría o nombre, ej CERVEZA']
  ];

  hoja.getRange(1, 1, datos.length, 3).setValues(datos);
  var header = hoja.getRange(1, 1, 1, 3);
  header.setBackground('#1E88E5');
  header.setFontColor('#FFFFFF');
  header.setFontWeight('bold');
  hoja.setFrozenRows(1);
}

function crearVendedor(data) {
  if (!validarSesionAdmin(data.token || '')) return { error: 'Sesión admin inválida o expirada' };

  var ss        = SpreadsheetApp.getActiveSpreadsheet();
  var prefijo   = (data.prefijo   || '').trim().toUpperCase();
  var nombre    = (data.nombre    || '').trim();
  var telefono  = (data.telefono  || '').trim();
  var correo    = (data.correo    || '').trim();
  var categoria = (data.categoria || 'GENERAL').trim().toUpperCase();
  var comision  = parseFloat(data.comision) || 0;
  var aliasPago = (data.aliasPago || '').trim();
  var linkMP    = (data.linkMP    || '').trim();
  var tokenMP   = (data.tokenMP   || '').trim(); // se guarda en Properties, NO en Sheets

  if (!prefijo || prefijo.length < 2) return { error: 'Prefijo inválido (mínimo 2 letras)' };
  if (!nombre) return { error: 'Nombre requerido' };

  var hVend = ss.getSheetByName('VENDEDORES');
  if (!hVend) return { error: 'No existe hoja VENDEDORES' };

  var datosVend = hVend.getDataRange().getValues();
  for (var i = 1; i < datosVend.length; i++) {
    if (String(datosVend[i][0]).trim().toUpperCase() === prefijo) {
      return { error: 'El prefijo ' + prefijo + ' ya existe' };
    }
  }

  // Crea TODAS las hojas operativas del cliente de una vez — inventario,
  // ventas, config y los módulos nuevos (historial, fiados, préstamos,
  // caja, caja_movimientos, salidas, ajuste_rápido). Es idempotente: si
  // una hoja ya existe, no la toca ni la recrea.
  _crearHojasOperativasCompletas(ss, prefijo, nombre, telefono, correo, aliasPago);

  // Guardar en VENDEDORES SIN el token — columnas: A=Prefijo B=Nombre C=Teléfono D=Correo E=Categoría F=Fecha Alta G=Activo H=Comision% I=Alias Pago J=Link MP K=Notas
  var ultimaFila = hVend.getLastRow() + 1;
  hVend.getRange(ultimaFila,1,1,11).setValues([[
    prefijo, nombre, telefono, correo, categoria,
    new Date(), 'si', comision, aliasPago, linkMP, ''
  ]]);

  // Guardar identidad/estado comercial en CLIENTES_VAO — fuente real del cliente.
  // Plan y Fecha Vence no vienen del alta rápida de admin.html todavía: quedan
  // en PRUEBA / sin vencimiento hasta que se cargue eso a mano o se defina el
  // flujo comercial completo (REQUIERE DECISIÓN VAO, no se inventa acá).
  var hCliNueva = ss.getSheetByName('CLIENTES_VAO');
  if (hCliNueva) {
    var filaCli = hCliNueva.getLastRow() + 1;
    hCliNueva.getRange(filaCli,1,1,14).setValues([[
      prefijo, nombre, '', telefono, correo, 'PRUEBA', 'ACTIVO',
      new Date(), '', aliasPago, linkMP,
      tokenMP ? 'CONFIGURADO ✅' : 'PENDIENTE ⚠️', 'CONFIGURADO ✅', ''
    ]]);
  }

  // Si vino token, guardarlo en Properties (seguro)
  if (tokenMP) {
    PropertiesService.getScriptProperties().setProperty('MP_TOKEN_' + prefijo, tokenMP);
  }

  // PIN aleatorio de 6 dígitos — se registra con setPIN() (sin tocarla) y se devuelve UNA vez
  var pinGenerado = generarPinAleatorio();
  setPIN(prefijo, pinGenerado);

  return { success: true, mensaje: '✅ Vendedor ' + nombre + ' (' + prefijo + ') creado', prefijo: prefijo, pin: pinGenerado };
}

function getProductos(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, null);
  if (!auth.ok) return { error: auth.error };
  var inv   = getHojaInv(prefijo);
  var datos = inv.getDataRange().getValues();
  var productos = [];
  for (var i = 1; i < datos.length; i++) {
    var fila   = datos[i];
    var nombre = fila[1] ? String(fila[1]).trim() : '';
    var precio = parseFloat(fila[4]) || 0;
    if (!nombre || precio <= 0) continue;
    productos.push({
      id:       i + 1,
      codigo:   fila[0] ? String(fila[0]).trim() : '',
      name:     nombre.toUpperCase(),
      price:    precio,
      costo:    parseFloat(fila[3]) || 0,
      stock:    parseInt(fila[2])   || 0,
      proveedor:fila[5] ? String(fila[5]).trim() : '',
      category: fila[6] ? String(fila[6]).trim().toUpperCase() : 'GENERAL'
    });
  }
  return { productos: productos };
}

function registrarVenta(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, null);
  if (!auth.ok) return { error: auth.error };

  var inv      = getHojaInv(prefijo);
  var ventas   = getHojaVentas(prefijo);
  var items    = data.items || [];
  var metodo   = (data.metodoPago || 'EFECTIVO').toUpperCase();
  var ahora    = new Date();
  var errores  = [];
  var procesados = [];
  var bloqueados = [];
  var datosInv = inv.getDataRange().getValues();

  for (var k = 0; k < items.length; k++) {
    var item     = items[k];
    var filaIdx  = parseInt(item.id);
    if (!filaIdx || filaIdx < 2) continue;
    var stockActual = parseInt(datosInv[filaIdx-1][2]) || 0;
    var qty         = parseInt(item.qty) || 1;
    var precio      = (item.precioVenta !== undefined && item.precioVenta !== null && item.precioVenta !== '')
      ? parseFloat(item.precioVenta)
      : parseFloat(datosInv[filaIdx-1][4]) || 0;
    var nombre = String(datosInv[filaIdx-1][1]).trim().toUpperCase();

    // BLOQUEO DURO: sin stock no se registra ni se descuenta
    if (stockActual <= 0) {
      bloqueados.push(nombre);
      errores.push(nombre + ': sin stock (venta NO registrada)');
      continue;
    }

    // Stock insuficiente: registra pero avisa
    if (stockActual < qty) {
      errores.push(nombre + ': stock insuficiente (disponible: ' + stockActual + ')');
      qty = stockActual; // vende lo que hay
    }

    inv.getRange(filaIdx,3).setValue(stockActual - qty);
    var uf = ventas.getLastRow() + 1;
    ventas.getRange(uf,1,1,6).setValues([[ahora, nombre, qty, precio, metodo, precio*qty]]);
    ventas.getRange(uf,1).setNumberFormat('dd/mm/yyyy hh:mm');
    ventas.getRange(uf,4).setNumberFormat('"$"#,##0');
    ventas.getRange(uf,6).setNumberFormat('"$"#,##0');
    procesados.push({ name: nombre, qty: qty, precio: precio });
  }

  var success = procesados.length > 0;
  return {
    success: success,
    procesados: procesados,
    errores: errores,
    bloqueados: bloqueados
  };
}

function ingresarMercaderia(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'pack1_ingreso');
  if (!auth.ok) return { error: auth.error };

  var inv      = getHojaInv(prefijo);
  var nombre   = (data.nombre   || '').trim().toUpperCase();
  var cantidad = parseInt(data.cantidad) || 0;
  var costo    = parseFloat(data.costo)  || 0;
  var venta    = parseFloat(data.venta)  || 0;
  var prov     = (data.proveedor || '').trim().toUpperCase();
  var cat      = (data.categoria || 'GENERAL').trim().toUpperCase();

  if (!nombre)       return { error: 'Nombre requerido' };
  if (cantidad <= 0) return { error: 'Cantidad inválida' };

  var datos = inv.getDataRange().getValues();
  var filaExistente = -1;
  for (var i = 1; i < datos.length; i++) {
    if (String(datos[i][1]).trim().toUpperCase() === nombre) { filaExistente = i+1; break; }
  }

  if (filaExistente > 0) {
    var stockActual = parseInt(datos[filaExistente-1][2]) || 0;
    inv.getRange(filaExistente,3).setValue(stockActual + cantidad);
    if (venta > 0) inv.getRange(filaExistente,5).setValue(venta);
    if (costo > 0) inv.getRange(filaExistente,4).setValue(costo);
    if (prov)      inv.getRange(filaExistente,6).setValue(prov);
    _registrarHistorial(prefijo, nombre, cantidad, costo, prov, 'Reposición de stock');
    return { success: true, mensaje: '📦 Stock actualizado: ' + nombre + ' (+' + cantidad + ')', nuevo: false };
  } else {
    var ultimaFila   = inv.getLastRow() + 1;
    var datosSlice   = datos.slice(1);
    var ultimoCodigo = 0;
    for (var j = 0; j < datosSlice.length; j++) {
      var cod = String(datosSlice[j][0]);
      if (cod.startsWith(prefijo)) {
        var num = parseInt(cod.replace(prefijo,'')) || 0;
        if (num > ultimoCodigo) ultimoCodigo = num;
      }
    }
    var nuevoCodigo = prefijo + String(ultimoCodigo+1).padStart(3,'0');
    inv.getRange(ultimaFila,1,1,7).setValues([[nuevoCodigo, nombre, cantidad, costo, venta, prov, cat]]);
    _registrarHistorial(prefijo, nombre, cantidad, costo, prov, 'Alta de producto nuevo');
    return { success: true, mensaje: '✅ Nuevo producto: ' + nombre + ' (' + nuevoCodigo + ')', nuevo: true };
  }
}

function ajustarStock(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'pack2_editor_stock');
  if (!auth.ok) return { error: auth.error };

  var inv        = getHojaInv(prefijo);
  var filaIdx    = parseInt(data.id);
  var nuevoStock = parseInt(data.stock);
  var nuevoPrecio= parseFloat(data.precio);
  var nuevoNombre= (data.nombre || '').trim().toUpperCase();
  var nuevoCodigo= (data.codigo || '').trim().toUpperCase();

  if (!filaIdx || filaIdx < 2) return { error: 'ID inválido' };

  var filaActual   = inv.getRange(filaIdx,1,1,5).getValues()[0];
  var stockAnterior = parseInt(filaActual[2]) || 0;
  var precioAnterior= parseFloat(filaActual[4]) || 0;
  var nombreProducto= String(filaActual[1] || '').trim();

  if (!isNaN(nuevoStock)   && nuevoStock  >= 0) inv.getRange(filaIdx,3).setValue(nuevoStock);
  if (!isNaN(nuevoPrecio)  && nuevoPrecio >  0) inv.getRange(filaIdx,5).setValue(nuevoPrecio);
  if (nuevoNombre) inv.getRange(filaIdx,2).setValue(nuevoNombre);
  if (nuevoCodigo) inv.getRange(filaIdx,1).setValue(nuevoCodigo);

  try {
    var hAjuste = _hojaCliente(prefijo, 'AJUSTE_RAPIDO');
    hAjuste.getRange(hAjuste.getLastRow()+1, 1, 1, 6).setValues([[
      new Date(), nombreProducto, stockAnterior,
      (!isNaN(nuevoStock) && nuevoStock >= 0) ? nuevoStock : stockAnterior,
      precioAnterior,
      (!isNaN(nuevoPrecio) && nuevoPrecio > 0) ? nuevoPrecio : precioAnterior
    ]]);
  } catch(e) { Logger.log('AJUSTE_RAPIDO no disponible para ' + prefijo + ': ' + e.message); }

  return { success: true, mensaje: 'Producto actualizado' };
}

function getEstadisticas(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, null);
  if (!auth.ok) return { error: auth.error };

  var ventas     = getHojaVentas(prefijo);
  var filas      = ventas.getDataRange().getValues();
  var hoy        = new Date();
  var hoyStr     = Utilities.formatDate(hoy, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var mesActual  = hoy.getMonth();
  var anioActual = hoy.getFullYear();
  var resHoy = {}, resMes = {}, resProductos = {}, resMeses = {};
  var ventasHoy = 0, ventasMes = 0;

  for (var i = 1; i < filas.length; i++) {
    var fila  = filas[i];
    var fecha = fila[0];
    if (!fecha || !(fecha instanceof Date)) continue;
    var nombre   = String(fila[1]||'').trim().toUpperCase();
    var qty      = parseFloat(fila[2])||0;
    var total    = parseFloat(fila[5])||0;
    var metodo   = String(fila[4]||'EFECTIVO').trim().toUpperCase();
    var fechaStr = Utilities.formatDate(fecha, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    var mesStr   = Utilities.formatDate(fecha, Session.getScriptTimeZone(), 'yyyy-MM');
    var esMes    = fecha.getMonth()===mesActual && fecha.getFullYear()===anioActual;

    if (fechaStr===hoyStr) { resHoy[metodo]=(resHoy[metodo]||0)+total; ventasHoy+=total; }
    if (esMes)             { resMes[metodo]=(resMes[metodo]||0)+total; ventasMes+=total; }
    resMeses[mesStr]=(resMeses[mesStr]||0)+total;
    if (esMes && nombre) {
      if (!resProductos[nombre]) resProductos[nombre]={qty:0,total:0};
      resProductos[nombre].qty+=qty; resProductos[nombre].total+=total;
    }
  }

  var topProductos = [];
  var entries = Object.keys(resProductos).map(function(k){ return [k, resProductos[k]]; });
  entries.sort(function(a,b){ return b[1].total-a[1].total; });
  for (var t = 0; t < Math.min(10, entries.length); t++) {
    topProductos.push({ nombre:entries[t][0], qty:entries[t][1].qty, total:entries[t][1].total });
  }

  var histMeses = [];
  var mEntries = Object.keys(resMeses).sort();
  for (var m = 0; m < mEntries.length; m++) {
    histMeses.push({ mes:mEntries[m], total:resMeses[mEntries[m]] });
  }

  return { hoy:{metodos:resHoy,total:ventasHoy}, mes:{metodos:resMes,total:ventasMes}, topProductos:topProductos, histMeses:histMeses };
}

function getVentasDiarias(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, null);
  if (!auth.ok) return { error: auth.error };

  var ventas = getHojaVentas(prefijo);
  var anio   = parseInt(data.anio) || new Date().getFullYear();
  var mes    = parseInt(data.mes);
  var filas  = ventas.getDataRange().getValues();
  var dias   = {};
  var metodosArr = [];

  for (var i = 1; i < filas.length; i++) {
    var fila  = filas[i];
    var fecha = fila[0];
    if (!fecha || !(fecha instanceof Date)) continue;
    if (fecha.getFullYear() !== anio) continue;
    if (!isNaN(mes) && fecha.getMonth() !== mes) continue;
    var dia    = fecha.getDate();
    var metodo = String(fila[4]||'EFECTIVO').trim().toUpperCase();
    var total  = parseFloat(fila[5])||0;
    if (!dias[dia]) dias[dia]={};
    dias[dia][metodo]=(dias[dia][metodo]||0)+total;
    if (metodosArr.indexOf(metodo)===-1) metodosArr.push(metodo);
  }
  return { dias:dias, metodos:metodosArr.sort(), anio:anio, mes:isNaN(mes)?-1:mes };
}

function getVentas(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'pack2_reportes');
  if (!auth.ok) return { error: auth.error };

  var ventas  = getHojaVentas(prefijo);
  var filas   = ventas.getDataRange().getValues();
  var tz      = Session.getScriptTimeZone();
  var resultado = [];
  for (var i = 1; i < filas.length; i++) {
    var fila  = filas[i];
    var fecha = fila[0];
    if (!fecha || !(fecha instanceof Date)) continue;
    resultado.push({
      fecha:  Utilities.formatDate(fecha, tz, 'yyyy-MM-dd'),
      hora:   Utilities.formatDate(fecha, tz, 'HH:mm'),
      nombre: String(fila[1]||'').trim().toUpperCase(),
      qty:    parseFloat(fila[2])||0,
      precio: parseFloat(fila[3])||0,
      metodo: String(fila[4]||'EFECTIVO').trim().toUpperCase(),
      total:  parseFloat(fila[5])||0
    });
  }
  return { ventas: resultado };
}

// ===============================
// MÓDULO AUTH — VAO SmartPOS
// Gestión segura de acceso admin y PIN de clientes
// Tokens y PINs NUNCA en Sheets — solo en Script Properties
// ===============================

// ── HELPERS ──────────────────────────────────────────────────────

function generarToken(largo) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var token = '';
  for (var i = 0; i < (largo || 32); i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function hashSimple(texto) {
  // Hash básico para no guardar PINs en texto plano en Properties
  // No es criptográfico pero es suficiente para este sistema
  var hash = 0;
  var sal  = 'VAO2026';
  var str  = sal + texto + sal;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'H' + Math.abs(hash).toString(36).toUpperCase();
}

// ── ADMIN — CLAVE MAESTRA ─────────────────────────────────────────

// Configura la clave de administrador — SOLO se ejecuta a mano, UNA vez,
// desde el editor de Apps Script (nunca desde la web, no está ruteada en
// doGet). La clave se pasa como parámetro en el momento de ejecutarla —
// nunca queda escrita en este archivo. Ejemplo, escrito directamente en
// la barra de ejecución del editor, nunca guardado en el código:
//   setAdminClave('tu-clave-real-aca')
function setAdminClave(claveNueva) {
  var clave = (claveNueva || '').trim();

  if (clave.length < 8) {
    Logger.log('ERROR: la clave debe tener al menos 8 caracteres. No se guardó nada.');
    return;
  }

  var props = PropertiesService.getScriptProperties();
  props.setProperty('ADMIN_CLAVE_HASH', hashSimple(clave));

  Logger.log('✅ Clave admin configurada correctamente. Borrá esta ejecución del historial si es necesario.');
}

function adminLogin(data) {
  var clave = (data.clave || '').trim();
  if (!clave) return { error: 'Clave requerida' };

  var props     = PropertiesService.getScriptProperties();
  var claveHash = props.getProperty('ADMIN_CLAVE_HASH');

  if (!claveHash) return { error: 'Sistema no configurado — ejecutar setAdminClave() primero' };
  if (hashSimple(clave) !== claveHash) return { error: 'Clave incorrecta' };

  // Generar token de sesión admin (duración 8 horas)
  var token    = 'ADMIN_' + generarToken(24);
  var expira   = new Date().getTime() + (8 * 60 * 60 * 1000);
  props.setProperty('SESSION_ADMIN', JSON.stringify({ token: token, expira: expira }));

  Logger.log('✅ Login admin exitoso');
  return { success: true, token: token, expira: expira };
}

function validarSesionAdmin(token) {
  if (!token || !token.startsWith('ADMIN_')) return false;
  var props    = PropertiesService.getScriptProperties();
  var sesionStr= props.getProperty('SESSION_ADMIN');
  if (!sesionStr) return false;
  try {
    var sesion = JSON.parse(sesionStr);
    if (sesion.token !== token) return false;
    if (new Date().getTime() > sesion.expira) {
      props.deleteProperty('SESSION_ADMIN');
      return false;
    }
    return true;
  } catch(e) { return false; }
}

// ── PIN DE CLIENTES ───────────────────────────────────────────────

// Ejecutar desde el editor para cargar el PIN de un cliente:
// setPIN('MC', '1234')
function setPIN(prefijo, pin) {
  prefijo = (prefijo || '').trim().toUpperCase();
  pin     = (pin || '').trim();
  if (!prefijo) { Logger.log('ERROR: Prefijo requerido'); return; }
  if (!pin || pin.length < 4) { Logger.log('ERROR: PIN debe tener al menos 4 caracteres'); return; }

  var props = PropertiesService.getScriptProperties();
  props.setProperty('PIN_' + prefijo, hashSimple(pin));

  // Actualizar estado en hoja CLIENTES_VAO si existe
  actualizarEstadoCliente(prefijo, 'PIN', 'CONFIGURADO ✅');

  Logger.log('✅ PIN configurado para ' + prefijo);
}

function eliminarPIN(prefijo) {
  prefijo = (prefijo || '').trim().toUpperCase();
  PropertiesService.getScriptProperties().deleteProperty('PIN_' + prefijo);
  actualizarEstadoCliente(prefijo, 'PIN', 'PENDIENTE ⚠️');
  Logger.log('🗑️ PIN eliminado para ' + prefijo);
}


function clienteLogin(data) {
  var prefijo = (data.prefijo || '').trim().toUpperCase();
  var pin     = (data.pin     || '').trim();

  if (!prefijo) return { error: 'Prefijo requerido' };
  if (!pin)     return { error: 'PIN requerido' };

  // Verificar que el cliente existe y está activo
  var infoCliente = obtenerInfoCliente(prefijo);
  if (!infoCliente)            return { error: 'Cliente no encontrado' };
  if (!infoCliente.activo)     return { error: 'Cliente inactivo — contactar a VAO Sistemas' };

  // Validar PIN
  var props   = PropertiesService.getScriptProperties();
  var pinHash = props.getProperty('PIN_' + prefijo);
  if (!pinHash) return { error: 'Acceso no configurado — contactar a VAO Sistemas' };
  if (hashSimple(pin) !== pinHash) return { error: 'PIN incorrecto' };

  // Generar token de sesión cliente (duración 7 días)
  var token  = 'CLI_' + prefijo + '_' + generarToken(20);
  var expira = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
  props.setProperty('SESSION_' + prefijo, JSON.stringify({ token: token, expira: expira }));

  Logger.log('✅ Login exitoso: ' + prefijo);
  return {
    success: true,
    token:   token,
    expira:  expira,
    prefijo: prefijo,
    nombre:  infoCliente.nombre
  };
}

function validarSesionCliente(prefijo, token) {
  if (!prefijo || !token) return false;
  if (!token.startsWith('CLI_' + prefijo + '_')) return false;

  var props    = PropertiesService.getScriptProperties();
  var sesionStr= props.getProperty('SESSION_' + prefijo);
  if (!sesionStr) return false;

  try {
    var sesion = JSON.parse(sesionStr);
    if (sesion.token !== token) return false;
    if (new Date().getTime() > sesion.expira) {
      props.deleteProperty('SESSION_' + prefijo);
      return false;
    }
    return true;
  } catch(e) { return false; }
}

function cerrarSesionCliente(data, prefijo) {
  prefijo = (prefijo || '').trim().toUpperCase();
  var token = (data && data.token) || '';
  // No exigimos que la sesión esté vigente (cerrar sesión debe funcionar
  // incluso con un token vencido), pero sí que el token sea del mismo
  // cliente — si no, no se toca nada. Evita que cualquiera fuerce el
  // logout de otro cliente sin conocer su token.
  if (!token || !token.startsWith('CLI_' + prefijo + '_')) {
    return { error: 'Token no corresponde a este cliente' };
  }
  PropertiesService.getScriptProperties().deleteProperty('SESSION_' + prefijo);
  return { success: true };
}

// ── HELPERS INTERNOS ──────────────────────────────────────────────

function obtenerInfoCliente(prefijo) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Fuente real: CLIENTES_VAO (identidad + Estado comercial)
  var hCli = ss.getSheetByName('CLIENTES_VAO');
  if (hCli) {
    var datosCli = hCli.getDataRange().getValues();
    for (var i = 1; i < datosCli.length; i++) {
      var f = datosCli[i];
      if (String(f[0]).trim().toUpperCase() === prefijo) {
        return {
          prefijo: prefijo,
          nombre:  String(f[1] || '').trim(),
          activo:  String(f[6] || '').trim().toUpperCase() === 'ACTIVO'
        };
      }
    }
  }

  // Respaldo de transición: cliente todavía sin fila en CLIENTES_VAO (viejo, sin migrar)
  var hoja = ss.getSheetByName('VENDEDORES');
  if (!hoja) return null;
  var datos = hoja.getDataRange().getValues();
  for (var j = 1; j < datos.length; j++) {
    var fv = datos[j];
    if (String(fv[0]).trim().toUpperCase() === prefijo) {
      return {
        prefijo: prefijo,
        nombre:  String(fv[1] || '').trim(),
        activo:  String(fv[6] || '').trim().toLowerCase() === 'si'
      };
    }
  }
  return null;
}

function actualizarEstadoCliente(prefijo, campo, valor) {
  // Actualiza columna L (Token MP) o M (PIN) en CLIENTES_VAO si existe
  try {
    var ss   = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = ss.getSheetByName('CLIENTES_VAO');
    if (!hoja) return;
    var datos = hoja.getDataRange().getValues();
    var colMap = { 'TOKEN': 12, 'PIN': 13 }; // L=12, M=13
    var col = colMap[campo.toUpperCase()];
    if (!col) return;
    for (var i = 1; i < datos.length; i++) {
      if (String(datos[i][0]).trim().toUpperCase() === prefijo) {
        hoja.getRange(i+1, col).setValue(valor);
        return;
      }
    }
  } catch(e) { Logger.log('actualizarEstadoCliente: ' + e.message); }
}

// ── RESUMEN ADMIN ─────────────────────────────────────────────────

function getResumenAdmin(token) {
  if (!validarSesionAdmin(token)) return { error: 'Sesión admin inválida o expirada' };

  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var hCli = ss.getSheetByName('CLIENTES_VAO');
  if (!hCli) return { error: 'No existe hoja CLIENTES_VAO' };

  var datos    = hCli.getDataRange().getValues();
  var clientes = [];
  var props    = PropertiesService.getScriptProperties();

  for (var i = 1; i < datos.length; i++) {
    var f       = datos[i];
    var prefijo = String(f[0] || '').trim().toUpperCase();
    // Saltea filas vacías, de leyenda o de ayuda (prefijo real = 2-3 letras)
    if (!/^[A-Z]{2,3}$/.test(prefijo)) continue;

    var estado = String(f[6] || '').trim().toUpperCase();

    var tienePin    = !!props.getProperty('PIN_' + prefijo);
    var tieneToken  = !!props.getProperty('MP_TOKEN_' + prefijo);
    var tieneSesion = !!props.getProperty('SESSION_' + prefijo);

    // Contar ventas del mes
    var totalMes = 0;
    try {
      var hVentas = ss.getSheetByName('VENTAS_' + prefijo);
      if (hVentas) {
        var ventas  = hVentas.getDataRange().getValues();
        var hoy     = new Date();
        for (var v = 1; v < ventas.length; v++) {
          var fecha = ventas[v][0];
          if (fecha instanceof Date &&
              fecha.getMonth() === hoy.getMonth() &&
              fecha.getFullYear() === hoy.getFullYear()) {
            totalMes += parseFloat(ventas[v][5]) || 0;
          }
        }
      }
    } catch(e) {}

    clientes.push({
      prefijo:     prefijo,
      nombre:      String(f[1] || '').trim(),
      activo:      estado === 'ACTIVO',
      estado:      estado,
      plan:        String(f[5] || '').trim(),
      fechaVence:  f[8] ? Utilities.formatDate(new Date(f[8]), Session.getScriptTimeZone(), 'dd/MM/yyyy') : '',
      tienePin:    tienePin,
      tieneToken:  tieneToken,
      sesionActiva:tieneSesion,
      ventasMes:   totalMes
    });
  }

  return { success: true, clientes: clientes };
}

// ── ACTIVAR / SUSPENDER CLIENTE ────────────────────────────────────
// Escribe el Estado real del cliente en CLIENTES_VAO (columna G).
// VENDEDORES ya no es la fuente de este dato — ver auditoría CLIENTES_VAO vs VENDEDORES.

function activarCliente(data) {
  return _setEstadoCliente(data, true);
}

function suspenderCliente(data) {
  return _setEstadoCliente(data, false);
}

function _setEstadoCliente(data, activo) {
  if (!validarSesionAdmin(data.token || '')) return { error: 'Sesión admin inválida o expirada' };

  var prefijo = (data.prefijo || '').trim().toUpperCase();
  if (!prefijo) return { error: 'Prefijo requerido' };

  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName('CLIENTES_VAO');
  if (!hoja) return { error: 'No existe hoja CLIENTES_VAO' };

  var datos = hoja.getDataRange().getValues();
  for (var i = 1; i < datos.length; i++) {
    if (String(datos[i][0]).trim().toUpperCase() === prefijo) {
      var estadoActual = String(datos[i][6] || '').trim().toUpperCase();
      if (estadoActual === 'BAJA') return { error: 'Cliente dado de BAJA — activar/suspender no aplica, es una decisión aparte' };
      hoja.getRange(i + 1, 7).setValue(activo ? 'ACTIVO' : 'SUSPENDIDO'); // columna G = Estado
      Logger.log((activo ? '✅ Activado: ' : '🔒 Suspendido: ') + prefijo);
      return { success: true, prefijo: prefijo, estado: activo ? 'ACTIVO' : 'SUSPENDIDO' };
    }
  }
  return { error: 'Cliente no encontrado en CLIENTES_VAO' };
}

// ===============================
// MÓDULO CONFIG — VAO SmartPOS
// Lee la configuración del cliente (hoja CONFIG_<prefijo>)
// El PIN es sensible y NUNCA se devuelve al frontend
// Cadena de validación (Reglas 24-29): prefijo → activo → token → token válido
// ===============================

function getConfig(prefijo, token) {
  var infoCliente = obtenerInfoCliente(prefijo);
  if (!infoCliente)        return { error: 'Cliente no encontrado' };
  if (!infoCliente.activo) return { error: 'Cliente inactivo — contactar a VAO Sistemas' };
  if (!validarSesionCliente(prefijo, token)) return { error: 'Sesión inválida o expirada' };

  var resultado = leerConfig(prefijo);
  if (resultado.config) delete resultado.config.PIN; // el PIN nunca sale del servidor
  return resultado;
}

function leerConfig(prefijo) {
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName('CONFIG_' + prefijo);
  if (!hoja) throw new Error('No existe hoja CONFIG_' + prefijo);

  var datos  = hoja.getDataRange().getValues();
  var config = {};

  for (var i = 1; i < datos.length; i++) {
    var campo = datos[i][0] ? String(datos[i][0]).trim() : '';
    if (!campo) continue; // fila separadora de sección ("--- IDENTIDAD ---", etc.), se ignora

    var valor = datos[i][1];
    if (valor === 'TRUE')  valor = true;
    if (valor === 'FALSE') valor = false;

    config[campo] = valor;
  }

  // Módulos base: nunca se apagan, aunque la planilla diga FALSE
  config.ventas    = true;
  config.cobrar    = true;
  config.ticket_wa = true;
  config.buscador  = true;

  return { config: config };
}

// ===============================================================
// CREACIÓN CENTRALIZADA DE HOJAS OPERATIVAS POR CLIENTE
// Todo lo que necesita un cliente nuevo, en un solo lugar.
// Idempotente: si una hoja ya existe, no la toca.
// ===============================================================

function _crearHojaSiFalta(ss, nombreHoja, headers) {
  if (ss.getSheetByName(nombreHoja)) return false;
  var h = ss.insertSheet(nombreHoja);
  h.getRange(1,1,1,headers.length).setValues([headers]);
  h.getRange(1,1,1,headers.length).setFontWeight('bold');
  h.setFrozenRows(1);
  return true;
}

function _crearHojasOperativasCompletas(ss, prefijo, nombre, telefono, correo, aliasPago) {
  // INVENTARIO_XX — las columnas H/I "Reservada" del diseño original quedan
  // usadas para Multicompra, que es justo lo que estaban reservando. K-O
  // son las columnas del motor de Ofertas.
  _crearHojaSiFalta(ss, 'INVENTARIO_' + prefijo,
    ['Código','Producto','Stock','P.Costo','P.Venta','Proveedor','Categoría',
     'MULTICOMPRA_ACTIVA','MULTICOMPRA_CANTIDAD','MULTICOMPRA_PRECIO',
     'RELAMPAGO','DESTACADA','ESPECIAL_PRECIO','PERSONALIZADA_TIPO','OFERTA_SIMPLE_PRECIO']);

  _crearHojaPlanesSiFalta(ss);

  _crearHojaSiFalta(ss, 'VENTAS_' + prefijo,
    ['Fecha','Producto','Cantidad','P.Venta','Modo de pago','Total']);

  crearHojaConfigDefault(ss, prefijo, nombre, telefono, correo, aliasPago);

  // HISTORIAL_XX — todo lo que ingresa al local (mismo criterio que Copihue:
  // fecha / producto / cantidad ingresada, más costo y proveedor)
  _crearHojaSiFalta(ss, 'HISTORIAL_' + prefijo,
    ['Fecha','Producto','Cantidad','Costo','Proveedor','Nota']);

  // FIADOS_XX — mismo esquema de columnas que la hoja FIADOS de Copihue
  // (referencia funcional probada), adaptado a multihoja por prefijo
  _crearHojaSiFalta(ss, 'FIADOS_' + prefijo,
    ['ID','Fecha','Ticket/Ref','Cliente','Teléfono','Descripción','Cant. Items',
     'Monto Original','Saldo','Fecha Vencimiento','Estado','Fecha Pago','Método Pago','Observaciones/Abonos']);

  // PRESTAMOS_XX — migra la estructura que en Seba21 vivía en localStorage
  _crearHojaSiFalta(ss, 'PRESTAMOS_' + prefijo,
    ['ID','Fecha','Acreedor','Monto','Motivo','Cuotas','Monto Cuota',
     'Vencimiento','Observaciones','Estado','Pagos (JSON)']);

  // CAJA_XX — una fila por apertura/cierre de caja
  _crearHojaSiFalta(ss, 'CAJA_' + prefijo,
    ['Fecha Apertura','Monto Apertura','Fecha Cierre','Monto Cierre Real',
     'Total Ventas Sistema','Diferencia','Usuario','Estado','Notas']);

  // CAJA_MOVIMIENTOS_XX — ingresos/retiros manuales de caja, fuera de una venta
  _crearHojaSiFalta(ss, 'CAJA_MOVIMIENTOS_' + prefijo,
    ['Fecha','Tipo','Monto','Motivo','Usuario']);

  // SALIDAS_XX — merma y consumo interno (no es venta, pero descuenta stock)
  _crearHojaSiFalta(ss, 'SALIDAS_' + prefijo,
    ['Fecha','Producto','Cantidad','Tipo','Motivo','Usuario']);

  // AJUSTE_RAPIDO_XX — auditoría de cada corrección manual de stock/precio
  _crearHojaSiFalta(ss, 'AJUSTE_RAPIDO_' + prefijo,
    ['Fecha','Producto','Stock Anterior','Stock Nuevo','Precio Anterior','Precio Nuevo']);
}

// Utilidad para correr UNA VEZ a mano desde el editor de Apps Script y
// completar las hojas que le falten a un cliente que ya existía antes de
// este cambio (ej. XX y LP). No se ejecuta sola — no toca nada si ya está todo.
function migrarHojasFaltantes(prefijo) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hVend = ss.getSheetByName('VENDEDORES');
  var datos = hVend.getDataRange().getValues();
  var prefijos = prefijo ? [prefijo.toUpperCase()] : [];
  if (!prefijo) {
    for (var i = 1; i < datos.length; i++) {
      var p = String(datos[i][0] || '').trim().toUpperCase();
      if (p) prefijos.push(p);
    }
  }
  var creadas = [];
  prefijos.forEach(function(p) {
    var info = obtenerInfoCliente(p);
    _crearHojasOperativasCompletas(ss, p, info ? info.nombre : p, '', '', '');
    creadas.push(p);
  });
  Logger.log('Hojas verificadas/creadas para: ' + creadas.join(', '));
  return { success: true, clientes: creadas };
}

// ===============================================================
// PERMISOS — validación en backend, no solo ocultar botones
// ===============================================================

function _autorizarAccionCliente(prefijo, token, moduloConfig) {
  if (!validarSesionCliente(prefijo, token)) return { ok: false, error: 'Sesión inválida o expirada' };
  if (moduloConfig) {
    var cfg = leerConfig(prefijo).config;
    if (!cfg[moduloConfig]) return { ok: false, error: 'Módulo no habilitado para este cliente' };
  }
  return { ok: true };
}

function _hojaCliente(prefijo, nombreBase) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var h = ss.getSheetByName(nombreBase + '_' + prefijo);
  if (!h) throw new Error('No existe hoja ' + nombreBase + '_' + prefijo);
  return h;
}

// ===============================================================
// HISTORIAL — todo lo que ingresa al local
// ===============================================================

function _registrarHistorial(prefijo, producto, cantidad, costo, proveedor, nota) {
  try {
    var h = _hojaCliente(prefijo, 'HISTORIAL');
    h.getRange(h.getLastRow()+1, 1, 1, 6).setValues([[new Date(), producto, cantidad, costo, proveedor, nota || '']]);
  } catch(e) { Logger.log('HISTORIAL no disponible para ' + prefijo + ': ' + e.message); }
}

function getHistorial(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_historial');
  if (!auth.ok) return { error: auth.error };
  var h = _hojaCliente(prefijo, 'HISTORIAL');
  var datos = h.getDataRange().getValues();
  var items = [];
  for (var i = 1; i < datos.length; i++) {
    var f = datos[i];
    if (!f[0]) continue;
    items.push({
      fecha:     f[0] instanceof Date ? Utilities.formatDate(f[0], Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm') : String(f[0]),
      producto:  String(f[1]||''), cantidad: parseFloat(f[2])||0,
      costo:     parseFloat(f[3])||0, proveedor: String(f[4]||''), nota: String(f[5]||'')
    });
  }
  items.reverse(); // más reciente primero
  return { success: true, items: items };
}

// ===============================================================
// FIADOS — mismo esquema de columnas que Copihue (referencia probada),
// adaptado a multihoja por prefijo
// ===============================================================

function crearFiado(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_fiados');
  if (!auth.ok) return { error: auth.error };

  var cliente = (data.cliente || '').trim();
  var telefono = (data.telefono || '').trim();
  var monto = parseFloat(data.monto) || 0;
  if (!cliente) return { error: 'Nombre de cliente requerido' };
  if (monto <= 0) return { error: 'Monto inválido' };

  var h = _hojaCliente(prefijo, 'FIADOS');
  var id = 'F' + prefijo + Date.now();
  var fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');
  var vencimiento = data.vencimiento || '';

  h.getRange(h.getLastRow()+1, 1, 1, 14).setValues([[
    id, fecha, data.ticket || '', cliente, telefono, data.descripcion || '',
    parseInt(data.cantItems) || 0, monto, monto, vencimiento, 'PENDIENTE', '', '', ''
  ]]);

  return { success: true, idFiado: id, mensaje: '✅ Fiado registrado para ' + cliente };
}

function listarFiados(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_fiados');
  if (!auth.ok) return { error: auth.error };

  var h = _hojaCliente(prefijo, 'FIADOS');
  var datos = h.getDataRange().getValues();
  var hoy = new Date(); hoy.setHours(0,0,0,0);
  var fiados = [];

  for (var i = 1; i < datos.length; i++) {
    var f = datos[i];
    if (!f[0]) continue;
    var estado = String(f[10] || '').toUpperCase();
    var vencFecha = f[9] ? new Date(String(f[9])) : null;
    if (vencFecha && !isNaN(vencFecha) && vencFecha < hoy && estado !== 'PAGADO') estado = 'VENCIDO';

    fiados.push({
      fila: i + 1, idFiado: String(f[0]||''), fecha: String(f[1]||''),
      ticket: String(f[2]||''), cliente: String(f[3]||''), telefono: String(f[4]||''),
      descripcion: String(f[5]||''), cantItems: f[6]||0,
      totalOriginal: parseFloat(f[7])||0, saldo: parseFloat(f[8])||0,
      fechaVencimiento: String(f[9]||''), estado: estado,
      fechaPago: String(f[11]||''), metodoPago: String(f[12]||''), observaciones: String(f[13]||'')
    });
  }
  fiados.sort(function(a,b){
    if (a.estado === 'VENCIDO' && b.estado !== 'VENCIDO') return -1;
    if (b.estado === 'VENCIDO' && a.estado !== 'VENCIDO') return 1;
    return (a.fechaVencimiento||'').localeCompare(b.fechaVencimiento||'');
  });
  return { success: true, fiados: fiados };
}

function abonarFiado(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_fiados');
  if (!auth.ok) return { error: auth.error };

  var idFiado = String(data.idFiado || '').trim();
  var abono = parseFloat(data.abono) || 0;
  if (!idFiado) return { error: 'Falta ID del fiado' };
  if (abono <= 0) return { error: 'Monto de abono inválido' };

  var h = _hojaCliente(prefijo, 'FIADOS');
  var rows = h.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) !== idFiado) continue;
    var saldoActual = parseFloat(rows[i][8]) || 0;
    var nuevoSaldo = Math.max(0, saldoActual - abono);
    h.getRange(i+1, 9).setValue(nuevoSaldo);

    var fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');
    var obsPrevia = String(rows[i][13] || '');
    var nuevaObs = (obsPrevia ? obsPrevia + ' | ' : '') + 'Abono $' + abono + ' (' + (data.metodoPago||'EFECTIVO') + ') ' + fecha;
    h.getRange(i+1, 14).setValue(nuevaObs);

    if (nuevoSaldo === 0) {
      h.getRange(i+1, 11).setValue('PAGADO');
      h.getRange(i+1, 12).setValue(fecha);
      h.getRange(i+1, 13).setValue(data.metodoPago || 'EFECTIVO');
    }
    return { success: true, nuevoSaldo: nuevoSaldo, pagado: nuevoSaldo === 0 };
  }
  return { error: 'Fiado no encontrado' };
}

function consultarFiadoPorTelefono(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_fiados');
  if (!auth.ok) return { error: auth.error };

  var telefono = String(data.telefono || '').replace(/\D/g,'');
  if (!telefono) return { success: true, deudaTotal: 0, fiados: [] };

  var h = _hojaCliente(prefijo, 'FIADOS');
  var datos = h.getDataRange().getValues();
  var pendientes = [];
  var deudaTotal = 0;
  for (var i = 1; i < datos.length; i++) {
    var f = datos[i];
    var telFila = String(f[4] || '').replace(/\D/g,'');
    var estado = String(f[10] || '').toUpperCase();
    if (telFila === telefono && estado !== 'PAGADO') {
      var saldo = parseFloat(f[8]) || 0;
      deudaTotal += saldo;
      pendientes.push({ idFiado: String(f[0]), fecha: String(f[1]), saldo: saldo, estado: estado });
    }
  }
  return { success: true, deudaTotal: deudaTotal, fiados: pendientes };
}

// ===============================================================
// PRÉSTAMOS — migrado de localStorage (Seba21) a PRESTAMOS_XX
// ===============================================================

function crearPrestamo(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_prestamos');
  if (!auth.ok) return { error: auth.error };

  var acreedor = (data.acreedor || '').trim();
  var monto = parseFloat(data.monto) || 0;
  if (!acreedor) return { error: 'Acreedor requerido' };
  if (monto <= 0) return { error: 'Monto inválido' };

  var h = _hojaCliente(prefijo, 'PRESTAMOS');
  var id = 'P' + prefijo + Date.now();
  var fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');
  var cuotas = parseInt(data.cuotas) || 1;
  var montoCuota = data.montoCuota ? parseFloat(data.montoCuota) : Math.round(monto / cuotas);

  h.getRange(h.getLastRow()+1, 1, 1, 11).setValues([[
    id, fecha, acreedor, monto, data.motivo || '', cuotas, montoCuota,
    data.vencimiento || '', data.observaciones || '', 'ACTIVO', '[]'
  ]]);

  return { success: true, idPrestamo: id, mensaje: '✅ Préstamo registrado: ' + acreedor };
}

function listarPrestamos(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_prestamos');
  if (!auth.ok) return { error: auth.error };

  var h = _hojaCliente(prefijo, 'PRESTAMOS');
  var datos = h.getDataRange().getValues();
  var prestamos = [];
  for (var i = 1; i < datos.length; i++) {
    var f = datos[i];
    if (!f[0]) continue;
    var pagos = [];
    try { pagos = JSON.parse(f[10] || '[]'); } catch(e) {}
    var totalPagado = pagos.reduce(function(s,p){ return s + (parseFloat(p.monto)||0); }, 0);
    prestamos.push({
      id: String(f[0]), fecha: String(f[1]), acreedor: String(f[2]), monto: parseFloat(f[3])||0,
      motivo: String(f[4]||''), cuotas: parseInt(f[5])||0, montoCuota: parseFloat(f[6])||0,
      vencimiento: String(f[7]||''), observaciones: String(f[8]||''), estado: String(f[9]||''),
      pagos: pagos, totalPagado: totalPagado, saldo: Math.max(0, (parseFloat(f[3])||0) - totalPagado)
    });
  }
  return { success: true, prestamos: prestamos };
}

function registrarPagoPrestamo(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_prestamos');
  if (!auth.ok) return { error: auth.error };

  var id = String(data.idPrestamo || '').trim();
  var monto = parseFloat(data.monto) || 0;
  if (!id) return { error: 'Falta ID del préstamo' };
  if (monto <= 0) return { error: 'Monto de pago inválido' };

  var h = _hojaCliente(prefijo, 'PRESTAMOS');
  var rows = h.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) !== id) continue;
    var pagos = [];
    try { pagos = JSON.parse(rows[i][10] || '[]'); } catch(e) {}
    pagos.push({ fecha: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy'), monto: monto });
    h.getRange(i+1, 11).setValue(JSON.stringify(pagos));

    var montoTotal = parseFloat(rows[i][3]) || 0;
    var totalPagado = pagos.reduce(function(s,p){ return s + (parseFloat(p.monto)||0); }, 0);
    if (totalPagado >= montoTotal) h.getRange(i+1, 10).setValue('PAGADO');

    return { success: true, totalPagado: totalPagado, saldo: Math.max(0, montoTotal - totalPagado) };
  }
  return { error: 'Préstamo no encontrado' };
}

// ===============================================================
// CAJA + CAJA_MOVIMIENTOS
// ===============================================================

function abrirCaja(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_caja');
  if (!auth.ok) return { error: auth.error };

  var h = _hojaCliente(prefijo, 'CAJA');
  var datos = h.getDataRange().getValues();
  for (var i = 1; i < datos.length; i++) {
    if (String(datos[i][7]) === 'ABIERTA') return { error: 'Ya hay una caja abierta desde ' + datos[i][0] };
  }
  var montoApertura = parseFloat(data.monto) || 0;
  h.getRange(h.getLastRow()+1, 1, 1, 9).setValues([[
    new Date(), montoApertura, '', '', '', '', data.usuario || '', 'ABIERTA', ''
  ]]);
  return { success: true, mensaje: '✅ Caja abierta con $' + montoApertura };
}

function cerrarCaja(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_caja');
  if (!auth.ok) return { error: auth.error };

  var h = _hojaCliente(prefijo, 'CAJA');
  var datos = h.getDataRange().getValues();
  var filaAbierta = -1;
  for (var i = 1; i < datos.length; i++) {
    if (String(datos[i][7]) === 'ABIERTA') { filaAbierta = i+1; break; }
  }
  if (filaAbierta < 0) return { error: 'No hay una caja abierta' };

  var fila = datos[filaAbierta-1];
  var fechaApertura = fila[0];
  var montoApertura = parseFloat(fila[1]) || 0;

  // Total de ventas registradas en el sistema desde que se abrió esta caja
  var totalVentasSistema = 0;
  try {
    var ventas = getHojaVentas(prefijo).getDataRange().getValues();
    for (var v = 1; v < ventas.length; v++) {
      var f = ventas[v][0] instanceof Date ? ventas[v][0] : null;
      if (f && f >= fechaApertura) totalVentasSistema += parseFloat(ventas[v][5]) || 0;
    }
  } catch(e) {}

  var montoCierreReal = parseFloat(data.montoReal) || 0;
  var esperado = montoApertura + totalVentasSistema;
  var diferencia = montoCierreReal - esperado;

  h.getRange(filaAbierta, 3).setValue(new Date());
  h.getRange(filaAbierta, 4).setValue(montoCierreReal);
  h.getRange(filaAbierta, 5).setValue(totalVentasSistema);
  h.getRange(filaAbierta, 6).setValue(diferencia);
  h.getRange(filaAbierta, 8).setValue('CERRADA');
  h.getRange(filaAbierta, 9).setValue(data.notas || '');

  return { success: true, esperado: esperado, real: montoCierreReal, diferencia: diferencia };
}

function getCajaActual(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_caja');
  if (!auth.ok) return { error: auth.error };

  var h = _hojaCliente(prefijo, 'CAJA');
  var datos = h.getDataRange().getValues();
  for (var i = 1; i < datos.length; i++) {
    if (String(datos[i][7]) === 'ABIERTA') {
      return { success: true, abierta: true, fechaApertura: datos[i][0], montoApertura: parseFloat(datos[i][1])||0 };
    }
  }
  return { success: true, abierta: false };
}

function registrarMovimientoCaja(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_caja');
  if (!auth.ok) return { error: auth.error };

  var tipo = (data.tipo || '').toUpperCase();
  if (tipo !== 'INGRESO' && tipo !== 'RETIRO') return { error: 'Tipo inválido (INGRESO o RETIRO)' };
  var monto = parseFloat(data.monto) || 0;
  if (monto <= 0) return { error: 'Monto inválido' };

  var h = _hojaCliente(prefijo, 'CAJA_MOVIMIENTOS');
  h.getRange(h.getLastRow()+1, 1, 1, 5).setValues([[new Date(), tipo, monto, data.motivo || '', data.usuario || '']]);
  return { success: true, mensaje: '✅ Movimiento registrado' };
}

function getMovimientosCaja(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_caja');
  if (!auth.ok) return { error: auth.error };

  var h = _hojaCliente(prefijo, 'CAJA_MOVIMIENTOS');
  var datos = h.getDataRange().getValues();
  var items = [];
  for (var i = 1; i < datos.length; i++) {
    var f = datos[i];
    if (!f[0]) continue;
    items.push({
      fecha: f[0] instanceof Date ? Utilities.formatDate(f[0], Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm') : String(f[0]),
      tipo: String(f[1]||''), monto: parseFloat(f[2])||0, motivo: String(f[3]||''), usuario: String(f[4]||'')
    });
  }
  items.reverse();
  return { success: true, items: items };
}

// ===============================================================
// SALIDAS — merma y consumo interno (descuenta stock, no es venta)
// ===============================================================

function registrarSalida(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_salidas');
  if (!auth.ok) return { error: auth.error };

  var tipo = (data.tipo || 'MERMA').toUpperCase();
  var cantidad = parseInt(data.cantidad) || 0;
  var filaIdx = parseInt(data.id);
  if (!filaIdx || filaIdx < 2) return { error: 'Producto inválido' };
  if (cantidad <= 0) return { error: 'Cantidad inválida' };

  var inv = getHojaInv(prefijo);
  var fila = inv.getRange(filaIdx,1,1,3).getValues()[0];
  var nombre = String(fila[1]||'').trim();
  var stockActual = parseInt(fila[2]) || 0;
  var nuevoStock = Math.max(0, stockActual - cantidad);
  inv.getRange(filaIdx,3).setValue(nuevoStock);

  var h = _hojaCliente(prefijo, 'SALIDAS');
  h.getRange(h.getLastRow()+1, 1, 1, 6).setValues([[new Date(), nombre, cantidad, tipo, data.motivo || '', data.usuario || '']]);

  return { success: true, mensaje: '✅ Salida registrada: ' + nombre + ' (-' + cantidad + ')', nuevoStock: nuevoStock };
}

function getSalidas(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_salidas');
  if (!auth.ok) return { error: auth.error };

  var h = _hojaCliente(prefijo, 'SALIDAS');
  var datos = h.getDataRange().getValues();
  var items = [];
  for (var i = 1; i < datos.length; i++) {
    var f = datos[i];
    if (!f[0]) continue;
    items.push({
      fecha: f[0] instanceof Date ? Utilities.formatDate(f[0], Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm') : String(f[0]),
      producto: String(f[1]||''), cantidad: parseFloat(f[2])||0, tipo: String(f[3]||''),
      motivo: String(f[4]||''), usuario: String(f[5]||'')
    });
  }
  items.reverse();
  return { success: true, items: items };
}

// ===============================================================
// MULTICOMPRA — columnas H/I/J de INVENTARIO_XX, referencia: Copihue
// (getMulticompraTodas). El resto del motor de Ofertas (Jueves
// Cervecero, Relámpago, etc.) queda REQUIERE DECISIÓN VAO — no está
// definido para VAO todavía y no se inventa acá.
// ===============================================================

function configurarMulticompra(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_config_ofertas');
  if (!auth.ok) return { error: auth.error };

  var filaIdx = parseInt(data.id);
  if (!filaIdx || filaIdx < 2) return { error: 'Producto inválido' };
  var inv = getHojaInv(prefijo);

  var activa = data.activa ? 'SI' : 'NO';
  var cantidad = parseInt(data.cantidad) || 0;
  var precioPack = parseFloat(data.precioPack) || 0;

  inv.getRange(filaIdx, 8).setValue(activa);
  inv.getRange(filaIdx, 9).setValue(cantidad);
  inv.getRange(filaIdx, 10).setValue(precioPack);

  return { success: true, mensaje: 'Multicompra actualizada' };
}

function getMulticompraActivas(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, null); // visible para cualquier sesión válida del cliente
  if (!auth.ok) return { error: auth.error };

  var inv = getHojaInv(prefijo);
  var datos = inv.getDataRange().getValues();
  var items = [];
  for (var i = 1; i < datos.length; i++) {
    var f = datos[i];
    var nombre = String(f[1]||'').trim();
    if (!nombre) continue;
    var activa = String(f[7]||'').trim().toUpperCase();
    if (activa !== 'SI') continue;
    var stock = parseFloat(f[2]) || 0;
    if (stock <= 0) continue;
    var cantidad = parseInt(f[8]) || 0;
    var precioPack = parseFloat(f[9]) || 0;
    if (cantidad <= 0 || precioPack <= 0) continue;

    items.push({
      id: i + 1, nombre: nombre, stock: stock,
      precioActual: parseFloat(f[4]) || 0,
      cantidad: cantidad, precioPack: precioPack
    });
  }
  return { success: true, items: items };
}

// ===============================================================
// OFERTAS — motor completo, adaptado de Almacén Copihue (calcularOfertas)
// a la arquitectura multihoja. Los tipos ligados a una decisión propia
// de un negocio (ej. "Jueves Cervecero") se generalizaron a
// configuración editable por cliente ("Día Temático"), no se eliminaron.
//
// Columnas nuevas en INVENTARIO_XX (K a O):
//  K(11) RELAMPAGO (1/0)      L(12) DESTACADA (1/0)
//  M(13) ESPECIAL_PRECIO      N(14) PERSONALIZADA_TIPO (0-6 → 10-60% off)
//  O(15) OFERTA_SIMPLE_PRECIO
// ===============================================================

var PCT_OFERTA_PERSONALIZADA_VAO = { 1:10, 2:20, 3:30, 4:40, 5:50, 6:60 };

function _diaTematicoActivoHoy_(cfg) {
  if (!cfg.ofertas_dia_tematico_activo) return false;
  var diaHoy = new Date().getDay(); // 0=domingo ... 6=sábado
  return parseInt(cfg.ofertas_dia_tematico_dia) === diaHoy;
}

// Mismo algoritmo de rotación por día del año que usa Copihue — reparte
// un pool grande de candidatos en tandas, cambiando qué tanda se muestra
// cada día, para no repetir siempre los mismos productos.
function _rotarPorDia_(candidatos, limite) {
  if (candidatos.length <= limite) return candidatos;
  var hoy = new Date();
  var inicioAnio = new Date(hoy.getFullYear(), 0, 0);
  var dayOfYear = Math.floor((hoy - inicioAnio) / 86400000);
  var totalSets = Math.ceil(candidatos.length / limite);
  var setNumber = dayOfYear % totalSets;
  var startIdx = (setNumber * limite) % candidatos.length;
  var out = [];
  for (var i = 0; i < limite; i++) out.push(candidatos[(startIdx + i) % candidatos.length]);
  return out;
}

function _dentroDeHorarioOferta_(horaInicio, horaCierre) {
  var ini = parseFloat(horaInicio), cie = parseFloat(horaCierre);
  if (isNaN(ini) || isNaN(cie)) return true; // sin horario configurado = todo el día
  var ahora = new Date();
  var horaActual = ahora.getHours() + ahora.getMinutes() / 60;
  if (cie > ini) return horaActual >= ini && horaActual < cie;
  return horaActual >= ini || horaActual < cie; // horario que cruza medianoche
}

function calcularOfertas(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_config_ofertas');
  if (!auth.ok) return { error: auth.error };

  var cfg = leerConfig(prefijo).config;
  var inv = getHojaInv(prefijo);
  var datos = inv.getDataRange().getValues();

  var diaTematicoActivo = _diaTematicoActivoHoy_(cfg);
  var categoriaTematica = String(cfg.ofertas_dia_tematico_categoria || '').trim().toUpperCase();

  function _esCategoriaTematica(fila) {
    if (!diaTematicoActivo || !categoriaTematica) return false;
    var nom = String(fila[1]||'').toUpperCase();
    var cat = String(fila[6]||'').toUpperCase();
    return cat.indexOf(categoriaTematica) !== -1 || nom.indexOf(categoriaTematica) !== -1;
  }

  var relampagoCand = [], destacadasCand = [], especialesCand = [];
  var personalizada = [], simple = [], ultimasUnidades = [], diaTematicoProductos = [];
  var stockMaxUltimas = parseInt(cfg.ofertas_ultimas_stock_max) || 3;

  for (var i = 1; i < datos.length; i++) {
    var f = datos[i];
    var nombre = String(f[1]||'').trim();
    if (!nombre) continue;
    var stock = parseInt(f[2]) || 0;
    if (stock <= 0) continue;
    var precio = parseFloat(f[4]) || 0;
    var id = i + 1;

    if (_esCategoriaTematica(f)) {
      diaTematicoProductos.push({ id:id, nombre:nombre, precio:precio, stock:stock });
      continue; // en su día temático no compite en los otros pools rotativos
    }

    if (parseInt(f[10]) === 1) relampagoCand.push({ id:id, nombre:nombre, precio:precio, stock:stock });
    if (parseInt(f[11]) === 1) destacadasCand.push({ id:id, nombre:nombre, precio:precio, stock:stock });

    var precioEspecial = parseFloat(f[12]) || 0;
    if (precioEspecial > 0 && precioEspecial < precio) {
      especialesCand.push({ id:id, nombre:nombre, precioOriginal:precio, precio:precioEspecial, stock:stock });
    }

    var tipoPers = parseInt(f[13]) || 0;
    if (tipoPers >= 1 && tipoPers <= 6) {
      var pct = PCT_OFERTA_PERSONALIZADA_VAO[tipoPers];
      personalizada.push({ id:id, nombre:nombre, precioOriginal:precio, precio: Math.round(precio*(1-pct/100)), porcentaje:pct, stock:stock });
    }

    var precioSimple = parseFloat(f[14]) || 0;
    if (precioSimple > 0 && precioSimple < precio) {
      simple.push({ id:id, nombre:nombre, precioOriginal:precio, precio:precioSimple, stock:stock });
    }

    if (stock <= stockMaxUltimas) ultimasUnidades.push({ id:id, nombre:nombre, precio:precio, stock:stock });
  }

  var relampagoActivo = _dentroDeHorarioOferta_(cfg.ofertas_relampago_hora_inicio, cfg.ofertas_relampago_hora_cierre)
    ? _rotarPorDia_(relampagoCand, parseInt(cfg.ofertas_relampago_limite) || 3) : [];
  var destacadasActivo = _rotarPorDia_(destacadasCand, parseInt(cfg.ofertas_destacadas_limite) || 6);
  var especialesActivo = _rotarPorDia_(especialesCand, parseInt(cfg.ofertas_especiales_limite) || 3);

  // Recién Llegados — reutiliza HISTORIAL_XX (config RECIEN_LLEGADOS_* ya existía)
  var recienLlegados = [];
  try {
    var hist = _hojaCliente(prefijo, 'HISTORIAL').getDataRange().getValues();
    var precioMin = parseInt(cfg.RECIEN_LLEGADOS_PRECIO_MIN) || 0;
    var limiteRL  = parseInt(cfg.RECIEN_LLEGADOS_LIMITE) || 12;
    var diasRL    = parseInt(cfg.RECIEN_LLEGADOS_DIAS) || 15;
    var hace = new Date(); hace.setDate(hace.getDate() - diasRL);
    var ultimaFechaMap = {};
    for (var h = 1; h < hist.length; h++) {
      var hn = String(hist[h][1]||'').trim().toUpperCase();
      var hf = hist[h][0] instanceof Date ? hist[h][0] : null;
      if (!hn || !hf || hf < hace) continue;
      if (!ultimaFechaMap[hn] || hf > ultimaFechaMap[hn]) ultimaFechaMap[hn] = hf;
    }
    var idsOtrosPools = {};
    relampagoActivo.concat(destacadasActivo, especialesActivo).forEach(function(p){ idsOtrosPools[p.id] = true; });
    for (var j = 1; j < datos.length; j++) {
      var fn = String(datos[j][1]||'').trim().toUpperCase();
      if (!fn || !ultimaFechaMap[fn]) continue;
      var idRL = j + 1;
      if (idsOtrosPools[idRL]) continue;
      var stRL = parseInt(datos[j][2]) || 0; if (stRL <= 0) continue;
      var prRL = parseFloat(datos[j][4]) || 0; if (prRL < precioMin) continue;
      recienLlegados.push({
        id: idRL, nombre: String(datos[j][1]).trim(), precio: prRL, stock: stRL,
        fechaIngreso: Utilities.formatDate(ultimaFechaMap[fn], Session.getScriptTimeZone(), 'dd/MM/yyyy')
      });
    }
    recienLlegados = recienLlegados.slice(0, limiteRL);
  } catch(e) { Logger.log('Recién Llegados no disponible para ' + prefijo + ': ' + e.message); }

  return {
    success: true,
    diaTematico: { activo: diaTematicoActivo, categoria: categoriaTematica, productos: diaTematicoProductos },
    relampago: relampagoActivo,
    destacadas: destacadasActivo,
    especiales: especialesActivo,
    personalizada: personalizada,
    simple: simple,
    ultimasUnidades: ultimasUnidades,
    recienLlegados: recienLlegados
  };
}

function configurarOferta(data, prefijo) {
  var auth = _autorizarAccionCliente(prefijo, data.token, 'extra_config_ofertas');
  if (!auth.ok) return { error: auth.error };

  var filaIdx = parseInt(data.id);
  if (!filaIdx || filaIdx < 2) return { error: 'Producto inválido' };
  var inv = getHojaInv(prefijo);

  if (data.relampago         !== undefined) inv.getRange(filaIdx,11).setValue(data.relampago ? 1 : 0);
  if (data.destacada         !== undefined) inv.getRange(filaIdx,12).setValue(data.destacada ? 1 : 0);
  if (data.especialPrecio    !== undefined) inv.getRange(filaIdx,13).setValue(parseFloat(data.especialPrecio) || 0);
  if (data.personalizadaTipo !== undefined) inv.getRange(filaIdx,14).setValue(parseInt(data.personalizadaTipo) || 0);
  if (data.simplePrecio      !== undefined) inv.getRange(filaIdx,15).setValue(parseFloat(data.simplePrecio) || 0);

  return { success: true, mensaje: 'Oferta actualizada' };
}

// ===============================================================
// PLANES DE SUSCRIPCIÓN — PLANES_VAO define qué incluye cada plan,
// sin tocar código. CLIENTES_VAO.Plan dice qué plan tiene cada uno.
// aplicarPlan() copia los campos del plan a CONFIG_XX del cliente.
// ===============================================================

function _crearHojaPlanesSiFalta(ss) {
  if (ss.getSheetByName('PLANES_VAO')) return;
  var h = ss.insertSheet('PLANES_VAO');
  var basico = {
    pack1_ingreso:'TRUE', pack1_hoy:'TRUE', pack1_recargar:'FALSE', pack1_notificaciones:'FALSE',
    pack2_editor_stock:'TRUE', pack2_reportes:'TRUE',
    extra_fiados:'FALSE', extra_prestamos:'FALSE', extra_caja:'TRUE', extra_salidas:'FALSE',
    extra_historial:'FALSE', extra_config_ofertas:'FALSE', extra_generador_flyer:'FALSE'
  };
  var pro = {
    pack1_ingreso:'TRUE', pack1_hoy:'TRUE', pack1_recargar:'TRUE', pack1_notificaciones:'TRUE',
    pack2_editor_stock:'TRUE', pack2_reportes:'TRUE',
    extra_fiados:'TRUE', extra_prestamos:'TRUE', extra_caja:'TRUE', extra_salidas:'TRUE',
    extra_historial:'TRUE', extra_config_ofertas:'TRUE', extra_generador_flyer:'TRUE'
  };
  var prueba = { pack1_ingreso:'TRUE', pack1_hoy:'TRUE', pack2_editor_stock:'TRUE', pack2_reportes:'TRUE' };

  var filas = [['Plan','Campo','Valor']];
  Object.keys(basico).forEach(function(k){ filas.push(['BASICO', k, basico[k]]); });
  Object.keys(pro).forEach(function(k){ filas.push(['PRO', k, pro[k]]); });
  Object.keys(prueba).forEach(function(k){ filas.push(['PRUEBA', k, prueba[k]]); });

  h.getRange(1,1,filas.length,3).setValues(filas);
  h.getRange(1,1,1,3).setFontWeight('bold');
  h.setFrozenRows(1);
}

function listarPlanes(data) {
  if (!validarSesionAdmin(data.token || '')) return { error: 'Sesión admin inválida o expirada' };
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var h = ss.getSheetByName('PLANES_VAO');
  if (!h) return { success: true, planes: [] };
  var datos = h.getDataRange().getValues();
  var set = {};
  for (var i = 1; i < datos.length; i++) { var p = String(datos[i][0]||'').trim(); if (p) set[p] = true; }
  return { success: true, planes: Object.keys(set) };
}

// Aplica un plan: copia sus campos a CONFIG_XX y actualiza CLIENTES_VAO.Plan.
// Solo toca los campos que el plan define — el resto de CONFIG_XX (marca,
// colores, wifi, etc.) queda intacto. Editable sin tocar código: para
// cambiar qué trae cada plan, se edita la hoja PLANES_VAO.
function aplicarPlan(data) {
  if (!validarSesionAdmin(data.token || '')) return { error: 'Sesión admin inválida o expirada' };

  var prefijo = (data.prefijo || '').trim().toUpperCase();
  var plan    = (data.plan    || '').trim().toUpperCase();
  if (!prefijo || !plan) return { error: 'Prefijo y plan requeridos' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hPlanes = ss.getSheetByName('PLANES_VAO');
  if (!hPlanes) return { error: 'No existe hoja PLANES_VAO' };

  var filasPlan = hPlanes.getDataRange().getValues();
  var campos = [];
  for (var i = 1; i < filasPlan.length; i++) {
    if (String(filasPlan[i][0]).trim().toUpperCase() === plan) {
      campos.push({ campo: String(filasPlan[i][1]).trim(), valor: filasPlan[i][2] });
    }
  }
  if (campos.length === 0) return { error: 'El plan "' + plan + '" no está definido en PLANES_VAO' };

  var hConfig = ss.getSheetByName('CONFIG_' + prefijo);
  if (!hConfig) return { error: 'No existe CONFIG_' + prefijo };
  var datosConfig = hConfig.getDataRange().getValues();
  var aplicados = [];
  campos.forEach(function(c) {
    for (var j = 1; j < datosConfig.length; j++) {
      if (String(datosConfig[j][0]).trim() === c.campo) {
        hConfig.getRange(j+1, 2).setValue(c.valor);
        aplicados.push(c.campo);
        return;
      }
    }
  });

  var hCli = ss.getSheetByName('CLIENTES_VAO');
  if (hCli) {
    var datosCli = hCli.getDataRange().getValues();
    for (var k = 1; k < datosCli.length; k++) {
      if (String(datosCli[k][0]).trim().toUpperCase() === prefijo) {
        hCli.getRange(k+1, 6).setValue(plan); // columna F = Plan
        break;
      }
    }
  }

  return { success: true, plan: plan, camposAplicados: aplicados };
}
