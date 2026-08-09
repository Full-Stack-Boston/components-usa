# Static dual-site museum demo (no Node build required at runtime).
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY prominent.components-usa.com/ /usr/share/nginx/html/
COPY compact.components-usa.com/ /usr/share/nginx/html/compact/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
