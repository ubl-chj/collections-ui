import * as React from "react";
import {FavoriteButton, Thumbnail} from "../ui";
import {AuthUserContext} from "../core";
const firebase = require("firebase/app");
const extend = require("lodash/extend")

const getAuthor = (source, bemBlocks) => {
  if (source['Author(s) of the Record']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Author:</b> {source['Author(s) of the Record']}</h3>
  }
}

const getSubject = (source, bemBlocks) => {
  if (source['Subject(s)']) {
    return <h3 className={bemBlocks.item('subtitle')}><b>Subject:</b> {source['Subject(s)']}</h3>
  }
}

const UcListItem = (props) => {
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const imageSource = result._source['thumbnail'] + '/full/90,/0/default.jpg'
  const imageLink = osdUrl + '?image=' + result._source['thumbnail']
  const viewUrl = viewerUrl + '?manifest=' + result._source['Manifest']
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <Thumbnail imageWidth={140} imageSource={imageSource} imageLink={imageLink} className={bemBlocks.item('poster')}/>
    <div className={bemBlocks.item('details')}>
      <AuthUserContext.Consumer>
        {(authUser) =>  authUser ? <FavoriteButton authUser={firebase.auth().currentUser} result={result}/>: null}
      </AuthUserContext.Consumer>
      <a href={viewUrl} target='_blank' rel='noopener noreferrer'>
        <h2 className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: source['Title']}}/>
      </a>
      {getAuthor(source, bemBlocks)}
      {getSubject(source, bemBlocks)}
      <h3 className={bemBlocks.item('subtitle')}><b>Date:</b> {source['Date of Creation']} {source['Date of Publication']}</h3>
      <h3 className={bemBlocks.item('subtitle')}
        dangerouslySetInnerHTML={{__html: source['Abstract']}}/>
    </div>
  </div>)
}

export default UcListItem
