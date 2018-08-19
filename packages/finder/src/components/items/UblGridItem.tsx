import * as React from "react";
import {Domain} from "../../constants";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {Thumbnail, Title} from "../ui";
import {ItemProps} from "./ItemProps";
import {buildImagePreview, shortenTitle} from './ItemUtils';

const extend = require("lodash/extend")

export class UblGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {previewUrl, result, bemBlocks} = this.props

    const source = extend({}, result._source, result.highlight)
    const pathname = new URL(source['@id']).pathname
    const splitPath = pathname.split('/')
    const viewId = splitPath[1].padStart(10, '0')
    const contentUrl = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
    const creator = source.Author
    const firstId = viewId.substring(0, 4).padStart(4, '0')
    const secondId = viewId.substring(5, 8).padStart(4, '0')
    const imageBase = process.env.REACT_APP_UBL_IMAGE_SERVICE_BASE + firstId + '/' + secondId + '/' + viewId + '/00000001.jpx'
    const thumbnail = imageBase + Domain.THUMBNAIL_API_REQUEST
    const imageLink = buildImagePreview(previewUrl, imageBase)
    const titleString = shortenTitle(source.Title)
    return (
      <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
        <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
        <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={titleString}/>
        <StructuredDataImageObject result={result} thumbnail={thumbnail} contentUrl={contentUrl}/>
      </div>
    )
  }
}

export default UblGridItem
