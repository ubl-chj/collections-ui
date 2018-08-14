import * as React from "react";
import {Thumbnail, Title} from "../ui";
import {StructuredData} from "../core/StructuredData";
import {Domain} from "../../constants";

const extend = require("lodash/extend")

export class SctGridItem extends React.Component<any, any, any> {
  props: any

  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const previewUrl = process.env.REACT_APP_OSD_BASE
    const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    const imageLink = previewUrl + '?image=' + source.thumbnail + '&manifest=' + source.manifest
    const contentUrl = source.manifest
    const viewUrl = viewerUrl + '?manifest=' + contentUrl
    let titleString
    if (source.Title.length >= 80) {
      titleString = source.Title.substr(0, 80) + '... '
    } else {
      titleString = source.Title
    }
    return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
      <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={titleString}/>
      <StructuredData headline={source.Title} thumbnail={thumbnail} contentUrl={contentUrl} position={source.imageIndex}/>
    </div>)
  }
}

export default SctGridItem
