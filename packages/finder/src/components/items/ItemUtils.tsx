import * as React from "react";
import {SchemaAdapter} from "../schema";
import {Domain} from "../../constants";

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
