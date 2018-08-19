import * as React from "react";
import {Domain} from "../../constants";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {Thumbnail, Title} from "../ui";
import {ItemProps} from './ItemProps'
import {buildImagePreview, shortenTitle} from './ItemUtils';

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
    const {result, bemBlocks, previewUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    const imageLink = buildImagePreview(previewUrl, source.thumbnail)
    const contentUrl = source.related
    const creator = source.Persons
    const titleString = shortenTitle(source.title)
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={titleString}/>
          <StructuredDataImageObject result={result} thumbnail={thumbnail} contentUrl={contentUrl}/>
        </div>)
  }
}

export default ECGridItem;
