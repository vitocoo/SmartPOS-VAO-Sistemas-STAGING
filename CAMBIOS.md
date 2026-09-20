# VAO POS — VERSIÓN FINAL v012 — generado 20/09/2026

## TERCERA RONDA — eliminación de credenciales expuestas (Code.gs v011 a v012)

| Archivo | Función | Problema | Corrección |
|---|---|---|---|
| Code.gs | `generarClaveAdmin()` | Contraseña de admin (`ventilador220`) escrita en texto plano en el código fuente. Además el nombre de la función no coincidía con lo que pedía el mensaje de error (`setAdminClave`) | Renombrada a `setAdminClave(claveNueva)` — **ya no existe ninguna contraseña dentro del código**. Se pasa como parámetro al ejecutarla a mano, una vez, desde el editor de Apps Script. Sigue sin estar ruteada en `doGet` — no se puede llamar por web bajo ningún nombre |
| Code.gs | `getTokenMP` | Devolvía el token real de MercadoPago al navegador (ya estaba gateado por sesión desde la ronda anterior, pero seguía viajando el valor real) | Ahora devuelve solo `{configurado: true/false}` — el valor del token nunca sale del servidor |
| Code.gs | *(nueva)* `crearPreferenciaMP` | — | Genera la preferencia de pago llamando a la API de MercadoPago **del lado del servidor** (`UrlFetchApp`), y devuelve al navegador únicamente la URL de pago (`initPoint`) para armar el QR. Exige sesión válida del mismo cliente, igual que el resto |
| pos.html | `generarQRMP()` | Llamaba directo a `api.mercadopago.com` desde el navegador con el token real en el header `Authorization: Bearer ...` — visible en las herramientas de desarrollador de quien esté usando el POS | Ahora llama a `crearPreferenciaMP` en el backend; el navegador nunca ve el token |
| pos.html | `cargarTokenMP()` | Guardaba el token real en la variable `mpTokenActual`, y tenía un fallback que leía un token crudo desde `localStorage` (`vao_mp_token_XX`) | `mpTokenActual` ahora solo guarda `'ok'`/`''` (configurado o no). Se sacó el fallback de localStorage con token crudo, porque ya no encaja con el nuevo flujo — si no hay token configurado en el servidor, se usa el link estático del vendedor (esto no cambió) |

## Búsqueda global de credenciales — qué se encontró
Se buscó en `Code.gs` y en los 4 HTML cualquier cadena que pudiera ser contraseña, PIN, token, API key o secreto. Además se revisaron **todas las celdas de la planilla real** (XX y LP) buscando tokens guardados por error — no se encontró ninguno.
- La única credencial real que quedaba en el código era `ventilador220` — corregida arriba.
- Las menciones a `APP_USR-...` en los comentarios de `setTokenMP` son ejemplos de formato, no tokens reales — se dejaron como están porque son solo documentación de cómo se ve un token de MP, no un secreto.
- `admin.html` tiene un `<input type="password">` para que el admin escriba su clave al loguearse — es el campo del formulario, no una credencial guardada.

## Verificación de `setPIN` / `eliminarPIN`
Ninguna de las dos está ruteada en `doGet` — no existe forma de llamarlas por web, ni con sesión de cliente ni sin sesión. Solo se pueden ejecutar a mano desde el editor de Apps Script. No requerían cambios.

## Prueba final repetida (las 6 baterías completas, contra el Code.gs definitivo)
Sin token, con token inválido, con token de otro cliente, cambiando el prefijo enviado en ambas direcciones (XX↔LP), forzando logout ajeno, alta de cliente sin admin, cliente normal llamando `crearVendedor`/`activarCliente`/`suspenderCliente`/`aplicarPlan`/`getResumenAdmin`/`listarPlanes`, y ahora además: `getTokenMP` sin devolver el token real, `crearPreferenciaMP` sin sesión y con sesión de otro cliente, `setAdminClave` sin contraseña hardcodeada y rechazando claves cortas. **Las 6 simulaciones completas pasan, cero fallos**, corridas contra el `Code.gs` real vía Node, no reimplementadas.

