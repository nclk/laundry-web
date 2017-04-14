FROM nginx

ADD ./public /usr/share/nginx/html
ADD ./nginx.conf.template /etc/nginx/nginx.conf.template
ADD ./bin/init /usr/bin/init-sutweb

RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list.d/foo.list && apt-get update
RUN apt-get install -y -t jessie-backports certbot 
