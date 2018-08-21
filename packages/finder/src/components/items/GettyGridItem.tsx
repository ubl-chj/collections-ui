import * as React from "react";
import {ResultContext} from "../core";
import {GridItemDisplay} from "../ui/GridItemDisplay";
import {ItemProps} from './ItemProps'
import {buildImagePreview, buildImageView, getSchema, shortenTitle} from './ItemUtils';

const extend = require("lodash/extend")

export class GettyGridItem extends React.Component<ItemProps, any> {

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
    const thumbnail = source.thumbnail
    const imageBase = thumbnail.split('/full')[0]
    const manifestId = source.id
    const imageLink = buildImagePreview(previewUrl, imageBase, manifestId)
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
  }
}

export default GettyGridItem
