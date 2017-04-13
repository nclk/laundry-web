FROM nginx

ADD ./public /usr/share/nginx/html
ADD ./nginx.conf.template /etc/nginx/nginx.conf.template

RUN add-apt-repository -y ppa:certbot/certbot
RUN apt-get update
RUN apt-get install certbot
