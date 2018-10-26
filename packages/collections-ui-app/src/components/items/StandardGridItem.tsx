import * as React from "react"
import {ResultContext} from "../core"
import {GridItemDisplay} from "../ui/GridItemDisplay"
import {ItemProps} from "./ItemProps"
import {buildImagePreview, buildImageView, buildThumbnailReference, getSchema, resolveManifestId, shortenTitle} from './ItemUtils'

const extend = require("lodash/extend")

export class StandardGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {previewUrl, viewerUrl, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const manifestId = resolveManifestId(source)
    const thumbnail = buildThumbnailReference(source.thumbnail)
    if (thumbnail) {
      const schema = getSchema(source, manifestId, thumbnail, null)
      const imageLink = buildImagePreview(previewUrl, source.thumbnail, manifestId)
      const viewUrl = buildImageView(viewerUrl, manifestId)
      const titleString = shortenTitle(source)
      return (
        <ResultContext.Provider value={result}>
          <GridItemDisplay
            contentUrl={viewUrl}
            imageLink={imageLink}
            schema={schema}
            thumbnail={thumbnail}
            titleString={titleString}
            {...this.props}
          />
        </ResultContext.Provider>)
    } else {
      return (null)
    }
  }
}

export default StandardGridItem
