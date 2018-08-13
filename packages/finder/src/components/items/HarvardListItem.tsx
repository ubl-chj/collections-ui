import * as React from "react";
import {FavoriteButton, Thumbnail} from "../ui";
import {AuthUserContext} from "../core";
import {StructuredData} from "../core/StructuredData";
import {Domain} from "../../constants";

const firebase = require("firebase/app");
const extend = require("lodash/extend")

const getAuthor = (source, bemBlocks) => {
  if (source['People']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Artist:</b> {source['People']}</h3>
  }
}

const getTechnique = (source, bemBlocks) => {
  if (source['Technique']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Classification:</b> {source['Technique']}</h3>
  }
}

const getMedium = (source, bemBlocks) => {
  if (source['Medium']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Medium:</b> {source['Medium']}</h3>
  }
}

const getDate = (source, bemBlocks) => {
  if (source['Date']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Date:</b> {source['Date']}</h3>
  }
}

export class HarvardListItem extends React.Component<any, any, any> {
  props: any

  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const previewUrl = process.env.REACT_APP_OSD_BASE
    const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const contentUrl = result._source['manifest']
    const creator = result._source.People
    let thumbnail
    if (result._source['thumbnail']) {
      thumbnail = result._source['thumbnail'] + Domain.THUMBNAIL_API_REQUEST
    } else {
      thumbnail = result._source['thumbnail']
    }
    const imageLink = previewUrl + '?image=' + result._source['thumbnail']
    const viewUrl = viewerUrl + '?manifest=' + contentUrl
    if (thumbnail) {
      return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
        <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink}
          className={bemBlocks.item('poster')}/>
        <div className={bemBlocks.item('details')}>
          <AuthUserContext.Consumer>
            {(authUser) => authUser ?
              <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
          </AuthUserContext.Consumer>
          <a href={viewUrl}>
            <h2 className={bemBlocks.item('title')}
              dangerouslySetInnerHTML={{__html: source['title']}}/>
          </a>
          {getAuthor(source, bemBlocks)}
          {getTechnique(source, bemBlocks)}
          {getDate(source, bemBlocks)}
          {getMedium(source, bemBlocks)}
          <h3 className={bemBlocks.item('subtitle')}>
            <b>Classification:</b> {source['Classification']}</h3>
          <StructuredData headline={source.title} thumbnail={thumbnail} creator={creator}
            contentUrl={contentUrl}/>
        </div>
      </div>)
    } else {
      return null;
    }
  }
}

export default HarvardListItem