---



## SEGUNDA RONDA DE AUDITORÍA — 4 hallazgos más (Code.gs v010 a v011)

Después de la primera ronda, se pidió explícitamente revisar TODAS las funciones equivalentes, no solo las 9 ya encontradas. Aparecieron 4 más:

| Archivo | Función | Problema | Corrección |
|---|---|---|---|
| Code.gs | `crearVendedor` | **Crítico** — dar de alta un cliente nuevo (con PIN generado y token de MercadoPago incluidos) no exigía sesión de admin. Cualquiera con la URL podía crear clientes | Ahora exige `validarSesionAdmin(data.token)` |
| Code.gs | `cerrarSesionCliente` | Cualquiera podía forzar el cierre de sesión de **otro** cliente sin conocer su token, solo mandando su prefijo | Ahora exige que el token mandado empiece con `CLI_<prefijo>_` — no hace falta que esté vigente (el logout tiene que funcionar con token vencido), pero sí que sea del mismo cliente |
| Code.gs | `getInfo` (pública a propósito, es un ping de diagnóstico) | Devolvía los correos personales del dueño del sistema y el nombre del repo de GitHub, sin ninguna autenticación | Se recortó para devolver solo proyecto/entorno/versión — nunca correos ni repo |
| Code.gs | `generarClaveAdmin()` | Tiene una contraseña de admin **hardcodeada en texto plano** (`ventilador220`) en el código fuente. No es explotable por web porque la función no está ruteada en `doGet` — solo se puede ejecutar a mano desde el editor de Apps Script — pero sigue siendo una credencial expuesta en el código | **No se puede corregir desde acá** — es una función de configuración inicial pensada para que la edites vos, cambies la clave, y la corras una vez. **Acción tuya pendiente: cambiá esa clave antes de desplegar a producción**, y considerá borrar la clave en texto plano del archivo después de correrla una vez |
| pos.html | `irAlInicio()` | Llamaba a `cerrarSesion` sin mandar token | Se agregó, capturando el token antes de borrarlo de localStorage |
| admin.html | alta de cliente | No mandaba `token` al backend | Se agregó `token: tokenAdmin` al payload |

## Revisión completa de las 39 acciones de `doGet`
Se revisaron **las 39**, una por una: 3 son pre-login por diseño y no llevan gate (`getInfo`, `adminLogin`, `clienteLogin` — son la autenticación en sí misma), las otras 36 exigen sesión válida (`validarSesionCliente` o `validarSesionAdmin` según corresponda), y las que además dependen de un plan exigen también el módulo de `CONFIG_XX` correspondiente.

## Pruebas negativas ejecutadas (todas server-side, contra el código real)
- Llamar sin token → rechazado (probado en múltiples funciones).
- Llamar con token de otro cliente contra un prefijo distinto → rechazado.
- Llamar con el token correcto de un cliente pero **cambiando el prefijo enviado** (`?p=` / `prefijo=`) al del otro cliente → rechazado en ambas direcciones (XX→LP y LP→XX).
- Forzar cierre de sesión ajena → rechazado; con el token propio, si funciona.
- Dar de alta un cliente sin sesión de admin, y con sesión de cliente (no admin) → ambos rechazados.
- Aplicar un plan sin sesión de admin → rechazado.

Con esto puedo decir: **revisé las 39 acciones expuestas en `doGet` y no quedan endpoints de lectura/escritura que puedan ejecutarse sin la autorización correspondiente**, salvo la contraseña hardcodeada de `generarClaveAdmin()`, que es una acción tuya (no de código) porque esa función ni siquiera está expuesta por web.

## Flujo de permisos confirmado
`PLANES_VAO → CLIENTES_VAO.Plan → aplicarPlan() copia a CONFIG_XX → _autorizarAccionCliente() lo vuelve a chequear en cada llamada al backend → recién ahí el HTML muestra u oculta el botón`. El HTML nunca es la única barrera — se probó explícitamente llamando las acciones "directo", sin pasar por ningún botón.

