import * as React from "react";
import * as PropTypes from "prop-types"
const defaults = require("lodash/defaults")

import {
  ViewerComponent,
  RenderComponentType,
  RenderComponentPropType, DocumentViewAccessor
} from "../../core"

import {AnnotationItemProps, AnnotationListProps, Annotations} from "./Annotations";

export interface DocumentViewSwitcherProps {
  viewerComponents?:Array<{
    key:string,
    title:string,
    itemComponent?:RenderComponentType<AnnotationItemProps>,
    listComponent?:RenderComponentType<AnnotationListProps>,
    metadataDisplayComponent?:RenderComponentType<AnnotationListProps>,
    defaultOption?:boolean
  }>
}

export class DocumentViewSwitcher extends ViewerComponent<DocumentViewSwitcherProps, any> {
  accessor:DocumentViewAccessor

	static propTypes = defaults({
		viewerComponents:PropTypes.arrayOf(
			PropTypes.shape({
				key:PropTypes.string.isRequired,
				title:PropTypes.string.isRequired,
				itemComponent:RenderComponentPropType,
				listComponent:RenderComponentPropType,
				defaultOption:PropTypes.bool
			})
		)
	}, Annotations.propTypes)

  defineAccessor(){
    return new DocumentViewAccessor("view", this.props.viewerComponents)
  }
  render(){
    const selectedOption = this.accessor.getSelectedOption()
    const props = {
      ...this.props,
      itemComponent: selectedOption.itemComponent,
      listComponent: selectedOption.listComponent,
      mod: 'sk-hits-'+selectedOption.key
    }
    return (
      <Annotations {...props} />
    )
  }
}
