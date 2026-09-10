Sí. Te lo dejo como una **especificación técnica completa para que se la pases directamente a tu agente de IA** y pueda trabajar sobre la plantilla XML, CSS, HTML y páginas de Blogger sin tener que interpretar demasiado.

La prioridad no es “hacer el blog más bonito” solamente. El objetivo es que **Creando-Historias parezca una publicación editorial terminada, coherente, fácil de navegar, transparente y preparada para una nueva revisión de AdSense**.

# Especificación para mejorar Creando-Historias en Blogger

## 0. Objetivo general del rediseño

Trabajar sobre:

`https://www.creando-historias.com/`

La web principal debe quedar claramente definida como una publicación de:

> **Relatos originales, ficción contemporánea y entretenimiento.**

La aplicación antigua debe permanecer separada en:

`https://app.creando-historias.com/`

No integrar contenido de `/stories/*` dentro del diseño actual de Blogger.

La web principal debe sentirse como **una revista digital**, no como el Blogger predeterminado con una lista de posts.

---

# FASE 1 — CRÍTICO ANTES DE REENVIAR ADSENSE

Estas tareas son prioridad P0. No reenviaría la solicitud de AdSense hasta terminarlas.

---

## TAREA 1 — Crear una navegación principal profesional

Actualmente las páginas importantes existen, pero deben formar parte visible de la navegación.

### Header recomendado

Crear un menú visible tanto en escritorio como en móvil:

```text
Creando-Historias

Inicio
Historias
Entretenimiento
Sobre Nosotros
Contacto
```

No meter Privacidad y Términos en el menú principal; esos van mejor en el footer.

### URLs

```text
Inicio
https://www.creando-historias.com/

Sobre Nosotros
https://www.creando-historias.com/p/sobre-nosotros.html

Contacto
https://www.creando-historias.com/p/contacto.html
```

Para **Historias** y **Entretenimiento**, utilizar etiquetas de Blogger.

Ejemplo:

```text
/search/label/Historias
/search/label/Entretenimiento
```

El agente debe comprobar cuáles son las etiquetas reales antes de construir los enlaces.

### Requisitos de UX

En escritorio:

* logo/nombre a la izquierda;
* navegación a la derecha;
* ancho máximo aproximado de 1100-1200px;
* header limpio;
* sin banners gigantes;
* sin exceso de elementos.

En móvil:

* logo;
* botón hamburguesa;
* menú desplegable;
* área táctil mínima razonable;
* sin enlaces amontonados.

### Criterio de aceptación

Desde cualquier entrada debe ser posible llegar a:

* Inicio;
* Sobre Nosotros;
* Contacto;

en **máximo 1 clic**.

---

# TAREA 2 — Crear un footer editorial completo

Esta es una de las mejoras más importantes.

El footer debe aparecer en:

* portada;
* entradas;
* páginas estáticas;
* páginas de etiquetas;
* resultados de búsqueda;
* páginas 404 cuando sea técnicamente posible.

### Estructura recomendada

```text
CREANDO-HISTORIAS

Relatos originales, ficción y entretenimiento.

Explorar
- Inicio
- Historias
- Entretenimiento
- Sobre Nosotros

Información
- Contacto
- Política de Privacidad
- Política de Cookies
- Términos y Condiciones

© 2026 Creando-Historias. Todos los derechos reservados.
```

### Enlaces legales

```text
/p/sobre-nosotros.html
/p/contacto.html
/p/politica-de-privacidad.html
/p/politica-de-cookies.html
/p/terminos-y-condiciones.html
```

Hay que crear Política de Cookies si todavía no existe.

### Importante

No dejar como único footer:

> Con tecnología de Blogger

Puede permanecer el crédito de Blogger si se desea, pero no debe ser prácticamente el único elemento del pie.

---

# TAREA 3 — Crear la página Política de Cookies

Crear:

```text
/p/politica-de-cookies.html
```

Debe explicar:

* qué son las cookies;
* cookies necesarias;
* cookies analíticas;
* cookies publicitarias;
* servicios de terceros;
* Google;
* posibilidad futura/presente de Google AdSense;
* cómo gestionar cookies desde el navegador;
* cómo retirar consentimiento cuando corresponda;
* enlace a Política de Privacidad;
* enlace a Contacto.

No copiar textos legales aleatorios palabra por palabra de otras webs.

---

# TAREA 4 — Mejorar Política de Privacidad

