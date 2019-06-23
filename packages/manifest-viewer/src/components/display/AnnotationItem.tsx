import React from 'react'

export interface IAnnotationItemProps {
  key: string,
  bemBlocks?: any,
  document: any
}

export class AnnotationItem extends React.PureComponent<IAnnotationItemProps, any> {

  render() {
    return (
      <div data-qa="hit" className={this.props.bemBlocks.item().mix(this.props.bemBlocks.container('item'))}>
        {this.props.document}
      </div>
    )
  }
}
