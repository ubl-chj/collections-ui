import * as React from "react"
import {Link} from 'react-router-dom'
import {ResultContext} from '../contexts'

export class Title extends React.Component<any, any> {

  viewUrl: string
  search: string
  className: string
  titleString: string

  constructor(props) {
    super(props)
    this.viewUrl = props.viewUrl
    this.className = props.className
    this.titleString = props.titleString
  }

  render() {
    return (
      <ResultContext.Consumer>
        {(result) => result ?
          <Link to={{pathname: this.viewUrl, state: {result}}}>
            <div  title={this.titleString} data-qa='title' className={this.className} dangerouslySetInnerHTML={{__html: this.titleString}}/>
          </Link> :
          <a href={this.viewUrl} title={this.titleString} target='_blank' rel='noopener noreferrer'>
            <div data-qa='title' className={this.className} dangerouslySetInnerHTML={{__html: this.titleString}}/>
          </a>}
      </ResultContext.Consumer>
    )
  }
}
