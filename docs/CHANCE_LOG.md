# CHANCE LOG — VAO POS MULTIHOJA

Registro descriptivo de cada sesión de desarrollo con IA.
Formato detallado en `CLAUDE.md` → sección "CHANCE LOG".

Propósito:
- Permitir reconstruir funciones complejas desde cero.
- Documentar errores blindados (nunca más sufrir el mismo problema).
- Dejar contexto para futuras IAs y para mí mismo en 3 meses.

═══════════════════════════════════════════════════
CHANCE LOG — 11/09/2026 — SESIÓN COMPLETA DEL DÍA
═══════════════════════════════════════════════════

## SESIÓN 1 — ARQUITECTO (orden general del proyecto)

QUÉ: Se ordenó el proyecto completo. Se creó CLAUDE.md + carpeta docs/.

POR QUÉ: El proyecto estaba disperso en 3 IAs y 5 conversaciones. Nadie
sabía dónde estaba cada regla. Cada IA reinventaba lo mismo.

CÓMO: Se unificaron 4 archivos de reglas de oro en uno solo. Se definió
el modelo multicliente (1 código, hojas por cliente). Se definió el modelo
de packs (base + pack1 + pack2 + pack3 + extra). Se definió PIN 6 dígitos,
3 colores + 4 temas, avatar con color del cliente, validación de contraste.

DÓNDE:
  - CLAUDE.md (raíz del repo)
  - docs/ARQUITECTURA.md
  - docs/CONFIG_XX.md
  - docs/PROMPT_MAESTRO.md
  - docs/PLANILLA ÚNICA.txt

PROBLEMA QUE EVITA O RESUELVE:
  - Pérdida de reglas entre sesiones.
  - IA inventando cosas distintas cada vez.
  - No tener un "lugar único" para las decisiones.

SI SE ROMPE: Los archivos son texto. Están en GitHub + Drive (backup).

PENDIENTE:
  - Renombrar PLANILLA ÚNICA.txt a PLANILLA_UNICA.txt.
  - Borrar .xlsx del repo (contienen datos de clientes).

───────────────────────────────────────────────────

## SESIÓN 2 — CLAUDE (index v007)

QUÉ: Se reemplazó index.html completo. Se agregó pantalla de entrada
con código de cliente.

POR QUÉ: El index viejo (v006) mostraba el POS directamente. Cualquiera
con la URL entraba. No había puerta de entrada.

CÓMO:
  - Input + botón "Entrar".
  - Regex ^[A-Za-z]{2,3}$ (valida formato, no existencia).
  - Redirige a pos.html?p=XX con mayúsculas.
  - Link chiquito a admin.html.

DÓNDE:
  - index.html v007

PROBLEMA QUE EVITA O RESUELVE:
  - Cualquiera con la URL entraba al POS.

SI SE ROMPE: Restaurar desde index_v006_backup.html.

PENDIENTE:
  - Falta identidad VAO (colores, logo).

───────────────────────────────────────────────────

## SESIÓN 3 — CLAUDE (index v008)

QUÉ: Se aplicó la identidad de marca oficial (Brand Book VAO Sistemas
v1.0): paleta de colores, logo real, favicon, lema.

POR QUÉ: la v007 tenía estructura correcta pero colores/logo
genéricos, no la marca real de VAO Sistemas.

