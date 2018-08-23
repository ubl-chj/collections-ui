export * from './components';
export * from "./core"

const tagManager = require('react-gtm-module')

const tagManagerArgs = {
  dataLayerName: 'schemaDataLayer',
  gtmId: 'GTM-KW98JC4',
}

tagManager.initialize(tagManagerArgs)
