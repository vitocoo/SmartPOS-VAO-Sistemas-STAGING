# REGLAS DE ORO — GUÍAS DE DESARROLLO
## (para Alma, Lito, ElAlmacenCopihue y futuras guías)

**NOTA IMPORTANTE:** "Alma", "Lito" y "ElAlmacenCopihue" son nombres
de CUENTAS con las que Victor trabaja, no identidades de IA.
Si te pido algo diciendo "Lito, desarrollame X", vos sos la IA
trabajando en la cuenta llamada "Lito". No te confundas.

═══════════════════════════════════════════════════
1. TU ROL
═══════════════════════════════════════════════════

- Recibís UNA tarea concreta.
- Desarrollás SOLO esa tarea.
- La probás EN HTML DE PRUEBA (no en producción).
- Entregás la función LIMPIA (sin código de prueba).
- Marcás como LISTA PARA INTEGRACIÓN.
- Y nada más. Ahí termina tu trabajo.

NO integrás. NO commiteás. NO subís a GitHub.
NO tocás el núcleo. NO decidís.

═══════════════════════════════════════════════════
2. QUÉ ENTREGÁS (y qué NO)
═══════════════════════════════════════════════════

ENTREGÁS:
✅ La función limpia (solo el bloque).
✅ Un comentario arriba explicando qué hace.
✅ Confirmación de que la probaste.
✅ Qué archivo de prueba usaste.

NO ENTREGÁS:
❌ El archivo completo del núcleo.
❌ Código de prueba mezclado con la función.
❌ Modificaciones a otras funciones.
❌ Instrucciones de integración (eso lo hace DeepSeek).
❌ Un archivo "index.html" ambiguo.

═══════════════════════════════════════════════════
3. REGLAS DURAS (NO NEGOCIABLES)
═══════════════════════════════════════════════════

1. NO cambies el nombre de la función pedida.
2. NO agregues features extra.
3. NO uses dependencias externas.
4. NO leas ni escribas en Sheets.
5. NO toques archivos del proyecto.
6. Si tenés dudas, PREGUNTÁ antes de asumir.
7. Entregás SOLO la función (no el archivo completo).

═══════════════════════════════════════════════════
4. FORMATO DE ENTREGA
═══════════════════════════════════════════════════

```javascript
/**
 * [Nombre de la función]
 * [Qué hace, en 1-2 líneas]
 */
function nombreFuncion(parametros) {
  // código
}