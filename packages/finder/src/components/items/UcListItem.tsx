import * as React from "react";
const extend = require("lodash/extend")

const handleMissingImage = (target) => {
  return target.src = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
}

const getAuthor = (source, bemBlocks) => {
  if (source['Author(s) of the Record']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Author:</b> {source['Author(s) of the Record']}</h3>
  }
}

const getSubject = (source, bemBlocks) => {
  if (source['Subject(s)']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Subject:</b> {source['Subject(s)']}</h3>
  }
}

const UcListItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const thumbUrl = osdUrl + '?image=' + result._source['thumbnail']
  const viewUrl = viewerUrl + '?manifest=' + result._source['Manifest']
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={thumbUrl} target='_blank' rel='noopener noreferrer'>
        <img onError={(e) => {handleMissingImage(e.target as HTMLImageElement)}}
          alt='uc' src={thumbnail}/>
      </a>
    </div>
    <div className={bemBlocks.item('details')}>
      <a href={viewUrl} target='_blank' rel='noopener noreferrer'>
        <h2 className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: source['Title']}}/>
      </a>
      {getAuthor(source, bemBlocks)}
      {getSubject(source, bemBlocks)}
      <h3 className={bemBlocks.item('subtitle')}><b>Date:</b> {source['Date of Creation']} {source['Date of Publication']}</h3>
      <h3 className={bemBlocks.item('subtitle')}
        dangerouslySetInnerHTML={{__html: source['Abstract']}}/>
    </div>
  </div>)
}

export default UcListItem
