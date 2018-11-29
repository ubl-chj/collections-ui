import * as React from 'react'

import {
  AnnotationsAccessor,
  IViewerComponentProps,
  renderComponent,
  RenderComponentPropType,
  RenderComponentType,
  ViewerComponent,
} from '../../core'
import {IAnnotationItemProps} from './AnnotationItem'
import {AnnotationList} from './AnnotationList'

const defaults = require('lodash/defaults')

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
    scrollTo: 'body',
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
