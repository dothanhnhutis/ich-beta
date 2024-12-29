FROM nginx:1.27.1


COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY cert/* /usr/local/ssl/cert

EXPOSE 80
EXPOSE 443
