import * as React from "react";
import {Domain} from "../../constants";
import {ResultContext} from "../core";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {Thumbnail, Title} from "../ui";
import {ItemProps} from './ItemProps'
import {buildImagePreview, buildImageView, shortenTitle} from './ItemUtils';
import {buildSchemaObject} from './SchemaAdapter';
const extend = require("lodash/extend")

export class StandardGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  buildGridItem() {
    const {result, bemBlocks, previewUrl, viewerUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const schema = buildSchemaObject(source)
    let thumbnail
    if (schema.thumbnail) {
      thumbnail = schema.thumbnail + Domain.THUMBNAIL_API_REQUEST
    } else {
      thumbnail = schema.thumbnail
    }
    if (thumbnail) {
      const previewLink = buildImagePreview(previewUrl, schema.thumbnail, schema.contentUrl)
      const viewLink = buildImageView(viewerUrl, schema.contentUrl)
      const titleString = shortenTitle(schema.headline)
      return (
        <ResultContext.Provider value={result}>
          <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
            <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={previewLink} className={bemBlocks.item('poster')}/>
            <Title viewUrl={viewLink} className={bemBlocks.item('title')} titleString={titleString}/>
            <StructuredDataImageObject result={result} thumbnail={thumbnail} contentUrl={schema.contentUrl}/>
          </div>
        </ResultContext.Provider>)
    } else {
      return null
    }
  }

  render() {
    return (this.buildGridItem())
  }
}

export default StandardGridItem
