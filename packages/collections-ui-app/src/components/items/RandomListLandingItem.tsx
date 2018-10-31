import {ResultContext} from 'collections-ui-common'
import {buildImagePreview, buildImageView, buildRandomThumbnailReference, getSchema, resolveManifestId,
  resolveName, Thumbnail, Title} from 'collections-ui-common'
import * as React from "react"
import {Link} from 'react-router-dom'
import {ListSchemaEntry} from '../ui/ListItemDisplay'
import {ItemProps} from './ItemProps'

const uuidv4 = require('uuid/v4');
const extend = require('lodash/extend')

export class RandomListLandingItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  state: {
    result: any,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {result, bemBlocks, previewUrl, viewerUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const manifestId = resolveManifestId(source)
    const thumbnail = buildRandomThumbnailReference(source.thumbnail)
    const imageLink = buildImagePreview(previewUrl, source.thumbnail, manifestId)
    const viewUrl = buildImageView(viewerUrl, manifestId)
    const schema = getSchema(source, manifestId, thumbnail, null)
    const name = resolveName(schema)
    const schemaFilterName = Object.entries(schema.mainEntity).filter((e) => e[0] === 'description' || e[0] === 'dateCreated'
      || e[0] === 'datePublished' || e[0] === 'disambiguatingDescription' || e[0] === 'material.format' || e[0] === 'material'
      || e[0] === 'creator')
    if (thumbnail) {
      return (
        <ResultContext.Provider value={result}>
          <div className={bemBlocks.item().mix(bemBlocks.container('landing'))} data-qa='hit'>
              <Thumbnail
                imageSource={thumbnail}
                imageLink={imageLink}
                className={'featured__poster'}
              />
            <div className={bemBlocks.item('details')}>
              <Title
                viewUrl={viewUrl}
                className={bemBlocks.item('title')}
                titleString={name}
              />
              {schemaFilterName.map((e) => <ListSchemaEntry {...this.props} key={uuidv4()} entry={e}/>)}
            </div>
          </div>
        </ResultContext.Provider>)
    } else {
      return null
    }
  }
}
