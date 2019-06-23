import {ResultContext, Thumbnail, buildImagePreview, buildImageView, buildThumbnailReference,
  getSchema, resolveCreator, resolveManifestId, resolveName, shortenTitle} from 'collections-ui-common'
import React from 'react'
import {Link} from 'react-router-dom'
import {DocumentViewAccessor} from '../../../core/accessors'
import {ViewerComponent} from '../../../core/react'
import {ItemProps} from './ItemProps'

const extend = require('lodash/extend')

export class SimpleGridItem extends ViewerComponent<ItemProps, any> {
  static defaultProps = {
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  state: {
    result: any;
  }

  constructor(props) {
    super(props)
  }

  getViewOptionsSwitcherAccessor() {
    return this.viewer.getAccessorByType(DocumentViewAccessor)
  }

  setView = (view) => {
    this.getViewOptionsSwitcherAccessor().setView(view)
    this.setState((prevState) => {
      return {didUpdate: !prevState.didUpdate};
    })
  }

  render() {
    const {result, bemBlocks, viewerUrl} = this.props
    const source = extend({}, result._source, result.highlight)
    const manifestId = resolveManifestId(source)
    const thumbnail = buildThumbnailReference(source.thumbnail)
    // const imageLink = buildImagePreview(previewUrl, source.thumbnail, manifestId)
    const viewUrl = buildImageView(viewerUrl, manifestId)
    const schema = getSchema(source, manifestId, thumbnail, null)
    const name = resolveName(schema)
    const titleString = shortenTitle(name)
    const viewOptionsAccessor = this.getViewOptionsSwitcherAccessor()
    if (viewOptionsAccessor) {
      if (thumbnail) {
        return (
          <ResultContext.Provider value={result}>
            <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
              <Thumbnail
                className={'sk-hits-grid-hit__poster'}
                imageLink={viewUrl}
                imageSource={thumbnail}
                imageWidth={170}
              />
              <Link to={viewUrl}>
                <div
                  className={bemBlocks.item('title')}
                  dangerouslySetInnerHTML={{__html: name}}
                  data-qa='title'
                  onClick={() => this.setView('list')}
                  title={titleString}
                />
              </Link>
              <div className='sk-hits-grid-hit__author' dangerouslySetInnerHTML={resolveCreator(schema)}/>
            </div>
          </ResultContext.Provider>)
      } else {
        return null
      }
    } else {
      return null
    }
  }
}
