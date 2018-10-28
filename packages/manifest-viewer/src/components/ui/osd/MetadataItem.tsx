import * as React from 'react';

export const MetadataItem = (props) => {
  const {label, value} = props
  let typedLabel
  if (label.length) {
    label.forEach((l) => {
      if (l['@language'] === 'en') {
        typedLabel = l['@value']
      } else {
        typedLabel = ""
      }
    })
  } else {
    typedLabel = label
  }
  return (
    <li className='list-group-item'><div className='metadata-label'>{typedLabel}:</div>
      <div dangerouslySetInnerHTML={{__html: value}}/>
    </li>
  )
}
