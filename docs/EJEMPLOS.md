# 🧪 Datos de ejemplo para testing

Para probar la aplicación sin usar tus datos reales, puedes usar estos archivos de ejemplo.

## 📁 Ejemplo: followers_example.json

Crea un archivo llamado `followers_example.json` con este contenido:

```json
[
  {
    "string_list_data": [
      {
        "href": "https://www.instagram.com/maria_garcia",
        "value": "maria_garcia",
        "timestamp": 1234567890
      }
    ]
  },
  {
    "string_list_data": [
      {
        "href": "https://www.instagram.com/juan_perez",
        "value": "juan_perez",
        "timestamp": 1234567891
      }
    ]
  },
  {
    "string_list_data": [
      {
        "href": "https://www.instagram.com/carlos_rodriguez",
        "value": "carlos_rodriguez",
        "timestamp": 1234567892
      }
    ]
  },
  {
    "string_list_data": [
      {
        "href": "https://www.instagram.com/ana_martinez",
        "value": "ana_martinez",
        "timestamp": 1234567893
      }
    ]
  },
  {
    "string_list_data": [
      {
        "href": "https://www.instagram.com/pedro_lopez",
        "value": "pedro_lopez",
        "timestamp": 1234567894
      }
    ]
  },
  {
    "string_list_data": [
      {
        "href": "https://www.instagram.com/laura_gonzalez",
        "value": "laura_gonzalez",
        "timestamp": 1234567895
      }
    ]
  },
  {
    "string_list_data": [
      {
        "href": "https://www.instagram.com/diego_sanchez",
        "value": "diego_sanchez",
        "timestamp": 1234567896
      }
    ]
  },
  {
    "string_list_data": [
      {
        "href": "https://www.instagram.com/sofia_ramirez",
        "value": "sofia_ramirez",
        "timestamp": 1234567897
      }
    ]
  }
]
```

## 📁 Ejemplo: following_example.json

Crea un archivo llamado `following_example.json` con este contenido:

```json
{
  "relationships_following": [
    {
      "string_list_data": [
        {
          "href": "https://www.instagram.com/maria_garcia",
          "value": "maria_garcia",
          "timestamp": 1234567890
        }
      ]
    },
    {
      "string_list_data": [
        {
          "href": "https://www.instagram.com/juan_perez",
          "value": "juan_perez",
          "timestamp": 1234567891
        }
      ]
    },
    {
      "string_list_data": [
        {
          "href": "https://www.instagram.com/luis_torres",
          "value": "luis_torres",
          "timestamp": 1234567898
        }
      ]
    },
    {
      "string_list_data": [
        {
          "href": "https://www.instagram.com/ana_martinez",
          "value": "ana_martinez",
          "timestamp": 1234567893
        }
      ]
    },
    {
      "string_list_data": [
        {
          "href": "https://www.instagram.com/pedro_lopez",
          "value": "pedro_lopez",
          "timestamp": 1234567894
        }
      ]
    },
    {
      "string_list_data": [
        {
          "href": "https://www.instagram.com/cristina_flores",
          "value": "cristina_flores",
          "timestamp": 1234567899
        }
      ]
    }
  ]
}
```

## 📊 Resultados esperados con estos ejemplos

Con los archivos de ejemplo anteriores, deberías obtener:

### Estadísticas:
- **Seguidores:** 8
- **Seguidos:** 6
- **No te siguen:** 2 (luis_torres, cristina_flores)
- **Amigos mutuos:** 4 (maria_garcia, juan_perez, ana_martinez, pedro_lopez)
- **Tus fans:** 4 (carlos_rodriguez, laura_gonzalez, diego_sanchez, sofia_ramirez)

### Desglose:

**No te siguen de vuelta:**
1. luis_torres
2. cristina_flores

**Amigos mutuos (se siguen mutuamente):**
1. maria_garcia
2. juan_perez
3. ana_martinez
4. pedro_lopez

**Tus fans (te siguen pero tú no):**
1. carlos_rodriguez
2. laura_gonzalez
3. diego_sanchez
4. sofia_ramirez

## 🔧 Cómo usar estos ejemplos

### Método 1: Copiar y pegar

1. Copia el contenido de `followers_example.json`
2. Abre un editor de texto (Notepad, TextEdit, VS Code)
3. Pega el contenido
4. Guarda como `followers_example.json`
5. Repite para `following_example.json`

### Método 2: Descargar desde terminal

```bash
# Crear followers_example.json
cat > followers_example.json << 'EOF'
[copiar contenido aquí]
EOF

# Crear following_example.json
cat > following_example.json << 'EOF'
[copiar contenido aquí]
EOF
```

### Método 3: Desde la aplicación web

1. Abre Instagram Analyzer
2. Arrastra `followers_example.json`
3. Arrastra `following_example.json`
4. Click en "Analizar Datos"

## 🎯 Casos de uso de los ejemplos

### Testing básico
- Verificar que la aplicación funciona
- Entender la interfaz
- Practicar el flujo

### Demo para amigos
- Mostrar cómo funciona sin datos reales
- Explicar las diferentes categorías
- Probar la exportación

### Desarrollo
- Testear cambios en el código
- Verificar cálculos
- Debuggear sin usar datos personales

## 📝 Personalizar los ejemplos

Puedes modificar los archivos para simular diferentes escenarios:

### Muchos seguidores
Duplica las entradas y cambia los nombres

### Cuenta popular
Más seguidores que seguidos

### Cuenta nueva
Más seguidos que seguidores

### Ejemplo de modificación

```json
{
  "string_list_data": [
    {
      "href": "https://www.instagram.com/TU_NOMBRE_AQUI",
      "value": "TU_NOMBRE_AQUI",
      "timestamp": 1234567900
    }
  ]
}
```

## ⚠️ Notas importantes

- Estos son datos **ficticios**
- Los timestamps pueden ser cualquier número
- Los nombres de usuario no necesitan existir realmente
- La estructura debe mantenerse igual

## 🚀 Próximos pasos

Después de probar con estos ejemplos:

1. Descarga tus datos reales de Instagram
2. Usa la aplicación con tus datos
3. Compara resultados

---

**¿Necesitas más ejemplos?**

Puedes generar más datos de prueba:
- Usa generadores de nombres aleatorios
- Mantén la misma estructura JSON
- Ajusta la cantidad según necesites

¡Feliz testing! 🎉
