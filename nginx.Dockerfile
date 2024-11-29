FROM nginx:1.27.1

RUN mkdir /usr/local/ssl/certificate

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY /certificate /usr/local/ssl/certificate

EXPOSE 80
EXPOSE 443