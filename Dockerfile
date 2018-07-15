FROM node:latest

MAINTAINER Christopher Johnson <chjohnson39@gmail.com>
LABEL description = "Collections UI Web Application"

WORKDIR /srv/collections-ui

# Download and Install collections-ui (master)
RUN git clone https://github.com/ub-leipzig/collections-ui.git ./
COPY packages/finder/.env packages/finder/.env
##Install
RUN npm i npm@latest -g
RUN npm install --global lerna
WORKDIR /srv/collections-ui/packages/ubl-viewer
RUN yarn
WORKDIR /srv/collections-ui/packages/finder
RUN npm install
WORKDIR /srv/collections-ui
RUN lerna run build
WORKDIR /srv/collections-ui/packages/finder
RUN yarn global add serve

COPY entrypoint.sh /entrypoint.sh
RUN chmod 700 /entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "-s", "build" ]
