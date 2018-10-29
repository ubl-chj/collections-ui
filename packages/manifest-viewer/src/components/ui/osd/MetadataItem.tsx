import * as React from 'react';

export const MetadataItem = (props) => {
  const {label, value} = props
  let typedLabel
  let typedValue
  if (Array.isArray(label)) {
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
  if (Array.isArray(value)) {
    value.forEach((l) => {
      if (l['@language'] === 'en') {
        typedValue = l['@value']
      } else {
        typedValue = ""
      }
    })
  } else {
    typedValue = value
  }
  return (
    <li className='list-group-item'><div className='metadata-label'>{typedLabel}:</div>
      <div dangerouslySetInnerHTML={{__html: typedValue}}/>
    </li>
  )
}
