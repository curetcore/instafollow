# 📁 Estructura del Proyecto

Guía completa de todos los archivos y carpetas.

## 📂 Estructura Visual

```
instagram-analyzer/
├── index.html              # Página principal de la aplicación
├── README.md               # Documentación principal
├── QUICKSTART.md           # Guía de inicio rápido
├── .gitignore              # Archivos ignorados por Git
├── deploy.sh               # Script de deployment automatizado
│
├── css/
│   └── styles.css          # Estilos de la aplicación
│
├── js/
│   └── app.js              # Lógica principal de la aplicación
│
├── assets/                 # Imágenes, íconos, etc. (vacía por ahora)
│
└── docs/                   # Documentación completa
    ├── DEPLOYMENT.md       # Guía de deployment en Contabo
    ├── NGINX.md            # Configuraciones de Nginx
    ├── OBTENER-DATOS.md    # Cómo obtener datos de Instagram
    ├── EJEMPLOS.md         # Datos de ejemplo para testing
    ├── FAQ.md              # Preguntas frecuentes
    └── ROADMAP.md          # Mejoras futuras y roadmap
```

---

## 📄 Descripción de Archivos

### Archivos Principales

#### `index.html`
- **Qué es:** Página principal de la aplicación
- **Contiene:** 
  - Estructura HTML completa
  - Formularios de carga de archivos
  - Secciones de resultados
  - Tabs para diferentes categorías
- **No tocar si:** No sabes HTML
- **Editar si:** Quieres cambiar textos o estructura

#### `css/styles.css`
- **Qué es:** Todos los estilos visuales
- **Contiene:**
  - Variables de colores
  - Diseño responsive
  - Animaciones
  - Estilos para todos los componentes
- **Editar para:** Cambiar colores, fuentes, tamaños
- **Líneas importantes:** 1-15 (variables de color)

#### `js/app.js`
- **Qué es:** Toda la lógica de la aplicación
- **Contiene:**
  - Manejo de archivos
  - Procesamiento de JSON
  - Análisis de datos
  - Generación de resultados
  - Exportación a CSV
- **No tocar si:** No sabes JavaScript
- **Editar con cuidado:** Cualquier cambio puede romper la app

---

### Documentación

#### `README.md`
- **Para:** Usuarios y desarrolladores
- **Contenido:** Visión general del proyecto
- **Incluye:** Características, instalación, uso básico

#### `QUICKSTART.md`
- **Para:** Usuarios que quieren empezar rápido
- **Contenido:** Guías de 5 minutos
- **Incluye:** Tres formas de deployment

#### `docs/DEPLOYMENT.md`
- **Para:** Developers deployando en Contabo
- **Contenido:** Guía paso a paso completa
- **Incluye:** Nginx, SSL, DNS, firewall

#### `docs/NGINX.md`
- **Para:** Configuración avanzada de servidor
- **Contenido:** Configuraciones de Nginx
- **Incluye:** SSL, optimización, seguridad

#### `docs/OBTENER-DATOS.md`
- **Para:** Usuarios que necesitan datos de Instagram
- **Contenido:** Cómo descargar datos de IG
- **Incluye:** Web, iOS, Android, troubleshooting

#### `docs/EJEMPLOS.md`
- **Para:** Testing sin datos reales
- **Contenido:** Archivos JSON de ejemplo
- **Incluye:** followers y following de prueba

#### `docs/FAQ.md`
- **Para:** Responder dudas comunes
- **Contenido:** Preguntas y respuestas
- **Incluye:** Seguridad, uso, técnicas

#### `docs/ROADMAP.md`
- **Para:** Ver el futuro del proyecto
- **Contenido:** Mejoras planeadas
- **Incluye:** v1.1, v2.0, v3.0, ideas

---

### Configuración

#### `.gitignore`
- **Qué es:** Archivos que Git ignora
- **Contiene:** Logs, archivos temporales, etc.
- **Útil si:** Usas Git para versionado

#### `deploy.sh`
- **Qué es:** Script de deployment automatizado
- **Uso:** `sudo ./deploy.sh`
- **Funciones:**
  - Instalación completa
  - Actualización
  - Configuración Nginx
  - SSL
  - Backups

