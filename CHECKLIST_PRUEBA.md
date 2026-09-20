# Checklist de prueba — correr esto en el staging real después de pegar el Code.gs

No pude ejecutar esto yo mismo (no tengo acceso a tu Google Sheets/Apps Script en vivo). Simulé la lógica con los datos reales de XX y LP y pasó, pero esto hay que confirmarlo con clicks reales antes de dar el paso por cerrado.

## 1. Login de cliente (los dos, no solo uno)
- [ ] Entrar como XX (`index.html` → pos.html?p=XX) con el PIN real de XX → debe entrar normal.
- [ ] Entrar como LP con su PIN real → debe entrar normal (es el caso que estaba en VENDEDORES pero no en CLIENTES_VAO hasta este backfill).
- [ ] El nombre que aparece en el header de `pos.html` para cada uno debe ser el correcto (viene de CLIENTES_VAO ahora).

## 2. Admin
- [ ] Login admin.
- [ ] La tabla de clientes muestra XX y LP con el estado correcto (Activo).
- [ ] Botón "Suspender" en LP → confirmar que en la planilla `CLIENTES_VAO` la columna Estado de LP pasa a SUSPENDIDO (no se toca VENDEDORES).
- [ ] Con LP suspendido, intentar loguearse como LP en pos.html → debe rechazar el acceso.
- [ ] Botón "Activar" en LP → Estado vuelve a ACTIVO, login vuelve a andar.

## 3. Alta de cliente nuevo
- [ ] Crear un cliente de prueba desde admin.html (prefijo nuevo, ej. "ZZ").
- [ ] Verificar que aparece fila nueva en VENDEDORES **y** en CLIENTES_VAO (Plan=PRUEBA, Estado=ACTIVO).
- [ ] Loguearse como ZZ con el PIN que te devolvió el alta.

## 4. Reportes (del paso anterior, re-confirmar que sigue bien)
- [ ] Abrir reportes desde pos.html de XX → debe mostrar ventas de XX, no de otro cliente.
- [ ] Abrir reportes desde pos.html de LP → debe mostrar ventas de LP.

## 5. Separación entre clientes
- [ ] Confirmar que suspender/activar LP no afecta en nada a XX (ni en login, ni en la tabla admin, ni en reportes).

## 0. Configuración inicial obligatoria — ANTES de usar el sistema
- [ ] **Configurar la clave de admin.** Ya no hay ninguna contraseña en el código. Desde el editor de Apps Script (`Extensiones → Apps Script`), en la barra de funciones elegí `setAdminClave`, y en la consola de ejecución corré una vez: `setAdminClave('TU_CLAVE_REAL_ACA')` reemplazando por tu clave real (mínimo 8 caracteres). No la escribas en ningún archivo que subas a Git o compartas — se guarda hasheada en Script Properties.
- [ ] Sin loguearte en pos.html, desde la consola del navegador: `fetch('TU_API_URL?action=getTokenMP&prefijo=XX').then(r=>r.json()).then(console.log)` → debe rechazar.
- [ ] Mismo chequeo con `?action=getProductos&prefijo=XX` sin token → debe rechazar.
- [ ] Intentar crear un cliente nuevo sin sesión de admin (`?action=crearVendedor&data=...`) → debe rechazar.
- [ ] Con sesión de cliente (no admin), probar `crearVendedor`, `activarCliente`, `suspenderCliente`, `aplicarPlan` → los 4 deben rechazar.
- [ ] Loguearte normal en pos.html como XX y confirmar que TODO sigue funcionando igual que antes: header con nombre real, QR de cobro con MercadoPago (si tenés token configurado), vender, ingresar mercadería, ajustar stock, ver estadísticas, cerrar sesión.
- [ ] Con las herramientas de desarrollador del navegador abiertas (pestaña Network), generar un QR de cobro y confirmar que **el token de MercadoPago no aparece en ninguna request** — solo se ve la llamada a tu propio backend.