---



## HALLAZGO CRÍTICO — 9 funciones sin ninguna validación de sesión
Al auditar el proyecto completo encontré que estas funciones, todas ya existentes antes de esta etapa, **no validaban token ni sesión de ningún tipo**: cualquiera con la URL del deployment y un prefijo de 2-3 letras podía usarlas sin loguearse.

| Archivo | Función | Problema | Corrección |
|---|---|---|---|
| Code.gs | `getVendedores` | Devolvía nombre, teléfono, alias de pago y link de MercadoPago de **todos** los clientes, a cualquiera, sin sesión | Ahora exige sesión válida (`_autorizarAccionCliente`) y filtra server-side: solo devuelve el propio prefijo autenticado |
| Code.gs | `getTokenMP` | Devolvía el **token real de MercadoPago** de cualquier cliente sin sesión | Ahora exige sesión válida del mismo prefijo |
| Code.gs | `getProductos` | Exponía todo el catálogo (precios, costos, stock) sin sesión | Ahora exige sesión válida |
| Code.gs | `registrarVenta` (acción `vender`) | Cualquiera podía registrar ventas falsas o descontar stock sin sesión | Ahora exige sesión válida |
| Code.gs | `ingresarMercaderia` | Sin sesión ni chequeo de módulo | Ahora exige sesión + `pack1_ingreso` |
| Code.gs | `ajustarStock` | Sin sesión ni chequeo de módulo | Ahora exige sesión + `pack2_editor_stock` |
| Code.gs | `getEstadisticas` | Sin sesión | Ahora exige sesión válida |
| Code.gs | `getVentasDiarias` | Sin sesión (función que además no se usa desde ningún HTML — código muerto preexistente, se corrigió igual) | Ahora exige sesión válida |
| Code.gs | `getVentas` (usada por reportes.html) | Sin sesión ni chequeo de módulo | Ahora exige sesión + `pack2_reportes` |

Como consecuencia, `doGet` ahora pasa `data` (con el token) a `getVendedores`, `getProductos`, `getVentas` y `getTokenMP`, que antes no lo recibían.

## Corrección de integración — pos.html
| Archivo | Función | Problema | Corrección |
|---|---|---|---|
| pos.html | carga de vendedor + token MP | Se disparaba **antes** de que el usuario terminara de loguearse (sin esperar el PIN); al exigir ahora sesión en el backend, esto hubiera roto el header/QR en la primera visita | Se convirtió en la función `cargarVendedorYTokenMP()`, que se llama recién dentro de `verificarSesionCliente()` una vez confirmada la sesión |
| pos.html | 6 llamadas (`getProductos`, `vender`, `ingresarMercaderia`, `ajustarStock`, `getEstadisticas`, `getVendedores`, `getTokenMP`) | No mandaban el token | Se agregó `token: localStorage.getItem(TOKEN_KEY)` a cada una |
| pos.html | `programarRecordatorioCierre()` | Bug preexistente: armaba la clave de localStorage sin el prefijo (`'vao_ventas_' + fecha`) mientras que el dato real se guarda con clave `HOY_KEY` (`'vao_ventas_' + PREFIJO + '_' + fecha`) — el aviso de cierre de las 22:05 **nunca se disparaba**, en ningún cliente | Se corrigió para usar la misma constante `HOY_KEY` con la que se escribe |

## Corrección de integración — reportes.html
| Archivo | Función | Problema | Corrección |
|---|---|---|---|
| reportes.html | llamada principal a `getVentas` | No mandaba token | Se agregó |
| reportes.html | `init()` | Si `getVentas` devolvía error (sesión vencida, módulo apagado), se mostraba un reporte **vacío en silencio**, sin avisar nada | Ahora muestra el error y un link para volver a loguearse en el POS |

