## Collections UI
[![Build Status](https://travis-ci.org/ubl-chj/collections-ui.svg?branch=master)](https://travis-ci.org/ubl-chj/collections-ui)

An interface that sources ElasticSearch indices and provides collections of IIIF manifests.

See it live at [https://collections.iiif.cloud/?utm_source=github&utm_medium=referral&utm_campaign=iiif](https://collections.iiif.cloud)

Also provides an image viewer (WIP).

In conjunction with [Elastic Manifests](https://github.com/ubl-chj/elastic-manifests),
the UI provides access to dynamic keyword sourced manifest assembly.

## Install Finder and Viewer
```bash
$ cd packages/ubl-viewer
$ yarn
$ cd ../finder
$ npm install
```

## Build and Run (from root directory)

```bash
$ lerna run build
$ lerna run start
```

## Environment

Create the file `packages/finder/.env`
Current reference implementation includes these required constants:

```bash
REACT_APP_ELASTICSEARCH_HOST=https://es.iiif.cloud/
REACT_APP_VIEWER_BASE=https://viewer.iiif.cloud
REACT_APP_GENERATOR_BASE=https://manifests.iiif.cloud/generator
REACT_APP_UBL_INDEX=m3
REACT_APP_ORP_INDEX=vp4
REACT_APP_EC_INDEX=ec7
REACT_APP_ATOMIC_INDEX=t4
REACT_APP_OSD_BASE=/osd
REACT_APP_OSD_COMPONENT_BASE=/component
REACT_APP_UBL_IMAGE_SERVICE_BASE=https://iiif.ub.uni-leipzig.de/iiif/j2k/
REACT_APP_UBL_IMAGE_VIEWER_BASE=https://digital.ub.uni-leipzig.de/object/viewid/
REACT_APP_EC_IMAGE_SERVICE_BASE=https://www.e-codices.unifr.ch:443/loris/
``` 

## Docker Compose
```bash
docker-compose up
```

See [manifest-metadata-processor](https://github.com/ub-leipzig/manifest-metadata-processor) for
the tooling to create JSON documents for elastic search from manifest metadata.

## Prototype (WIP)
![](docs/collections-ui-v0.1.0.png?raw=true)