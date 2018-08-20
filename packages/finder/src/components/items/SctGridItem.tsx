import * as React from "react";
import {Domain} from "../../constants";
import {ResultContext} from "../core";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {Thumbnail, Title} from "../ui";
import {ItemProps} from "./ItemProps";
import {buildImagePreview, buildImageView, getSchema, shortenTitle} from './ItemUtils';

const extend = require("lodash/extend")

export class SctGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {previewUrl, viewerUrl, result, bemBlocks} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    const contentUrl = source.manifest
    const imageLink = buildImagePreview(previewUrl, source.thumbnail, contentUrl)
    const viewUrl = buildImageView(viewerUrl, contentUrl)
    const schema = getSchema(result, contentUrl, thumbnail, null)
    const titleString = shortenTitle(source.Title)
    return (
      <ResultContext.Provider value={result}>
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={titleString}/>
          <StructuredDataImageObject schema={schema}/>
        </div>
      </ResultContext.Provider>)
  }
}

export default SctGridItem
