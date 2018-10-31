import {AuthUserContext, firebase, resolveName, Thumbnail, Title} from 'collections-ui-common'
import * as React from "react"
import {FavoriteButton} from "./index"

const uuidv4 = require('uuid/v4')

export interface IListItemDisplayProps {
  bemBlocks?: any
  contentUrl: any
  imageLink: string
  result?: any
  schema: any
  thumbnail: string
}

export const makeAnchor = (entry) => {
  if (entry[0] === 'sameAs' || entry[0] === 'url') {
    return {__html: '<a target=\'_blank\' rel=\'noopener noreferrer\' href=' + entry[1] + '>' + entry[1] + '</a>'}
  } else {
    return {__html: entry[1]}
  }
}

export const ListSchemaEntry = (props) => {
  const {entry} = props
  const value = makeAnchor(entry)
  return (
    <div className='schema-list'>
      <div className='schema-list__left'>
        <span className='schema-list-key'><b>{entry[0]}</b></span>
      </div>
      <div className='schema-list-value' dangerouslySetInnerHTML={value}/>
    </div>
  )
}

export class ListItemDisplay extends React.Component<IListItemDisplayProps, any> {

  render() {
    const {bemBlocks, contentUrl, imageLink, result, thumbnail, schema} = this.props
    const schemaFilterName = Object.entries(schema.mainEntity).filter((e) => e[0] !== 'name')
    const name = resolveName(schema)

    return (
      <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
        <Thumbnail
          imageWidth={170}
          imageSource={thumbnail}
          imageLink={imageLink}
          className={bemBlocks.item('poster')}
        />
        <div className={bemBlocks.item('details')}>
          <div className='title-flex'>
            <AuthUserContext.Consumer>
              {(authUser) => authUser ? <FavoriteButton authUser={firebase.auth.currentUser} result={result}/> : null}
            </AuthUserContext.Consumer>
            <Title
              viewUrl={contentUrl}
              className={bemBlocks.item('title')}
              titleString={name}
            />
          </div>
            {schemaFilterName.map((e) => <ListSchemaEntry {...this.props} key={uuidv4()} entry={e}/>)}
        </div>
      </div>
    )
  }
}
