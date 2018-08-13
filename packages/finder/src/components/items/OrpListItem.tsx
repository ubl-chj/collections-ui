import * as React from "react";
import {FavoriteButton, Thumbnail} from "../ui";
import {AuthUserContext} from "../core";

const extend = require("lodash/extend")
const firebase = require("firebase/app");
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

export class OrpListItem extends React.Component<any, any, any> {
  props: any

  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const viewerIRI = process.env.REACT_APP_VIEWER_BASE + '/#?c=0&m=0&s=0&cv=0&manifest='
    const imageSource = source.imageServiceIRI + '/full/90,/0/default.jpg'
    const imageLink = osdUrl + '?image=' + source.imageServiceIRI
    let tag4 = source.metadataMap.tag4 || ''
    let tag5 = source.metadataMap.tag5 || ''
    let tag6 = source.metadataMap.tag6 || ''
    let tag7 = source.metadataMap.tag7 || ''
    let tag8 = source.metadataMap.tag8 || ''
    const query = getQuery(source.metadataMap.tag3 + ' ' + tag4 + ' ' + tag5 + ' ' + tag6 + ' ' + tag7 + ' ' + tag8)

    return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink} className={bemBlocks.item('poster')}/>
      <div className={bemBlocks.item('details')}>
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
            <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
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
            <td><a href={viewerIRI + encodeURIComponent(query)}>{source.metadataMap.tag3} {source.metadataMap.tag5} {source.metadataMap.tag7} {source.metadataMap.tag8}</a>
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
