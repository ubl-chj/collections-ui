import * as React from "react";
import {FavoriteButton, Thumbnail, Title} from "../ui";
import {AuthUserContext} from "../core";
import {Domain} from "../../constants";

const firebase = require("firebase/app");
const extend = require("lodash/extend")

const getPart = (source, bemBlocks) => {
  if (source['Part reference']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Part:</b> {source['Part reference']}</h3>
  }
}

export class SctListItem extends React.Component<any, any, any> {
  props: any

  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    const osdUrl = process.env.REACT_APP_OSD_BASE
    const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
    const {bemBlocks, result} = this.props
    const source = extend({}, result._source, result.highlight)
    const imageSource = source.thumbnail + Domain.THUMBNAIL_API_REQUEST
    const imageLink = osdUrl + '?image=' + source.thumbnail + '&manifest=' + source.manifest
    const viewUrl = viewerUrl + '?manifest=' + source.manifest
    return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink} className={bemBlocks.item('poster')}/>
      <div className={bemBlocks.item('details')}>
        <AuthUserContext.Consumer>
          {(authUser) => authUser ?
            <FavoriteButton authUser={firebase.auth().currentUser} result={result}/> : null}
        </AuthUserContext.Consumer>
        <Title viewUrl={viewUrl} className={bemBlocks.item('title')} titleString={source['Title']}/>
        <h3 className={bemBlocks.item('subtitle')} dangerouslySetInnerHTML={{__html: source['Description']}}/>
        {getPart(source, bemBlocks)}
      </div>
    </div>)
  }
}

export default SctListItem
