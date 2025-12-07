# Minimal Dockerfile to serve the static site via Nginx (no chat server)
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
