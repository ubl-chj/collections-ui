import * as React from 'react';

export const MetadataItem = (props) => {
  const {label, value} = props

  return (
    <li className='list-group-item'><div className='metadata-label'>{label}:</div>
      <div dangerouslySetInnerHTML={{__html: value}}/>
    </li>
  )
}
