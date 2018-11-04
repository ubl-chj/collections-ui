import {IViewerComponentProps} from "../../../core/react"

export interface ItemProps extends IViewerComponentProps {
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