## 6. Fiados (activar extra_fiados=TRUE en CONFIG_XX primero)
- [ ] Botón "💳 Gestión" aparece en pos.html, pestaña Fiados visible.
- [ ] Crear un fiado de prueba → aparece en la lista con estado PENDIENTE.
- [ ] Abonar parcial → el saldo baja, sigue PENDIENTE.
- [ ] Abonar el resto → pasa a PAGADO automáticamente.
- [ ] Verificar en la hoja FIADOS_XX que las columnas coinciden con lo esperado.

## 7. Préstamos (extra_prestamos=TRUE)
- [ ] Crear préstamo, registrar pagos parciales, confirmar que pasa a PAGADO al cubrir el monto total.

## 8. Caja (extra_caja=TRUE)
- [ ] Abrir caja con un monto.
- [ ] Intentar abrir de nuevo sin cerrar → debe rechazar.
- [ ] Hacer una venta real, registrar un retiro manual.
- [ ] Cerrar caja con un monto real distinto al esperado → confirmar que la diferencia calculada es correcta (esperado = apertura + ventas del sistema).

## 9. Salidas (extra_salidas=TRUE)
- [ ] Buscar un producto, registrar una merma → confirmar que el stock bajó en INVENTARIO_XX y quedó el registro en SALIDAS_XX.

## 10. Multicompra
- [ ] Activar multicompra en un producto (vía `configurarMulticompra` — todavía no tiene UI de admin, se puede probar llamando la acción directo o cargando las columnas H/I/J a mano en INVENTARIO_XX) y confirmar que `getMulticompraActivas` lo devuelve.

## 11. Historial
- [ ] Con extra_historial=TRUE, ingresar mercadería desde pos.html y confirmar que aparece en el botón "📋 Historial" de reportes.html.

## 12. Separación entre clientes (repetir para todo lo nuevo)
- [ ] Un fiado/préstamo/movimiento de caja/salida creado en XX no debe aparecer ni ser accesible desde LP, y viceversa.

## 13. CONFIG_LP (bug encontrado y corregido)
- [ ] Entrar como LP y confirmar que `pos.html` carga bien la config (antes de esta entrega, la hoja CONFIG_LP no existía y esto rompía el login/carga de LP). Si por algún motivo tu staging real ya tenía una CONFIG_LP con datos propios que no están en la planilla que te entrego, avisame antes de reemplazarla — la que armé es un default nuevo, no una recuperación de datos viejos.

## 14. Ofertas (extra_config_ofertas=TRUE en CONFIG_XX)
- [ ] Marcar algún producto con RELAMPAGO=1, DESTACADA=1, ESPECIAL_PRECIO, PERSONALIZADA_TIPO (1-6) u OFERTA_SIMPLE_PRECIO directamente en INVENTARIO_XX.
- [ ] Abrir "🏷️ Ofertas" en pos.html (dentro de Gestión) y en reportes.html → confirmar que aparecen con el precio correcto.
- [ ] Probar Día Temático: poner `ofertas_dia_tematico_activo=TRUE`, `ofertas_dia_tematico_dia`=día de hoy, `ofertas_dia_tematico_categoria`= alguna categoría real tuya → confirmar que esos productos aparecen en "Día temático" y NO en Relámpago/Destacadas/Especiales aunque tengan esos flags.
- [ ] Cambiar `ofertas_relampago_limite` a un número chico con más productos marcados que ese número → confirmar que solo se muestran esa cantidad (rota día a día).

## 15. Planes (PLANES_VAO)
- [ ] Desde admin.html, elegir un plan (BÁSICO o PRO) para un cliente y tocar "Aplicar".
- [ ] Confirmar en CONFIG_XX de ese cliente que los campos cambiaron según lo que dice PLANES_VAO para ese plan.
- [ ] Confirmar que CLIENTES_VAO.Plan quedó actualizado.
- [ ] Confirmar que los campos que el plan NO menciona (identidad, colores, wifi) no se tocaron.

