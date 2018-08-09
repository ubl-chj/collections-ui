import * as React from "react";
import {Thumbnail} from "../ui";
const extend = require("lodash/extend")

const GettyGridItem = (props) => {
  const previewUrl = process.env.REACT_APP_OSD_BASE
  const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = result._source['thumbnail']
  const imageBase = thumbnail.split('/full')[0]
  const imageLink = previewUrl + '?image=' + imageBase
  const viewUrl = viewerUrl + '?manifest=' + result._source['id']
  let titleString
  if (source.title.length >= 80) {
    titleString = source.title.substr(0, 80) + '... '
  } else {
    titleString = source.title
  }
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
    <a href={viewUrl} target='_blank' rel='noopener noreferrer'>
      <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: titleString}}/>
    </a>
  </div>)
}

export default GettyGridItem
