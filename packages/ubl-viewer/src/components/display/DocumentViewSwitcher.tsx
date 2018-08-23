import * as PropTypes from "prop-types"
import * as React from "react";
import {DocumentViewAccessor, RenderComponentPropType, RenderComponentType, ViewerComponent} from "../../core"

import {IAnnotationItemProps} from "./AnnotationItem";
import {IAnnotationListProps} from "./AnnotationList";
import {Annotations} from "./Annotations";

const defaults = require("lodash/defaults")

export interface IDocumentViewSwitcherProps {
  viewerComponents?: Array<{
    key: string,
    title: string,
    itemComponent?: RenderComponentType<IAnnotationItemProps>,
    listComponent?: RenderComponentType<IAnnotationListProps>,
    metadataDisplayComponent?: RenderComponentType<IAnnotationListProps>,
    defaultOption?: boolean,
  }>
}

export class DocumentViewSwitcher extends ViewerComponent<IDocumentViewSwitcherProps, any> {

  static propTypes = defaults({
    viewerComponents: PropTypes.arrayOf(
      PropTypes.shape({
        defaultOption: PropTypes.bool,
        itemComponent: RenderComponentPropType,
        key: PropTypes.string.isRequired,
        listComponent: RenderComponentPropType,
        title: PropTypes.string.isRequired,
      }),
    ),
  }, Annotations.propTypes)
  accessor: DocumentViewAccessor

  defineAccessor() {
    return new DocumentViewAccessor("view", this.props.viewerComponents)
  }

  render() {
    const selectedOption = this.accessor.getSelectedOption()
    const props = {
      ...this.props,
      itemComponent: selectedOption.itemComponent,
      listComponent: selectedOption.listComponent,
      mod: 'sk-hits-' + selectedOption.key,
    }
    return (
      <Annotations {...props} />
    )
  }
}
