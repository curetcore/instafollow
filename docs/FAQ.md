# ❓ Preguntas Frecuentes (FAQ)

Respuestas a las preguntas más comunes sobre Instagram Analyzer.

## 🔐 Privacidad y Seguridad

### ¿Es seguro usar esta aplicación?

**Sí, completamente seguro.**
- Todo se procesa en tu navegador (client-side)
- No se envían datos a ningún servidor
- No guardamos ni almacenamos información
- El código es open source (puedes revisarlo)

### ¿Necesito dar mi contraseña de Instagram?

**NO. Nunca.**
- Solo subes archivos JSON que descargas de Instagram
- No hay login ni autenticación
- No accedemos a tu cuenta de Instagram

### ¿Mis datos quedan guardados en algún lado?

**No.**
- Los datos solo existen en la memoria de tu navegador
- Al cerrar la página, todo se borra
- No usamos cookies ni tracking

---

## 📊 Uso de la Aplicación

### ¿Qué archivos necesito?

Necesitas 2 archivos JSON de Instagram:
1. `followers_1.json` (tus seguidores)
2. `following.json` (tus seguidos)

### ¿Dónde obtengo estos archivos?

Ve a la guía completa: [OBTENER-DATOS.md](OBTENER-DATOS.md)

Resumen rápido:
1. Instagram → Configuración → Descargar información
2. Selecciona "Seguidores y seguidos" en JSON
3. Espera el email
4. Descarga y extrae el ZIP

### ¿Cuánto tardan en llegar mis datos?

Depende de cuántos seguidores tengas:
- Menos de 1,000: 15 min - 1 hora
- 1,000 - 10,000: 1 - 6 horas
- Más de 10,000: 1 - 3 días

### ¿Puedo usar esto en móvil?

**Sí**, la aplicación es responsive:
- ✅ Funciona en iPhone
- ✅ Funciona en Android
- ✅ Funciona en tablets
- ⚠️ Pero es más cómodo en desktop

---

## 🐛 Problemas Técnicos

### "Error al leer el archivo"

**Causas comunes:**
- Archivo corrupto → Descarga nuevamente
- Formato incorrecto → Asegúrate que sea JSON (no HTML)
- Archivo vacío → Verifica que tenga datos

**Solución:**
1. Abre el archivo en un editor de texto
2. Verifica que comience con `[` o `{`
3. Si ves HTML, descargaste el formato incorrecto

### "No aparecen resultados"

**Verifica:**
- [ ] Subiste ambos archivos (followers Y following)
- [ ] Los archivos tienen datos (no están vacíos)
- [ ] Hiciste click en "Analizar Datos"
- [ ] Los archivos son de tu cuenta (no de otra persona)

### La página no carga

**Soluciones:**
1. Recarga la página (F5 o Cmd+R)
2. Limpia caché del navegador
3. Prueba en modo incógnito
4. Usa otro navegador (Chrome, Firefox, Safari)

### Los números no coinciden

**Esto es normal.**
Instagram puede mostrar números diferentes porque:
- Cuentas suspendidas no aparecen
- Cuentas privadas bloqueadas
- Bots eliminados
- Diferencia de tiempo entre descarga y análisis

---

## 📱 Instagram

### ¿Esto es legal?

**Sí, completamente.**
- Usas datos que Instagram te proporciona oficialmente
- No violamos términos de servicio
- No hacemos scraping ni acceso no autorizado

### ¿Instagram sabrá que hice esto?

**No directamente.**
- Instagram registra que descargaste tus datos
- Pero no sabe qué haces con ellos después
- Descargar tus datos es 100% legal y normal

### ¿Puedo ser baneado por usar esto?

**No.**
- No interactuamos con la API de Instagram
- No accedemos a tu cuenta
- Solo analizas datos que Instagram te dio

### ¿Con qué frecuencia puedo descargar mis datos?

**Sin límite.**
- Puedes solicitar descarga cuando quieras
- Útil para ver cambios mensuales
- Recomendado: 1 vez al mes

---

## 🎯 Resultados

### ¿Qué significan las categorías?

**No te siguen:**
- Usuarios que tú sigues pero ellos no te siguen de vuelta

**Amigos mutuos:**
- Usuarios con seguimiento mutuo (se siguen ambos)

**Tus fans:**
- Usuarios que te siguen pero tú no los sigues

### ¿Por qué algunos no aparecen?

Razones comunes:
- Cuenta eliminada
- Cuenta suspendida
- Cuenta privada que te bloqueó
- Cambió su username

### ¿Los resultados son 100% exactos?

