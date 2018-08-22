import * as React from "react";
import {Link} from 'react-router-dom'
import {ResultContext} from "../core";

export class Thumbnail extends React.Component<any, any> {
  imageSource: string
  search: string
  imageLink: string
  className: string
  imageWidth: number

  constructor(props) {
    super(props)
    this.imageSource = props.imageSource
    this.search = '?' + props.imageLink.split('?')[1]
    this.imageLink = props.imageLink
    this.className = props.className
    this.imageWidth = props.imageWidth
  }

  handleMissingImage = (target) => {
    return target.src = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
  }

  render() {
    return (
      <div className={this.className}>
      <ResultContext.Consumer>
        {(result) => result ?
          <Link
            to={{
            pathname: process.env.REACT_APP_OSD_BASE,
            search: this.search,
            state: {
              result,
            },
          }}
          >
          <img
            width={this.imageWidth}
            onError={(e) => {this.handleMissingImage(e.target as HTMLImageElement)}}
            alt='thumbnail'
            src={this.imageSource}
          />
          </Link> :
          <a href={this.imageLink} target='_blank' rel='noopener noreferrer'>
            <img
              width={this.imageWidth}
              onError={(e) => {this.handleMissingImage(e.target as HTMLImageElement)}}
              alt='thumbnail'
              src={this.imageSource}
            />
          </a>}
      </ResultContext.Consumer>
    </div>)
  }
}
