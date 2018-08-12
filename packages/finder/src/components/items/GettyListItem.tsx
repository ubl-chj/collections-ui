import * as React from "react";
import {FavoriteButton, Thumbnail} from "../ui";
import {AuthUserContext} from "../core";
import {StructuredData} from "../core/StructuredData";

const firebase = require("firebase/app");
const extend = require("lodash/extend")

const getAuthor = (source, bemBlocks) => {
  if (source['Artist']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Artist:</b> {source['Artist']}</h3>
  }
}

const getSubject = (source, bemBlocks) => {
  if (source['Subject(s)']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Object Type:</b> {source['Object Type']}</h3>
  }
}

export class GettyListItem extends React.Component<any, any, any> {
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
    const thumbnail = result._source['thumbnail']
    const imageBase = thumbnail.split('/full')[0]
    const imageLink = previewUrl + '?image=' + imageBase
    const viewUrl = viewerUrl + '?manifest=' + result._source['id']
    const contentUrl = result._source['id']
    const creator = result._source.Artist
    return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
      <div className={bemBlocks.item('details')}>
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
            <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
        </AuthUserContext.Consumer>
        <a href={viewUrl}>
          <h2 className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: source['title']}}/>
        </a>
        {getAuthor(source, bemBlocks)}
        {getSubject(source, bemBlocks)}
        <h3 className={bemBlocks.item('subtitle')}>
          <b>Date:</b> {source['Culture & Date']} {source['Culture & Date']}</h3>
        <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={{__html: source['Inscription']}}/>
      </div>
      <StructuredData headline={source.title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}/>
    </div>)
  }
}

export default GettyListItem