La página actual sirve como base, pero hay que reforzarla.

Debe tener como mínimo estas secciones:

```text
1. Responsable del sitio
2. Información que recopilamos
3. Formularios de contacto
4. Datos técnicos y navegación
5. Cookies
6. Servicios de terceros
7. Google y publicidad
8. Google AdSense
9. Analítica
10. Derechos de los usuarios
11. Enlaces externos
12. Conservación de datos
13. Cambios en esta política
14. Contacto
```

### Cambiar afirmaciones demasiado absolutas

Evitar:

> recopilamos información de forma anónima

porque algunos identificadores técnicos no deberían describirse universalmente como anónimos.

Preferir:

> Durante la navegación pueden recopilarse automáticamente determinados datos técnicos y de uso, como información del navegador, dispositivo, páginas visitadas, dirección IP, cookies y otros identificadores en línea.

### Texto relativo a AdSense

Utilizar una formulación futura/condicional mientras no esté aprobado:

> Creando-Historias puede utilizar servicios publicitarios de terceros, incluido Google AdSense. Cuando estos servicios se encuentren habilitados, Google y sus socios pueden utilizar cookies u otras tecnologías para mostrar y medir publicidad.

No escribir:

> Google AdSense muestra publicidad en nuestra web

si todavía no está aprobado y funcionando.

---

# TAREA 5 — Mejorar Términos y Condiciones

Cambiar también:

> Creando-Historias muestra anuncios de Google AdSense

por:

> Creando-Historias puede mostrar publicidad mediante servicios de terceros, incluido Google AdSense, cuando dichos servicios estén habilitados.

### Añadir una sección específica de ficción

Muy importante.

Texto recomendado:

> **Contenido de ficción**
>
> Creando-Historias publica relatos y obras narrativas creadas principalmente con fines de entretenimiento. Salvo que se indique expresamente lo contrario, los personajes, nombres, diálogos, situaciones y acontecimientos descritos en nuestros relatos pueden ser ficticios, estar dramatizados o haber sido modificados con fines narrativos. Cualquier semejanza con personas o acontecimientos reales puede ser coincidente.

El agente puede adaptar el texto al tono editorial, pero debe conservar el significado.

---

# TAREA 6 — Etiquetar claramente los relatos ficticios

Esta es una de las modificaciones editoriales que más recomiendo.

Cada historia ficticia debe mostrar debajo del título algo parecido a:

```text
RELATO DE FICCIÓN
8 min de lectura
```

Y debajo:

> Esta historia es una obra narrativa creada con fines de entretenimiento. Los personajes y acontecimientos descritos son ficticios o han sido dramatizados.

### Cómo automatizarlo en Blogger

Utilizar una etiqueta estándar para todas las historias:

```text
Ficción
```

o:

```text
Relato de ficción
```

Después, en el XML de Blogger, mostrar el aviso solamente cuando la entrada tenga dicha etiqueta.

Esquema conceptual:

```xml
<b:loop values='data:post.labels' var='label'>
  <b:if cond='data:label.name == "Ficción"'>
    <div class='fiction-disclaimer'>
      <span class='fiction-badge'>Relato de ficción</span>
      <p>
        Esta historia es una obra narrativa creada con fines
        de entretenimiento. Los personajes y acontecimientos
        son ficticios o han sido dramatizados.
      </p>
    </div>
  </b:if>
</b:loop>
```

El agente debe adaptar esta lógica a la estructura XML concreta del tema.

### Diseño

Badge discreto:

```text
RELATO DE FICCIÓN
```

No convertirlo en una enorme alerta roja.

Debe parecer una etiqueta editorial.

---

# TAREA 7 — Mostrar autor, fecha y tiempo de lectura

Cada entrada debe mostrar claramente:

```text
Por Mr. Nexo
8 de septiembre de 2026
8 min de lectura
```

o el nombre editorial que decidas utilizar.

### Debajo del artículo

Añadir una caja de autor.

Ejemplo:

```text
SOBRE EL AUTOR

Mr. Nexo

Autor y editor de Creando-Historias. Escribe sobre ficción,
relatos contemporáneos y entretenimiento.

Ver más publicaciones
```

No usar identidades o credenciales inventadas.

### Blogger

Aprovechar cuando sea posible:

```xml
<data:post.author.name/>
```

y los datos del autor disponibles en el tema.

Si Blogger no ofrece suficientes datos, crear un bloque editorial estático configurable.

