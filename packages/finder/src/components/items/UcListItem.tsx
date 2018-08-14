import * as React from "react";
import {FavoriteButton, Thumbnail, Title} from "../ui";
import {AuthUserContext} from "../core";
import {StructuredData} from "../core/StructuredData";
import {Domain} from "../../constants";

const firebase = require("firebase/app");
const extend = require("lodash/extend")


export class UcListItem extends React.Component<any, any, any> {
  props: any

  constructor(props) {
    super(props)
    this.props = props
  }

  static getAuthor(source, bemBlocks) {
    if (source['Author(s) of the Record']) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Author:</b> {source['Author(s) of the Record']}</h3>
    }
  }

  static getSubject(source, bemBlocks) {
    if (source['Subject(s)']) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Subject:</b> {source['Subject(s)']}</h3>
    }
  }

  static getDate(source, bemBlocks) {
    if (source['Date of Creation'] || source['Date of Publication']) {
      return <h3 className={bemBlocks.item('subtitle')}><b>Date:</b> {source['Date of Creation']}{source['Date of Publication']}</h3>
    }
  }

  render() {
    const osdUrl = process.env.REACT_APP_OSD_BASE
    const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const thumbnail = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    const contentUrl = source.Manifest
    const creator = source['Author(s) of the Record']
    const imageLink = osdUrl + '?image=' + source.thumbnail + '&manifest=' + source.Manifest
    const viewUrl = viewerUrl + '?manifest=' + contentUrl
    return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={thumbnail} imageLink={imageLink} className={bemBlocks.item('poster')}/>
      <div className={bemBlocks.item('details')}>
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
            <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
        </AuthUserContext.Consumer>
        <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={source['Title']}/>
        {UcListItem.getAuthor(source, bemBlocks)}
        {UcListItem.getSubject(source, bemBlocks)}
        {UcListItem.getDate(source, bemBlocks)}
        <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={{__html: source['Abstract']}}/>
      </div>
      <StructuredData headline={source.title} thumbnail={thumbnail} creator={creator} contentUrl={contentUrl}/>
    </div>)
  }
}

export default UcListItem
