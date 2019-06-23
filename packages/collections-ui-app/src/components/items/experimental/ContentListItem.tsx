import {Domain} from 'collections-ui-common'
import React from 'react'
import {ItemProps} from '../ItemProps'

const extend = require('lodash/extend')

export class ContentListItem extends React.Component<ItemProps, any> {

  static defaultProps = {
    previewUrl: process.env.REACT_APP_OSD_BASE,
  }

  static queryBuilder(queryString) {
    const queryFields = ['iiifService', 'structureMap.1.@id', 'structureMap.1.label', 'metadata.Date', 'metadata.Title', 'metadata.Author',
      'metadata.Date of publication', 'metadata.Call number', 'metadata.Collection', 'metadata.Objekttitel', 'metadata.Part of',
      'metadata.Place', 'metadata.Place of publication', 'metadata.Publisher', 'metadata.Sprache', 'metadata.URN',
      'metadata.Source PPN (SWB)']
    return {
      bool: {
        should: [
          {
            nested: {
              path: 'contentList',
              query: {
                bool: {
                  must: [
                    {match: {'contentList.chars': queryString}},
                  ],
                },
              },
              inner_hits: {},
            },
          },
          {
            simple_query_string:
              {
                query: queryString,
                fields: queryFields,
              },
          },
        ],
      },
    }
  }

  constructor(props) {
    super(props)
  }

  InnerHits(innerHits) {
    const content = []
    if (innerHits.contentList != null) {
      innerHits.contentList.hits.hits.forEach((hit) => {
        content.push(hit._source)
      })
    }
    return content
  }

  render() {
    const {result, bemBlocks, previewUrl} = this.props
    const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
    const source = extend({}, result._source, result.highlight)
    const innerHits = extend({}, result.inner_hits)
    const thumbnail = source.iiifService + Domain.THUMBNAIL_API_REQUEST
    const url = source.iiifService + Domain.FULL_IMAGE_API_REQUEST
    const pathname = new URL(source.iiifService).pathname
    const splitPath = pathname.split('/')
    const viewId = splitPath[5]
    const viewerUrl = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
    const constManifestUrl = generatorUrl + '?type=atomic&q='
    const query = '{\'query\':{\'multi_match\':{\'query\':\'' + viewId + '\',\'type\':\'cross_fields\',\'operator\':\'and\'}},\'size\':500}'
    const contentObjs = (
      <ul className='list-group'>
        {this.InnerHits(innerHits).map((hit) =>
          <li className='list-group-item' key={hit.objectId}>
            <a href={previewUrl + '?image=' + source.iiifService + '&region=' + hit.region} target='_blank'
              rel='noopener noreferrer'>{hit.chars}</a>
          </li>,
        )}
      </ul>)

    return (
      <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
        <div className={bemBlocks.item('poster')}>
          <a href={url}><img className='thumbnail' alt='presentation' data-qa='poster' src={thumbnail}/></a>
        </div>
        <div className={bemBlocks.item('details')}>
          <a href={viewerUrl}>
            <h2 className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: source.metadata.Title}}/></a>
          <table>
            <tbody>
            <tr>
              <td>Image Index:</td>
              <td>{source.imageIndex}</td>
            </tr>
            <tr>
              <td>Author:</td>
              <td>{source.metadata.Author}</td>
            </tr>
            <tr>
              <td>Date:</td>
              <td>{source.metadata.Date} {source.metadata['Date of publication']} {source.metadata.Datierung} {source.metadata.datiert}</td>
            </tr>
            <tr>
              <td>Content Coordinates:</td>
              <td>{contentObjs}</td>
            </tr>
            <tr>
              <td>Composite Manifest:</td>
              <td><a href={constManifestUrl + query}>{viewId}</a></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
