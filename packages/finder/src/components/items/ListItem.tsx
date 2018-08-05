import * as React from "react";

const extend = require("lodash/extend")

const ListItem = (props) => {
  const generatorUrl = process.env.REACT_APP_GENERATOR_BASE
  const osdUrl = process.env.REACT_APP_OSD_BASE
  const osdComponentUrl = process.env.REACT_APP_OSD_COMPONENT_BASE
  const viewerUrl = process.env.REACT_APP_UBL_IMAGE_VIEWER_BASE
  const constManifestUrl = generatorUrl + "?type=atomic&index=" + process.env.REACT_APP_ATOMIC_INDEX + "&q="
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  const thumbnail = source.iiifService + "/full/90,/0/default.jpg"
  const url = osdUrl + "?image=" + source.iiifService
  const pathname = new URL(source.iiifService).pathname
  const splitPath = pathname.split("/")
  const viewId = splitPath[5]
  const viewer = viewerUrl + viewId
  const query = "{\"query\":{\"multi_match\":{\"query\":\"" + source.metadata.URN + "\",\"type\":\"cross_fields\",\"operator\":\"and\"}},\"size\":500}"
  const manifestView = osdComponentUrl + "?manifest=" + encodeURIComponent(constManifestUrl + query)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <a href={url} target="_blank"><img className="thumbnail" alt="presentation" data-qa="poster"
          src={thumbnail}/></a>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={viewer} target="_blank">
          <h2 className={bemBlocks.item("title")}
            dangerouslySetInnerHTML={{__html: source.metadata.Title}}/></a>
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
            <td>{source.metadata.Date} {source.metadata['Date of publication']} {source.metadata['Datierung']} {source.metadata['datiert']}</td>
          </tr>
          <tr>
            <td>Elastic Manifest:</td>
            <td><a href={constManifestUrl + query} target="_blank">JSON-LD</a></td>
          </tr>
          <tr>
            <td>View:</td>
            <td><a href={manifestView} target="_blank">{source.metadata.URN}</a></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListItem
