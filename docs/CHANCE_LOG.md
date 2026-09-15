# CHANCE LOG — VAO POS / SmartPOS

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

QUÉ: se agregaron las reglas 24-29 al CLAUDE.md y se creó
docs/SEGURIDAD.md.

POR QUÉ: se detectó una brecha real — getConfig devolvía datos
sin validar token. Se documentó la regla para que no vuelva a
pasar en ninguna app VAO.

CÓMO: bloque "REGLAS DE SEGURIDAD EN ENDPOINTS" en CLAUDE.md.
Cadena obligatoria: prefijo → activo → token → token válido → no expirado.

DÓNDE:
  - CLAUDE.md (reglas 24-29)
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

POR QUÉ: reglas 24-29 (CLAUDE.md): ningún endpoint que devuelve datos
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

---

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

---

## PRÓXIMO PASO (al retomar)

**PASO 1 — Toolbar dinámica según packs**

pos.html ya lee getConfig al cargar (para validar sesión).
Ahora:
- Guardar esa config en memoria.
- Generar los botones de la toolbar según los TRUE/FALSE.
- Ocultar Ingresar / Ajustar / Hoy / Reportes / Salir según packs.

Al terminar: Chance Log del día.

═══════════════════════════════════════════════════
FIN DE LAS SESIONES — 11-12/09/2026
═══════════════════════════════════════════════════