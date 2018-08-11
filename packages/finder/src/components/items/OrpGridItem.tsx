import * as React from "react";
import {Thumbnail} from "../ui";
const extend = require("lodash/extend")

const osdUrl = process.env.REACT_APP_OSD_BASE
const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
const constManifestUrl = generatorUrl + '?type=orp&index=' + process.env.REACT_APP_ORP_INDEX + '&q='

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

export class OrpGridItem extends React.Component<any, any, any> {
  props: any
  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const imageSource = source.imageServiceIRI + '/full/pct:25/0/default.jpg'
    const imageLink = osdUrl + '?image=' + source.imageServiceIRI
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
      <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink}
        className={bemBlocks.item('poster')}/>
      <div><a href={viewer + encodeURIComponent(query)} target='_blank' rel='noopener noreferrer'>
        <div data-qa='title' className={bemBlocks.item('title')}
          dangerouslySetInnerHTML={{__html: finalTitle}}/>
      </a></div>
    </div>)
  }
}

export default OrpGridItem
