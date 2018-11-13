import {UUIDResolver} from 'manifest-uuid'
import * as React from 'react'
import {Domain} from '../../constants'
import {SchemaAdapter} from '../schema'

const uuidv5 = require('uuidv5')

export function shortenTitle(name) {
  let shortTitle
  if (name) {
    if (!Array.isArray(name)) {
      if (name.length >= 80) {
        shortTitle =  name.substr(0, 80) + "... "
      } else {
        return name;
      }
    } else {
      shortTitle =  name[0]
    }
  }
  return shortTitle
}

export function buildImagePreview(previewUrl: string, thumbnail: string, manifest?: string) {
  // hack for Getty
  let thumbnailLink
  if (thumbnail) {
    if (thumbnail.includes('/full')) {
      thumbnailLink = thumbnail.split('/full')[0]
    } else {
      thumbnailLink = thumbnail
    }
  }
  if (manifest) {
    return previewUrl + '/' + manifest + '?image=' + thumbnailLink
  } else {
    return previewUrl + '?image=' + thumbnail
  }
}

export function buildImageView(viewerUrl: string, manifest: string) {
  return viewerUrl + '/' + manifest
}

export function getAuthor(source, bemBlocks) {
  if (source.Artist) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Artist:</b> {source.Artist}</h3>
  }
}

export function getSubject(source, bemBlocks) {
  if (source['Subject(s)']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Object Type:</b> {source['Object Type']}</h3>
  }
}

export function getSchema(result, contentUrl, thumbnail, position) {
  const adapter = new SchemaAdapter(result, contentUrl, thumbnail, position)
  return adapter.buildStructuredData().dataLayer
}

export function buildGenerator(generatorUrl: string, index: string) {
  return generatorUrl + "?type=atomic&index=" + index + "&q="
}

export function buildThumbnailReference(thumbnail) {
  let thumbnailLink
  if (thumbnail) {
    if (thumbnail.includes('/full')) {
      thumbnailLink = thumbnail
      // support image api v1 providers (this should not be a long list)
    } else if (thumbnail.includes(Domain.LEGACY_API_COLLECTIONS)) {
     thumbnailLink = thumbnail + Domain.THUMBNAIL_NATIVE_API_REQUEST
    } else {
      thumbnailLink = thumbnail + Domain.THUMBNAIL_API_REQUEST
    }
  } else {
    thumbnailLink = thumbnail
  }
  return thumbnailLink
}

export function resolveName(schema) {
  if (schema.mainEntity.name) {
    return schema.mainEntity.name
  } else {
    return schema.mainEntity.alternateName
  }
}

export function resolveCreator(schema) {
  if (schema.mainEntity.creator) {
    return {__html: schema.mainEntity.creator}
  } else {
    return null
  }
}

export function resolveManifestId(source) {
  if (source.manifest) {
    let manifest;
    const regexp = /http[^s]/i
    if (source.manifest.match(regexp)) {
      manifest = source.manifest.replace('http', 'https')
    } else {
      manifest = source.manifest
    }
    return uuidv5('url', manifest)
  } else if (source.Manifest) {
    return uuidv5('url', source.Manifest)
  }
}
