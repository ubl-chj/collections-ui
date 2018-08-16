import * as React from "react";
import {Thumbnail, Title} from "../ui";
import {StructuredData} from "../core/StructuredData";
import {Domain} from "../../constants";
import {ItemProps} from "./ItemProps";
import {ResultContext} from "../core";

const extend = require("lodash/extend")

export class SctGridItem extends React.Component<ItemProps, any> {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE
  }

  render() {
    const {previewUrl, viewerUrl, result, bemBlocks} = this.props
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
    return (
      <ResultContext.Provider value={result}>
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={titleString}/>
          <StructuredData headline={source.Title} thumbnail={thumbnail} contentUrl={contentUrl} position={source.imageIndex}/>
        </div>
      </ResultContext.Provider>)
  }
}

export default SctGridItem