## Corrección de planilla — columnas de Ofertas faltantes
Las 5 columnas de Ofertas (`RELAMPAGO`...`OFERTA_SIMPLE_PRECIO`) se habían agregado al generador de hojas para clientes NUEVOS, pero no se habían retroalimentado a `INVENTARIO_XX`/`INVENTARIO_LP`, que ya existían. Se corrigió — ahora las 15 columnas de ambos inventarios coinciden exactamente, una por una, con los índices que lee/escribe `Code.gs`.

## Verificación de planilla — todo lo demás coincide
Se comparó, columna por columna, cada hoja nueva (`FIADOS`, `PRESTAMOS`, `CAJA`, `CAJA_MOVIMIENTOS`, `SALIDAS`, `HISTORIAL`, `AJUSTE_RAPIDO`, `VENTAS`) de XX y LP contra lo que `Code.gs` espera — coinciden exactamente. `CONFIG_XX` y `CONFIG_LP` tienen el mismo conjunto de campos. Las 24 hojas que el código necesita existen todas en la planilla.

## Código muerto encontrado (preexistente, no se tocó)
`deleteTokenMP`, `listarTokensConfigurados`, `generarClaveAdmin`, `eliminarPIN`, `_parseNumeroFlexible`, `_esActivoFlag_` — definidas pero no llamadas desde ningún HTML ni desde `doGet`. Parecen utilidades para ejecutar a mano desde el editor de Apps Script (mismo criterio que `migrarHojasFaltantes`). No las toqué porque no es un error — es código de utilidad que no está conectado a la interfaz, y no hay evidencia de que deba estarlo.

## Prueba de aislamiento XX/LP (simulación real, no reimplementada)
Se armaron dos clientes de prueba con datos claramente identificables ("PRODUCTO SECRETO DE XX" / "DE LP") y se probó, con el token real de sesión de XX, pedir datos de LP en las 16 funciones de cliente que existen hoy (`getProductos`, `getVendedores`, `registrarVenta`, `ingresarMercaderia`, `ajustarStock`, `getEstadisticas`, `getVentas`, `getTokenMP`, `getHistorial`, `listarFiados`, `crearFiado`, `listarPrestamos`, `getCajaActual`, `getMovimientosCaja`, `getSalidas`, `getOfertas`, `getMulticompraActivas`) — **las 16 se bloquearon**. Con su propio token, cada cliente ve solo sus propios datos.

## Estado final del proyecto
Terminado y auditado dentro de lo que se puede verificar sin acceso a Google Sheets/Apps Script en vivo: sintaxis correcta, simulación funcional de cada módulo contra el código real (no reimplementado), aislamiento entre clientes confirmado en las 16 funciones críticas, permisos por plan verificados a nivel backend (no solo UI), planilla y código coinciden hoja por hoja y columna por columna. Falta únicamente la prueba de clic real en tu Apps Script/Sheets — checklist actualizada para eso.

---



## Motor de OFERTAS (Code.gs v008 a v009) — adaptado de Almacén Copihue
Puerto funcional del motor de ofertas de Copihue (`calcularOfertas`) a la arquitectura multihoja, con validación de sesión + módulo (`extra_config_ofertas`) en el backend. Tipos implementados:

- **Relámpago, Destacadas, Especiales** — mismos pools rotativos por día del año que Copihue (para no mostrar siempre los mismos productos), con límite y horario configurables por cliente en `CONFIG_XX`.
- **Personalizada** — mismo código 1-6 → 10/20/30/40/50/60% off que Copihue.
- **Simple** — precio fijo de oferta por producto.
- **Últimas Unidades** — automático, por umbral de stock configurable (no requiere marcar producto por producto).
- **Recién Llegados** — reutiliza `HISTORIAL_XX` (los campos `RECIEN_LLEGADOS_*` ya estaban en `CONFIG_XX` desde antes, sin usar).
- **Jueves Cervecero → "Día Temático"** — esto era una decisión exclusiva del negocio de Copihue (cerveza, jueves), así que **no se trasladó tal cual**: se convirtió en configuración (`ofertas_dia_tematico_dia`, `ofertas_dia_tematico_categoria`) para que cualquier cliente VAO pueda definir su propio día/categoría temática, o dejarlo apagado.
- **Multicompra** — ya estaba (entrega anterior), ahora integrado en la misma respuesta de `getOfertas` y con UI.

