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
