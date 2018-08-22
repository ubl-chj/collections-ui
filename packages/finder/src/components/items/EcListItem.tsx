import * as React from "react";
import {Domain} from "../../constants";
import {ResultContext} from "../core";
import {ListItemDisplay} from "../ui/ListItemDisplay";
import {ItemProps} from './ItemProps'
import {buildImagePreview, buildImageView, getSchema} from './ItemUtils';

const extend = require("lodash/extend")

export class ECListItem extends React.Component<ItemProps, any> {

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
  }
}

export default ECListItem;
