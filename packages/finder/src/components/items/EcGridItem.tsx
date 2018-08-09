import * as React from "react";
import {Thumbnail} from "../ui";
const extend = require("lodash/extend")

const ECGridItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const imageSource = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const imageLink = osdUrl + '?image=' + result._source['thumbnail']
  const url = result._source['related']
  let titleString
  if (source.title.length >= 80) {
    titleString = source.title.substr(0, 80) + '... '
  } else {
    titleString = source.title
  }
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink} className={bemBlocks.item('poster')}/>
    <a href={url} target='_blank' rel='noopener noreferrer'>
      <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: titleString}}/>
    </a>
  </div>)
}

export default ECGridItem;