Nuevas columnas en `INVENTARIO_XX` (K-O): `RELAMPAGO`, `DESTACADA`, `ESPECIAL_PRECIO`, `PERSONALIZADA_TIPO`, `OFERTA_SIMPLE_PRECIO`. Se configuran editando la planilla directamente (mismo criterio que ya se usaba para Multicompra) — hay una función `configurarOferta()` en el backend por si más adelante se quiere UI para eso.

## Integración con Inventario / Ventas / Multicompra / Reportes
- **Inventario**: las ofertas leen directo de `INVENTARIO_XX`, sin datos duplicados.
- **Ventas**: `pos.html` ya tenía `editarPrecio()` — el vendedor toca el precio en el carrito y lo cambia al precio de oferta que ve en la pestaña "🏷️ Ofertas". No se tocó el flujo de venta/cobro existente (que ya funciona) para no arriesgarlo; la conexión es mostrar el precio correcto para que se cargue con el mecanismo que ya existía.
- **Multicompra**: ahora sí tiene UI (antes solo backend) — se agregó a la misma pestaña de Ofertas en `pos.html`.
- **Reportes**: botón "🏷️ Ofertas" nuevo en `reportes.html`, panel de solo lectura con las ofertas activas del día.

## PLANES DE SUSCRIPCIÓN — hoja nueva `PLANES_VAO`
`CLIENTES_VAO.Plan` dice qué plan tiene cada cliente. `PLANES_VAO` (Plan / Campo / Valor) define qué trae cada plan — **editable sin tocar código**. Vienen 3 planes de ejemplo (`PRUEBA`, `BASICO`, `PRO`, usando la estructura de ejemplo que vos mismo diste), pero se puede agregar cualquier otro plan agregando filas a esa hoja.
- `aplicarPlan(prefijo, plan)` — copia los campos del plan a `CONFIG_XX` del cliente y actualiza `CLIENTES_VAO.Plan`. Solo toca los campos que el plan define (identidad, colores, wifi, etc. quedan intactos).
- **UI en `admin.html`**: selector de plan + botón "Aplicar" en cada fila de la tabla de clientes.

## BUG REAL ENCONTRADO — `CONFIG_LP` no existía
Al extender la planilla real, encontré que **`CONFIG_LP` nunca se había creado** — la hoja no existe en el staging actual. Como `leerConfig()` explota si la hoja no existe, esto significa que **`getConfig('LP', ...)` está roto ahora mismo en el sistema real** (LP no puede terminar de cargar `pos.html`, que pide la config justo después del login). No es algo que yo haya roto — lo encontré revisando la planilla real antes de escribir código nuevo. Lo corregí: `CONFIG_LP` queda creada en la planilla que te entrego, con el mismo default completo que genera `crearHojaConfigDefault()`, usando los datos reales de LP (Lupino).

## Seguridad — repaso hecho en esta etapa
Confirmé que las 18 funciones nuevas de cliente (Historial, Fiados, Préstamos, Caja, Salidas, Multicompra, Ofertas) pasan por `_autorizarAccionCliente()` antes de tocar cualquier dato — sesión válida del prefijo correspondiente + módulo habilitado en `CONFIG_XX` de ESE cliente. La separación entre clientes ya estaba garantizada por cómo está armado el token (`CLI_XX_...` solo sirve para XX) — no hay forma de pedir datos de LP con una sesión de XX, se confirmó de nuevo con las funciones nuevas.

