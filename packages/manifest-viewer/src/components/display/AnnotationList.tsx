import * as PropTypes from 'prop-types'
import React from 'react'
import {RenderComponentPropType, RenderComponentType, block, renderComponent} from '../../core/react'
import {AnnotationItem, IAnnotationItemProps} from './AnnotationItem'

export interface IAnnotationListProps {
  mod?: string;
  className?: string;
  itemComponent?: RenderComponentType<IAnnotationItemProps>;
  document: object;
}

export class AnnotationList extends React.PureComponent<IAnnotationListProps, any> {
  static defaultProps = {
    itemComponent: AnnotationItem,
    mod: 'sk-hits',
  }

  static propTypes = {
    className: PropTypes.string,
    document: PropTypes.any,
    itemComponent: RenderComponentPropType,
    mod: PropTypes.string,
  }

  render() {
    const {document, mod, className, itemComponent}: Readonly<{ children?: React.ReactNode }> & Readonly<IAnnotationListProps> = this.props
    const bemBlocks = {
      container: block(mod).el,
      item: block(`${mod}-hit`).el,
    }
    return (
      <div className={bemBlocks.container().mix(className)} data-qa="document">
        {renderComponent(itemComponent, {document, bemBlocks})}
      </div>
    )
  }
}
