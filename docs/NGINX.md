# 🔧 Configuraciones de Nginx

Configuraciones adicionales y optimizadas para Instagram Analyzer.

## 📝 Configuración completa con HTTPS

Archivo: `/etc/nginx/sites-available/instagram-analyzer`

```nginx
# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
}

# Configuración HTTPS
server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    # Configuración SSL optimizada
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Root y index
    root /var/www/instagram-analyzer;
    index index.html;

    # Logs
    access_log /var/log/nginx/instagram-analyzer.access.log;
    error_log /var/log/nginx/instagram-analyzer.error.log;

    # Tamaño máximo de carga
    client_max_body_size 10M;

    # Comprimir archivos
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        font/truetype
        font/opentype
        application/vnd.ms-fontobject
        image/svg+xml;
    gzip_disable "msie6";

    # Servir archivos estáticos
    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # Caché para recursos estáticos
    location ~* \.(css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;

    # Ocultar versión de Nginx
    server_tokens off;

    # Denegar acceso a archivos ocultos
    location ~ /\. {
        deny all;
    }
}
```

## 🚀 Configuración de alto rendimiento

Para sitios con mucho tráfico:

```nginx
# /etc/nginx/nginx.conf

user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    # Básico
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Tipos MIME
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Compresión Gzip
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Límites de carga
    client_max_body_size 10M;
    client_body_buffer_size 128k;

    # Buffers
    client_header_buffer_size 1k;
    large_client_header_buffers 4 16k;

    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;

    # Incluir configuraciones de sitios
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

## 🛡️ Configuración de seguridad extrema

```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com;

    # ... (certificados SSL)

    # Seguridad máxima
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self' data:; frame-ancestors 'none';" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Rate limiting (prevenir abuso)
    limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
    limit_req zone=one burst=20;

    # Denegar bots maliciosos
    if ($http_user_agent ~* (bot|crawler|spider|scraper)) {
        return 403;
    }

    # ... resto de configuración
}
```

## 📊 Configuración con logs detallados

```nginx
# Formato de log personalizado
log_format detailed '$remote_addr - $remote_user [$time_local] '
                   '"$request" $status $body_bytes_sent '
                   '"$http_referer" "$http_user_agent" '
                   'rt=$request_time uct="$upstream_connect_time" '
                   'uht="$upstream_header_time" urt="$upstream_response_time"';

server {
    # ...
    access_log /var/log/nginx/instagram-analyzer.access.log detailed;
    # ...
}
```

## 🌍 Configuración multi-dominio

Si quieres servir en múltiples dominios:

```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com otrodominio.com;

    # Mismo certificado o certificados separados
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    # ... resto de configuración
}
```

## 🔄 Configuración con subdominio

Para `instagram.tudominio.com`:

```nginx
server {
    listen 443 ssl http2;
    server_name instagram.tudominio.com;

    ssl_certificate /etc/letsencrypt/live/instagram.tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/instagram.tudominio.com/privkey.pem;

    root /var/www/instagram-analyzer;
    index index.html;

    # ... resto de configuración
}
```

## 🎯 Configuración con balanceo de carga

Si expandes a múltiples servidores:

```nginx
upstream instagram_backend {
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
    least_conn;
}

server {
    # ...
    location / {
        proxy_pass http://instagram_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📱 Configuración con redirección móvil

```nginx
server {
    # ...
    
    # Detectar móviles
    set $mobile_rewrite do_not_perform;
    
    if ($http_user_agent ~* "(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino") {
        set $mobile_rewrite perform;
    }
    
    # Opcional: servir contenido específico para móviles
    if ($mobile_rewrite = perform) {
        # add_header X-Mobile-Device "true";
    }
}
```

## 🔧 Comandos útiles

```bash
# Verificar configuración
nginx -t

# Recargar sin downtime
nginx -s reload

# Ver configuración activa
nginx -T

# Ver versión y módulos
nginx -V

# Testear performance
ab -n 1000 -c 10 https://tudominio.com/
```

## 📊 Monitoreo

### Habilitar página de estado

```nginx
server {
    listen 127.0.0.1:8080;
    server_name localhost;

    location /nginx_status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        deny all;
    }
}
```

Ver estadísticas:
```bash
curl http://127.0.0.1:8080/nginx_status
```

---

**Notas:**
- Siempre haz `nginx -t` antes de reiniciar
- Guarda backups de configuraciones funcionales
- Monitorea logs después de cambios
