import * as React from "react";
import * as PropTypes from "prop-types";

import {
  AnnotationsAccessor,
  ViewerComponent,
  ViewerComponentProps,
  RenderComponentType,
  RenderComponentPropType,
  renderComponent,
  block
} from "../../core"

const defaults = require("lodash/defaults")

export interface AnnotationItemProps {
  key:string,
  bemBlocks?:any,
  document:any
}

export class AnnotationItem extends React.PureComponent<AnnotationItemProps, any> {

  render(){
    return (
      <div data-qa="hit"
    className={this.props.bemBlocks.item().mix(this.props.bemBlocks.container("item"))}>
    {this.props.document}
    </div>
  )
  }
}

export interface AnnotationListProps{
  mod?:string,
  className?:string,
  itemComponent?:RenderComponentType<AnnotationItemProps>,
  document:Object
}

export class AnnotationList extends React.PureComponent<AnnotationListProps, any>{

  static defaultProps={
    mod:"sk-hits",
    itemComponent:AnnotationItem
  }

  static propTypes = {
    mod:PropTypes.string,
    className:PropTypes.string,
    itemComponent:RenderComponentPropType,
    document:PropTypes.any
  }

  render(){
    const {document, mod, className, itemComponent} = this.props
    const bemBlocks = {
      container: block(mod).el,
      item: block(`${mod}-hit`).el
    }
    return (
      <div data-qa="document" className={bemBlocks.container().mix(className)}>
    {renderComponent(itemComponent, {document, bemBlocks})}
    </div>
  )
  }
}

export interface AnnotationsProps extends ViewerComponentProps{
  hitsPerPage?: number
  highlightFields?:Array<string>
  customHighlight?:any
  itemComponent?: RenderComponentType<AnnotationItemProps>
  listComponent?: RenderComponentType<AnnotationItemProps>
  scrollTo?: boolean|string
}


export class Annotations extends ViewerComponent<AnnotationsProps, any> {
  annotationsAccessor:AnnotationsAccessor

  static propTypes = defaults({
    itemComponent:RenderComponentPropType,
    listComponent:RenderComponentPropType
  }, ViewerComponent.propTypes)

  static defaultProps = {
    listComponent:AnnotationList,
    scrollTo: "body"
  }

  componentWillMount() {
    super.componentWillMount()
    this.annotationsAccessor = new AnnotationsAccessor({ scrollTo:this.props.scrollTo })
    this.viewer.addAccessor(this.annotationsAccessor)
  }


  render() {
    let document:Object = this.getDocument()

    if (!this.isInitialLoading()) {
      const {listComponent, mod, className, itemComponent} = this.props
      return renderComponent(listComponent, {
        document, mod, className, itemComponent
      })
    }

    return null

  }
}
