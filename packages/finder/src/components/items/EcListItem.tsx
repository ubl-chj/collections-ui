import * as React from "react";
import {FavoriteButton, Thumbnail, Title} from '../ui'
import {AuthUserContext, ResultContext} from "../core";
import {StructuredData} from "../core/StructuredData";
import {Domain} from "../../constants";
import {ItemProps} from './ItemProps'

const extend = require("lodash/extend")
const firebase = require("firebase/app");

function createTitle(source) {
  const title = source['Title (English)']
  return {__html: '<b>Title:</b> ' + title}
}

export class ECListItem extends React.Component<ItemProps, any> {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE
  }

  render() {
    const {result, bemBlocks, previewUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source['thumbnail'] + Domain.THUMBNAIL_API_REQUEST
    const imageLink = previewUrl + '?image=' + result._source['thumbnail']
    const contentUrl = source['related']
    const creator = source['Persons']
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <div className={bemBlocks.item('details')}>
            <AuthUserContext.Consumer>
              {(authUser) => authUser ?
                <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
            </AuthUserContext.Consumer>
            <Title viewUrl={contentUrl} className={bemBlocks.item('title')} titleString={source.title}/>
            <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={createTitle(source)}/>
            <h3 className={bemBlocks.item('subtitle')}><b>Date of Origin:</b> {source['Date of Origin (English)']}</h3>
            <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={{__html: source['Summary (English)']}}/>
          </div>
          <StructuredData headline={source.title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}/>
        </div>)
  }
}

export default ECListItem;
