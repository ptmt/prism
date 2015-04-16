FROM mhart/alpine-node

RUN apk update && \
    apk add libc-dev gcc curl libgcc git && \
    apk add python make

ENV NODE_ENV PRODUCTION

WORKDIR /src
ADD . .

RUN npm install --production
RUN npm run postinstall

EXPOSE 8080
CMD ["node", "app/server.compiled"]
