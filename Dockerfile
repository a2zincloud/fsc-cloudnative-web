FROM node:8

ADD FSCWebApp /FSCWebApp

WORKDIR /FSCWebApp

ADD https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 /usr/local/bin/jq
RUN chmod a+x /usr/local/bin/jq

RUN npm install

COPY startup.sh startup.sh

ENTRYPOINT ["./startup.sh"]