import * as React from "react";

export class Title extends React.Component<any, any> {
  viewUrl: string
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
      <a href={this.viewUrl} target='_blank' rel='noopener noreferrer'>
        <div data-qa='title' className={this.className}
          dangerouslySetInnerHTML={{__html: this.titleString}}/>
      </a>
    )
  }
}
