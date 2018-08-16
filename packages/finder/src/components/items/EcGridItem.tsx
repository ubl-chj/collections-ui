import * as React from "react";
import {Thumbnail, Title} from "../ui";
import {StructuredData} from "../core/StructuredData";
import {Domain} from "../../constants";
import {ItemProps} from './ItemProps'

const extend = require("lodash/extend")

export class ECGridItem extends React.Component<ItemProps, any> {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE
  }

  render() {
    const {result, bemBlocks, previewUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = result._source['thumbnail'] + Domain.THUMBNAIL_API_REQUEST
    const imageLink = previewUrl + '?image=' + result._source['thumbnail']
    const contentUrl = source.related
    const creator = source.Persons
    let titleString
    if (source.title.length >= 80) {
      titleString = source.title.substr(0, 80) + '... '
    } else {
      titleString = source.title
    }
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={titleString}/>
          <StructuredData headline={source.title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}/>
        </div>)
  }
}

export default ECGridItem;
