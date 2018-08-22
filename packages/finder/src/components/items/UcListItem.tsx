import * as React from "react"
import {Domain} from "../../constants"
import {ResultContext} from "../core"
import {ListItemDisplay} from "../ui/ListItemDisplay";
import {ItemProps} from "./ItemProps"
import {buildImagePreview, buildImageView, getSchema} from './ItemUtils'

const extend = require("lodash/extend")

export class UcListItem extends React.Component<ItemProps, any> {

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
    const thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    const contentUrl = source.Manifest
    const schema = getSchema(source, contentUrl, thumbnail, null)
    const imageLink = buildImagePreview(previewUrl, source.thumbnail, contentUrl)
    const viewUrl = buildImageView(viewerUrl, contentUrl)
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
  }
}

export default UcListItem
