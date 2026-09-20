# VAO POS — FINAL

**Versión: Code.gs v012 · pos.html v9 · admin.html v5 · reportes.html v5 · index.html v8**
**Generado: 20/09/2026**

Sistema de punto de venta multi-cliente (multihoja). Este paquete es para **staging**.

## ⚠️ Configuración inicial obligatoria antes de producción
El código ya **no tiene ninguna contraseña**. Antes de usar el sistema, desde el editor de Apps Script tenés que correr una vez, a mano:
```
setAdminClave('TU_CLAVE_REAL_ACA')
```
reemplazando por tu contraseña real (mínimo 8 caracteres). Se guarda hasheada en Script Properties — nunca queda en el código. Ver el punto 0 de `CHECKLIST_PRUEBA.md` para el resto de la configuración inicial.

## Qué incluye

- `Code.gs` — backend completo (Apps Script)
- `index.html`, `pos.html`, `admin.html`, `reportes.html` — frontend
- `SmartPOS_VAO_Sistemas_Planilla_Staging_FINAL.xlsx` — planilla con toda la estructura de hojas ya creada para los clientes existentes (XX, LP), incluye `PLANES_VAO`
- `CAMBIOS.md` — cambios de esta entrega y de las anteriores
- `CHECKLIST_PRUEBA.md` — qué probar a mano antes de dar esto por cerrado

## Instalación

1. **Planilla**: subí `SmartPOS_VAO_Sistemas_Planilla_Staging_FINAL.xlsx` a Google Drive y abrila como Google Sheets (o importá su contenido a tu planilla de staging existente, hoja por hoja, si preferís no reemplazarla entera).
2. **Apps Script**: `Extensiones → Apps Script` en esa planilla. Reemplazá todo el contenido del archivo `.gs` existente por el contenido completo de `Code.gs`. Guardá.
3. **Deploy**: `Implementar → Nueva implementación → Aplicación web`. Ejecutar como "Yo", acceso "Cualquier usuario". Copiá la URL que te da.
4. Si la URL cambió respecto a la anterior, actualizá `API_URL` en `index.html`, `pos.html`, `admin.html` y `reportes.html` (buscá la constante `API_URL` en cada uno).
5. Subí los 4 HTML donde estés sirviendo el sitio (el mismo lugar donde ya tenías el staging).

## Planes de suscripción

La hoja `PLANES_VAO` (Plan / Campo / Valor) define qué incluye cada plan. Vienen 3 de ejemplo (`PRUEBA`, `BASICO`, `PRO`). Para agregar o cambiar un plan, se edita esa hoja directamente — no hace falta tocar código. Desde `admin.html`, cada cliente tiene un selector de plan + botón "Aplicar" que copia esos campos a su `CONFIG_XX`.

## Después de instalar — correr UNA vez a mano

Desde el editor de Apps Script, seleccioná y ejecutá la función:

```
migrarHojasFaltantes()
```

Esto verifica que todos los clientes existentes tengan las hojas nuevas (Historial, Fiados, Préstamos, Caja, Caja_Movimientos, Salidas, Ajuste_Rápido). Es idempotente — no rompe nada si ya están (la planilla que te entrego ya las trae creadas para XX y LP, así que esto es solo un resguardo si preferís reconstruir la planilla desde cero en vez de usar la que te dejo).

## Activar módulos por cliente

Cada cliente tiene su propia hoja `CONFIG_XX`. Ahí, cambiando `FALSE` por `TRUE` en la columna `valor`, activás/desactivás por cliente (sin tocar código):

| Campo | Módulo |
|---|---|
| `extra_fiados` | Fiados |
| `extra_prestamos` | Préstamos |
| `extra_caja` | Caja + movimientos de caja |
| `extra_salidas` | Salidas (merma/consumo) |
| `extra_historial` | Historial de ingresos (visible desde Reportes) |
| `extra_config_ofertas` | Ofertas completas: Relámpago, Destacadas, Especiales, Personalizada, Simple, Últimas Unidades, Recién Llegados, Día Temático, y Multicompra — todo en la pestaña "🏷️ Ofertas" del POS y en Reportes |

Ningún módulo se activa solo porque el código exista — el flag de `CONFIG_XX` manda, y además el backend vuelve a chequear ese mismo flag en cada llamada (no solo el HTML esconde el botón).

## Configurar ofertas por producto

Se editan directamente en `INVENTARIO_XX` (mismo criterio que Multicompra): columnas `RELAMPAGO` (1/0), `DESTACADA` (1/0), `ESPECIAL_PRECIO`, `PERSONALIZADA_TIPO` (1 a 6 = 10% a 60% off), `OFERTA_SIMPLE_PRECIO`. Los límites, horarios y el "día temático" (generalización de cosas como "jueves de cerveza") se configuran en `CONFIG_XX`, campos que empiezan con `ofertas_`.

## Qué NO está incluido todavía

- UI dentro de `pos.html`/`admin.html` para tocar los flags de oferta por producto sin entrar a la planilla (hoy se editan en `INVENTARIO_XX` directamente, igual que Multicompra).
- No probé esto en tu Apps Script real — ver checklist.
