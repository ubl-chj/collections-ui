import * as React from "react";
const extend = require("lodash/extend")

const handleMissingImage = (target) => {
  return target.src = 'https://www.e-codices.unifr.ch/img/frontend/logo-nav.png'
}

function createTitle(source) {
  const title = source['Title (English)']
  return {__html: '<b>Title:</b> ' + title}
}

const ECListItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const thumbUrl = osdUrl + '?image=' + result._source['thumbnail']
  const url = result._source['related']
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={thumbUrl} target='_blank' rel='noopener noreferrer'>
        <img onError={(e) => {handleMissingImage(e.target as HTMLImageElement)}}
          alt='e-codices' src={thumbnail}/>
      </a>
    </div>
    <div className={bemBlocks.item('details')}>
      <a href={url} target='_blank' rel='noopener noreferrer'>
        <h2 className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: source.title}}/>
      </a>
      <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={createTitle(source)}/>
      <h3 className={bemBlocks.item('subtitle')}><b>Date of
        Origin:</b> {source['Date of Origin (English)']}</h3>
      <h3 className={bemBlocks.item('subtitle')}
        dangerouslySetInnerHTML={{__html: source['Summary (English)']}}/>
    </div>
  </div>)
}

export default ECListItem;
