import * as React from "react";
import {Domain} from "../../constants";
import {AuthUserContext, ResultContext} from "../core";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {FavoriteButton, Thumbnail, Title} from '../ui'
import {ItemProps} from './ItemProps'
import {buildImagePreview} from './ItemUtils';

const extend = require("lodash/extend")
const firebase = require("firebase/app");

export class ECListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  static createTitle(source) {
    const title = source['Title (English)']
    return {__html: '<b>Title:</b> ' + title}
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {result, bemBlocks, previewUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    const imageLink = buildImagePreview(previewUrl, source.thumbnail)
    const contentUrl = source.related
    const creator = source.Persons
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <div className={bemBlocks.item('details')}>
            <AuthUserContext.Consumer>
              {(authUser) => authUser ?
                <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
            </AuthUserContext.Consumer>
            <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={source.title}/>
            <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={ECListItem.createTitle(source)}/>
            <h3 className={bemBlocks.item('subtitle')}><b>Date of Origin:</b> {source['Date of Origin (English)']}</h3>
            <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={{__html: source['Summary (English)']}}/>
          </div>
          <StructuredDataImageObject result={result} thumbnail={thumbnail} contentUrl={contentUrl}/>
        </div>)
  }
}

export default ECListItem;
