## Collections UI

An interface that sources ElasticSearch indices and provides IIIF manifests.

Also, in conjunction with [Elastic Manifests](https://github.com/ubl-chj/elastic-manifests),
the UI provides access to dynamic keyword sourced manifest assembly.

See `orp.js` for an example.

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

See [manifest-metadata-processor](https://github.com/ub-leipzig/manifest-metadata-processor) for
the tooling to create JSON documents for elastic search from manifest metadata.

## Prototype (WIP)
![](docs/collections-ui-v0.1.0.png?raw=true)