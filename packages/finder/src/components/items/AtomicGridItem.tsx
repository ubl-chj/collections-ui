import * as React from "react";
import {Domain} from '../../constants'
import {StructuredData} from "../core/StructuredData";
import {Thumbnail, Title} from "../ui";
import {ItemProps} from './ItemProps'

const extend = require("lodash/extend")

export class AtomicGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const viewerUrl = process.env.REACT_APP_UBL_IMAGE_VIEWER_BASE
    const {result, bemBlocks, previewUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.iiifService + Domain.THUMBNAIL_API_REQUEST
    const imageLink = previewUrl + "?image=" + source.iiifService
    const pathname = new URL(source.iiifService).pathname
    const splitPath = pathname.split("/")
    const viewId = splitPath[5]
    const contentUrl = viewerUrl + viewId
    const creator = source.metadata.Author
    let titleString;
    if (source.metadata.Title.length >= 80) {
      titleString = source.metadata.Title.substr(0, 80) + "... "
    } else {
      titleString = source.metadata.Title
    }
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={titleString}/>
          <StructuredData headline={source.metadata.Title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}
            position={source.imageIndex}/>
        </div>
    )
  }
}

export default AtomicGridItem;
