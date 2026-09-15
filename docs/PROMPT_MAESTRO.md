# PROMPT MAESTRO — REGLAS DE ORO DE ESTA APP

Quiero que trabajes sobre esta APP respetando estrictamente las siguientes **REGLAS DE ORO**.

Estas reglas son un **CONTRATO DE DESARROLLO**, no sugerencias.

Antes de modificar cualquier código debes leerlas y aplicarlas.
**No tienes autorización para modificar, reorganizar, eliminar, modernizar ni "mejorar" partes de la APP que no formen parte de la solicitud específica.**

## REGLAS DE ORO

### 1. CONTROL DE VERSIÓN

La APP tiene una única constante `APP_VERSION`, ubicada cerca del principio del script.

- Cada nueva salida incrementa `APP_VERSION` en +1 entero.
- Solo se utilizan números enteros consecutivos.
- Nunca `v1.2`, `v1.2.x`, `1a`, `1b`, etc.
- `APP_VERSION` es la única fuente de verdad.
- `<title>` y badge del header deben obtener la versión desde `APP_VERSION`.
- Nunca hardcodear versiones en otros lugares.
- Cada archivo del ecosistema (ver Regla 13) tiene su PROPIO `APP_VERSION` independiente — no comparten numeración entre sí.

### 2. ARCHIVOS DE SALIDA

Siempre debes entregar DOS archivos con **exactamente el mismo contenido**, cambia solo el nombre:

- **`index.html`** → archivo limpio, con el nombre real que va a Vercel/GitHub. Listo para subir y reemplazar directamente.
- **`[nombre-interno]_v[N]_backup.html`** → mismo contenido exacto, pero con el nombre de trabajo interno del archivo (el que usamos para hablar de él en la conversación, ej. `pos_naturaleza_ilustrada`) + la versión (`APP_VERSION`) en el nombre.

Ejemplo concreto para el POS en la versión 441:

- `index.html`
- `pos_naturaleza_ilustrada_v441_backup.html`

**Importante:** `index.html` NO es un nombre genérico de ejemplo — es el nombre real y literal que hay que usar siempre para el archivo que se sube a producción, sin importar cómo le digamos al archivo en la charla. El nombre con versión es solo para el backup/historial.

Si un archivo del ecosistema NO se deploya como `index.html` (por ejemplo, páginas secundarias como `naturaleza-ilustrada-finanzas.html`), el archivo limpio conserva su nombre real de producción, y el backup agrega `_v[N]_backup` de la misma forma.

### 3. NUNCA SALIR DE LA PÁGINA SIN CONFIRMACIÓN

La APP nunca debe abandonar la página sin preguntar al usuario.

Esto incluye:

- botón Atrás de la APP;
- botón Atrás del navegador;
- botón físico/software de atrás del teléfono;
- gesto swipe-back;
- links internos;
- botones que naveguen a otra página;
- cualquier otra navegación que abandone la página.

Debe utilizarse el mismo sistema de confirmación.

Cuando corresponda, utilizar `history`, `popstate` y mecanismos equivalentes.

La implementación no debe provocar bucles ni romper modales, formularios o navegación legítima.

### 4. EDICIONES DEL USUARIO = ICONO DE GUARDADO

Cuando el usuario modifique cualquier dato:

- el indicador de guardar debe cambiar al clásico icono de disquete 💾;
- debe quedar claro que existen cambios pendientes;
- después del guardado definitivo debe volver al estado correspondiente.

### 5. NO VOLVER A PREGUNTAR POR ESTAS REGLAS

No vuelvas a preguntarme cómo:

- numerar versiones;
- nombrar archivos;
- generar backups;
- entregar la APP;
- modularizar (ver Regla 13).

Estas reglas deben aplicarse automáticamente en cada versión.

### 6. EL DESPLAZAMIENTO VERTICAL NUNCA RECARGA LA PÁGINA

Desplazarse verticalmente jamás debe provocar una recarga.

Debe impedirse especialmente el `pull-to-refresh` del navegador móvil.

Deslizar hacia abajo estando arriba de la página NO significa "recargar".

El refresco de datos debe realizarse mediante herramientas/botones explícitos.

Utilizar, cuando corresponda, soluciones como:

`overscroll-behavior-y: contain`

o una solución equivalente compatible.

### 7. NO RECARGAR PÁGINAS QUE CARGAN DATOS POR DETALLES DE INTERFAZ

Una interacción visual, desplazamiento o cambio menor no debe volver a cargar todos los datos desde el servidor.

Evitar solicitudes y recargas innecesarias.

La actualización de datos debe realizarse mediante herramientas explícitas de refresco — y debe existir **un único** botón/acción de refresco por pantalla, no varios que hagan lo mismo con distinto nombre (ver Regla 13).

### 8. MENSAJES DEL SISTEMA

Prioridad de ubicación:

1. Centrados.
2. Si no es posible → abajo a la izquierda.
3. Si tapa información → arriba a la derecha.

Nunca colocar mensajes de forma que bloqueen información o controles importantes.

### 9. EL USUARIO SIEMPRE DEBE PODER DESPLAZARSE

Ningún contenedor, modal, panel, overlay, tarjeta, tabla o elemento flotante debe impedir accidentalmente el desplazamiento vertical.

Revisar especialmente:

- `overflow`;
- `height`;
- `max-height`;
- `fixed`;
- `absolute`;
- overlays;
- contenedores con scroll anidado.

### 10. COLORES SEMÁNTICOS

