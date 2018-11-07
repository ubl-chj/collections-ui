## Collections UI
[![Build Status](https://travis-ci.org/ubl-chj/collections-ui.svg?branch=master)](https://travis-ci.org/ubl-chj/collections-ui)

An interface that sources ElasticSearch indices and provides collections of IIIF manifests.

See it live at [https://iiif.cloud](https://iiif.cloud/?utm_source=github&utm_medium=referral&utm_campaign=iiif)

Also provides an image viewer (WIP).

In conjunction with [Elastic Manifests](https://github.com/ubl-chj/elastic-manifests),
the UI provides access to dynamic keyword sourced manifest assembly.

## Install Packages
```bash
$ lerna init
$ npm run bootstrap
$ cd ../collections-ui-commons
$ npm install
$ cd ../manifest-viewer
$ npm install
$ cd ../collections-ui-app
$ npm install
```
* Note that if you are using Node >= v11, run npm install with the --build-from-source flag.  See Dockerfile for reference.

## Build and Run (from root directory)

```bash
$ lerna run build
$ lerna run start
```

## Environment

Create the file `packages/collections-ui-app/.env`
Current reference implementation includes these required constants:

```bash
REACT_APP_BASEURL=https://collections.iiif.cloud
REACT_APP_ELASTICSEARCH_HOST=https://es.iiif.cloud/
REACT_APP_OSD_BASE=/preview
REACT_APP_OSD_COMPONENT_BASE=/view
``` 

## Docker Compose
```bash
docker-compose up
```

See [manifest-metadata-processor](https://github.com/ub-leipzig/manifest-metadata-processor) for
the tooling to create JSON documents for elastic search from manifest metadata.

## Prototype (WIP)
![](docs/collections-ui-v0.1.0.png?raw=true)