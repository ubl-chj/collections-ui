export interface ItemProps {
  bemBlocks: {
    item: Function
    container: Function
  }
  result: {
    _source: {
      thumbnail: string,
    }
    highlight: object
    inner_hits: object,
  }
  previewUrl: string
  viewerUrl: string
  searchkit2: any
}
