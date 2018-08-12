import * as React from "react";
import {Thumbnail, Title} from "../ui";
import {StructuredData} from "../core/StructuredData";
import {Domain} from '../../constants'
const extend = require("lodash/extend")

export class AtomicGridItem extends React.Component<any, any, any> {
  props: any

  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const osdUrl = process.env.REACT_APP_OSD_BASE
    const viewerUrl = process.env.REACT_APP_UBL_IMAGE_VIEWER_BASE
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.iiifService + Domain.THUMBNAIL_API_REQUEST
    const imageLink = osdUrl + "?image=" + source.iiifService
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
