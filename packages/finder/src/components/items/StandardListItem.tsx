import * as React from "react"
import {ResultContext} from "../core"
import {ListItemDisplay} from "../ui/ListItemDisplay";
import {ItemProps} from "./ItemProps"
import {buildImagePreview, buildImageView, buildThumbnailReference, getSchema, resolveManifestId} from './ItemUtils'

const extend = require("lodash/extend")

export class StandardListItem extends React.Component<ItemProps, any> {

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
      return (
        <ResultContext.Provider value={result}>
          <ListItemDisplay
            contentUrl={viewUrl}
            imageLink={imageLink}
            schema={schema}
            thumbnail={thumbnail}
            {...this.props}
          />
        </ResultContext.Provider>)
    } else {
      return (null)
    }
  }
}

export default StandardListItem
