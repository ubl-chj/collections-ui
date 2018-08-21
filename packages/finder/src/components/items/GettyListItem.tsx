import * as React from "react";
import {ResultContext} from "../core";
import {ListItemDisplay} from "../ui/ListItemDisplay";
import {ItemProps} from "./ItemProps";
import {buildImagePreview, buildImageView, getSchema} from './ItemUtils';

const extend = require("lodash/extend")

export class GettyListItem extends React.Component<ItemProps, any> {

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

export default GettyListItem