---

# TAREA 8 — Mejorar la página Sobre Nosotros

Debe dejar mucho más claro quién publica y cuál es el proceso editorial.

Agregar secciones:

```text
Quiénes somos

Qué publicamos

Cómo trabajamos

Nuestro compromiso editorial

Relatos de ficción

Correcciones

Contacto
```

### Ejemplo de enfoque

> Creando-Historias es una publicación digital dedicada a relatos originales, ficción contemporánea y contenidos de entretenimiento.

Después:

> Los contenidos son revisados antes de su publicación con el objetivo de mejorar claridad, coherencia, presentación y calidad editorial.

Solo afirmar procesos que realmente se realicen.

### Añadir

Un enlace visible:

```text
¿Has encontrado un error?
Contacta con nosotros.
```

---

# TAREA 9 — Mejorar Contacto

La página actual tiene buena base.

Añadir debajo del formulario:

> Al enviar este formulario, utilizaremos los datos proporcionados únicamente para gestionar y responder tu consulta. Consulta nuestra Política de Privacidad.

“Política de Privacidad” debe ser un enlace.

### Añadir tipos de contacto

Por ejemplo:

```text
Correcciones editoriales
Derechos de autor
Problemas técnicos
Colaboraciones
Privacidad
Publicidad
Otros
```

Si el formulario permite selector de asunto, mejor.

---

# TAREA 10 — Eliminar enlaces rotos del tema

El agente debe recorrer TODO el XML y localizar:

```text
/stories/
/about
/privacy
/terms
/cookies
/contact
/author/
```

y cualquier URL perteneciente a la aplicación antigua.

### Regla

El Blogger principal no debe enlazar accidentalmente a:

```text
www.creando-historias.com/stories/...
```

La aplicación antigua ahora vive en:

```text
app.creando-historias.com
```

Si quieres enlazarla desde Blogger, debe hacerse explícitamente como:

```text
https://app.creando-historias.com/
```

pero no es necesario para AdSense y yo evitaría darle protagonismo en el menú principal.

---

# TAREA 11 — Crear una página 404 decente

No dejar una página de error vacía o genérica.

Diseño:

```text
404

Esta página ya no está disponible.

Es posible que el contenido haya sido movido o eliminado.

[Volver al inicio]
[Explorar historias]
```

Opcionalmente incluir 3 publicaciones recientes.

No redirigir automáticamente cualquier 404 a la portada.

---

# FASE 2 — REDISEÑO DE LAS ENTRADAS

## TAREA 12 — Crear una jerarquía visual editorial

Cada artículo debería seguir aproximadamente esta estructura:

```text
Categoría

Título

Subtítulo / entradilla

Autor · Fecha · Tiempo de lectura

[Imagen principal]

Aviso "Relato de ficción" cuando corresponda

Contenido

Contenido relacionado

Caja del autor

Artículos recomendados
```

---

# TAREA 13 — Mejorar el ancho del texto

El cuerpo de artículo no debería ocupar todo el monitor.

Recomendación:

```css
.post-body {
    max-width: 760px;
    margin: 0 auto;
    line-height: 1.75;
}
```

Ajustar al tema existente.

### Texto

Orientativamente:

```css
.post-body {
    font-size: 18px;
}
```

En móvil:

```css
@media (max-width: 768px) {
    .post-body {
        font-size: 17px;
        line-height: 1.7;
    }
}
```

No hace falta copiar literalmente esos valores si chocan con el diseño actual.

---

# TAREA 14 — Mejorar títulos y subtítulos

Los H1 deben reservarse principalmente para el título de la página o artículo.

Dentro del contenido:

```text
H2 → sección principal
H3 → subsección
```

Evitar utilizar encabezados solo para hacer texto grande.

Cada artículo debe tener un único H1 principal.

---

# TAREA 15 — Mejorar imágenes

Cada artículo debería tener una imagen principal de calidad.

El agente debe:

* definir ancho y alto;
* evitar layout shift;
* usar `loading="lazy"` para imágenes secundarias;
* no aplicar lazy loading de forma agresiva a la imagen principal si perjudica LCP;
* utilizar `alt` descriptivo;
* evitar imágenes gigantes innecesarias;
* mantener proporciones coherentes.

### Ejemplo

```html
<img
  src="..."
  alt="Descripción real de la imagen"
  width="1200"
  height="675"
  loading="lazy"
/>
```