## Verificación hecha (sin acceso a Google Sheets en vivo)
- Sintaxis del `.gs` completo: sin errores.
- Simulación completa de Ofertas contra el código real: día temático excluye correctamente productos de los otros pools, límite de relámpago se respeta, precio especial/personalizada(30%)/simple se calculan bien, últimas unidades y recién llegados aparecen cuando corresponde y no se duplican con otros pools.
- Simulación completa de Planes: `aplicarPlan('PRO')` activa todos los módulos del plan y actualiza `CLIENTES_VAO.Plan`; `aplicarPlan('BASICO')` los vuelve a apagar — probado con el `CONFIG_XX` real que genera `crearHojaConfigDefault()`, no uno armado a mano.
- Los 3 HTML (`pos.html`, `admin.html`, `reportes.html`) quedaron con `<div>` y `<script>` balanceados y sintaxis válida después de cada cambio.
- **Falta:** correr esto en tu Apps Script/Sheets real — checklist actualizada.

## Pendiente / REQUIERE DECISIÓN VAO
- Nada bloqueante para probar. El único punto abierto real es si en algún momento querés que `configurarOferta`/`configurarMulticompra` tengan una UI para tocarlos desde `pos.html` en vez de editar la planilla directamente — hoy se editan igual que se vienen editando los demás flags de configuración.

---

# Cambios — entrega v3 (staging, historial/fiados/préstamos/caja/salidas/multicompra)

## MÓDULOS NUEVOS (Code.gs v007 a v008) — Historial, Fiados, Préstamos, Caja, Salidas, Multicompra

Todo con validación de sesión + módulo habilitado hecha **en el backend** (no solo ocultando botones del HTML) — ver `_autorizarAccionCliente()`.

- **Historial** (`HISTORIAL_XX`): se completa solo, automáticamente, cada vez que se usa "Ingresar mercadería" en pos.html. Visible desde `reportes.html` (botón nuevo, solo si `extra_historial=TRUE`).
- **Fiados** (`FIADOS_XX`): mismo esquema de columnas que la hoja FIADOS de Copihue (referencia probada) — crear fiado, listar, abonar (parcial o total, pasa a PAGADO solo). UI nueva: botón "💳 Gestión" en pos.html, pestaña Fiados (solo si `extra_fiados=TRUE`).
- **Préstamos** (`PRESTAMOS_XX`): migrado de localStorage (Seba21) a Sheets — crear, listar, registrar pagos (pasa a PAGADO cuando se cubre el monto). UI en la misma pestaña "Gestión" (solo si `extra_prestamos=TRUE`).
- **Caja + Caja_Movimientos** (`CAJA_XX`, `CAJA_MOVIMIENTOS_XX`): apertura/cierre de caja con cálculo automático de esperado (apertura + ventas del sistema) vs. real contado, más ingresos/retiros manuales. UI en "Gestión" (solo si `extra_caja=TRUE`).
- **Salidas** (`SALIDAS_XX`): merma/consumo interno — descuenta stock igual que una venta pero sin ser venta, queda su propio registro. UI en "Gestión" (solo si `extra_salidas=TRUE`).
- **Ajuste rápido** (`AJUSTE_RAPIDO_XX`): ahora `ajustarStock()` deja un registro de auditoría (stock/precio antes y después) cada vez que se usa el editor que ya existía en pos.html. No es un módulo nuevo para el usuario — es trazabilidad de algo que ya funcionaba.
- **Multicompra**: las dos columnas "Reservada" del inventario (H/I) pasan a ser `MULTICOMPRA_ACTIVA`/`MULTICOMPRA_CANTIDAD`, y se agregó una columna nueva `MULTICOMPRA_PRECIO` (J) — es justo para lo que esas columnas estaban reservadas. Activar/consultar ofertas de multicompra por producto, con la misma lógica de Copihue (`getMulticompraTodas`) adaptada a multihoja.
- **El resto del motor de Ofertas de Copihue** (Jueves Cervecero, Relámpago, Últimas Unidades, Personalizadas, etc.) — **no se construyó**. No hay reglas comerciales definidas para VAO sobre cómo debe comportarse cada tipo, y no las inventé. Queda **REQUIERE DECISIÓN VAO**.

## `CONFIG_XX` — 3 flags nuevos
`extra_historial`, `extra_caja`, `extra_salidas`. Los de Fiados/Préstamos/Ofertas ya existían en la hoja (estaban sin usar) — se reutilizaron, no se duplicaron.

