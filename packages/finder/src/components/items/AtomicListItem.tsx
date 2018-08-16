import * as React from "react";
import {FavoriteButton, Thumbnail, Title} from "../ui";
import {AuthUserContext, ResultContext} from "../core";
import {StructuredData} from "../core/StructuredData";
import {Domain} from "../../constants";
import {ItemProps} from './ItemProps'

const firebase = require("firebase/app");
const extend = require("lodash/extend")

export class AtomicListItem extends React.Component<ItemProps, any> {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE
  }

  render() {
    const ublViewerUrl = process.env.REACT_APP_UBL_IMAGE_VIEWER_BASE
    const {result, bemBlocks, previewUrl, viewerUrl} = this.props
    const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
    const constManifestUrl = generatorUrl + "?type=atomic&index=" + process.env.REACT_APP_ATOMIC_INDEX + "&q="
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.iiifService + Domain.THUMBNAIL_API_REQUEST
    const creator = source.metadata.Author
    const imageLink = previewUrl + "?image=" + source.iiifService
    const pathname = new URL(source.iiifService).pathname
    const splitPath = pathname.split("/")
    const viewId = splitPath[5]
    const contentUrl = ublViewerUrl + viewId
    const query = "{\"query\":{\"multi_match\":{\"query\":\"" + source.metadata.URN + "\",\"type\":\"cross_fields\",\"operator\":\"and\"}},\"size\":500}"
    const manifestView = viewerUrl + "?manifest=" + encodeURIComponent(constManifestUrl + query)
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <div className={bemBlocks.item("details")}>
            <AuthUserContext.Consumer>
              {(authUser) => authUser ?
                <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
            </AuthUserContext.Consumer>
            <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={source.metadata.Title}/>
            <table>
              <tbody>
              <tr>
                <td>Image Index:</td>
                <td>{source.imageIndex}</td>
              </tr>
              <tr>
                <td>Author:</td>
                <td>{source.metadata.Author}</td>
              </tr>
              <tr>
                <td>Date:</td>
                <td>{source.metadata.Date} {source.metadata['Date of publication']} {source.metadata['Datierung']} {source.metadata['datiert']}</td>
              </tr>
              <tr>
                <td>Elastic Manifest:</td>
                <td><a href={constManifestUrl + query} target="_blank">JSON-LD</a></td>
              </tr>
              <tr>
                <td>View:</td>
                <td><a href={manifestView} target="_blank">{source.metadata.URN}</a></td>
              </tr>
              </tbody>
            </table>
          </div>
          <StructuredData headline={source.metadata.Title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}
            position={source.imageIndex}/>
        </div>
    )
  }
}

export default AtomicListItem
