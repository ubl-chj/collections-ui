import {Domain} from 'collections-ui-common'
import * as React from "react";
import {Thumbnail, Title} from "../../ui"
import {ItemProps} from "../ItemProps"
import {buildImagePreview} from '../ItemUtils'

const extend = require("lodash/extend")

export class OrpGridItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  static getQuery(params, constManifestUrl) {
    const query = JSON.stringify({
      query: {
        simple_query_string: {
          default_operator: 'and',
          query: params,
        },
      }, size: 500,
    })
    return constManifestUrl + query
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {previewUrl, result, bemBlocks} = this.props
    const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
    const constManifestUrl = generatorUrl + '?type=orp&index=' + process.env.REACT_APP_ORP_INDEX + '&q='
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.imageServiceIRI + Domain.THUMBNAIL_API_REQUEST
    const imageLink = buildImagePreview(previewUrl, source.imageServiceIRI)
    const viewer = process.env.REACT_APP_VIEWER_BASE + '/#?c=0&m=0&s=0&cv=0&manifest='
    const tag4 = source.metadataMap.tag4 || ''
    const tag5 = source.metadataMap.tag5 || ''
    const tag6 = source.metadataMap.tag6 || ''
    const tag7 = source.metadataMap.tag7 || ''
    const tag8 = source.metadataMap.tag8 || ''
    const query = OrpGridItem.getQuery(source.metadataMap.tag3 + ' ' + tag4 + ' ' + tag5 + ' ' + tag6 + ' ' + tag7 + ' ' +
      tag8, constManifestUrl)
    const titleString = source.metadataMap.tag3 + ' ' + source.metadataMap.tag5 + ' ' + source.metadataMap.tag7 + ' ' +
      source.metadataMap.tag8
    const finalTitle = titleString.substr(0, 50) + '...: ' + source.imageIndex
    const viewUrl = viewer + encodeURIComponent(query)
    return (
      <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
      <div>
        <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={finalTitle}/>
      </div>
    </div>)
  }
}

export default OrpGridItem
