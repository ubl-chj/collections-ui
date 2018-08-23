import * as PropTypes from "prop-types";
import * as React from "react";
import {block, renderComponent, RenderComponentPropType, RenderComponentType} from "../../core/react";
import {AnnotationItem, IAnnotationItemProps} from "./AnnotationItem";

export interface IAnnotationListProps {
  mod?: string,
  className?: string,
  itemComponent?: RenderComponentType<IAnnotationItemProps>,
  document: object
}

export class AnnotationList extends React.PureComponent<IAnnotationListProps, any> {

  static defaultProps = {
    itemComponent: AnnotationItem,
    mod: "sk-hits",
  }

  static propTypes = {
    className: PropTypes.string,
    document: PropTypes.any,
    itemComponent: RenderComponentPropType,
    mod: PropTypes.string,
  }

  render() {
    const {document, mod, className, itemComponent} = this.props
    const bemBlocks = {
      container: block(mod).el,
      item: block(`${mod}-hit`).el,
    }
    return (
      <div data-qa="document" className={bemBlocks.container().mix(className)}>
        {renderComponent(itemComponent, {document, bemBlocks})}
      </div>
    )
  }
}
