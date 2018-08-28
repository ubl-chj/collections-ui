import * as React from "react";
import {AuthUserContext} from "../core";
import {resolveName} from '../items';
import {FavoritesListButton, Thumbnail, Title} from "./index";

const uuidv4 = require('uuid/v4');

export interface IListItemDisplayProps {
  bemBlocks?: any
  contentUrl: any
  imageLink: string
  result?: any
  schema: any
  thumbnail: string
  unsetFavorite: any
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

export class FavoritesListItemDisplay extends React.Component<IListItemDisplayProps, any> {

  favorite: {
    result: any,
  }
  state: {
    error: null
    isFavorite: boolean,
  };
  authUser: {
    uid: string,
  }
  unsetFavorite: any
  viewerUrl: string

  constructor(props) {
    super(props)
    this.favorite = props.favorite
    this.authUser = props.authUser
    this.unsetFavorite = props.unsetFavorite
    this.state = {
      error: null,
      isFavorite: true,
    }
  }

  render() {
    const {bemBlocks, contentUrl, imageLink, unsetFavorite, result, thumbnail, schema} = this.props
    const schemaFilterName = Object.entries(schema.mainEntity).filter((e) => e[0] !== 'name')
    const name = resolveName(schema)

    return (
      <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
        <Thumbnail
          imageWidth={140}
          imageSource={thumbnail}
          imageLink={imageLink}
          className={bemBlocks.item('poster')}
        />
        <div className={bemBlocks.item('details')}>
          <AuthUserContext.Consumer>
            {(authUser) => authUser ? <FavoritesListButton
              authUser={this.authUser}
              result={result}
              unsetFavorite={unsetFavorite}
            /> : null}
          </AuthUserContext.Consumer>
          <Title
            viewUrl={contentUrl}
            className={bemBlocks.item('title')}
            titleString={name}
          />
          {schemaFilterName.map((e) => <ListSchemaEntry {...this.props} key={uuidv4()} entry={e}/>)}
        </div>
      </div>
    )
  }
}
