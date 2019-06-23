import React from 'react'

export const MetadataItem = (props) => {
  const {label, value} = props
  let typedLabel
  let typedValue
  if (Array.isArray(label)) {
    label.forEach((ll) => {
      if (ll['@language'] === 'en') {
        typedLabel = ll['@value']
      }
    })
  } else {
    typedLabel = label
  }
  if (Array.isArray(value)) {
    value.forEach((lv) => {
      if (lv['@language'] === 'en') {
        typedValue = lv['@value']
      } else if (lv['@language'] === 'en' && typeof lv !== 'object') {
        typedValue = lv.value
      } else if (typeof value[0] !== 'object') {
        typedValue = value[0]
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
