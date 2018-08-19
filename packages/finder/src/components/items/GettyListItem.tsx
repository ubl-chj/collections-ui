import * as React from "react";
import {AuthUserContext, ResultContext} from "../core";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {FavoriteButton, Thumbnail, Title} from "../ui";
import {ItemProps} from "./ItemProps";
import {buildImagePreview, buildImageView} from './ItemUtils';

const firebase = require("firebase/app");
const extend = require("lodash/extend")

export class GettyListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  static getAuthor(source, bemBlocks) {
    if (source.Artist) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Artist:</b> {source.Artist}</h3>
    }
  }

  static getSubject(source, bemBlocks) {
    if (source['Subject(s)']) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Object Type:</b> {source['Object Type']}</h3>
    }
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {result, bemBlocks, previewUrl, viewerUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.thumbnail
    const imageBase = thumbnail.split('/full')[0]
    const contentUrl = source.id
    const imageLink = buildImagePreview(previewUrl, imageBase, contentUrl)
    const viewUrl = buildImageView(viewerUrl, contentUrl)
    const creator = source.Artist
    return (
      <ResultContext.Provider value={result}>
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <div className={bemBlocks.item('details')}>
            <AuthUserContext.Consumer>
              {(authUser) => authUser ?
                <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
            </AuthUserContext.Consumer>
            <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={source.title}/>
            {GettyListItem.getAuthor(source, bemBlocks)}
            {GettyListItem.getSubject(source, bemBlocks)}
            <h3 className={bemBlocks.item('subtitle')}>
              <b>Date:</b> {source['Culture & Date']} {source['Culture & Date']}</h3>
            <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={{__html: source.Inscription}}/>
          </div>
          <StructuredDataImageObject result={result} thumbnail={thumbnail} contentUrl={contentUrl}/>
        </div>
      </ResultContext.Provider>)
  }
}

export default GettyListItem
