# Usar Nginx como servidor web para archivos estáticos
FROM nginx:alpine

# Copiar archivos de la aplicación al directorio de nginx
COPY . /usr/share/nginx/html

# Copiar configuración personalizada de nginx si es necesaria
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Exponer el puerto 80
EXPOSE 80

# Nginx se ejecuta automáticamente
CMD ["nginx", "-g", "daemon off;"]