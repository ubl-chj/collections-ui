import * as React from "react";
import OsdComponent from "./OsdComponent";
const extend = require("lodash/extend")

export const ManifestItem = (props) => {
  const {bemBlocks, document} = props
  return (<OsdComponent {...props}/>)
}
