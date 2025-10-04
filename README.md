# 📊 Instagram Analyzer

Aplicación web para analizar tus seguidores de Instagram y descubrir quién no te sigue de vuelta.

## 🌟 Características

- ✅ **100% Privado**: Todo se procesa en tu navegador, nada se envía a servidores
- 📊 **Análisis completo**: Ve quién no te sigue, amigos mutuos y tus fans
- 🎨 **Interfaz moderna**: Diseño atractivo y responsive
- 📥 **Drag & Drop**: Arrastra tus archivos fácilmente
- 💾 **Exportar resultados**: Descarga listas en formato CSV
- 🌐 **Multi-usuario**: Compártelo con amigos

## 🚀 Cómo usar

### Para usuarios (sin conocimientos técnicos)

1. **Obtén tus datos de Instagram**
   - Abre Instagram (app o web)
   - Ve a: Configuración → Seguridad → Descargar información
   - Selecciona **"Seguidores y seguidos"**
   - Formato: **JSON**
   - Espera el email (puede tardar horas o días)

2. **Descarga los archivos**
   - Instagram te enviará un link de descarga
   - Descarga el .zip
   - Extrae: `followers_1.json` y `following.json`

3. **Usa la aplicación**
   - Abre: [TU_DOMINIO.com]
   - Arrastra o selecciona `followers_1.json`
   - Arrastra o selecciona `following.json`
   - Click en "Analizar Datos"
   - ¡Listo! 🎉

## 📁 Estructura del proyecto

```
instagram-analyzer/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos
├── js/
│   └── app.js          # Lógica de la aplicación
├── docs/
│   ├── DEPLOYMENT.md   # Guía de deployment
│   └── NGINX.md        # Configuración Nginx
└── README.md           # Este archivo
```

## 🛠️ Tecnologías

- HTML5
- CSS3 (Grid, Flexbox, Animaciones)
- JavaScript Vanilla (ES6+)
- Sin dependencias externas

## 🔒 Privacidad

Esta aplicación NO:
- ❌ Envía datos a ningún servidor
- ❌ Guarda información en bases de datos
- ❌ Usa cookies o tracking
- ❌ Requiere tu contraseña de Instagram

Todo el procesamiento ocurre localmente en tu navegador.

## 📊 Qué puedes analizar

- **No te siguen**: Usuarios que sigues pero no te siguen de vuelta
- **Amigos mutuos**: Personas con las que tienes seguimiento mutuo
- **Tus fans**: Usuarios que te siguen pero tú no los sigues

## 💾 Exportar datos

Cada lista puede exportarse como CSV con:
- Username
- URL del perfil

## 🌐 Deployment

Ver guía completa en: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

Opciones rápidas:
- **Contabo VPS** (recomendado para tu caso)
- Netlify (gratis)
- Vercel (gratis)
- GitHub Pages

## 🤝 Compartir con amigos

1. Configura tu dominio personalizado
2. Comparte el link
3. Tus amigos pueden usarlo sin instalar nada

## ⚙️ Configuración avanzada

### SSL/HTTPS

Para producción, siempre usa HTTPS:

```bash
# Con Let's Encrypt
sudo certbot --nginx -d tudominio.com
```

### Dominio personalizado

Apunta tu DNS a tu servidor:
```
A Record: @ → TU_IP
A Record: www → TU_IP
```

## 🐛 Solución de problemas

**Error al leer JSON**
- Asegúrate de que sean los archivos correctos de Instagram
- Verifica que no estén corruptos
- Descárgalos de nuevo si es necesario

**No aparece ningún resultado**
- Verifica que ambos archivos estén cargados
- Revisa la consola del navegador (F12)

**La página no carga**
- Verifica que todos los archivos estén en las rutas correctas
- Revisa la configuración de Nginx

## 📝 Notas importantes

- Instagram puede cambiar el formato de exportación
- Los datos deben ser recientes para resultados precisos
- La exportación de Instagram puede tardar días

## 🎨 Personalización

Para cambiar colores, edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary: #E1306C;        /* Color principal */
    --secondary: #405DE6;      /* Color secundario */
    /* ... más variables */
}
```

## 📄 Licencia

Proyecto de uso libre. Compártelo y mejóralo.

## 🤖 Creado por

- Proyecto personal
- Hecho con ❤️ para la comunidad

---

**¿Preguntas?** Revisa la [documentación completa](docs/) o abre un issue.
