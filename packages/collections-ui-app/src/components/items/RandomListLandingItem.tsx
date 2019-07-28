import {
  buildImageView,
  buildThumbnailReference,
  DynamicLayoutContext,
  getSchema,
  resolveManifestId,
  resolveName,
  ResultContext,
  Thumbnail,
  Title
} from 'collections-ui-common'
import {ListSchemaEntry} from '../ui/ListItemDisplay'
import {ItemProps} from './ItemProps'
import React, {ReactElement} from 'react'
import uuidv4 from 'uuid/v4';
import extend from 'lodash/extend'

export const RandomListLandingItem: React.FC<ItemProps> = (props): ReactElement => {
  const viewerUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const {result, bemBlocks, previewUrl} = props
  const source = extend({}, result._source, result.highlight)
  const manifestId = resolveManifestId(source)
  const thumbnail = buildThumbnailReference(source.thumbnail)
  // const imageLink = buildImagePreview(previewUrl, source.thumbnail, manifestId)
  const viewUrl = buildImageView(viewerUrl, manifestId)
  const schema = getSchema(source, manifestId, thumbnail, null)
  const name = resolveName(schema)
  const schemaFilterName = Object.entries(schema.mainEntity).filter((e) => e[0] === 'description' || e[0] === 'dateCreated'
    || e[0] === 'datePublished' || e[0] === 'disambiguatingDescription' || e[0] === 'material.format' || e[0] === 'material'
    || e[0] === 'creator')
  if (thumbnail) {
    return (
      <ResultContext.Provider value={result}>
        <DynamicLayoutContext.Consumer>
          {(isMobile) => isMobile ?
            <div>
              <Title
                viewUrl={viewUrl}
                className={bemBlocks.item('title')}
                titleString={name}
              />
              <div className='sk-hits-grid-landing__item' data-qa='hit'>
                <Thumbnail
                  imageWidth={170}
                  imageSource={thumbnail}
                  imageLink={viewUrl}
                  className={bemBlocks.item('sk-hits-grid-hit__poster')}
                />
                <div className={bemBlocks.item('details')}>
                  {schemaFilterName.map((e) => <ListSchemaEntry {...props} key={uuidv4()} entry={e}/>)}
                </div>
              </div>
            </div>  :
            <div className={bemBlocks.item().mix(bemBlocks.container('landing'))} data-qa='hit'>
              <Thumbnail
                imageWidth={170}
                imageSource={thumbnail}
                imageLink={viewUrl}
                className={bemBlocks.item('poster')}
              />
              <div className={bemBlocks.item('details')}>
                <Title
                  viewUrl={viewUrl}
                  className={bemBlocks.item('title')}
                  titleString={name}
                />
                {schemaFilterName.map((e) => <ListSchemaEntry {...props} key={uuidv4()} entry={e}/>)}
              </div>
            </div>}
        </DynamicLayoutContext.Consumer>
      </ResultContext.Provider>)
  } else {
    return null
  }
}