## Estructura de hojas — `_crearHojasOperativasCompletas()`
Toda la creación de hojas de un cliente quedó centralizada en una sola función, llamada desde `crearVendedor()`. También agregué `migrarHojasFaltantes()` para correr a mano una vez y completar hojas faltantes en clientes viejos (ver README). En la planilla que te entrego, XX y LP ya tienen todas las hojas creadas — no hace falta correr esa función salvo que reconstruyas la planilla desde cero.

## admin.html
Se agregó la columna "Plan" a la tabla de clientes (ya la devolvía `getResumenAdmin` desde la migración anterior, pero no se mostraba en ningún lado).

## Verificación hecha (sin acceso a Google Sheets en vivo)
- Sintaxis del `.gs` completo: sin errores.
- **Simulación funcional real**: armé un mock de `SpreadsheetApp`/`PropertiesService`/`Utilities`/`Session` en Node y corrí el `Code.gs` real (no una reimplementación) contra datos de prueba. Se probó: alta de fiado → abono parcial → abono total (pasa a PAGADO) ✅; alta de préstamo → pagos hasta cubrir el monto (pasa a PAGADO) ✅; apertura de caja → bloqueo de doble apertura ✅ → venta real → movimiento manual → cierre con cálculo correcto de diferencia ✅; salida de stock (descuenta inventario) ✅; multicompra (activar y listar) ✅; historial automático desde ingreso de mercadería ✅; ajuste rápido con log de auditoría ✅; **permisos**: sin token, con token inválido, y con módulo apagado en CONFIG — los tres casos bloquean correctamente ✅.
- Sintaxis de los 3 bloques `<script>` de `pos.html`/`admin.html`/`reportes.html`: sin errores. Etiquetas `<div>` y `<script>` balanceadas en los 4 HTML.
- **Bug real encontrado y corregido durante este mismo proceso**: un `str_replace` mal armado había borrado la apertura del `<script>` principal de `pos.html` — se detectó por el chequeo de balance de etiquetas, no a simple vista. Quedó arreglado antes de entregar nada.
- Un segundo bug encontrado y corregido: al agregar las columnas de Multicompra al inventario real (XX/LP), el primer intento las dejó en las columnas J/K/L en vez de H/I/J, desalineadas con lo que lee/escribe `Code.gs`. Se corrigió y se verificó columna por columna antes de guardar la planilla final.
- **Falta:** correr esto de verdad en tu Apps Script y planilla reales — ver `CHECKLIST_PRUEBA.md`.

## Pendiente / REQUIERE DECISIÓN VAO
- Motor completo de Ofertas (más allá de Multicompra) — sin reglas comerciales definidas.
- Fecha Vence no bloquea login (default seguro ya acordado).
- Categoría (VENDEDORES) vs Plan (CLIENTES_VAO) — sin unificar.

---

# Cambios — entrega v3 previa (migración CLIENTES_VAO / VENDEDORES)

## Code.gs → v006 a v007 — Migración CLIENTES_VAO / VENDEDORES
Según el plan aprobado: `CLIENTES_VAO` pasa a ser la fuente real de identidad y estado comercial del cliente. `VENDEDORES` queda para datos operativos (comisión, notas) y como respaldo temporal de transición para clientes que aún no tengan fila en `CLIENTES_VAO`.
- `obtenerInfoCliente()` (usada por `clienteLogin` y `getConfig`): ahora lee `CLIENTES_VAO` primero; si el prefijo no está ahí, cae a `VENDEDORES`. **`clienteLogin` no se tocó** — solo cambió de dónde saca el dato esta función interna.
- `getVendedores()`: nombre, teléfono, correo, alias de pago y link MP salen de `CLIENTES_VAO` cuando el cliente ya está migrado; si no, usa `VENDEDORES`. Comisión y notas siguen siendo de `VENDEDORES`.
- `crearVendedor()`: ahora, además de la fila de siempre en `VENDEDORES`, crea la fila de identidad en `CLIENTES_VAO` (Plan=PRUEBA, Estado=ACTIVO, Fecha Vence en blanco — no se inventó una regla de vencimiento).
- `activarCliente` / `suspenderCliente`: ahora escriben el Estado (ACTIVO/SUSPENDIDO) en `CLIENTES_VAO`, no la columna Activo de `VENDEDORES`. Si el cliente está en BAJA, el botón devuelve error en vez de pisar ese estado.
- `getResumenAdmin()`: ahora lee `CLIENTES_VAO`, y agrega Plan y Fecha Vence a la respuesta (visibles para el admin, sin bloquear nada todavía — pendiente REQUIERE DECISIÓN VAO sobre vencimiento automático).
- `admin.html` **no se modificó** en este paso — ya leía los mismos nombres de campo (`activo`, `nombre`, `tienePin`, `ventasMes`), así que sigue funcionando igual.