CÓMO: variables CSS actualizadas a los hex oficiales (#141A22,
#FF9800, #2CCB6F, #0078FF); logo SVG copiado tal cual del
header-logo del v006; version-tag ahora se escribe por JS.

DÓNDE: index.html v008

PROBLEMA QUE EVITA O RESUELVE: evita que cada archivo nuevo invente
su propia paleta — deja fijado el estándar visual del proyecto.

SI SE ROMPE: restaurar los 5 hex de :root y volver a pegar el SVG del logo.

PENDIENTE: fuentes Playfair Display + DM Sans del v006 no están
todavía en index.

───────────────────────────────────────────────────

## SESIÓN 4 — CLAUDE (CONFIG_XX en planilla)

QUÉ: se creó la hoja CONFIG_XX en SmartPOS_VAO_Sistemas_Planilla,
con 55 campos (identidad, apariencia, pagos, wifi, recién llegados,
seguridad, módulos/packs).

POR QUÉ: era la pieza que faltaba para que cada cliente tenga su
propia configuración editable sin tocar código.

CÓMO: función crearConfigXX() de un solo uso, corrida manualmente
desde el editor de Apps Script.

DÓNDE: hoja nueva, junto a INVENTARIO_XX y VENTAS_XX.

PROBLEMA QUE EVITA O RESUELVE: sin esto, no había dónde guardar
tema, colores, PIN, ni qué packs tiene prendidos cada cliente.

SI SE ROMPE: recrear con la misma función.

PENDIENTE: crear CONFIG_LP para el otro cliente.

───────────────────────────────────────────────────

## SESIÓN 5 — CLAUDE (GAS v002 con getConfig)

QUÉ: se agregó el endpoint ?action=getConfig, que lee CONFIG_<prefijo>
y devuelve la configuración del cliente al frontend.

POR QUÉ: index/pos van a necesitar leer tema, colores, packs, etc.

CÓMO: getConfig(prefijo) valida prefijo existe + activo sí (reusa
obtenerInfoCliente), llama a leerConfig(prefijo) que lee la hoja
fila por fila, y borra el campo PIN antes de responder.
Todavía NO valida sesión — pos.html no genera token de cliente aún.

DÓNDE: una línea nueva en el switch de doGet + dos funciones nuevas.

PENDIENTE: cuando exista la pantalla PIN en pos.html, agregar la
validación de sesión con validarSesionCliente.

═══════════════════════════════════════════════════
CHANCE LOG — 12/09/2026 — SESIÓN COMPLETA DEL DÍA
═══════════════════════════════════════════════════

## SESIÓN 1 — SEGURIDAD DOCUMENTADA

QUÉ: se agregaron las reglas 27-32 al CLAUDE.md y se creó
docs/SEGURIDAD.md.

POR QUÉ: se detectó una brecha real — getConfig devolvía datos
sin validar token. Se documentó la regla para que no vuelva a
pasar en ninguna app VAO.

CÓMO: bloque "REGLAS DE SEGURIDAD EN ENDPOINTS" en CLAUDE.md.
Cadena obligatoria: prefijo → activo → token → token válido → no expirado.

DÓNDE:
  - CLAUDE.md (reglas 27-32)
  - docs/SEGURIDAD.md

PROBLEMA QUE EVITA O RESUELVE:
  - Endpoints que devuelven datos sin validar sesión.
  - Confiar en el frontend para seguridad.
  - Devolver campos sensibles sin filtrar.

PENDIENTE: aplicar la cadena a cualquier endpoint privado nuevo.

───────────────────────────────────────────────────

## SESIÓN 2 — CLAUDE (pos.html v004)

QUÉ: se agregó pantalla de PIN (overlay pantalla completa) antes de
usar el POS, y el botón de salida ahora cierra sesión de verdad.

POR QUÉ: hasta ahora cualquiera con la URL ?p=XX entraba directo al
POS sin ninguna verificación. Además el botón decía "Inicio" pero en
realidad cerraba la sesión — texto engañoso.

CÓMO: overlay fijo (z-index 5000) con input de 6 dígitos que llama a
clienteLogin y guarda el token en localStorage (vao_token_<prefijo>);
al cargar la página, verificarSesionCliente() valida ese token contra
getConfig antes de ocultar el overlay. Guard nuevo al inicio del script:
sin ?p= en la URL, redirige a index.html y corta la ejecución. Botón
"Inicio" → "Salir": ahora irAlInicio() borra el token, llama a
cerrarSesion en el GAS, y recién ahí redirige.

DÓNDE: <body> (overlay nuevo, primer hijo), toolbar, inicio del <script>
(guard + APP_VERSION 3→4), bloque nuevo después de CARRITO_KEY,
función irAlInicio().

PROBLEMA QUE EVITA O RESUELVE: acceso sin control al POS de un
cliente con solo conocer su prefijo de 2-3 letras.

SI SE ROMPE: el overlay y sus funciones son un bloque autocontenido
(TOKEN_KEY + 4 funciones + la llamada final) — se puede pegar de
nuevo tal cual después de CARRITO_KEY.

PENDIENTE: el botón-ícono del header (🏠 sin texto) sigue llamando
a irAlInicio() pero no se le cambió el ícono — queda pendiente
unificarlo con el de la toolbar.

───────────────────────────────────────────────────

## SESIÓN 3 — CLAUDE (vao-smartpos-script.gs v003)

QUÉ: getConfig ahora valida la sesión de verdad — cierra el hueco de
seguridad que quedó abierto en la v002.

POR QUÉ: reglas 27-32 (CLAUDE.md): ningún endpoint que devuelve datos
privados puede confiar en que el frontend ya validó algo.

CÓMO: getConfig(prefijo) pasó a getConfig(prefijo, token); se agregó
un if (!validarSesionCliente(prefijo, token)) return {error...} entre
la validación de "activo" y la lectura de la config. El switch de
doGet ahora pasa data.token || '' al llamarla.

DÓNDE: la línea del switch en doGet + la función getConfig completa.
leerConfig no se tocó.

PROBLEMA QUE EVITA O RESUELVE: antes, cualquier token guardado en
localStorage (válido, vencido o inventado) hacía que getConfig
devolviera la configuración igual — la sesión no se comprobaba en
el servidor. Ahora sí.

SI SE ROMPE: el cambio es de una sola línea de validación adentro de
getConfig.

PENDIENTE: aplicar la misma cadena a cualquier endpoint futuro.

───────────────────────────────────────────────────

## SESIÓN 4 — CARGA DE PIN Y PRUEBAS

QUÉ: se cargó el PIN de XX en Script Properties y se probó el
flujo completo del POS.

POR QUÉ: clienteLogin valida el PIN contra PIN_<prefijo> en
Script Properties. El PIN de CONFIG_XX es inerte hoy (doble fuente).

CÓMO: función temporal cargarPINXX() con setPIN('XX', '123456').
Probado: 000000 → error. 123456 → entra. Recargar → entra directo
(token válido). "Salir" → borra token + cierra sesión + index.
Volver a entrar → pide PIN.

DÓNDE:
  - Apps Script (Script Properties)
  - pos.html v004 en Vercel

PROBLEMA QUE EVITA O RESUELVE:
  - Confirmó que la pantalla PIN + validación de sesión funcionan
    de punta a punta.

SI SE ROMPE: re-ejecutar setPIN('XX', '123456') desde el editor.

PENDIENTE:
  - Unificar PIN: hoy vive en Properties Y en CONFIG_XX.
    Decisión: que viva solo en CONFIG_XX (a futuro).
  - Cargar PIN de LP.

───────────────────────────────────────────────────

## PROBLEMAS ABIERTOS AL CIERRE DEL DÍA (12/09/2026)

1. **PIN con doble fuente**
   Vive en Properties (PIN_XX) Y en CONFIG_XX (campo PIN).
   clienteLogin lee de Properties. CONFIG_XX.PIN es inerte.
   Unificar a futuro (probablemente en CONFIG_XX).

2. **Botón-ícono del header (🏠)**
   Sigue llamando irAlInicio sin texto. Unificar con el botón "Salir".

3. **Paleta oficial sin definir**
   Brand Book vs Manual tienen paletas distintas.

4. **SVG oficial del símbolo sin conseguir**
   El que se usa es una reconstrucción.

5. **Avatares por iniciales vs Manual de Identidad**
   El Manual prohíbe meter el símbolo en círculo con letras.

6. **Google Fonts faltantes en index v008**
   No bloquea, pero rompe coherencia con pos.html.

7. **Toolbar dinámica según packs**
   pos.html muestra todos los botones sin filtrar por CONFIG_XX.

───────────────────────────────────────────────────

## PRÓXIMO PASO (al retomar 13/09)

**PASO 1 — Toolbar dinámica según packs**

pos.html ya lee getConfig al cargar (para validar sesión).
Ahora:
- Guardar esa config en memoria.
- Generar los botones de la toolbar según los TRUE/FALSE.
- Ocultar Ingresar / Ajustar / Hoy / Reportes / Salir según packs.

═══════════════════════════════════════════════════
CHANCE LOG — 13/09/2026 — INVENTARIO BACKEND COPIHUE
═══════════════════════════════════════════════════

## SESIÓN ÚNICA — INVENTARIO DE FUNCIONES COPIHUE

QUÉ: Se hizo el inventario completo de las funciones del backend de
Copihue (Code.gs + 7 archivos .gs satélite) para migrar a VAO POS.
Se armó un TSV de ~305 filas + prompt para Claude.

POR QUÉ: El proyecto estaba disperso en 3 IAs y 5 conversaciones. Nadie
sabía qué funciones existen en Copihue y cuáles aplican a VAO POS.
Sin inventario, la migración se vuelve caos.

CÓMO:
1. Victor pasó los 7 archivos .gs de Copihue:
   - code.gs (backend principal, v11.0)
   - multicompra.gs
   - motorInventario.gs
   - pedidos_wa.gs
   - sin_stock.gs
   - flyer_multicompra.gs
   - bloque asistente voz.gs
2. Se clasificaron ~305 funciones por módulo:
   Ventas (19), Fiados (20), Caja (11), Inventario (32),
   Ofertas (55), Juegos (20), Sistema (22), Cacheo (3),
   Logs (3), Herramientas (25), Descartados (4).
3. Se armó un TSV con 9 columnas:
   Módulo | Archivo | Función | Qué hace | Estado | Prioridad
   | ¿Migrar? | Migrado | Notas
4. Se descartaron 3 cosas:
   - Alexa (requiere training por cliente, inviable multi-cliente)
   - ingreso.html viejo (reemplazado por modal del POS)
   - _aliasEspecificos (33 productos específicos de Copihue)
5. Se armó prompt para Claude (script que crea hoja BACKEND).
6. Claude entregó el script.
7. Victor ejecutó el script en la planilla "BACKEND POS VAO SISTEMAS".
8. Hoja BACKEND creada con 305 filas + colores + desplegables.

DÓNDE:
  - Planilla: BACKEND POS VAO SISTEMAS (cuenta victoralvarezoejeda)
  - Hoja: BACKEND (305 filas, 9 columnas)
  - Colores por prioridad + filtros + desplegables

PROBLEMA QUE EVITA O RESUELVE:
  - Cada IA trabajaba con información distinta.
  - Olvido de funciones valiosas (motorInventario, blindaje multicompra).
  - Duplicación de código al migrar.

SI SE ROMPE: El TSV está en el chat. Se puede volver a pegar a Claude.
Los 7 archivos .gs originales siguen intactos en Copihue.

PENDIENTE:
  - Bloque 2: FRONTEND (seba21.html, ~150 filas).
  - Bloque 3: DASHBOARD + LIMPIEZA + PLAN MIGRACIÓN.
  - Marcar prioridades finales en la hoja BACKEND.

═══════════════════════════════════════════════════
CHANCE LOG — 14/09/2026 — HEADER IDENTIDAD + getInfo
═══════════════════════════════════════════════════

## SESIÓN ÚNICA — HEADER DE IDENTIDAD EN EL GAS

QUÉ: Se agregó al GAS de VAO POS MULTIHOJA (producción) un header
de identidad + constante SISTEMA + endpoint getInfo.

POR QUÉ: Para que cualquier IA (o Victor mismo en 6 meses), al abrir
el GAS, sepa exactamente qué sistema es, a qué cuenta pertenece y
dónde vive. Evita confundir proyectos.

CÓMO:
1. Se agregó un header al inicio del archivo con:
   - Proyecto (VAO POS MULTIHOJA)
   - Cuentas (googlesheet, Claude, Deepseek)
   - URL, repo, planilla
   - Arquitectura, origen
2. Se agregó una constante SISTEMA (objeto JS) con los mismos datos
   en formato estructurado.
3. Se agregó el endpoint ?action=getInfo en el doGet (primera línea
   del switch).
4. Se agregó la función getInfo() antes de getHojaInv().

DÓNDE:
  - vao-smartpos-script.gs (producción)
  - Header al inicio + constante SISTEMA + endpoint + función

PROBLEMA QUE EVITA O RESUELVE:
  - Confundir el proyecto al abrir el GAS.
  - No saber a qué cuenta Google pertenece.
  - Perder contexto entre sesiones.

SI SE ROMPE: El endpoint es 1 línea en el switch + 8 líneas de
función. Fácil de restaurar.

PENDIENTE:
  - Replicar el mismo header en el GAS de staging.
  - Agregar campo "entorno: 'staging'" al SISTEMA del staging.

═══════════════════════════════════════════════════
CHANCE LOG — 15/09/2026 — STAGING ARMADO
═══════════════════════════════════════════════════

## SESIÓN ÚNICA — STAGING COMPLETO

QUÉ: Se armó el STAGING completo del VAO POS MULTIHOJA.

POR QUÉ: Para tener un ambiente de pruebas separado de producción.
Aunque todavía no hay clientes reales, conviene tener el hábito y el
sistema listo para cuando los haya.

CÓMO:
1. Planilla: Copia de SmartPOS_VAO_Sistemas_Planilla_Staging
   - Cuenta: victoralvarezoejeda@gmail.com
   - Copia exacta de producción (datos + estructura).
2. Repo GitHub: vitocoo/SmartPOS-VAO-Sistemas-STAGING
   - Público.
   - Mismos archivos que producción (index, pos, admin, reportes).
   - Copia de docs/.
3. Vercel: https://vao-pos-staging.vercel.app/
   - Deploy desde el repo de staging.
   - Auto-deploy al hacer push.
4. GAS:
   https://script.google.com/macros/s/AKfycbx_JUJEZnu1r_zFkVZ7EL9kQj8l0G5brldf1Oo9tWrokUWDiyQUH91OpCx4rWmsv-G4/exec
   - Vinculado a la planilla de staging.
   - Todavía con el código viejo (falta pegar el archivo completo).

DÓNDE:
  - Planilla: Copia de SmartPOS_VAO_Sistemas_Planilla_Staging
  - Repo: vitocoo/SmartPOS-VAO-Sistemas-STAGING
  - Vercel: vao-pos-staging.vercel.app
  - GAS: AKfycbx_JUJEZnu1r...

PROBLEMA QUE EVITA O RESUELVE:
  - Poder probar cambios sin tocar producción.
  - Construir el hábito de staging → producción.

SI SE ROMPE: El staging es desechable. Se puede recrear desde cero.

PENDIENTE:
  - Pegar el archivo completo de Lito en el GAS de staging.
  - Deploy nueva versión con el header de STAGING + getInfo.
  - Probar `?action=getInfo` → debe decir `entorno: 'staging'`.
  - Probar `?action=getProductos&prefijo=XX`.
  - Probar `vao-pos-staging.vercel.app`.

═══════════════════════════════════════════════════
CHANCE LOG — 16/09/2026 — ACTUALIZACIÓN DOCUMENTAL
═══════════════════════════════════════════════════

## SESIÓN ÚNICA — ACTUALIZACIÓN DE DOCUMENTOS

QUÉ: Sesión de orden. Se revisaron y actualizaron los documentos
del proyecto (CLAUDE.md, CHANCE_LOG.md, PROMPT_MAESTRO.md,
REGLAS_GUIAS.md).

POR QUÉ: El CHANCE_LOG estaba desactualizado (llegaba hasta 12/09).
Faltaba documentar las sesiones del 13, 14 y 15. Además, los
documentos no reflejaban:
  - El staging armado.
  - Las guías de desarrollo (Alma, Lito, ElAlmacenCopihue).
  - El rol de DeepSeek como secretario técnico.
  - Las 3 funciones nuevas (respuestaJSON, _parseNumeroFlexible,
    _esActivoFlag_).

CÓMO:
1. CLAUDE.md: agregadas:
   - Regla Número 1 (NO ROMPER LO QUE YA FUNCIONA)
   - Regla de Staging → Producción
   - Modo Pañales / Modo Profesional
   - Roles del equipo
   - Chance Log completo (estructura)
2. CHANCE_LOG.md: agregadas las sesiones 13, 14, 15, 16.
3. PROMPT_MAESTRO.md: actualizado con los 3 proyectos y roles.
4. REGLAS_GUIAS.md: creado (reglas para Alma, Lito, ElAlmacenCopihue).

DÓNDE:
  - CLAUDE.md (raíz del repo)
  - docs/CHANCE_LOG.md
  - docs/PROMPT_MAESTRO.md
  - docs/REGLAS_GUIAS.md

PROBLEMA QUE EVITA O RESUELVE:
  - Perder contexto al retomar sesiones.
  - Cada IA nueva con información distinta.
  - No saber qué pasó en los días 13, 14, 15.

PENDIENTE:
  - Pegar el archivo de Lito en el GAS de staging.
  - Deploy del staging con el header + getInfo.
  - Integrar las 3 funciones:
    - respuestaJSON (desarrollada por Alma)
    - _parseNumeroFlexible (desarrollada por ElAlmacenCopihue)
    - _esActivoFlag_ (desarrollada por Lito)
  - Probar el staging completo.
  - Promover a producción lo que esté confirmado.

═══════════════════════════════════════════════════
PROBLEMAS ABIERTOS AL CIERRE DEL DÍA (16/09/2026)
═══════════════════════════════════════════════════

1. **PIN con doble fuente** (heredado del 12/09)
   Vive en Properties (PIN_XX) Y en CONFIG_XX (campo PIN).
   Unificar a futuro.

2. **Botón-ícono del header (🏠)** (heredado del 12/09)
   Unificar con el botón "Salir".

3. **Paleta oficial sin definir** (heredado del 12/09)
   Brand Book vs Manual tienen paletas distintas.

4. **SVG oficial del símbolo sin conseguir** (heredado del 12/09)

5. **Avatares por iniciales vs Manual de Identidad** (heredado del 12/09)

6. **Google Fonts faltantes en index v008** (heredado del 12/09)

7. **Toolbar dinámica según packs** (heredado del 12/09)

8. **GAS de staging sin actualizar** (nuevo del 15/09)
   Falta pegar el archivo completo con header + getInfo.

9. **3 funciones nuevas pendientes de integrar** (nuevo del 13-15/09)
   respuestaJSON, _parseNumeroFlexible, _esActivoFlag_

═══════════════════════════════════════════════════
PRÓXIMO PASO (al retomar 16-17/09)
═══════════════════════════════════════════════════

**PASO 1 — Terminar el staging**

1. Pegar el archivo completo en el GAS de staging.
2. Deploy nueva versión con header + getInfo.
3. Probar `?action=getInfo` → debe decir `entorno: 'staging'`.
4. Probar `?action=getProductos&prefijo=XX`.
5. Probar `vao-pos-staging.vercel.app`.

**PASO 2 — Integrar las 3 funciones nuevas**

1. Pasar las 3 funciones aprobadas a DeepSeek.
2. DeepSeek arma instrucciones para Claude.
3. Claude integra al núcleo del staging.
4. Probar.
5. Si anda → promover a producción.

**PASO 3 — Volver al Plan original (12/09)**

Después del staging:
- Toolbar dinámica según packs.
- Unificar PIN.
- Botón 🏠.
- etc.

═══════════════════════════════════════════════════
FIN DEL CHANCE LOG
═══════════════════════════════════════════════════