import * as React from "react";
import {AuthUserContext, ResultContext} from "../core";
import {StructuredDataImageObject} from "../schema/StructuredDataImageObject";
import {FavoriteButton, Thumbnail, Title} from "../ui";
import {ItemProps} from "./ItemProps";
import {buildImagePreview, buildImageView, getAuthor, getSchema, getSubject} from './ItemUtils';

const firebase = require("firebase/app");
const extend = require("lodash/extend")

export class GettyListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
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
    const schema = getSchema(result, contentUrl, thumbnail, null)
    return (
      <ResultContext.Provider value={result}>
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
          <div className={bemBlocks.item('details')}>
            <AuthUserContext.Consumer>
              {(authUser) => authUser ? <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
            </AuthUserContext.Consumer>
            <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={source.title}/>
            {getAuthor(source, bemBlocks)}
            {getSubject(source, bemBlocks)}
            <h3 className={bemBlocks.item('subtitle')}>
              <b>Date:</b> {schema.mainEntity.dateCreated}</h3>
            <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={{__html: schema.mainEntity.text.inscription}}/>
          </div>
          <StructuredDataImageObject schema={schema}/>
        </div>
      </ResultContext.Provider>)
  }
}

export default GettyListItem
