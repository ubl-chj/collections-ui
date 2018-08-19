export function buildSchemaObject(source) {
  return {
    contentUrl: source.manifest,
    creator: source.creator,
    headline: source.title,
    thumbnail: source.thumbnail,
  }
}
