# Publicación de Neural Arcade

## 1. Verificación previa

Desde la raíz del proyecto:

```bash
bun install --frozen-lockfile
bun run check
```

La entrega no debe publicarse si cualquiera de esas comprobaciones falla.

El comando también exige una cobertura global mínima del 80%. En GitHub, CI y CodeQL se ejecutan automáticamente al abrir un pull request o actualizar `main`.

## 2. Despliegue recomendado: Vercel

1. Entra a Vercel con la cuenta de GitHub que puede leer `ocazare2/Neural-Arcade`.
2. Selecciona **Add New → Project**, importa el repositorio y deja el framework en **Next.js**.
3. Usa Node.js 24.x. Vercel detectará Bun por `bun.lock`.
4. Configura las variables descritas abajo.
5. Despliega primero en Preview; cuando las verificaciones sean correctas, promueve a Production.

No configures manualmente el directorio de salida: Next.js/Vercel administra `.next`.

## 3. Variables

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Con dominio propio | URL canónica sin barra final, por ejemplo `https://arcade.example.com`. |
| `UPSTASH_REDIS_REST_URL` | No | URL REST de una base Upstash Redis. Recomendada si hay varias instancias. |
| `UPSTASH_REDIS_REST_TOKEN` | No | Token REST correspondiente. Debe guardarse como secreto. |

Vercel expone `VERCEL_PROJECT_PRODUCTION_URL`; la aplicación lo usa como URL canónica cuando `NEXT_PUBLIC_SITE_URL` no está definida.

## 4. Comprobación posterior

Sustituye `https://tu-dominio.example` por la URL final:

```bash
curl -I https://tu-dominio.example/
curl -i https://tu-dominio.example/api
curl -I https://tu-dominio.example/manifest.json
curl -I https://tu-dominio.example/robots.txt
curl -I https://tu-dominio.example/sitemap.xml
```

Comprueba:

- portada con HTTP 200 y sin errores visibles;
- `/api` con HTTP 200 y cabeceras `X-RateLimit-*`;
- manifest, iconos, service worker, robots y sitemap accesibles;
- cabeceras CSP, `X-Content-Type-Options`, `X-Frame-Options` y `Referrer-Policy`;
- instalación PWA desde un navegador móvil o una ventana privada;
- progreso, reinicio, selector ES/EN, música tras la primera interacción y navegación por niveles;
- definiciones del glosario completamente visibles a 320 px de ancho.

## 5. Dominio e indexación

1. Agrega el dominio en **Vercel → Project → Settings → Domains**.
2. Configura en el proveedor DNS los registros que indique Vercel.
3. Define `NEXT_PUBLIC_SITE_URL` con el dominio definitivo y vuelve a desplegar.
4. Abre [Google Search Console](https://search.google.com/search-console), verifica la propiedad del dominio y envía `https://tu-dominio.example/sitemap.xml`.
5. Opcionalmente registra el sitio en [Bing Webmaster Tools](https://www.bing.com/webmasters/).
6. Usa la inspección de URL para solicitar la indexación de la portada.

La indexación no es instantánea y depende del buscador; el proyecto solo puede dejar preparados los recursos técnicos.

## 6. Rate limiting

La ruta `/api` permite 100 solicitudes por minuto y cliente.

- Con Upstash: ventana fija distribuida usando una clave distinta por intervalo.
- Sin Upstash: contador en memoria acotado a 10 000 clientes por instancia.
- Si Upstash no responde, se usa el limiter local para mantener disponible la aplicación.

No uses caché CDN para `/api`, ya que la respuesta contiene estado específico del cliente.

## 7. Servidor propio

El build usa `output: "standalone"`. También puede ejecutarse con:

```bash
bun run build
PORT=3000 bun run start
```

El `Caddyfile` incluido funciona como proxy fijo hacia `127.0.0.1:3000`. Define `DOMAIN` antes de iniciar Caddy. El servidor debe estar detrás de HTTPS y de un proxy que reemplace, no acepte ciegamente, las cabeceras de IP del cliente.

## 8. Reversión

Vercel conserva despliegues anteriores. Si una verificación falla, usa **Deployments → … → Promote to Production** sobre la última versión estable y abre una incidencia antes de reintentar.