No rellenar `alt` con palabras clave artificiales.

---

# TAREA 16 — Crear artículos relacionados

Al terminar una historia:

```text
También te puede interesar
```

Mostrar entre 3 y 4 artículos.

Idealmente relacionados mediante etiquetas.

No mostrar 12-20 enlaces.

Esto mejora navegación y profundidad de sesión.

---

# TAREA 17 — Crear breadcrumbs

En artículos:

```text
Inicio > Historias > Título
```

En páginas de categoría:

```text
Inicio > Historias
```

Además de ser útiles para SEO, ayudan mucho a la navegación.

---

# FASE 3 — PORTADA

## TAREA 18 — Dejar de mostrar solamente una lista cronológica

La portada debe parecer una publicación.

Estructura recomendada:

```text
HEADER

Artículo destacado

Últimas historias
[3 o 4 cards]

Historias populares o recomendadas
[3 cards]

Entretenimiento
[3 cards]

Más historias
[listado]

FOOTER
```

### Artículo destacado

Una tarjeta grande:

```text
[Imagen]

RELATO DE FICCIÓN
Título destacado

Resumen de 2 líneas

Leer historia →
```

---

# TAREA 19 — Crear tarjetas consistentes

Todas las cards deberían incluir:

```text
Imagen
Categoría
Título
Extracto corto
Fecha
```

No mostrar párrafos gigantes en la home.

Ejemplo CSS conceptual:

```css
.story-card {
    border-radius: 12px;
    overflow: hidden;
}

.story-card img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
}

.story-card-title {
    font-size: 1.2rem;
    line-height: 1.3;
}
```

Mantener la estética sencilla.

---

# TAREA 20 — Mejorar la identidad visual

No convertirlo en algo excesivamente complejo.

El diseño debería transmitir:

* revista;
* historias;
* lectura;
* editorial;
* entretenimiento.

Evitar:

* demasiados degradados;
* animaciones constantes;
* sliders automáticos;
* neón;
* popups;
* widgets innecesarios;
* cinco tipografías distintas.

### Tipografías

Máximo 2 familias.

Por ejemplo:

* una para títulos;
* una para cuerpo.

O una sola familia bien utilizada.

---

# FASE 4 — PUBLICIDAD Y ADSENSE

## TAREA 21 — Verificar integración de AdSense en `<head>`

El agente debe buscar en el tema:

```text
ca-pub-
adsbygoogle
pagead2.googlesyndication.com
google-adsense-account
```

No duplicar scripts.

Puede existir uno de los métodos que te proporcione AdSense.

Ejemplo:

```html
<meta name="google-adsense-account"
      content="ca-pub-XXXXXXXXXXXXXXX"/>
```

Usar **tu ID real**, nunca el ejemplo.

### Importantísimo

Si AdSense ya proporciona una etiqueta válida, no insertar cinco versiones diferentes “por si acaso”.

Debe existir una sola integración correcta.

---

# TAREA 22 — No crear anuncios falsos

No insertar:

```text
ADVERTISEMENT
Anuncio de Google
Banner Ads
```

con bloques vacíos únicamente para parecer preparado.

Mientras Google no haya aprobado el sitio, que no aparezcan anuncios es normal.

---

# TAREA 23 — Dejar espacios publicitarios razonables

Una vez aprobado, los sitios ideales serían:

### Desktop

```text
Artículo

Párrafos iniciales

[anuncio]

Contenido

[anuncio opcional]

Contenido

Final
```

Máximo razonable al principio.

Evitar:

```text
anuncio
anuncio
título
anuncio
2 párrafos
anuncio
```

El contenido debe dominar claramente la página.

---

# TAREA 24 — No usar publicidad intrusiva durante la revisión

Si sigue existiendo integración con Adsterra u otra red:

desactivar durante la revisión:

* popunders;
* redirecciones;
* ventanas emergentes;
* anuncios de pantalla completa;
* social bars invasivas;
* botones falsos;
* anuncios que se confundan con navegación.

No es necesario eliminar toda monetización alternativa si es limpia, pero **yo simplificaría el sitio al máximo durante la revisión**.

---

# FASE 5 — SEO TÉCNICO

## TAREA 25 — Canonical correcto

Cada artículo debe apuntar a su propia URL canónica.

Por ejemplo:

```html
<link rel="canonical"
      href="https://www.creando-historias.com/2026/09/mi-articulo.html"/>
```

