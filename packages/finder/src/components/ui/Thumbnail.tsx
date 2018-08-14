import * as React from "react";

export class Thumbnail extends React.Component<any, any> {
  imageSource: string
  imageLink: string
  className: string
  imageWidth: number

  constructor(props) {
    super(props)
    this.imageSource = props.imageSource
    this.imageLink = props.imageLink
    this.className = props.className
    this.imageWidth = props.imageWidth
  }

  handleMissingImage = (target) => {
    return target.src = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/VisualEditor_icon_page-not-found-ltr.svg'
  }

  render() {
    return (<div className={this.className}>
      <a href={this.imageLink} target='_blank' rel='noopener noreferrer'>
        <img width={this.imageWidth} onError={(e) => {
          this.handleMissingImage(e.target as HTMLImageElement)
        }} alt='thumbnail' src={this.imageSource}/></a></div>)
  }
}
