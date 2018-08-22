import * as React from "react";
import {ResultContext} from "../core";
import {ListItemDisplay} from "../ui/ListItemDisplay";
import {ItemProps} from "./ItemProps";
import {buildImagePreview, buildImageView, buildThumbnailReference, getSchema} from './ItemUtils';

const extend = require("lodash/extend")

export class HarvardListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  buildListItem() {
    const {previewUrl, viewerUrl, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = buildThumbnailReference(source.thumbnail)

    if (thumbnail) {
      const manifestId = source.manifest
      const imageLink = buildImagePreview(previewUrl, source.thumbnail, manifestId)
      const viewUrl = buildImageView(viewerUrl, manifestId)
      const schema = getSchema(source, manifestId, thumbnail, null)
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
      return null;
    }
  }

  render() {
    return (this.buildListItem())
  }
}

export default HarvardListItem
