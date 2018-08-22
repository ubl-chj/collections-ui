import * as React from "react";
import {Domain} from "../../constants";
import {ResultContext} from "../core";
import {GridItemDisplay} from "../ui/GridItemDisplay";
import {ItemProps} from './ItemProps'
import {buildImagePreview, buildImageView, getSchema, shortenTitle} from './ItemUtils';

const extend = require("lodash/extend")

export class ECGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {result, previewUrl, viewerUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    const manifestId = source['identifier.manifest']
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
      </ResultContext.Provider>
    )
  }
}

export default ECGridItem;
