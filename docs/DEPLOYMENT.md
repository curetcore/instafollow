# 🚀 Guía de Deployment - Contabo VPS

Guía paso a paso para deployar Instagram Analyzer en tu servidor Contabo.

## 📋 Requisitos previos

- VPS Contabo activo
- Acceso SSH (usuario root o sudo)
- Dominio apuntando a tu IP (opcional pero recomendado)

## 🔧 Paso 1: Preparar el servidor

### Conectarse al servidor

```bash
ssh root@TU_IP_CONTABO
```

### Actualizar el sistema

```bash
apt update && apt upgrade -y
```

### Instalar Nginx

```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

Verifica: Abre `http://TU_IP` en el navegador. Deberías ver la página de bienvenida de Nginx.

## 📁 Paso 2: Subir archivos

### Opción A: Usando SCP (desde tu computadora)

```bash
# Desde tu máquina local
scp -r instagram-analyzer root@TU_IP:/var/www/
```

### Opción B: Usando Git

```bash
# En el servidor
cd /var/www/
git clone TU_REPOSITORIO instagram-analyzer
```

### Opción C: Manualmente con FileZilla

1. Descarga FileZilla
2. Conecta a tu servidor (SFTP, puerto 22)
3. Sube la carpeta completa a `/var/www/instagram-analyzer`

### Establecer permisos

```bash
cd /var/www/instagram-analyzer
chown -R www-data:www-data .
chmod -R 755 .
```

## ⚙️ Paso 3: Configurar Nginx

### Crear archivo de configuración

```bash
nano /etc/nginx/sites-available/instagram-analyzer
```

### Configuración básica (solo IP)

Pega esto:

```nginx
server {
    listen 80;
    server_name TU_IP;

    root /var/www/instagram-analyzer;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Optimizaciones
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Configuración con dominio

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    root /var/www/instagram-analyzer;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Optimizaciones
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Activar la configuración

```bash
# Crear symlink
ln -s /etc/nginx/sites-available/instagram-analyzer /etc/nginx/sites-enabled/

# Eliminar configuración por defecto (opcional)
rm /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

## 🔒 Paso 4: Configurar SSL (HTTPS)

### Instalar Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

### Obtener certificado

```bash
certbot --nginx -d tudominio.com -d www.tudominio.com
```

Sigue las instrucciones:
- Ingresa tu email
- Acepta términos
- Elige redirección automática a HTTPS (opción 2)

### Renovación automática

Certbot configura renovación automática. Verifica:

```bash
certbot renew --dry-run
```

## 🌐 Paso 5: Configurar DNS

En tu proveedor de dominio (Namecheap, GoDaddy, etc.):

```
Tipo    Nombre    Valor           TTL
A       @         TU_IP_CONTABO   3600
A       www       TU_IP_CONTABO   3600
```

Espera 15-60 minutos para propagación.

## ✅ Verificación

1. Abre `http://tudominio.com` o `http://TU_IP`
2. Deberías ver Instagram Analyzer
3. Prueba subir archivos JSON
4. Verifica que funcione el análisis

## 🔥 Paso 6: Configurar Firewall

```bash
# Instalar UFW
apt install ufw -y

# Configurar reglas
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS

# Activar
ufw enable

# Verificar estado
ufw status
```

## 📊 Monitoreo y logs

### Ver logs de Nginx

```bash
# Logs de acceso
tail -f /var/log/nginx/access.log

# Logs de errores
tail -f /var/log/nginx/error.log
```

### Ver estado de Nginx

```bash
systemctl status nginx
```

## 🔄 Actualizar la aplicación

```bash
cd /var/www/instagram-analyzer

# Si usas Git
git pull

# O reemplaza archivos manualmente

# Reiniciar Nginx
systemctl restart nginx
```

## 🎨 Personalización adicional

### Cambiar límite de carga de archivos (opcional)

```bash
nano /etc/nginx/nginx.conf
```

Agrega en `http {}`:

```nginx
client_max_body_size 10M;
```

### Comprimir archivos

En tu configuración de Nginx, agrega:

```nginx
gzip on;
gzip_types text/css application/javascript application/json;
gzip_min_length 1000;
```

## 🐛 Solución de problemas

### Error 403 Forbidden

```bash
# Verificar permisos
ls -la /var/www/instagram-analyzer
chown -R www-data:www-data /var/www/instagram-analyzer
chmod -R 755 /var/www/instagram-analyzer
```

### Nginx no inicia

```bash
# Ver error específico
nginx -t

# Ver logs
tail -20 /var/log/nginx/error.log
```

### Página no carga

```bash
# Verificar que Nginx esté corriendo
systemctl status nginx

# Reiniciar si es necesario
systemctl restart nginx

# Verificar firewall
ufw status
```

## 📱 Compartir con amigos

Una vez deployado:

1. Tu link: `https://tudominio.com`
2. Compártelo libremente
3. No requiere instalación
4. Funciona en móvil y desktop

## 🚀 Optimizaciones avanzadas

### Caché de navegador

Ya incluido en la configuración de Nginx.

### CDN (opcional)

Para mayor velocidad global:
- Cloudflare (gratis)
- BunnyCDN
- AWS CloudFront

## 💡 Tips

- Haz backup de `/var/www/instagram-analyzer` regularmente
- Monitorea el uso de recursos con `htop`
- Actualiza el sistema mensualmente: `apt update && apt upgrade`
- Revisa logs semanalmente

## 📝 Comandos útiles

```bash
# Reiniciar Nginx
systemctl restart nginx

# Recargar configuración sin downtime
systemctl reload nginx

# Ver logs en tiempo real
tail -f /var/log/nginx/access.log

# Verificar sintaxis de configuración
nginx -t

# Ver uso de disco
df -h

# Ver uso de memoria
free -h
```

## ✅ Checklist final

- [ ] Nginx instalado y corriendo
- [ ] Archivos en `/var/www/instagram-analyzer`
- [ ] Permisos correctos (755)
- [ ] Configuración de Nginx creada
- [ ] DNS configurado (si usas dominio)
- [ ] SSL instalado (si usas dominio)
- [ ] Firewall configurado
- [ ] Sitio accesible desde navegador
- [ ] Funcionalidad probada

---

¡Listo! Tu Instagram Analyzer está en línea 🎉