No establecer todas las páginas como canonical de la portada.

Blogger normalmente gestiona esto, así que primero verificar antes de añadir código manual.

---

# TAREA 26 — Titles únicos

La home:

```text
Creando-Historias | Relatos, ficción y entretenimiento
```

Entrada:

```text
Título del relato | Creando-Historias
```

Página:

```text
Sobre Nosotros | Creando-Historias
```

No:

```text
Creando Historias - Creando Historias - Blogger
```

---

# TAREA 27 — Meta description

Home:

> Descubre relatos originales, historias de ficción y contenidos de entretenimiento en Creando-Historias.

Cada artículo debería poder utilizar su descripción/extracto.

No rellenarla con listas de keywords.

---

# TAREA 28 — Open Graph

Comprobar soporte de:

```text
og:title
og:description
og:image
og:url
og:type
```

Para entradas:

```text
og:type = article
```

Esto mejora la apariencia al compartir en Facebook, WhatsApp, etc.

---

# TAREA 29 — Datos estructurados

Añadir o comprobar `Article` / `BlogPosting`.

Debe incluir cuando sea posible:

```json
{
  "@type": "BlogPosting",
  "headline": "...",
  "description": "...",
  "image": "...",
  "datePublished": "...",
  "dateModified": "...",
  "author": {
    "@type": "Person",
    "name": "..."
  },
  "publisher": {
    "@type": "Organization",
    "name": "Creando-Historias"
  }
}
```

Muy importante:

**no inventar datos.**

No poner:

```text
award
rating
review
expert
```

si no existen.

---

# TAREA 30 — Structured data de breadcrumbs

Añadir `BreadcrumbList` si el tema actual no lo tiene correctamente implementado.

---

# FASE 6 — CALIDAD Y RENDIMIENTO

## TAREA 31 — Eliminar scripts innecesarios

El agente debe auditar:

```html
<script>
```

y detectar:

* analytics duplicado;
* anuncios antiguos;
* widgets que ya no existen;
* scripts de Vercel;
* scripts de `/stories`;
* scripts de chat antiguos;
* trackers sin uso;
* librerías cargadas dos veces.

No borrar nada sin identificar primero su función.

---

# TAREA 32 — Reducir JavaScript visual innecesario

Eliminar o evitar:

* sliders gigantes;
* animación en cada card;
* partículas;
* loaders;
* carruseles automáticos;
* scroll effects pesados.

Prioridad:

**lectura rápida y estable.**

---

# TAREA 33 — Responsive completo

Probar como mínimo:

```text
320 px
375 px
430 px
768 px
1024 px
1440 px
```

Comprobar:

* menú;
* imágenes;
* títulos;
* tablas;
* formularios;
* footer;
* anuncios;
* botones;
* enlaces.

No permitir scroll horizontal.

---

# TAREA 34 — Accesibilidad básica

Añadir:

* contraste suficiente;
* estados `:focus`;
* `alt` en imágenes;
* `aria-label` en botones sin texto;
* navegación mediante teclado;
* tamaño legible;
* enlaces distinguibles.

Ejemplo:

```css
a:focus-visible,
button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
}
```

---

# FASE 7 — LIMPIEZA DE LA ANTIGUA PLATAFORMA

Esto ya no es propiamente diseño, pero el agente debe comprobarlo.

## TAREA 35 — No generar enlaces `/stories/*`

Buscar en el XML:

```text
/stories
```

Resultado esperado:

```text
0 enlaces internos activos
```

salvo que exista una razón deliberada.

---

## TAREA 36 — Revisar referencias a Vercel

Buscar:

```text
vercel
app.creando-historias.com
stories
api.
```

Eliminar referencias antiguas innecesarias.

No tocar:

```text
app.creando-historias.com
```

si es un enlace deliberado hacia la aplicación.

---

# FASE 8 — CONTENIDO Y SEÑALES EDITORIALES

Aunque esto no sea XML puro, debería formar parte del trabajo.

## TAREA 37 — Homogeneizar categorías

No utilizar 30 etiquetas casi iguales.

Crear aproximadamente 4-7 categorías principales.

Por ejemplo:

```text
Ficción
Drama
Relaciones
Misterio
Familia
Entretenimiento
Cultura
```

Incluso se puede simplificar más.

---

# TAREA 38 — Evitar apariencia de contenido producido en masa

No modificar únicamente diseño.

