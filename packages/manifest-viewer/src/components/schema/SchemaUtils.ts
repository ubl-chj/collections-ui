import {Domain} from '../../constants';

const tagManager = require('react-gtm-module')

export function buildContentUrl() {
  return window.location.href
}

export function buildDescription(schema) {
  let description
  if (schema.mainEntity.description) {
    description = schema.mainEntity.description
  } else if (schema.mainEntity.name) {
    description = schema.mainEntity.name
  } else {
    description = schema.name
  }
  return description
}

export function buildStructuredData(schema) {
  const dataLayer = {
    dataLayer: schema,
    dataLayerName: 'schemaDataLayer',
  }
  tagManager.dataLayer(dataLayer)
}

export function buildThumbnail(manifest) {
  let thumbnail = manifest.getThumbnail()
  if (thumbnail) {
    thumbnail = thumbnail.id
  } else {
    thumbnail = Domain.LOGO_URL
  }
  return thumbnail
}
