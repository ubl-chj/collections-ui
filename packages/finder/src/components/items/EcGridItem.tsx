import * as React from "react";
const extend = require("lodash/extend")

const handleMissingImage = (target) => {
  return target.src = 'https://www.e-codices.unifr.ch/img/frontend/logo-nav.png'
}

const ECGridItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const thumbUrl = osdUrl + '?image=' + result._source['thumbnail']
  const url = result._source['related']
  let titleString
  if (source.title.length >= 80) {
    titleString = source.title.substr(0, 80) + '... '
  } else {
    titleString = source.title
  }
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={thumbUrl} target='_blank' rel='noopener noreferrer'>
        <img width='140' onError={(e) => {
          handleMissingImage(e.target as HTMLImageElement)
        }} alt='e-codices' src={thumbnail}/>
      </a>
    </div>
    <a href={url} target='_blank' rel='noopener noreferrer'>
      <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: titleString}}/>
    </a>
  </div>)
}

export default ECGridItem;
