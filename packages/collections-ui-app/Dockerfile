FROM node:latest

MAINTAINER Christopher Johnson <chjohnson39@gmail.com>
LABEL description = "React Discovery App"
ARG CIRCLE_BRANCH
ARG REACT_APP_ELASTICSEARCH_HOST
ARG REACT_APP_OSD_COMPONENT_BASE
ARG REACT_APP_FIREBASE_KEY
ARG REACT_APP_VISION_API_BASE
ARG REACT_APP_VISION_API_KEY
ARG REACT_APP_REDIS_BASE
ENV CIRCLE_BRANCH=${CIRCLE_BRANCH} \
    REACT_APP_ELASTICSEARCH_HOST=${REACT_APP_ELASTICSEARCH_HOST} \
    REACT_APP_OSD_COMPONENT_BASE=${REACT_APP_OSD_COMPONENT_BASE} \
    REACT_APP_FIREBASE_KEY=${REACT_APP_FIREBASE_KEY} \
    REACT_APP_VISION_API_BASE=${REACT_APP_VISION_API_BASE} \
    REACT_APP_VISION_API_KEY=${REACT_APP_VISION_API_KEY} \
    REACT_APP_REDIS_BASE=${REACT_APP_REDIS_BASE}
RUN printenv
WORKDIR /srv/collections-ui
RUN git clone https://github.com/ubl-chj/collections-ui.git ./
RUN git checkout ${CIRCLE_BRANCH}

RUN npm i npm@latest -g
RUN npm install --global lerna
RUN lerna bootstrap --hoist
RUN lerna run build
RUN yarn global add serve
COPY entrypoint.sh /entrypoint.sh
RUN chmod 700 /entrypoint.sh

EXPOSE 5000

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "-s", "build" ]
