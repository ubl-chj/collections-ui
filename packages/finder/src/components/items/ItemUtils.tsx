import * as React from "react";
import {Domain} from "../../constants";
import {SchemaAdapter} from "../schema";

export function shortenTitle(title: string) {
  if (title.length >= 80) {
    return title.substr(0, 80) + "... "
  } else {
    return title;
  }
}

export function buildImagePreview(previewUrl: string, thumbnail: string, manifest?: string) {
  if (manifest) {
    return previewUrl + '?image=' + thumbnail + '&manifest=' + manifest
  } else {
    return previewUrl + '?image=' + thumbnail
  }
}

export function buildImageView(viewerUrl: string, manifest: string) {
    return viewerUrl + '?manifest=' + manifest
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

// this is a hack
export function  buildUBLManifestId(thumbnail) {
  const pathname = new URL(thumbnail).pathname
  const splitPath = pathname.split("/")
  return 'https://iiif.ub.uni-leipzig.de/' + splitPath[5] + '/manifest.json'
}

export function buildGenerator(generatorUrl: string, index: string) {
  return generatorUrl + "?type=atomic&index=" + index + "&q="
}

export function buildThumbnailReference(thumbnail) {
  let thumbnailLink
  if (thumbnail) {
    thumbnailLink = thumbnail + Domain.THUMBNAIL_API_REQUEST
  } else {
    thumbnailLink = thumbnail
  }
  return thumbnailLink
}

export function buildRandomThumbnailReference(thumbnail) {
  let thumbnailLink
  if (thumbnail) {
    thumbnailLink = thumbnail + Domain.RANDOM_THUMBNAIL_API_REQUEST
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

// this is an ugly workaround
export function resolveManifestId(source) {
  if (source.manifest) {
    return source.manifest
  } else if (source.Manifest) {
    return source.Manifest
  } else if (source.iiifService) {
    return (buildUBLManifestId(source.iiifService))
  } else if (source.id) {
    return source.id
  }
}

export function resolveThumbnailSource(source) {
  if (source.thumbnail) {
      return source.thumbnail
  } else if (source.iiifService) {
    return source.iiifService
  }
}

export function resolveThumbnail(thumbnail) {
    return thumbnail + Domain.THUMBNAIL_API_REQUEST
}
