import {DynamicLayoutContext} from 'collections-ui-common'
import * as React from "react"
import Observer from 'react-intersection-observer'
import {Link} from 'react-router-dom'
import {ResultContext} from "../core"

export class Thumbnail extends React.Component<any, any> {
  imageSource: string
  search: string
  imageLink: string
  className: string
  imageWidth: number
  canvas: any
  img: any

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

  buildImage() {
    return (
      <img
        crossOrigin=''
        width={this.imageWidth}
        onError={(e) => {
          this.handleMissingImage(e.target as HTMLImageElement)
        }}
        alt='thumbnail'
        src={this.imageSource}
      />
    )
  }

  render() {
    return (
      <DynamicLayoutContext.Consumer>
          {(isMobile) => isMobile ?
            <div className={this.className}>
              <ResultContext.Consumer>
                {(result) => result ?
                  <Link title='Preview this image' to={this.imageLink}>
                    <Observer>
                      {({inView, ref}) => (
                        <div ref={ref}>
                          {inView ? (this.buildImage()) : null}
                        </div>
                      )}
                    </Observer>
                  </Link> :
                  <a href={this.imageLink} target='_blank' rel='noopener noreferrer'>
                    <Observer>
                      {({inView, ref}) => (
                        <div ref={ref}>
                          {inView ? (this.buildImage()) : null}
                        </div>
                      )}
                    </Observer>
                  </a>}
              </ResultContext.Consumer>
            </div> :
            <div className={this.className}>
              <ResultContext.Consumer>
                {(result) => result ?
                  <Link title='Preview this image' to={this.imageLink}>
                    {this.buildImage()}
                  </Link> :
                  <a href={this.imageLink} target='_blank' rel='noopener noreferrer'>
                    {this.buildImage()}
                  </a>}
              </ResultContext.Consumer>
            </div>
          }
      </DynamicLayoutContext.Consumer>)
    }
}
