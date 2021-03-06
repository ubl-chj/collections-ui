import React from 'react'
import Observer from 'react-intersection-observer'
import {Link} from 'react-router-dom'
import {Domain} from '../../constants'
import {DynamicLayoutContext, ResultContext} from '../contexts'

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
    return target.src = Domain.THUMBNAIL_NOTFOUND_SVG
  }

  buildImage() {
    return (
      <img
        // crossOrigin=''
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
            <div className='poster'>
              <ResultContext.Consumer>
                {(result) => result ?
                  <Link title='View this Item' to={{pathname: this.imageLink, state: {result}}}>
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
                  <div style={{height: '100%', position: 'relative', background: '#eeeeee'}}>
                    {this.buildImage()}
                    <Link
                      title='View this Item'
                      to={{pathname: this.imageLink, state: {result}}}
                    />
                  </div> :
                    <a href={this.imageLink} target='_blank' rel='noopener noreferrer'>
                      {this.buildImage()}
                    </a>
                   }
              </ResultContext.Consumer>
            </div>
          }
      </DynamicLayoutContext.Consumer>)
    }
}
