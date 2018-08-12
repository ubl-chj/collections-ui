import * as React from "react";
import {FavoriteButton, Thumbnail} from '../ui'
import {AuthUserContext} from "../core";
import {StructuredData} from "../core/StructuredData";
import {Domain} from "../../constants";

const extend = require("lodash/extend")
const firebase = require("firebase/app");

function createTitle(source) {
  const title = source['Title (English)']
  return {__html: '<b>Title:</b> ' + title}
}

export class ECListItem extends React.Component<any, any, any> {
  props: any

  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const osdUrl = process.env.REACT_APP_OSD_BASE
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = result._source['thumbnail'] + Domain.THUMBNAIL_API_REQUEST
    const imageLink = osdUrl + '?image=' + result._source['thumbnail']
    const contentUrl = result._source['related']
    const creator = result._source['Persons']
    return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
      <div className={bemBlocks.item('details')}>
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
            <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
        </AuthUserContext.Consumer>
        <a href={contentUrl} target='_blank' rel='noopener noreferrer'>
          <h2 className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: source.title}}/>
        </a>
        <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={createTitle(source)}/>
        <h3 className={bemBlocks.item('subtitle')}><b>Date of Origin:</b> {source['Date of Origin (English)']}</h3>
        <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={{__html: source['Summary (English)']}}/>
      </div>
      <StructuredData headline={source.title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}/>
    </div>)
  }
}

export default ECListItem;
