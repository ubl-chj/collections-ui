import * as React from "react";
import {Domain} from "../../constants";
import {AuthUserContext} from "../core";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {FavoriteButton, Thumbnail, Title} from "../ui";
import {ItemProps} from "./ItemProps";
import {buildImagePreview} from './ItemUtils';

const firebase = require("firebase/app");

const extend = require("lodash/extend")

export class UblListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {previewUrl, result, bemBlocks} = this.props
    const source = extend({}, result._source, result.highlight)
    const pathname = new URL(source['@id']).pathname
    const splitPath = pathname.split('/')
    const viewId = splitPath[1].padStart(10, '0')
    const katalogBase = 'https://katalog.ub.uni-leipzig.de/Search/Results?lookfor=record_id:'
    const contentUrl = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
    const creator = source.Author
    const firstId = viewId.substring(0, 4).padStart(4, '0')
    const secondId = viewId.substring(5, 8).padStart(4, '0')
    const imageBase = process.env.REACT_APP_UBL_IMAGE_SERVICE_BASE + firstId + '/' + secondId + '/' + viewId + '/00000001.jpx'
    const thumbnail = imageBase + Domain.THUMBNAIL_API_REQUEST
    const imageLink = buildImagePreview(previewUrl, imageBase)
    return (
      <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
        <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
        <div className={bemBlocks.item('details')}>
          <AuthUserContext.Consumer>
            {(authUser) => authUser ?
              <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
          </AuthUserContext.Consumer>
          <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={source.Title}/>
          <table>
            <tbody>
            <tr>
              <td>Author:</td>
              <td>{source.Author}</td>
            </tr>
            <tr>
              <td>Date:</td>
              <td>{source.Date} {source['Date of publication']} {source.Datierung} {source.datiert}</td>
            </tr>
            <tr>
              <td>Katalog URI:</td>
              <td><a href={katalogBase + source['Source PPN (SWB)']}> {source['Source PPN (SWB)']}</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <StructuredDataImageObject result={result} thumbnail={thumbnail} contentUrl={contentUrl}/>
      </div>)
  }
}

export default UblListItem