**Casi siempre, pero puede haber variaciones:**
- Los datos dependen de cuándo los descargaste
- Instagram puede tener inconsistencias
- Cuentas pueden cambiar entre descarga y análisis

---

## 💾 Exportación

### ¿En qué formato exporta?

**CSV (Excel compatible)**
- Fácil de abrir en Excel/Google Sheets
- Incluye username y link al perfil

### ¿Puedo exportar todo junto?

**Por ahora no.**
- Debes exportar cada categoría por separado
- Próxima actualización incluirá esta función

### ¿Dónde se guardan las exportaciones?

En tu carpeta de Descargas predeterminada.

---

## 🚀 Características

### ¿Puedo ver estadísticas históricas?

**No directamente.**
Pero puedes:
1. Exportar resultados con fecha
2. Guardar en una hoja de cálculo
3. Comparar manualmente mes a mes

### ¿Hay versión de escritorio/app?

**No es necesario.**
- Funciona directamente en el navegador
- Puedes agregar a tu pantalla de inicio en móvil
- No requiere instalación

### ¿Funciona sin internet?

**No.**
Necesitas internet para:
- Cargar la página inicialmente
- Ver los links a perfiles

Pero el análisis se hace localmente.

---

## 🌐 Compartir

### ¿Puedo compartir esto con amigos?

**¡Por supuesto!**
- Comparte el link
- Ellos pueden usarlo con sus propios datos
- Cada uno ve solo sus resultados

### ¿Puedo instalar esto en mi servidor?

**Sí.**
Ver guía: [DEPLOYMENT.md](DEPLOYMENT.md)

### ¿Hay límite de usuarios?

**No.**
- Soporta múltiples usuarios simultáneos
- Cada uno procesa sus datos localmente
- Sin límite de uso

---

## 🔧 Técnico

### ¿Qué tecnologías usa?

- HTML5
- CSS3 (vanilla)
- JavaScript (ES6+)
- Sin frameworks
- Sin dependencias externas

### ¿Funciona offline después de cargar?

**Parcialmente.**
- La interfaz sí funciona
- El análisis sí funciona
- Pero necesitas internet para ver links de Instagram

### ¿Puedo modificar el código?

**¡Sí!**
- El código es abierto
- Puedes personalizarlo
- Reporta bugs o mejoras

### ¿Cómo reporto un bug?

Por ahora:
- Revisa la consola del navegador (F12)
- Anota el error
- Contacta al desarrollador

---

## 💡 Tips y Trucos

### Para mejores resultados:

1. **Descarga datos recientes** (no más de 1 mes)
2. **Usa formato JSON** (no HTML)
3. **Descarga solo "Seguidores y seguidos"** (más rápido)
4. **Guarda exportaciones** con fecha para comparar

### Para análisis histórico:

1. Descarga datos mensualmente
2. Exporta cada categoría
3. Crea hoja de cálculo con evolución
4. Identifica tendencias

### Para compartir:

1. Configura dominio bonito
2. Agrega SSL (HTTPS)
3. Comparte link corto
4. Explica cómo obtener los datos

---

## 🆘 Soporte

### ¿Dónde obtengo ayuda?

1. Lee esta FAQ completa
2. Revisa la [documentación](README.md)
3. Contacta al desarrollador
4. Reporta issues en GitHub

### ¿Hay tutoriales en video?

**Próximamente.**

### ¿Qué navegadores son compatibles?

✅ Compatibles:
- Chrome/Chromium (v90+)
- Firefox (v88+)
- Safari (v14+)
- Edge (v90+)

❌ No compatibles:
- Internet Explorer
- Navegadores muy antiguos

---

## 🔮 Futuro

### ¿Habrá nuevas funciones?

**Planeadas:**
- Gráficas de evolución
- Comparación temporal
- Exportación completa
- Más estadísticas
- Filtros avanzados
- Modo oscuro personalizable

### ¿Puedo sugerir funciones?

**¡Sí!**
Contacta al desarrollador o abre un issue.

### ¿Cuándo la próxima actualización?

Sin fecha fija, pero se planean mejoras continuas.

---

## ⚖️ Legal

### ¿Quién es responsable de los resultados?

El usuario es responsable de:
- Cómo usa los resultados
- Decisiones basadas en el análisis
- Acciones que tome con la información

### ¿Puedo usar esto comercialmente?

Consulta la licencia del proyecto.

---

**¿No encuentras tu pregunta?**

Contacta al desarrollador o revisa la documentación completa.

---

**Última actualización:** Octubre 2025