- Verde = éxito, operación positiva, guardado correcto.
- Rojo = error, rechazo, problema o advertencia crítica.

### 11. LA LISTA PRINCIPAL DE PRODUCTOS TIENE PRIORIDAD DE ESPACIO

Cuando una pantalla tenga una lista principal de productos:

**la lista de productos debe recibir la máxima prioridad de espacio y visibilidad.**

Todo contenido secundario que venga abierto, desplegado, expandido o visible desde el arranque debe aparecer **colapsado o comprimido por defecto**, siempre que no sea necesario mantenerlo visible para el funcionamiento.

No reducir innecesariamente el tamaño o legibilidad de los productos para hacer entrar contenido secundario.

Primero:

1. Colapsar contenido secundario.
2. Comprimir elementos secundarios.
3. Reducir espacios innecesarios.
4. Optimizar la distribución.

"Colapsar" NO significa eliminar ni ocultar permanentemente.

La información debe seguir disponible para expandirse cuando el usuario la necesite.

### 12. PROTECCIÓN AUTOMÁTICA DE LAS EDICIONES

Cuando el usuario esté editando información:

**cada modificación relevante debe respaldarse automáticamente en `localStorage` o mecanismo local equivalente.**

El objetivo es evitar perder trabajo si:

- sale accidentalmente;
- cierra la pestaña;
- recarga;
- pierde conexión;
- cambia de página;
- cierra el navegador;
- la APP se reinicia.

El respaldo debe contener suficiente información para reconstruir la edición, normalmente mediante JSON.

Al volver a abrir la APP:

1. Detectar si existe una edición pendiente.
2. Compararla con el estado guardado definitivo cuando sea posible.
3. Avisar al usuario.
4. Permitir recuperar o descartar.
5. Nunca sobrescribir silenciosamente el trabajo del usuario.

Cuando el guardado definitivo sea exitoso, eliminar o marcar como guardado el respaldo temporal.

Para rendimiento puedes utilizar `debounce`; no es necesario escribir literalmente en `localStorage` en cada pulsación.

**💾 Guardar = almacenamiento definitivo.**

**🛡️ localStorage = salvavidas automático de la edición.**

### 13. MODULARIZAR: ARCHIVOS LIVIANOS EN VEZ DE UNO GIGANTE

El POS principal (`index.html`) es el núcleo del día a día: vender, cobrar, fiar, ingresar mercadería. Todo lo demás — herramientas administrativas, reportes, features secundarias u opcionales — debe vivir en **páginas HTML independientes**, accesibles desde el cajón de Herramientas, no embebido dentro del archivo principal.

- Antes de agregar una feature nueva al `index.html`, preguntarte: **¿esto es parte del flujo de venta del día a día, o es una herramienta administrativa/secundaria?** Si es lo segundo, va en su propia página.
- Features heredadas del código original (seba21) que sean administrativas u opcionales (ej: raspaditas, tragamonedas, flyers promocionales) se migran a páginas propias en vez de mantenerse embebidas, aunque ya estuvieran ahí antes.
- Cada página independiente sigue las mismas Reglas de Oro (su propio `APP_VERSION`, su propio par de archivos de salida, confirmación de salida, etc.) como si fuera una mini-app aparte.
- Esto no es una reescritura completa de una sola vez: se hace de a una feature por vez, cuando se pide explícitamente sacarla del archivo principal — no reorganizar todo preventivamente sin que se pida (sigue aplicando la Regla Más Importante de abajo).
- Un único índice/dashboard en Herramientas debe listar y enlazar todas estas páginas independientes, para que no queden sueltas o difíciles de encontrar.

---

# 🛑 REGLA MÁS IMPORTANTE: NO ROMPER LO QUE YA FUNCIONA

Antes de modificar código:

1. Analiza primero el código existente.
2. Identifica qué funciona actualmente.
3. Identifica exactamente qué parte necesita modificación.
4. Modifica únicamente lo necesario.
5. Conserva todo comportamiento existente que no haya sido solicitado cambiar.
6. No reorganices código funcional por gusto.
7. No elimines funciones porque parezcan innecesarias.
8. No cambies nombres, estructuras, estilos o flujos sin necesidad.
9. No agregues dependencias innecesarias.
10. No reemplaces una solución funcional solamente porque exista una solución más moderna.

**Una solicitud de cambio NO es autorización para modificar el resto de la APP.**

## PRINCIPIO DE TRABAJO

> **PRIMERO PRESERVAR.
> DESPUÉS MODIFICAR.
> NUNCA MODIFICAR POR MODIFICAR.**

La APP existente es la fuente de verdad sobre su comportamiento.

Si tienes una duda entre:

**A) cambiar algo que no fue solicitado**

o

**B) conservarlo**

elige siempre:

**B) CONSERVARLO.**

Si una modificación puede afectar una Regla de Oro, debes advertírmelo antes de realizarla.

---

# PRIORIDAD

Si existe conflicto:

1. Solicitud explícita del usuario.
2. Reglas de Oro.
3. Comportamiento funcional existente.
4. Sugerencias o mejoras técnicas de la IA.

Una "mejora técnica" nunca justifica romper una Regla de Oro o alterar una función existente que no fue solicitada.

---

# FORMA DE TRABAJO

Antes de tocar el código, dime brevemente:

1. Qué entendiste que debo modificar.
2. Qué archivos/funciones vas a tocar.
3. Qué comportamiento existente vas a preservar.
4. Si detectas algún riesgo de afectar una Regla de Oro.

Después realiza la modificación.

**No hagas cambios adicionales fuera del alcance solicitado.**