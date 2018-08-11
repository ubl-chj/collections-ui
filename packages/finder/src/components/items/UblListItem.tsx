import * as React from "react";
const firebase = require("firebase/app");
import {FavoriteButton, Thumbnail} from "../ui";
import {AuthUserContext} from "../core";

const extend = require("lodash/extend")

export class UblListItem extends React.Component<any, any, any> {
  props: any
  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const {bemBlocks, result} = this.props
    const osdUrl = process.env.REACT_APP_OSD_BASE
    const source = extend({}, result._source, result.highlight)
    const pathname = new URL(result._source['@id']).pathname
    const splitPath = pathname.split('/')
    const viewId = splitPath[1].padStart(10, '0')
    const katalogBase = 'https://katalog.ub.uni-leipzig.de/Search/Results?lookfor=record_id:'
    const viewer = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
    const firstId = viewId.substring(0, 4).padStart(4, '0')
    const secondId = viewId.substring(5, 8).padStart(4, '0')
    const imageBase = process.env.REACT_APP_UBL_IMAGE_SERVICE_BASE + firstId + '/' + secondId + '/' + viewId + '/00000001.jpx'
    const imageSource = imageBase + '/full/90,/0/default.jpg'
    const imageLink = osdUrl + "?image=" + imageBase
    return (
      <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
        <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink}
          className={bemBlocks.item('poster')}/>
        <div className={bemBlocks.item('details')}>
          <AuthUserContext.Consumer>
            {(authUser) => authUser ?
              <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
          </AuthUserContext.Consumer>
          <a href={viewer} target='_blank' rel='noopener noreferrer'>
            <h2 className={bemBlocks.item('title')}
              dangerouslySetInnerHTML={{__html: source.Title}}/></a>
          <table>
            <tbody>
            <tr>
              <td>Author:</td>
              <td>{source.Author}</td>
            </tr>
            <tr>
              <td>Date:</td>
              <td>{source.Date} {source['Date of publication']} {source['Datierung']} {source['datiert']}</td>
            </tr>
            <tr>
              <td>Katalog URI:</td>
              <td><a href={katalogBase + source['Source PPN (SWB)']} target='_blank'
                rel='noopener noreferrer'> {source['Source PPN (SWB)']}</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>)
  }
}

export default UblListItem