Las historias que tengan estructuras demasiado parecidas deben revisarse.

Evitar repetir constantemente:

```text
traición
humillación
venganza
millonario
herencia
secreto
caída
lección
```

en combinaciones casi idénticas.

El agente no debe borrar contenido automáticamente.

Debe señalar los artículos sospechosamente repetitivos para revisión humana.

---

# TAREA 39 — Añadir fuentes a contenido factual

Los relatos ficticios no necesitan bibliografía.

Pero si publicas:

```text
rankings
películas
Netflix
tecnología
estadísticas
premios
noticias
datos históricos
```

añadir al final:

```text
Fuentes y referencias
```

con enlaces a fuentes reales.

No inventar referencias.

---

# FASE 9 — ELEMENTOS QUE NO QUIERO QUE EL AGENTE HAGA

Esto es importante incluirlo en el prompt.

### NO hacer

```text
❌ No redirigir todos los 404 a la home.

❌ No redirigir todos los /stories/* a la home.

❌ No crear información falsa sobre autores.

❌ No inventar dirección física.

❌ No afirmar que AdSense está activo si no lo está.

❌ No insertar anuncios falsos.

❌ No llenar los textos de keywords.

❌ No crear 50 categorías.

❌ No eliminar scripts sin identificar para qué sirven.

❌ No romper los widgets nativos de Blogger.

❌ No eliminar los tags <b:...> sin comprenderlos.

❌ No transformar la plantilla XML en HTML convencional.

❌ No quitar los canonical nativos de Blogger sin comprobarlos.

❌ No añadir dos veces Analytics o AdSense.

❌ No introducir dependencias JS pesadas para cosas que pueden hacerse con CSS.

❌ No hacer autoplay de audio o vídeo.

❌ No mostrar popups al entrar a la página.
```

---

# FASE 10 — CONFIGURACIONES DE BLOGGER FUERA DEL CÓDIGO

Tu agente debería darte también una lista de acciones que tengas que hacer manualmente.

## ads.txt

En Blogger:

**Configuración → Monetización → ads.txt personalizado**

Cuando AdSense te proporcione la línea exacta, usar la que indique Google.

Suele tener una estructura semejante a:

