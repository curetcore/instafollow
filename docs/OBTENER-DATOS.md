# 📥 Cómo obtener tus datos de Instagram

Guía actualizada paso a paso para descargar tus seguidores y seguidos de Instagram (2025).

## ⚠️ IMPORTANTE - Antes de empezar

1. **El proceso ha cambiado** - Instagram actualizó la interfaz en 2024
2. **DEBES seleccionar JSON** - NO selecciones HTML o no funcionará
3. **Solo necesitas "Seguidores y seguidos"** - No descargues todo
4. **Puede tardar 48 horas** - Ten paciencia

## 🌐 Método 1: Desde la Web (Recomendado)

### Paso 1: Acceder a Instagram

1. Abre tu navegador
2. Ve a [instagram.com](https://instagram.com)
3. Inicia sesión con tu cuenta

### Paso 2: Ir a Configuración

1. Click en tu foto de perfil (esquina superior derecha)
2. Click en **"⚙️ Configuración y actividad"** (puede estar en el menú ☰)
3. Busca y click en **"Centro de cuentas"**

### Paso 3: Navegar a Descarga de Información

1. En Centro de cuentas, busca **"Tu información y permisos"**
2. Click en **"Descargar tu información"**
3. Click en **"Descargar o transferir información"**
4. Selecciona **solo tu cuenta de Instagram** (no otras cuentas)
5. Click en **"Parte de tu información"** (NO "Toda tu información")

### Paso 4: Configurar descarga - MUY IMPORTANTE

1. **Selección de datos:**
   - ❌ Desmarca todo primero
   - ✅ Marca SOLO: **"Seguidores y seguidos"**
   - ⚠️ NO marques nada más o tardará mucho más

2. **Formato - CRÍTICO:**
   - 🔴 **DEBE SER: JSON**
   - ❌ **NO selecciones: HTML**
   - Si eliges HTML, los archivos no funcionarán con esta app

3. **Periodo de tiempo:**
   - Selecciona: **"Todo el tiempo"** o **"Desde el principio"**

4. **Calidad multimedia:**
   - No importa (no estamos descargando fotos/videos)

5. Click en **"Crear archivos"** o **"Solicitar descarga"**

### Paso 5: Esperar confirmación

- Instagram procesará tu solicitud
- Recibirás un **email** cuando esté listo
- Puede tardar: **1 hora a 3 días** (depende de la cantidad de datos)

### Paso 6: Descargar archivos

1. Revisa tu email
2. Click en el link de descarga (válido por 14 días)
3. Descarga el archivo ZIP
4. Extrae el ZIP

### Paso 7: Ubicar archivos JSON

Dentro del ZIP encontrarás:
```
tu-instagram-data/
├── connections/
│   ├── followers_and_following/
│   │   ├── followers_1.json          ← Este es el de SEGUIDORES
│   │   └── following.json             ← Este es el de SEGUIDOS
```

¡Listo! Ya tienes tus archivos.

---

## 📱 Método 2: Desde la App Móvil

### En iOS (iPhone) - Actualizado 2025

1. Abre la app de Instagram
2. Ve a tu perfil (icono de persona abajo a la derecha)
3. Toca las **tres líneas** (☰) arriba a la derecha
4. Toca **"⚙️ Configuración y actividad"** (al final del menú)
5. En la sección "Cómo usas Instagram", toca **"Centro de cuentas"**
6. Toca **"Tu información y permisos"**
7. Toca **"Descargar tu información"**
8. **IMPORTANTE:** Sigue exactamente los pasos del Método 1 (especialmente elegir JSON)

### En Android - Actualizado 2025

1. Abre la app de Instagram
2. Ve a tu perfil (icono de persona abajo a la derecha)
3. Toca las **tres líneas** (☰) arriba a la derecha
4. Toca **"⚙️ Configuración y actividad"**
5. Desplázate hasta **"Centro de cuentas"** (puede estar bajo "También de Meta")
6. Toca **"Tu información y permisos"**
7. Toca **"Descargar tu información"**
8. **IMPORTANTE:** Sigue exactamente los pasos del Método 1 (especialmente elegir JSON)

---

## 📋 Estructura de los archivos JSON

### followers_1.json (Seguidores)

```json
[
  {
    "string_list_data": [
      {
        "href": "https://www.instagram.com/usuario1",
        "value": "usuario1",
        "timestamp": 1234567890
      }
    ]
  },
  {
    "string_list_data": [
      {
        "href": "https://www.instagram.com/usuario2",
        "value": "usuario2",
        "timestamp": 1234567891
      }
    ]
  }
]
```

### following.json (Seguidos)

```json
{
  "relationships_following": [
    {
      "string_list_data": [
        {
          "href": "https://www.instagram.com/usuario3",
          "value": "usuario3",
          "timestamp": 1234567892
        }
      ]
    }
  ]
}
```

**Nota:** La aplicación detecta automáticamente ambos formatos.

---

## ⚠️ Problemas comunes

### "No recibí el email"

**Soluciones:**
- Revisa la carpeta de spam
- Espera hasta 48-72 horas
- Verifica que el email de tu cuenta Instagram esté correcto
- Solicita nuevamente la descarga

### "El link expiró"

- Los links expiran en 14 días
- Solicita una nueva descarga

### "El archivo está corrupto"

- Descarga nuevamente
- Usa un descompresor diferente (WinRAR, 7-Zip, The Unarchiver)
- Intenta desde otro navegador

### "No encuentro los archivos JSON"

- Asegúrate de extraer TODO el ZIP
- Busca la carpeta `connections/followers_and_following/`
- Los archivos pueden tener números: `followers_1.json`, `followers_2.json`

### "Descargué en HTML por error"

**¿Cómo sé si descargué HTML?**
- Los archivos terminan en `.html` no `.json`
- Al abrirlos se ven como páginas web
- No funcionan con Instagram Analyzer

**Solución:**
1. Solicita una nueva descarga
2. Esta vez ASEGÚRATE de seleccionar **JSON**
3. En la pantalla de formato, busca estas opciones:
   - ❌ **HTML** - NO seleccionar
   - ✅ **JSON** - SÍ seleccionar
4. Espera el nuevo email

**¿Por qué no funciona HTML?**
- HTML es para ver en navegador (humanos)
- JSON es para procesar con código (apps)
- Esta app necesita JSON para analizar los datos

---

## 💡 Tips importantes

### ✅ Hacer:
- Usar formato **JSON** (no HTML)
- Seleccionar solo "Seguidores y seguidos" (descarga más rápida)
- Guardar los archivos en un lugar seguro
- Verificar que los archivos no estén vacíos

### ❌ Evitar:
- No descargar "Todo" (tarda muchísimo más)
- No usar HTML (más difícil de procesar)
- No compartir estos archivos con desconocidos
- No usar apps de terceros que pidan tu contraseña

---

## 🔒 Privacidad y seguridad

**¿Es seguro descargar mis datos?**
- ✅ Sí, es una función oficial de Instagram
- ✅ Solo tú tienes acceso a la descarga
- ✅ El link expira en 14 días

**¿Instagram sabrá que descargué mis datos?**
- Sí, queda registrado en tu actividad
- Es completamente legal y normal

**¿Puedo hacer esto varias veces?**
- Sí, sin límite
- Útil para ver cambios en el tiempo

---

## 📊 Diferencia entre JSON y HTML - IMPORTANTE

### ✅ JSON (CORRECTO)
```json
{
  "relationships_following": [
    {
      "string_list_data": [
        {
          "href": "https://www.instagram.com/usuario",
          "value": "usuario",
          "timestamp": 1234567890
        }
      ]
    }
  ]
}
```
- **Aspecto:** Texto con llaves `{}` y corchetes `[]`
- **Extensión:** `.json`
- **Tamaño:** Pequeño (KB/MB)
- **Uso:** Para apps y análisis automático
- **✅ FUNCIONA con Instagram Analyzer**

### ❌ HTML (INCORRECTO)
```html
<html>
<head><title>Following</title></head>
<body>
  <h1>People you follow</h1>
  <div>usuario</div>
</body>
</html>
```
- **Aspecto:** Texto con etiquetas `<>` 
- **Extensión:** `.html`
- **Tamaño:** Grande (más MB)
- **Uso:** Para ver en navegador
- **❌ NO FUNCIONA con Instagram Analyzer**

## 🎯 Regla Simple

**En la pantalla de formato de Instagram:**
- Si ves **"HTML"** → ❌ NO lo elijas
- Si ves **"JSON"** → ✅ SÍ lo elijas

---

## 🕐 Tiempos estimados

| Seguidores | Tiempo de procesamiento |
|-----------|------------------------|
| < 1,000   | 15 min - 1 hora       |
| 1K - 10K  | 1 - 6 horas           |
| 10K - 50K | 6 - 24 horas          |
| > 50K     | 1 - 3 días            |

**Nota:** Instagram procesa solicitudes en lotes.

---

## 📞 Ayuda adicional

Si tienes problemas:

1. **Centro de ayuda de Instagram:**
   - [help.instagram.com](https://help.instagram.com)

2. **Documentación oficial:**
   - Busca "Descargar tu información" en el centro de ayuda

3. **Contacto directo:**
   - Desde la app: Configuración → Ayuda → Reportar un problema

---

## ✅ Checklist de verificación

Antes de usar Instagram Analyzer, verifica:

- [ ] Descargaste el archivo ZIP completo
- [ ] Extrajiste el ZIP
- [ ] Encontraste la carpeta `connections/followers_and_following/`
- [ ] Tienes el archivo `followers_1.json` (o similar)
- [ ] Tienes el archivo `following.json`
- [ ] Los archivos pesan más de 1 KB (no están vacíos)
- [ ] Los archivos se abren correctamente en un editor de texto

**¡Ahora estás listo para usar Instagram Analyzer!** 🎉

---

## 🔄 Actualizar tus datos

Para análisis actualizados:
- Descarga nuevos datos cada mes
- Compara resultados en el tiempo
- Ve cómo cambia tu red

---

**Última actualización:** Octubre 2025
**Versión de Instagram:** Compatible con versión actual
