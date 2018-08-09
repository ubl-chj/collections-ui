import * as React from "react";
import {Thumbnail} from "../ui";
const extend = require("lodash/extend")

const UcGridItem = (props) => {
  const previewUrl = process.env.REACT_APP_OSD_BASE
  const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const imageSource = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const imageLink = previewUrl + '?image=' + result._source['thumbnail']
  const viewUrl = viewerUrl + '?manifest=' + result._source['Manifest']
  let titleString
  if (source.Title.length >= 80) {
    titleString = source.Title.substr(0, 80) + '... '
  } else {
    titleString = source.Title
  }
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink} className={bemBlocks.item('poster')}/>
    <a href={viewUrl} target='_blank' rel='noopener noreferrer'>
      <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: titleString}}/>
    </a>
  </div>)
}

export default UcGridItem
