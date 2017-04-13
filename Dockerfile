FROM nginx

ADD ./public /usr/share/nginx/html
ADD ./nginx.conf.template /etc/nginx/nginx.conf.template
