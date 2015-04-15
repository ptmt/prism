FROM mhart/alpine-node

WORKDIR /src
ADD . .

RUN apk update && \
    apk add libc-dev gcc curl libgcc git && \
    apk add python make

ENV NODE_ENV PRODUCTION

RUN npm install --production

EXPOSE 8080
CMD ["node", "app/server.compiled"]
