import * as React from "react";
const extend = require("lodash/extend")

const UblListItem = (props) => {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const pathname = new URL(result._source['@id']).pathname
  const splitPath = pathname.split('/')
  const viewId = splitPath[1].padStart(10, '0')
  const katalogBase = 'https://katalog.ub.uni-leipzig.de/Search/Results?lookfor=record_id:'
  const url = 'https://digital.ub.uni-leipzig.de/object/viewid/' + viewId
  const firstId = viewId.substring(0, 4).padStart(4, '0')
  const secondId = viewId.substring(5, 8).padStart(4, '0')
  const thumbnail = process.env.REACT_APP_UBL_IMAGE_SERVICE_BASE + firstId + '/' + secondId + '/' + viewId + '/00000001.jpx/full/90,/0/default.jpg'
  return (<div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
    <div className={bemBlocks.item('poster')}>
      <img className='thumbnail' alt='presentation' data-qa='poster' src={thumbnail}/>
    </div>
    <div className={bemBlocks.item('details')}>
      <a href={url} target='_blank' rel='noopener noreferrer'>
        <h2 className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html: source.Title}}/></a>
      <table>
        <tbody>
        <tr>
          <td>Author:</td>
          <td>{source.Author}</td>
        </tr>
        <tr>
          <td>Date:</td>
          <td>{source.Date} {source['Date of publication']} {source['Datierung']} {source['datiert']}</td>
        </tr>
        <tr>
          <td>Katalog URI:</td>
          <td><a href={katalogBase + source['Source PPN (SWB)']} target='_blank' rel='noopener noreferrer'> {source['Source PPN (SWB)']}</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>)
}

export default UblListItem
