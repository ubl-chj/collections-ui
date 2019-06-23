import React from 'react'

export interface IAnnotationItemProps {
  key: string;
  bemBlocks?: any;
  document: any;
}

export class AnnotationItem extends React.PureComponent<IAnnotationItemProps, any> {
  render() {
    return (
      <div className={this.props.bemBlocks.item().mix(this.props.bemBlocks.container('item'))} data-qa="hit">
        {this.props.document}
      </div>
    )
  }
}
