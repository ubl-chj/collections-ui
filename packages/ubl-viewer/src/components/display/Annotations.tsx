import * as PropTypes from "prop-types";
import * as React from "react";

import {
  AnnotationsAccessor,
  block,
  IViewerComponentProps,
  renderComponent,
  RenderComponentPropType,
  RenderComponentType,
  ViewerComponent,
} from "../../core"

const defaults = require("lodash/defaults")

export interface IAnnotationItemProps {
  key: string,
  bemBlocks?: any,
  document: any
}

export class AnnotationItem extends React.PureComponent<IAnnotationItemProps, any> {

  render() {
    return (
      <div data-qa="hit" className={this.props.bemBlocks.item().mix(this.props.bemBlocks.container("item"))}>
        {this.props.document}
      </div>
    )
  }
}

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

export interface IAnnotationsProps extends IViewerComponentProps {
  hitsPerPage?: number
  highlightFields?: string[]
  customHighlight?: any
  itemComponent?: RenderComponentType<IAnnotationItemProps>
  listComponent?: RenderComponentType<IAnnotationItemProps>
  scrollTo?: boolean | string
}

export class Annotations extends ViewerComponent<IAnnotationsProps, any> {

  static propTypes = defaults({
    itemComponent: RenderComponentPropType,
    listComponent: RenderComponentPropType,
  }, ViewerComponent.propTypes)

  static defaultProps = {
    listComponent: AnnotationList,
    scrollTo: "body",
  }
  annotationsAccessor: AnnotationsAccessor

  componentWillMount() {
    super.componentWillMount()
    this.annotationsAccessor = new AnnotationsAccessor()
    this.viewer.addAccessor(this.annotationsAccessor)
  }

  render() {
    const document: object = this.getDocument()

    if (!this.isInitialLoading()) {
      const {listComponent, mod, className, itemComponent} = this.props
      return renderComponent(listComponent, {
        className, document, itemComponent, mod,
      })
    }
    return null
  }
}
