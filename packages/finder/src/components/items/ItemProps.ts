export interface ItemProps {
  bemBlocks: {
    item: Function
    container: Function
  }
  result: {
    _source: object
    highlight: object
    inner_hits: object
  }
  previewUrl: string
  viewerUrl: string
}
