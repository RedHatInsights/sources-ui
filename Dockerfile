FROM registry.access.redhat.com/ubi8/ubi:8.2-343

ENV WORKDIR /sources-ui/
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR
COPY . $WORKDIR

# Enable nodejs & python2.7 module streams to lock versions
RUN dnf -y --disableplugin=subscription-manager module enable nodejs:10 && \
    dnf -y --disableplugin=subscription-manager module enable python27:2.7 && \
    dnf -y --disableplugin=subscription-manager --setopt=tsflags=nodocs install \
       npm nodejs \
       python2 \
       make gcc-c++ git && \
    dnf --disableplugin=subscription-manager clean all

RUN npm install
RUN npm rebuild node-sass

EXPOSE 8001 8002
CMD [ "npm", "run", "start", "--", "--host", "0.0.0.0" ]
