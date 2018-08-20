import * as React from "react";
import {Domain} from "../../constants";
import {AuthUserContext} from "../core";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {FavoriteButton, Thumbnail, Title} from "../ui";
import {ItemProps} from './ItemProps'
import {buildGenerator, buildImagePreview, buildUBLViewId, getSchema} from './ItemUtils';

const firebase = require("firebase/app");
const extend = require("lodash/extend")

export class AtomicListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  static getAuthor(schema) {
    if (schema.mainEntity.creator) {
      return (
        <tr>
          <td>Author:</td>
          <td>{schema.mainEntity.creator}</td>
        </tr>
      )
    } else {
      return null
    }
  }

  dataLayer: any

  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    this.dataLayer = (window as any).schemaDataLayer ? (window as any).schemaDataLayer : null
  }

  render() {
    const ublViewerUrl = process.env.REACT_APP_UBL_IMAGE_VIEWER_BASE
    const {result, bemBlocks, previewUrl, viewerUrl} = this.props
    if (result) {
      const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
      const constManifestUrl = buildGenerator(generatorUrl, process.env.REACT_APP_ATOMIC_INDEX)
      const source = extend({}, result._source, result.highlight)
      const thumbnail = source.iiifService + Domain.THUMBNAIL_API_REQUEST
      const imageLink = buildImagePreview(previewUrl, source.iiifService)
      const viewId = buildUBLViewId(source.iiifService)
      const contentUrl = ublViewerUrl + viewId
      const schema = getSchema(result, contentUrl, thumbnail, source.imageIndex)
      const query = "{\"query\":{\"multi_match\":{\"query\":\"" + source.URN +
        "\",\"type\":\"cross_fields\",\"operator\":\"and\"}},\"size\":500}"
      const manifestView = viewerUrl + "?manifest=" + encodeURIComponent(constManifestUrl + query)
      return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <div className={bemBlocks.item("details")}>
            <AuthUserContext.Consumer>
              {(authUser) => authUser ? <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
            </AuthUserContext.Consumer>
            <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={schema.mainEntity.name}/>
            <table>
              <tbody>
              <tr>
                <td>Image Index:</td>
                <td>{schema.position}</td>
              </tr>
              {AtomicListItem.getAuthor(schema)}
              <tr>
                <td>Date:</td>
                <td>{schema.mainEntity.datePublished}</td>
              </tr>
              <tr>
                <td>Elastic Manifest:</td>
                <td><a href={constManifestUrl + query} target="_blank">JSON-LD</a></td>
              </tr>
              <tr>
                <td>View:</td>
                <td><a href={manifestView} target="_blank">{schema.mainEntity.identifier.urn}</a></td>
              </tr>
              </tbody>
            </table>
          </div>
          <StructuredDataImageObject schema={schema}/>
        </div>
      )
    } else {
      return null
    }
  }
}

export default AtomicListItem
