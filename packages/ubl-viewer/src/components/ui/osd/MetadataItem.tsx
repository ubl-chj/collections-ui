import * as React from "react";


export const MetadataItem = (props) => {
  const {label, value} = props

  return (<li className="list-group-item">{label}:<br/>
      <div dangerouslySetInnerHTML={{__html: value}}/></li>
  )
}
