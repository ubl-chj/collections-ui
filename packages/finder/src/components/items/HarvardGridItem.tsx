import * as React from "react";
import {ResultContext} from "../core";
import {GridItemDisplay} from "../ui/GridItemDisplay";
import {ItemProps} from './ItemProps'
import {buildImagePreview, buildImageView, buildThumbnailReference, getSchema, shortenTitle} from './ItemUtils';
const extend = require("lodash/extend")

export class HarvardGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  buildGridItem() {
    const {result, previewUrl, viewerUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = buildThumbnailReference(source.thumbnail)
    if (thumbnail) {
      const manifestId = source.manifest
      const imageLink = buildImagePreview(previewUrl, source.thumbnail, manifestId)
      const viewUrl = buildImageView(viewerUrl, manifestId)
      const schema = getSchema(source, manifestId, thumbnail, null)
      const titleString = shortenTitle(source.title)
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
      return null
    }
  }

  render() {
    return (this.buildGridItem())
  }
}

export default HarvardGridItem
