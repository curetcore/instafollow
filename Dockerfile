# Usar Nginx como servidor web para archivos estáticos
FROM nginx:alpine

# Etiqueta de versión para forzar rebuild
LABEL version="2.1"
LABEL description="Instagram Analyzer - Updated instructions and search feature"

# Copiar archivos de la aplicación al directorio de nginx
COPY . /usr/share/nginx/html

# Copiar configuración personalizada de nginx si es necesaria
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Limpiar caché y archivos innecesarios
RUN rm -rf /usr/share/nginx/html/.git \
    && rm -rf /usr/share/nginx/html/.gitignore \
    && rm -rf /usr/share/nginx/html/README.md \
    && rm -rf /usr/share/nginx/html/docs \
    && rm -rf /usr/share/nginx/html/deploy.sh

# Exponer el puerto 80
EXPOSE 80

# Nginx se ejecuta automáticamente
CMD ["nginx", "-g", "daemon off;"]