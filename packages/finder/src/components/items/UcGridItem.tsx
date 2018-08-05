import * as React from "react";
const extend = require("lodash/extend")

const handleMissingImage = (target) => {
  return target.src = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
}

const UcGridItem = (props) => {
  const previewUrl = process.env.REACT_APP_OSD_BASE
  const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const thumbUrl = previewUrl + '?image=' + result._source['thumbnail']
  const viewUrl = viewerUrl + '?manifest=' + result._source['Manifest']
  let titleString
  if (source.Title.length >= 80) {
    titleString = source.Title.substr(0, 80) + '... '
  } else {
    titleString = source.Title
  }
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={thumbUrl} target='_blank' rel='noopener noreferrer'>
        <img width='140' onError={(e) => {
          handleMissingImage(e.target as HTMLImageElement)
        }} alt='uc' src={thumbnail}/>
      </a>
    </div>
    <a href={viewUrl} target='_blank' rel='noopener noreferrer'>
      <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: titleString}}/>
    </a>
  </div>)
}

export default UcGridItem
