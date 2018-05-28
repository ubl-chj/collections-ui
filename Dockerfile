FROM node:latest

MAINTAINER Christopher Johnson <chjohnson39@gmail.com>
LABEL description = "Collections UI Web Application"

WORKDIR /srv/uv

# Download and Install uv-webapp (master)
RUN git clone https://github.com/ub-leipzig/collections-ui.git ./

##Install
RUN npm install
RUN yarn

# Copy default.json configuration into the image
#COPY cfg/* config/

COPY entrypoint.sh /entrypoint.sh
RUN chmod 700 /entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "start" ]