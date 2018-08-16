import * as React from "react";
import {Thumbnail, Title} from "../ui";
import {StructuredData} from "../core/StructuredData";
import {ResultContext} from "../core";
import {ItemProps} from './ItemProps'

const extend = require("lodash/extend")

export class GettyGridItem extends React.Component<ItemProps, any> {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE
  }

  render() {
    const {result, bemBlocks, previewUrl, viewerUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.thumbnail
    const imageBase = thumbnail.split('/full')[0]
    const imageLink = previewUrl + '?image=' + imageBase + '&manifest=' + source.id
    const viewUrl = viewerUrl + '?manifest=' + source.id
    const contentUrl = source.id
    const creator = source.Artist
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
          <StructuredData headline={source.title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}/>
        </div>
      </ResultContext.Provider>)
  }
}

export default GettyGridItem
