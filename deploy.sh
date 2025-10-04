#!/bin/bash

# Instagram Analyzer - Script de Deployment
# Automatiza el deployment en servidor Contabo

set -e  # Salir si hay error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Banner
echo "========================================="
echo "   Instagram Analyzer - Deployment      "
echo "========================================="
echo ""

# Verificar si se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
    print_error "Por favor ejecuta como root (usa sudo)"
    exit 1
fi

# Variables
PROJECT_DIR="/var/www/instagram-analyzer"
NGINX_CONFIG="/etc/nginx/sites-available/instagram-analyzer"
BACKUP_DIR="/root/backups/instagram-analyzer"

# Menú principal
echo "Selecciona una opción:"
echo "1) Instalación completa (nuevo servidor)"
echo "2) Actualizar archivos del proyecto"
echo "3) Configurar Nginx"
echo "4) Instalar SSL (Let's Encrypt)"
echo "5) Ver logs"
echo "6) Hacer backup"
echo "7) Restaurar backup"
echo "8) Verificar instalación"
echo "9) Desinstalar"
echo "0) Salir"
echo ""
read -p "Opción: " option

case $option in
    1)
        print_info "Iniciando instalación completa..."
        
        # Actualizar sistema
        print_info "Actualizando sistema..."
        apt update && apt upgrade -y
        print_success "Sistema actualizado"
        
        # Instalar Nginx
        if ! command -v nginx &> /dev/null; then
            print_info "Instalando Nginx..."
            apt install nginx -y
            systemctl start nginx
            systemctl enable nginx
            print_success "Nginx instalado"
        else
            print_success "Nginx ya está instalado"
        fi
        
        # Crear directorio del proyecto
        print_info "Creando directorio del proyecto..."
        mkdir -p $PROJECT_DIR
        print_success "Directorio creado: $PROJECT_DIR"
        
        print_success "Instalación base completa"
        print_info "Ahora sube los archivos del proyecto a: $PROJECT_DIR"
        print_info "Luego ejecuta la opción 3 para configurar Nginx"
        ;;
        
    2)
        print_info "Actualizando archivos del proyecto..."
        
        if [ ! -d "$PROJECT_DIR" ]; then
            print_error "El directorio del proyecto no existe: $PROJECT_DIR"
            exit 1
        fi
        
        # Hacer backup antes de actualizar
        print_info "Creando backup..."
        mkdir -p $BACKUP_DIR
        timestamp=$(date +%Y%m%d_%H%M%S)
        tar -czf "$BACKUP_DIR/backup_$timestamp.tar.gz" -C /var/www instagram-analyzer
        print_success "Backup creado: $BACKUP_DIR/backup_$timestamp.tar.gz"
        
        # Aquí irían los comandos para actualizar (git pull, etc)
        print_info "Copia manualmente los nuevos archivos a: $PROJECT_DIR"
        
        # Establecer permisos
        print_info "Estableciendo permisos..."
        chown -R www-data:www-data $PROJECT_DIR
        chmod -R 755 $PROJECT_DIR
        print_success "Permisos establecidos"
        
        # Recargar Nginx
        print_info "Recargando Nginx..."
        nginx -t && systemctl reload nginx
        print_success "Nginx recargado"
        ;;
        
    3)
        print_info "Configurando Nginx..."
        
        read -p "¿Tienes un dominio? (s/n): " has_domain
        
        if [ "$has_domain" = "s" ]; then
            read -p "Ingresa tu dominio (ej: tudominio.com): " domain
            
            # Crear configuración con dominio
            cat > $NGINX_CONFIG << EOF
