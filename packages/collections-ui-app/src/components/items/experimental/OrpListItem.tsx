import {AuthUserContext, Domain} from 'collections-ui-common'
import * as React from "react";
import {FavoriteButton, Thumbnail} from "../../ui"
import {ItemProps} from "../ItemProps"
import {buildImagePreview} from '../ItemUtils'

const extend = require("lodash/extend")
const firebase = require("firebase/app")

export class OrpListItem extends React.Component<ItemProps, any> {

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
    const viewerIRI = process.env.REACT_APP_VIEWER_BASE + '/#?c=0&m=0&s=0&cv=0&manifest='
    const imageSource = source.imageServiceIRI + Domain.THUMBNAIL_API_REQUEST
    const imageLink = buildImagePreview(previewUrl, source.imageServiceIRI)
    const tag4 = source.metadataMap.tag4 || ''
    const tag5 = source.metadataMap.tag5 || ''
    const tag6 = source.metadataMap.tag6 || ''
    const tag7 = source.metadataMap.tag7 || ''
    const tag8 = source.metadataMap.tag8 || ''
    const query = OrpListItem.getQuery(source.metadataMap.tag3 + ' ' + tag4 + ' ' + tag5 + ' ' + tag6 + ' ' + tag7 + ' '
      + tag8, constManifestUrl)

    return (
      <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink} className={bemBlocks.item('poster')}/>
      <div className={bemBlocks.item('details')}>
        <AuthUserContext.Consumer>
          {(authUser) => authUser ? <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
        </AuthUserContext.Consumer>
        <table>
          <tbody>
          <tr>
            <td>Image:</td>
            <td>{source.imageIndex}</td>
          </tr>
          <tr>
            <td>Collection:</td>
            <td>{source.metadataMap.tag1}</td>
          </tr>
          <tr>
            <td>Date Range:</td>
            <td>{source.metadataMap.tag2}</td>
          </tr>
          <tr>
            <td>Composite Manifest:</td>
            <td><a href={viewerIRI + encodeURIComponent(query)}>{source.metadataMap.tag3} {source.metadataMap.tag5}
            {source.metadataMap.tag7} {source.metadataMap.tag8}</a>
            </td>
          </tr>
          </tbody>
        </table>
        <hr/>
      </div>
    </div>)
  }
}

export default OrpListItem
