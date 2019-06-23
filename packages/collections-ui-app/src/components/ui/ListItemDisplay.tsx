import {
  AuthUserContext,
  DynamicLayoutContext,
  FavoriteButton,
  firebase,
  resolveName,
  Thumbnail,
  Title
} from 'collections-ui-common'
import React, {ReactElement} from 'react'
import {IGridItemDisplayProps} from "./GridItemDisplay"

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

export const ListItemDisplay: React.FC<IListItemDisplayProps> = (props): ReactElement => {
  const buildTitle = (bemBlocks, contentUrl, name) => {
    return(
      <Title
        viewUrl={contentUrl}
        className={bemBlocks.item('title')}
        titleString={name}
      />
    )
  }

  const buildFavoriteButton = (result) => {
    return(
    <AuthUserContext.Consumer>
      {(authUser) => authUser ?
        <FavoriteButton
          authUser={firebase.auth().currentUser}
          className='button-transparent__fav'
          result={result}
        /> : null}
    </AuthUserContext.Consumer>)
  }
  const {bemBlocks, contentUrl, imageLink, result, thumbnail, schema} = props
  const schemaFilterName = Object.entries(schema.mainEntity).filter((e) => e[0] !== 'name')
  const name = resolveName(schema)

  return (
    <DynamicLayoutContext.Consumer>
      {(isMobile) => isMobile ?
        <div className='sk-hits-grid-landing__item' data-qa='hit'>
          <div className='title-flex'>
            {buildFavoriteButton(result)}
            {buildTitle(bemBlocks, contentUrl, name)}
          </div>
            <Thumbnail
              imageWidth={170}
              imageSource={thumbnail}
              imageLink={imageLink}
              className={bemBlocks.item('sk-hits-grid-hit__poster')}
            />
            <div className={bemBlocks.item('details')}>
                {schemaFilterName.map((e) => <ListSchemaEntry {...props} key={uuidv4()} entry={e}/>)}
            </div>
        </div> :
        <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
          <Thumbnail
            imageWidth={170}
            imageSource={thumbnail}
            imageLink={imageLink}
            className={bemBlocks.item('poster')}
          />
          <div className={bemBlocks.item('details')}>
            <div className='title-flex'>
              {buildFavoriteButton(result)}
              {buildTitle(bemBlocks, contentUrl, name)}
            </div>
            {schemaFilterName.map((e) => <ListSchemaEntry {...props} key={uuidv4()} entry={e}/>)}
          </div>
        </div>}
    </DynamicLayoutContext.Consumer>
  )
}
