FROM node:8-alpine

ENV WORKDIR /sources-ui/
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR
COPY . $WORKDIR

# Use apk to install python. Python is needed by one of the javascript dependencies.
#
# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++

RUN npm install
RUN npm rebuild node-sass
RUN apk del build-dependencies

EXPOSE 8001 8002
CMD [ "npm", "run", "start", "--", "--host", "0.0.0.0" ]
