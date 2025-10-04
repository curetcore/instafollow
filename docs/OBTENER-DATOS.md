# 📥 Cómo obtener tus datos de Instagram

Guía paso a paso para descargar tus seguidores y seguidos de Instagram.

## 🌐 Método 1: Desde la Web (Recomendado)

### Paso 1: Acceder a Instagram

1. Abre tu navegador
2. Ve a [instagram.com](https://instagram.com)
3. Inicia sesión con tu cuenta

### Paso 2: Ir a Configuración

1. Click en tu foto de perfil (esquina superior derecha)
2. Click en **"Configuración"**
3. En el menú lateral, busca **"Centro de cuentas"**

### Paso 3: Solicitar descarga

1. Click en **"Tu información y permisos"**
2. Click en **"Descargar tu información"**
3. Click en **"Descargar o transferir información"**
4. Selecciona tu cuenta de Instagram
5. Click en **"Descargar tu información"**

### Paso 4: Configurar descarga

1. **Tipos de información:**
   - Desmarca "Seleccionar todo"
   - ✅ Marca SOLO: **"Seguidores y seguidos"**

2. **Formato:**
   - Selecciona: **JSON** (no HTML)

3. **Calidad multimedia:**
   - No aplica (solo descargamos listas)

4. **Fecha y rango:**
   - Selecciona "Todo el tiempo"

5. Click en **"Crear archivos"**

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

### En iOS (iPhone)

1. Abre la app de Instagram
2. Ve a tu perfil (icono de persona abajo a la derecha)
3. Toca las **tres líneas** (≡) arriba a la derecha
4. Toca **"Configuración y privacidad"**
5. Toca **"Centro de cuentas"**
6. Toca **"Tu información y permisos"**
7. Toca **"Descargar tu información"**
8. Sigue los mismos pasos del Método 1 (Paso 4 en adelante)

### En Android

1. Abre la app de Instagram
2. Ve a tu perfil (icono de persona abajo a la derecha)
3. Toca las **tres líneas** (≡) arriba a la derecha
4. Toca **"Configuración y actividad"**
5. Toca **"Centro de cuentas"**
6. Toca **"Tu información y permisos"**
7. Toca **"Descargar tu información"**
8. Sigue los mismos pasos del Método 1 (Paso 4 en adelante)

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

- Tienes que solicitar nuevamente
- Esta vez selecciona **JSON** como formato

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

## 📊 Formatos alternativos

Instagram puede exportar en dos formatos:

### JSON (Recomendado)
- ✅ Fácil de procesar automáticamente
- ✅ Compacto
- ✅ Compatible con nuestra app

### HTML
- ❌ Solo para ver manualmente
- ❌ Más pesado
- ❌ No compatible con análisis automático

**Siempre usa JSON.**

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
