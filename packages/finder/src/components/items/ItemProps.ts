export interface ItemProps {
  bemBlocks: {
    item: Function
    container: Function
  }
  result: {
    _source: object
    highlight: object
  }
  previewUrl: string
  viewerUrl: string
}
