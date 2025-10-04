# 🚀 Inicio Rápido

Comienza a usar Instagram Analyzer en 5 minutos.

## Para Usuarios (Usar la app)

### 1️⃣ Obtén tus datos de Instagram

1. Ve a Instagram → Configuración
2. Centro de cuentas → Tu información y permisos
3. Descargar tu información
4. Selecciona **"Seguidores y seguidos"** en formato **JSON**
5. Espera el email (puede tardar horas o días)
6. Descarga y extrae el ZIP

### 2️⃣ Usa la aplicación

1. Abre: `https://tudominio.com` (o el link que te compartieron)
2. Arrastra `followers_1.json` a la primera caja
3. Arrastra `following.json` a la segunda caja
4. Click en **"Analizar Datos"**
5. ¡Listo! 🎉

### 3️⃣ Exporta resultados

- Click en cualquier botón "Exportar lista"
- Se descargará un archivo CSV
- Ábrelo en Excel o Google Sheets

---

## Para Desarrolladores (Deployar)

### Opción A: Deployment rápido (Contabo)

```bash
# 1. Conecta a tu servidor
ssh root@TU_IP

# 2. Sube los archivos
scp -r instagram-analyzer root@TU_IP:/tmp/

# 3. Ejecuta el script de deployment
cd /tmp/instagram-analyzer
chmod +x deploy.sh
sudo ./deploy.sh

# 4. Selecciona opción 1 (Instalación completa)
# 5. Sigue las instrucciones
```

### Opción B: Manual paso a paso

```bash
# 1. Instalar Nginx
apt update && apt upgrade -y
apt install nginx -y

# 2. Copiar archivos
mkdir -p /var/www/instagram-analyzer
cp -r * /var/www/instagram-analyzer/

# 3. Configurar permisos
chown -R www-data:www-data /var/www/instagram-analyzer
chmod -R 755 /var/www/instagram-analyzer

# 4. Configurar Nginx
nano /etc/nginx/sites-available/instagram-analyzer
# (pega la configuración de docs/NGINX.md)

# 5. Activar sitio
ln -s /etc/nginx/sites-available/instagram-analyzer /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 6. Instalar SSL (opcional)
apt install certbot python3-certbot-nginx -y
certbot --nginx -d tudominio.com
```

### Opción C: Servicios gratuitos

**Netlify** (más fácil):
```bash
# 1. Instala Netlify CLI
npm install -g netlify-cli

# 2. Deploy
cd instagram-analyzer
netlify deploy --prod
```

**Vercel**:
```bash
# 1. Instala Vercel CLI
npm install -g vercel

# 2. Deploy
cd instagram-analyzer
vercel --prod
```

**GitHub Pages**:
```bash
# 1. Crea repo en GitHub
# 2. Sube los archivos
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/instagram-analyzer.git
git push -u origin main

# 3. Habilita GitHub Pages en Settings
# 4. Tu sitio estará en: https://TU_USUARIO.github.io/instagram-analyzer/
```

---

## Verificación Rápida

### ✅ Checklist

- [ ] Nginx instalado y corriendo
- [ ] Archivos en `/var/www/instagram-analyzer`
- [ ] Permisos correctos (755)
- [ ] Configuración de Nginx activa
- [ ] Sitio accesible en el navegador
- [ ] Puedes subir archivos JSON
- [ ] El análisis funciona

### 🧪 Prueba

1. Abre tu sitio en el navegador
2. Descarga los archivos de ejemplo de `docs/EJEMPLOS.md`
3. Súbelos a la aplicación
4. Verifica que el análisis funcione

---

## Solución de Problemas Rápidos

### Nginx no inicia
```bash
nginx -t  # Ver error
tail -20 /var/log/nginx/error.log  # Ver logs
```

### Página no carga
```bash
systemctl status nginx  # Ver estado
systemctl restart nginx  # Reiniciar
```

### Error 403
```bash
chown -R www-data:www-data /var/www/instagram-analyzer
chmod -R 755 /var/www/instagram-analyzer
```

---

## Comandos Útiles

```bash
# Ver logs en tiempo real
tail -f /var/log/nginx/access.log

# Reiniciar Nginx
systemctl restart nginx

# Verificar configuración
nginx -t

# Ver estado del servidor
systemctl status nginx
```

---

## Próximos Pasos

### Para usuarios:
1. Lee el [FAQ](docs/FAQ.md) completo
2. Descarga tus datos cada mes
3. Compara resultados

### Para desarrolladores:
1. Lee la [documentación completa](README.md)
2. Revisa el [roadmap](docs/ROADMAP.md)
3. Personaliza según necesites

---

## Enlaces Importantes

- **README completo:** [README.md](README.md)
- **Guía de deployment:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Obtener datos de IG:** [docs/OBTENER-DATOS.md](docs/OBTENER-DATOS.md)
- **Configuración Nginx:** [docs/NGINX.md](docs/NGINX.md)
- **FAQ:** [docs/FAQ.md](docs/FAQ.md)
- **Roadmap:** [docs/ROADMAP.md](docs/ROADMAP.md)

---

## ¿Necesitas ayuda?

1. Lee la documentación completa
2. Revisa el FAQ
3. Verifica los logs
4. Contacta al desarrollador

---

**¡Disfruta usando Instagram Analyzer!** 🎉