server {
    listen 80;
    server_name $domain www.$domain;

    root $PROJECT_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF
            print_success "Configuración creada para: $domain"
        else
            # Obtener IP del servidor
            server_ip=$(hostname -I | awk '{print $1}')
            
            # Crear configuración con IP
            cat > $NGINX_CONFIG << EOF
server {
    listen 80;
    server_name $server_ip;

    root $PROJECT_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF
            print_success "Configuración creada para IP: $server_ip"
        fi
        
        # Activar configuración
        ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
        
        # Eliminar default si existe
        if [ -f "/etc/nginx/sites-enabled/default" ]; then
            rm /etc/nginx/sites-enabled/default
            print_info "Configuración default eliminada"
        fi
        
        # Verificar y recargar
        nginx -t
        systemctl reload nginx
        print_success "Nginx configurado y recargado"
        
        if [ "$has_domain" = "s" ]; then
            print_info "Tu sitio está disponible en: http://$domain"
            print_info "Para HTTPS, ejecuta la opción 4"
        else
            print_info "Tu sitio está disponible en: http://$server_ip"
        fi
        ;;
        
    4)
        print_info "Instalando SSL con Let's Encrypt..."
        
        read -p "Ingresa tu dominio: " domain
        read -p "Ingresa tu email: " email
        
        # Instalar Certbot
        if ! command -v certbot &> /dev/null; then
            print_info "Instalando Certbot..."
            apt install certbot python3-certbot-nginx -y
            print_success "Certbot instalado"
        fi
        
        # Obtener certificado
        certbot --nginx -d $domain -d www.$domain --email $email --agree-tos --no-eff-email
        
        print_success "SSL instalado correctamente"
        print_info "Tu sitio ahora está disponible en: https://$domain"
        ;;
        
    5)
        print_info "Mostrando logs de Nginx..."
        echo ""
        echo "=== Logs de acceso (últimas 20 líneas) ==="
        tail -20 /var/log/nginx/access.log
        echo ""
        echo "=== Logs de error (últimas 20 líneas) ==="
        tail -20 /var/log/nginx/error.log
        ;;
        
    6)
        print_info "Creando backup..."
        mkdir -p $BACKUP_DIR
        timestamp=$(date +%Y%m%d_%H%M%S)
        tar -czf "$BACKUP_DIR/backup_$timestamp.tar.gz" -C /var/www instagram-analyzer
        print_success "Backup creado: $BACKUP_DIR/backup_$timestamp.tar.gz"
        ;;
        
    7)
        print_info "Backups disponibles:"
        ls -lh $BACKUP_DIR
        echo ""
        read -p "Ingresa el nombre del backup a restaurar: " backup_file
        
        if [ -f "$BACKUP_DIR/$backup_file" ]; then
            print_info "Restaurando backup..."
            tar -xzf "$BACKUP_DIR/$backup_file" -C /var/www
            chown -R www-data:www-data $PROJECT_DIR
            chmod -R 755 $PROJECT_DIR
            print_success "Backup restaurado"
        else
            print_error "Backup no encontrado"
        fi
        ;;
        
    8)
        print_info "Verificando instalación..."
        
        # Verificar Nginx
        if systemctl is-active --quiet nginx; then
            print_success "Nginx está corriendo"
        else
            print_error "Nginx NO está corriendo"
        fi
        
        # Verificar archivos del proyecto
        if [ -f "$PROJECT_DIR/index.html" ]; then
            print_success "Archivos del proyecto presentes"
        else
            print_error "Archivos del proyecto NO encontrados"
        fi
        
        # Verificar configuración de Nginx
        nginx -t && print_success "Configuración de Nginx válida" || print_error "Error en configuración de Nginx"
        
        # Verificar firewall
        if command -v ufw &> /dev/null; then
            print_info "Estado del firewall:"
            ufw status
        fi
        ;;
        
    9)
        print_error "¡ADVERTENCIA! Esto eliminará completamente la instalación"
        read -p "¿Estás seguro? (escribe 'SI' para confirmar): " confirm
        
        if [ "$confirm" = "SI" ]; then
            print_info "Desinstalando..."
            
            # Eliminar configuración de Nginx
            rm -f /etc/nginx/sites-enabled/instagram-analyzer
            rm -f /etc/nginx/sites-available/instagram-analyzer
            
            # Eliminar archivos del proyecto
            rm -rf $PROJECT_DIR
            
            # Recargar Nginx
            nginx -t && systemctl reload nginx
            
            print_success "Desinstalación completa"
        else
            print_info "Desinstalación cancelada"
        fi
        ;;
        
    0)
        print_info "Saliendo..."
        exit 0
        ;;
        
    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

echo ""
print_success "Operación completada"
