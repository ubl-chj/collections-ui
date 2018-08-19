import * as React from "react";
import {Domain} from "../../constants";
import {AuthUserContext} from "../core";
import {FavoriteButton, Thumbnail, Title} from "../ui";
import {ItemProps} from "./ItemProps";
import {buildImagePreview, buildImageView} from './ItemUtils';
import {StructuredDataImageObject} from '../schema/StructuredDataImageObject';

const firebase = require("firebase/app");
const extend = require("lodash/extend")

export class SctListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  static getPart(source, bemBlocks) {
    if (source['Part reference']) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Part:</b> {source['Part reference']}</h3>
    }
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {previewUrl, viewerUrl, result, bemBlocks} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    const contentUrl = source.manifest
    const imageLink = buildImagePreview(previewUrl, source.thumbnail, contentUrl)
    const viewUrl = buildImageView(viewerUrl, contentUrl)
    return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
      <div className={bemBlocks.item('details')}>
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
            <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
        </AuthUserContext.Consumer>
        <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={source.Title}/>
        <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={{__html: source.Description}}/>
        {SctListItem.getPart(source, bemBlocks)}
        <StructuredDataImageObject result={result} thumbnail={thumbnail} contentUrl={contentUrl}/>
      </div>
    </div>)
  }
}

export default SctListItem
