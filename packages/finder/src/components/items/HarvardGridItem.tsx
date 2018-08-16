import * as React from "react";
import {Thumbnail, Title} from "../ui";
import {StructuredData} from "../core/StructuredData";
import {Domain} from "../../constants";
import {ResultContext} from "../core";
import {ItemProps} from './ItemProps'
const extend = require("lodash/extend")

export class HarvardGridItem extends React.Component<ItemProps, any> {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE
  }

  buildGridItem() {
    const {result, bemBlocks, previewUrl, viewerUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    let thumbnail
    if (source.thumbnail) {
      thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    } else {
      thumbnail = source.thumbnail
    }
    if (thumbnail) {
      const imageLink = previewUrl + '?image=' + source.thumbnail + '&manifest=' + source.manifest
      const contentUrl = source.manifest
      const viewUrl = viewerUrl + '?manifest=' + contentUrl

      const title = source.title
      const creator = source.People

      let titleString
      if (source.title.length >= 80) {
        titleString = source.title.substr(0, 80) + '... '
      } else {
        titleString = source.title
      }
      return (
        <ResultContext.Provider value={result}>
          <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
            <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
            <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={titleString}/>
            <StructuredData headline={title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}/>
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

export default HarvardGridItem
