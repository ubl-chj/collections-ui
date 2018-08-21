import * as React from "react";
import {Domain} from '../../constants'
import {GridItemDisplay} from "../ui/GridItemDisplay";
import {ItemProps} from './ItemProps'
import {buildImagePreview, buildImageView, buildUBLManifestId, getSchema, shortenTitle} from './ItemUtils'
import {ResultContext} from "../core";
const extend = require("lodash/extend")

export class AtomicGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {result, previewUrl, viewerUrl} = this.props
    if (result) {
      const source = extend({}, result._source, result.highlight)
      const thumbnail = source.iiifService + Domain.THUMBNAIL_API_REQUEST
      const manifestId = buildUBLManifestId(source.iiifService)
      const imageLink = buildImagePreview(previewUrl, source.iiifService, manifestId)
      const viewUrl = buildImageView(viewerUrl, manifestId)
      const schema = getSchema(source, manifestId, thumbnail, source.imageIndex)
      const titleString = shortenTitle(schema.mainEntity.name)
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
        </ResultContext.Provider>
      )
    } else {
      return null
    }
  }
}

export default AtomicGridItem;