```text
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

**No utilizar ese ejemplo literalmente.**

Debe llevar tu Publisher ID real.

---

## HTTPS

Comprobar:

```text
Disponibilidad HTTPS: Sí
Redirección HTTPS: Sí
```

---

## Dominio

Mantener:

```text
www.creando-historias.com → Blogger
```

y:

```text
app.creando-historias.com → Vercel
```

---

## Sitemap

Comprobar:

```text
https://www.creando-historias.com/sitemap.xml
```

y enviarlo a Search Console.

---

# FASE 11 — CHECKLIST QUE DEBE SUPERAR EL AGENTE

Antes de declarar el proyecto terminado, debe comprobar:

```text
[ ] Header funciona en desktop
[ ] Header funciona en móvil
[ ] Menú hamburguesa funciona
[ ] Footer visible en todas las páginas
[ ] Sobre Nosotros accesible
[ ] Contacto accesible
[ ] Privacidad accesible
[ ] Términos accesibles
[ ] Cookies accesible
[ ] Ningún enlace legal devuelve 404
[ ] No existen enlaces accidentales a /stories/*
[ ] Autor visible
[ ] Fecha visible
[ ] Relatos ficticios identificados
[ ] Caja de autor presente
[ ] Artículos relacionados presentes
[ ] 404 personalizada
[ ] No existe scroll horizontal
[ ] No hay scripts publicitarios duplicados
[ ] No hay scripts antiguos de Vercel
[ ] No hay enlaces rotos importantes
[ ] Canonical correcto
[ ] Un solo H1 por entrada
[ ] Imágenes responsive
[ ] Alt en imágenes
[ ] Meta title correcto
[ ] Meta description correcta
[ ] Open Graph correcto
[ ] BlogPosting válido
[ ] Navegación accesible con teclado
[ ] Formulario de contacto funciona
[ ] Contacto enlaza a Privacidad
[ ] Footer enlaza a Cookies
[ ] Diseño usable a 320px
[ ] Diseño usable a 1440px
```

---

# Orden exacto en el que yo lo implementaría

Para que tu agente no empiece por detalles secundarios:

### Sprint 1 — Confianza y estructura

```text
1. Backup completo del tema XML.
2. Auditar enlaces y scripts.
3. Header.
4. Navegación móvil.
5. Footer.
6. Política de Cookies.
7. Mejorar Privacidad.
8. Mejorar Términos.
9. Mejorar Sobre Nosotros.
10. Mejorar Contacto.
```

### Sprint 2 — Posts

```text
11. Layout de artículos.
12. Autor.
13. Fecha.
14. Tiempo de lectura.
15. Aviso automático de ficción.
16. Caja de autor.
17. Breadcrumbs.
18. Artículos relacionados.
```

### Sprint 3 — Portada

```text
19. Hero destacado.
20. Cards.
21. Secciones por categoría.
22. Mejorar mobile.
```

### Sprint 4 — SEO/técnico

```text
23. Titles.
24. Meta descriptions.
25. Canonical.
26. Open Graph.
27. Structured data.
28. Rendimiento.
29. Accesibilidad.
30. Eliminar scripts antiguos.
```

### Sprint 5 — AdSense

```text
31. Verificar código AdSense.
32. Comprobar que no esté duplicado.
33. Configurar ads.txt.
34. Configurar CMP/consentimiento.
35. Eliminar publicidad intrusiva.
36. Auditoría final.
```

---

# Prompt listo para pegar a tu agente de IA

Puedes darle literalmente esto:

> Trabaja sobre la plantilla XML de Blogger de Creando-Historias. El objetivo es convertir el sitio en una publicación editorial profesional de relatos originales, ficción y entretenimiento, optimizada para navegación, confianza, SEO, rendimiento y una futura revisión de Google AdSense.
>
> Antes de modificar nada, crea una copia de seguridad completa de la plantilla XML.
>
> No reemplaces la plantilla completa si no es necesario. Trabaja incrementalmente, respetando las etiquetas y expresiones propias de Blogger (`<b:...>`, `<data:...>`).
>
> Prioriza: header y navegación, footer legal, páginas de confianza, identificación de contenido ficticio, autoría, layout de entradas, portada editorial, SEO técnico, rendimiento y finalmente integración de AdSense.
>
> El sitio principal es `www.creando-historias.com`, servido por Blogger. La aplicación anterior vive en `app.creando-historias.com`. No debe generarse ningún enlace interno accidental hacia `www.creando-historias.com/stories/*`.
>
> El menú principal debe permitir acceder a Inicio, Historias, Entretenimiento, Sobre Nosotros y Contacto. El footer debe incluir Sobre Nosotros, Contacto, Política de Privacidad, Política de Cookies y Términos y Condiciones.
>
> Los artículos etiquetados como `Ficción` deben mostrar automáticamente una insignia “Relato de ficción” y un aviso indicando que se trata de una obra narrativa creada con fines de entretenimiento.
>
> Cada entrada debe mostrar autor, fecha, tiempo aproximado de lectura, breadcrumb, contenido, caja del autor y artículos relacionados.
>
> No inventes autores, credenciales, fuentes, datos legales ni información corporativa. No afirmes que Google AdSense está activo si no lo está.
>
> Audita scripts buscando código antiguo, duplicados de Analytics, AdSense, publicidad, Vercel o integraciones ya no utilizadas. No elimines scripts sin identificar previamente su función.
>
> Antes de entregar los cambios, comprueba mobile desde 320px, desktop hasta 1440px, enlaces rotos, navegación por teclado, scroll horizontal, canonical, meta tags, Open Graph y datos estructurados.
>
> Entrega cada modificación con: archivo/sección modificada, código anterior, código nuevo, motivo del cambio y prueba que debo realizar para comprobar que funciona.

Y añadiría una última instrucción especialmente importante:

> **No hagas todos los cambios de una sola vez. Divide la modificación de la plantilla en bloques y asegúrate de que el XML continúa siendo válido después de cada bloque.**

Eso te puede ahorrar el clásico momento Blogger de **“el tema no se puede guardar porque alguna etiqueta se ha cerrado mal”** después de que el agente haya reescrito 4.000 líneas 😅.

Si vas a utilizar un agente que pueda **editar directamente tu XML**, lo ideal ahora sería pasarle también la plantilla real. Si me subes aquí el **archivo `.xml` exportado de tu tema de Blogger**, puedo revisarlo y darte una segunda especificación mucho más precisa: qué bloques exactos tocar, qué código retirar, dónde insertar el menú/footer/autor/ficción y qué partes de tu tema actual conviene no tocar.
