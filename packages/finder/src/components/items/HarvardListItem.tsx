import * as React from "react";
import {Domain} from "../../constants";
import {AuthUserContext, ResultContext} from "../core";
import {StructuredData} from "../core/StructuredData";
import {FavoriteButton, Thumbnail, Title} from "../ui";
import {ItemProps} from "./ItemProps";

const firebase = require("firebase/app");
const extend = require("lodash/extend")

export class HarvardListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  static getAuthor(source, bemBlocks) {
    if (source.People) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Artist:</b> {source.People}</h3>
    }
  }

  static getTechnique(source, bemBlocks) {
    if (source.Technique) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Classification:</b> {source.Technique}</h3>
    }
  }

  static getMedium(source, bemBlocks) {
    if (source.Medium) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Medium:</b> {source.Medium}</h3>
    }
  }

  static getDate(source, bemBlocks) {
    if (source.Date) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Date:</b> {source.Date}</h3>
    }
  }
  constructor(props) {
    super(props)
  }

  buildListItem() {
    const {previewUrl, viewerUrl, result, bemBlocks} = this.props
    const source = extend({}, result._source, result.highlight)

    let thumbnail
    if (source.thumbnail) {
      thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    } else {
      thumbnail = source.thumbnail
    }

    if (thumbnail) {
      const contentUrl = source.manifest
      const imageLink = previewUrl + '?image=' + source.thumbnail + '&manifest=' + source.manifest
      const viewUrl = viewerUrl + '?manifest=' + contentUrl

      const creator = source.People
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
              {HarvardListItem.getAuthor(source, bemBlocks)}
              {HarvardListItem.getTechnique(source, bemBlocks)}
              {HarvardListItem.getDate(source, bemBlocks)}
              {HarvardListItem.getMedium(source, bemBlocks)}
              <h3 className={bemBlocks.item('subtitle')}>
                <b>Classification:</b> {source.Classification}</h3>
              <StructuredData headline={source.title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}/>
            </div>
          </div>
        </ResultContext.Provider>)
    } else {
      return null;
    }
  }

  render() {
    return (this.buildListItem())
  }
}

export default HarvardListItem
