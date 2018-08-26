import * as React from "react";
import {Link} from 'react-router-dom'
import {ResultContext} from "../core";

export class Title extends React.Component<any, any> {

  static defaultProps = {
    viewerUrl: process.env.REACT_APP_OSD_COMPONENT_BASE,
  }

  viewUrl: string
  search: string
  className: string
  titleString: string

  constructor(props) {
    super(props)
    this.search = '?' + props.viewUrl.split('?')[1]
    this.viewUrl = props.viewUrl
    this.className = props.className
    this.titleString = props.titleString
  }

  render() {
    return (
      <ResultContext.Consumer>
        {(result) => result ?
          <Link
            id='image-view'
            to={{
            pathname: process.env.REACT_APP_OSD_COMPONENT_BASE,
            search: this.search,
            state: {
              result,
              scrollY,
            },
          }}
          >
            <div data-qa='title' className={this.className} dangerouslySetInnerHTML={{__html: this.titleString}}/>
          </Link> :
          <a href={this.viewUrl} target='_blank' rel='noopener noreferrer'>
            <div data-qa='title' className={this.className} dangerouslySetInnerHTML={{__html: this.titleString}}/>
          </a>}
      </ResultContext.Consumer>
    )
  }
}
