import * as React from "react";
const extend = require("lodash/extend")

const osdUrl = process.env.REACT_APP_OSD_BASE
const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
const constManifestUrl = generatorUrl + '?type=orp&index=' + process.env.REACT_APP_ORP_INDEX + '&q='

const handleMissingImage = (target) => {
  return target.src = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
}

const getQuery = (params) => {
  const query = JSON.stringify({
    'query': {
      'simple_query_string': {
        'query': params, 'default_operator': 'and'
      }
    }, 'size': 500
  })
  return constManifestUrl + query
}

const OrpGridItem = (props) => {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = source.imageServiceIRI + '/full/pct:25/0/default.jpg'
  const url = osdUrl + '?image=' + source.imageServiceIRI
  const viewer = process.env.REACT_APP_VIEWER_BASE + '/#?c=0&m=0&s=0&cv=0&manifest='
  let tag4 = source.metadataMap.tag4 || ''
  let tag5 = source.metadataMap.tag5 || ''
  let tag6 = source.metadataMap.tag6 || ''
  let tag7 = source.metadataMap.tag7 || ''
  let tag8 = source.metadataMap.tag8 || ''
  const query = getQuery(source.metadataMap.tag3 + ' ' + tag4 + ' ' + tag5 + ' ' + tag6 + ' ' + tag7 + ' ' + tag8)
  const titleString = source.metadataMap.tag3 + ' ' + source.metadataMap.tag5 + ' ' + source.metadataMap.tag7 + ' ' + source.metadataMap.tag8
  const finalTitle = titleString.substr(0, 50) + '...: ' + source.imageIndex
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <a href={url} target='_blank' rel='noopener noreferrer'>
        <img onError={(e) => {handleMissingImage(e.target as HTMLImageElement)}}
          className={bemBlocks.item('poster')}
          alt='presentation'
          data-qa='poster'
          src={thumbnail} width='180'/>
      </a>
    </div>
    <div><a href={viewer + encodeURIComponent(query)} target='_blank' rel='noopener noreferrer'>
      <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: finalTitle}}/>
    </a></div>
  </div>)
}

export default OrpGridItem
