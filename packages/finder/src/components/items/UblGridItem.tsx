import {Thumbnail, Title} from "../ui";
import * as React from "react";
import {Domain} from "../../constants";
import {StructuredData} from "../core/StructuredData";

const extend = require("lodash/extend")

export class UblGridItem extends React.Component<any, any, any> {
  props: any

  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const {bemBlocks, result} = this.props
    const osdUrl = process.env.REACT_APP_OSD_BASE
    const source = extend({}, result._source, result.highlight)
    const pathname = new URL(result._source['@id']).pathname
    const splitPath = pathname.split('/')
    const viewId = splitPath[1].padStart(10, '0')
    const contentUrl = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
    const creator = source.Author
    const firstId = viewId.substring(0, 4).padStart(4, '0')
    const secondId = viewId.substring(5, 8).padStart(4, '0')
    const imageBase = process.env.REACT_APP_UBL_IMAGE_SERVICE_BASE + firstId + '/' + secondId + '/' + viewId + '/00000001.jpx'
    const thumbnail = imageBase + Domain.THUMBNAIL_API_REQUEST
    const imageLink = osdUrl + "?image=" + imageBase
    let titleString;
    if (source.Title.length >= 80) {
      titleString = source.Title.substr(0, 80) + "... "
    } else {
      titleString = source.Title
    }
    return (
      <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
        <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
        <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={titleString}/>
        <StructuredData headline={source.Title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}/>
      </div>
    )
  }
}

export default UblGridItem
