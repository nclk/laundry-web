FROM nginx

WORKDIR /web
ADD . /web

RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list.d/foo.list && apt-get update

RUN apt-get install -y curl gnupg procps
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install -y nodejs git
RUN apt-get install -y -t jessie-backports certbot

ADD ./nginx.conf.template /etc/nginx/nginx.conf.template
ADD ./bin/init /usr/bin/init-sutweb
RUN npm i -g polymer-cli@next bower

#CMD [ "bash", "/usr/bin/init-sutweb" ]
