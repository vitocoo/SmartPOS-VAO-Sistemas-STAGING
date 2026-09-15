# CONFIG_XX — ESTRUCTURA

Hoja por cliente. Guarda TODA la configuración del cliente.
El cliente NUNCA la ve. Solo el GAS la lee/escribe.

## IDENTIDAD
| Campo | Ejemplo |
|---|---|
| title | Catalogo - Almacén Copihue |
| slogan | Productos de calidad con la confianza de siempre |
| nombre_empresa | Almacén Copihue |
| telefono | 5492944907380 |
| direccion | Copihue 457 |
| email | javierojedabariloche@gmail.com |
| ciudad | Bariloche |
| descripcion | Ventas articulos de almacen, limpieza y tecnologia |
| logo_url | logo-copihue.png |
| url_sitio | almacen-copihue.vercel.app |

## APARIENCIA
| Campo | Valores |
|---|---|
| tema_actual | T1 / T2 / T3 / T4 |
| color_primario | hex (pinta también el avatar) |
| color_secundario | hex |
| color_acento | hex |

**Validación de contraste:** mínimo WCAG AA 4.5:1. Si falla, no se guarda.

**Avatar por iniciales:** toma `color_primario`. Si no hay, usa el automático por iniciales.

## PAGOS
| Campo | Ejemplo |
|---|---|
| alias_transferencia | pago.copihue |
| qr_pago | (imagen o texto) |

## WIFI
| Campo | Ejemplo |
|---|---|
| wifi_ssid | (opcional) |
| wifi_clave | (opcional) |
| qr_wifi | (opcional) |

## RECIEN LLEGADOS
| Campo | Valor | Descripción |
|---|---|---|
| RECIEN_LLEGADOS_PRECIO_MIN | 2000 | menor a este precio no se muestran |
| RECIEN_LLEGADOS_LIMITE | 60 | límite de productos a mostrar |
| RECIEN_LLEGADOS_DIAS | 15 | ingresados últimos X días |

## SEGURIDAD
| Campo | Valor |
|---|---|
| PIN | 6 dígitos (solo números) |
| sesion_dias | 7 |
| intentos_max | 3 |

## MÓDULOS (TRUE/FALSE)

### Base (siempre TRUE, no se apaga)
- ventas
- cobrar
- ticket_wa
- buscador

### Pack 1 — Operación básica
- pack1_ingreso
- pack1_hoy
- pack1_recargar
- pack1_notificaciones
- pack1_info

### Pack 2 — Inventario avanzado
- pack2_editor_stock
- pack2_reportes

### Pack 3 — Catálogo y finanzas
- pack3_editor_categoria
- pack3_editor_nombre
- pack3_finanzas

### Pack Extra (individuales)
- extra_horarios (requiere CONF_DIARIA_XX)
- extra_ultimas_unidades
- extra_prestamos
- extra_retiro_caja
- extra_retiro_local
- extra_fiados
- extra_lista_compras
- extra_generador_flyer
- extra_config_ofertas
- extra_carga_foto
- extra_herramientas
- extra_raspadita
- extra_tragamonedas

**Regla:** si un módulo está en FALSE → ni el botón en el frontend ni el endpoint en el GAS existen.