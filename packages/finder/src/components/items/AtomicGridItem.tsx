import * as React from "react";
import {Thumbnail, Title} from "../ui";

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
    const imageSource = source.iiifService + "/full/90,/0/default.jpg"
    const imageLink = osdUrl + "?image=" + source.iiifService
    const pathname = new URL(source.iiifService).pathname
    const splitPath = pathname.split("/")
    const viewId = splitPath[5]
    const viewer = viewerUrl + viewId
    let titleString;
    if (source.metadata.Title.length >= 80) {
      titleString = source.metadata.Title.substr(0, 80) + "... "
    } else {
      titleString = source.metadata.Title
    }
    return (
      <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
        <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink}
          className={bemBlocks.item('poster')}/>
        <Title viewUrl={viewer} className={bemBlocks.item('title')} titleString={titleString}/>
      </div>
    )
  }
}

export default AtomicGridItem;
