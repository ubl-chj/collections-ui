import {AnnotationsAccessor, ViewerComponent} from "../../core";
import {Controls} from "../ui";
import * as React from "react";

const defaults = require("lodash/defaults")

export interface MetadataProps {
  key: string,
  bemBlocks?: any,
  scrollTo?: boolean|string
}

export class Metadata extends ViewerComponent<MetadataProps, any> {
  annotationsAccessor: AnnotationsAccessor

  componentWillMount() {
    super.componentWillMount()
    this.annotationsAccessor = new AnnotationsAccessor({ scrollTo:this.props.scrollTo })
    this.viewer.addAccessor(this.annotationsAccessor)
  }

  render() {
    let document:Object = this.getDocument()
    let bemBlocks = this.bemBlocks
    const props = {
      ...this.props,
      document: document,
      bemBlocks: bemBlocks
    }
    return (
      <Controls {...props}/>
    )
  }
}