## Planilla → backfill de LP en CLIENTES_VAO
Se agregó la fila de `LP` (Lupino) en `CLIENTES_VAO`, tomando lo que ya existía en `VENDEDORES`. Quedan vacíos y a completar a mano: Contacto, Fecha Vence, Link MP, y confirmar el estado real de Token/PIN (no se puede leer Script Properties desde la planilla).

## Verificación hecha (sin acceso a Google Sheets en vivo)
- Chequeo de sintaxis del `.gs` completo: sin errores.
- Simulación local de `obtenerInfoCliente()` y `getVendedores()` con los datos reales de XX y LP: los dos clientes resuelven correctamente (activo=true, nombre correcto), y un prefijo inexistente devuelve null.
- **Falta:** correr esto de verdad en el Apps Script del staging y probar `clienteLogin`, `activarCliente`/`suspenderCliente` y el alta de un cliente nuevo desde `admin.html` — ver checklist de prueba abajo.

## Pendiente / REQUIERE DECISIÓN VAO
- Fecha Vence no bloquea login todavía (default seguro, no inventado — a definir si algún día debe bloquear).
- Categoría (VENDEDORES) vs Plan (CLIENTES_VAO): quedan sin unificar, no se tocó.
- Fiados, Préstamos, Historial, Caja, Salidas, Ajuste (hoja), Ofertas: siguen sin construir — es el próximo paso.


## reportes.html → v1 a v2
- Ahora toma el prefijo del cliente desde `?p=XX` (igual que pos.html). Si no hay prefijo, redirige a index.html.
- `getVentas` se llama con `&prefijo=` — antes caía siempre al default del backend (NE), mostrando las ventas de un cliente equivocado.
- El botón "← Volver" ahora apunta a `pos.html?p=XX` (antes apuntaba a `venta.html`, un archivo que no existe).
- No se tocó nada del calendario, filtros, ni cálculo de totales.

## admin.html → v1 a v2
- El botón Activar/Suspender de la tabla de clientes ahora llama de verdad al backend (`activarCliente` / `suspenderCliente`) en vez de solo mostrar un aviso para editar la planilla a mano.
- No se agregó ningún comportamiento comercial nuevo — el botón hace exactamente lo que el propio HTML ya decía que iba a hacer.
- Se agregó un badge de versión visible (mismo estilo que index.html), que antes no existía en este archivo.

## codegs (Code.gs staging) → v005 a v006
- Nuevas funciones `activarCliente(data)` / `suspenderCliente(data)`, ambas protegidas por `validarSesionAdmin(token)`.
- Escriben "SI"/"NO" en la columna G (Activo) de `VENDEDORES` — la misma columna que ya leen `obtenerInfoCliente()`, `getResumenAdmin()` y `clienteLogin()`. No se creó ninguna fuente de datos nueva.
- Nuevas rutas en `doGet`: `action=activarCliente`, `action=suspenderCliente`.

## No modificado
- CLIENTES_VAO / VENDEDORES: solo se auditó, no se tocó código ni estructura (ver auditoría aparte). "REQUIERE DECISIÓN VAO".
- Ningún módulo nuevo (Fiados, Préstamos, Caja, etc.) — eso viene después.
