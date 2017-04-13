FROM nginx

ADD ./public /usr/share/nginx/html
ADD ./nginx.conf.template /etc/nginx/nginx.conf.template

RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list.d/foo.list && apt-get update
RUN apt-get install -y -t jessie-backports certbot 
RUN certbot certonly --webroot -w /usr/share/nginx/html \
	-d qa.sut.htvtools.us -d prod.sut.htvtools.us \
	--agree-tos --email tjb1982@gmail.com --non-interactive