---

## 🎯 Qué Archivo Editar Para...

### Cambiar colores
→ `css/styles.css` (líneas 1-15)

### Cambiar textos
→ `index.html`

### Agregar funcionalidad
→ `js/app.js`

### Agregar documentación
→ Crear nuevo archivo en `docs/`

### Cambiar configuración de servidor
→ Ver `docs/NGINX.md` o usar `deploy.sh`

---

## 📦 Carpetas

### `css/`
- Contiene todos los estilos
- Por ahora solo `styles.css`
- Futuro: múltiples temas

### `js/`
- Contiene todo el JavaScript
- Por ahora solo `app.js`
- Futuro: módulos separados

### `assets/`
- Para imágenes, íconos, fonts
- Vacía por ahora
- Úsala para recursos visuales

### `docs/`
- Toda la documentación
- 7 archivos markdown
- Cubre todo el proyecto

---

## 🔧 Archivos que Deberías Editar

### Fácil (sin riesgo):
- ✅ `README.md` - Personalizar descripción
- ✅ Variables de color en `css/styles.css`
- ✅ Textos en `index.html`

### Moderado:
- ⚠️ Estilos en `css/styles.css`
- ⚠️ Configuración de Nginx

### Avanzado (cuidado):
- 🔴 `js/app.js` - Puede romper funcionalidad
- 🔴 `deploy.sh` - Puede afectar servidor

---

## 📊 Tamaño de Archivos

Aproximado:

```
index.html          ~6 KB
css/styles.css      ~10 KB
js/app.js           ~8 KB
README.md           ~5 KB
QUICKSTART.md       ~4 KB
deploy.sh           ~8 KB
docs/*.md           ~30 KB total

Total: ~71 KB (muy ligero!)
```

---

## 🎨 Personalización Rápida

### Cambiar nombre del proyecto

1. `index.html` → Busca "Instagram Analyzer"
2. Reemplaza con tu nombre
3. Actualiza también en documentación

### Cambiar esquema de colores

1. Abre `css/styles.css`
2. Edita líneas 1-15 (variables CSS)
3. Cambia los valores hexadecimales

Ejemplo:
```css
--primary: #E1306C;  /* Rosa Instagram */
--secondary: #405DE6;  /* Azul */
```

### Agregar tu logo

1. Guarda logo en `assets/`
2. Edita `index.html`
3. Agrega: `<img src="assets/logo.png">`

---

## 🚀 Archivos Necesarios para Deployment

### Mínimo necesario:
```
✅ index.html
✅ css/styles.css
✅ js/app.js
```

### Recomendado incluir:
```
✅ README.md
✅ QUICKSTART.md
✅ docs/
```

### Opcional:
```
⚪ deploy.sh (solo si deployeas en VPS)
⚪ .gitignore (solo si usas Git)
```

---

## 📝 Notas Importantes

### No editar directamente:
- Logs de Nginx
- Certificados SSL
- Archivos del sistema

### Hacer backup antes de:
- Editar `js/app.js`
- Cambiar configuración de Nginx
- Actualizar en producción

### Versionar con Git:
```bash
git add .
git commit -m "Descripción de cambios"
git push
```

---

## 🔍 Buscar en el Código

### Buscar texto específico:
```bash
grep -r "texto_a_buscar" .
```

### Buscar en archivos específicos:
```bash
grep "función" js/app.js
```

### Buscar y reemplazar:
```bash
sed -i 's/viejo/nuevo/g' archivo.js
```

---

## ✅ Verificar Integridad

### Todos los archivos presentes:
```bash
ls -la
```

### Permisos correctos:
```bash
chmod 644 *.html *.md
chmod 755 *.sh
chmod 644 css/*.css js/*.js
```

### Sin errores de sintaxis:
- HTML: Usar validador W3C
- CSS: Usar CSS validator
- JS: Abrir consola del navegador (F12)

---

**Este archivo te ayuda a navegar el proyecto. ¡Guárdalo como referencia!** 📚
