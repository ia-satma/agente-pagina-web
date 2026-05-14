# Brief de cliente — plantilla

Copia este directorio entero a `briefs/<slug-cliente>/` y rellena los 11 archivos del `knowledge-base/` con la investigación 360° de la marca.

**Slug:** kebab-case sin acentos. Ejemplos: `clinica-vital`, `tequila-don-fulano`, `jabalina-mx`.

## Estructura

```
briefs/<slug>/
├── knowledge-base/
│   ├── 01-overview.md
│   ├── 02-servicios.md
│   ├── 03-industrias.md
│   ├── 04-casos-exito.md
│   ├── 05-equipo.md
│   ├── 06-proceso.md
│   ├── 07-diferenciador.md
│   ├── 08-faq.md
│   ├── 09-contacto-y-comercial.md
│   ├── 10-tono-y-cultura.md
│   └── README.md
├── brief.md            # resumen ejecutivo + pedido (1 página)
├── assets/             # logos, fotos, brand assets que ya tenga el cliente
└── web-actual/         # si tiene página actual: screenshots + URL
```

## Reglas

- **Cada archivo del knowledge-base debe contener hechos verificables**, no marketing inflado.
- Si falta info, marcar como `[FALTA: <pregunta concreta>]`. El `brand-researcher` los completará o pedirá al usuario.
- Para clientes en México: incluir RFC, dirección fiscal, ciudades de operación.
- Mantener en español. Si el sitio será bilingüe, indicarlo en `brief.md`.

## Cómo invocar el pipeline

Dentro de `AGENTE PAGINA WEB/`:

```
> Genera la página web para <slug-cliente> usando stack <next|astro|html>
```
