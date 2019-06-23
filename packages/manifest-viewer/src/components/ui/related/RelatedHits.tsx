import React from 'react';
import {ScaleLoader} from 'react-spinners'
import {Hits, SearchkitComponent} from 'searchkit'
import {SimpleGridItem} from './SimpleGridItem'

export class RelatedHits extends SearchkitComponent<any, any> {
  render() {
    if (this.isLoading()) {
      return (
        <div className='centered'>
          <ScaleLoader color='#FFF' loading={true}/>
        </div>
      )
    } else {
      return (
        <Hits
          highlightFields={['title', 'Title', 'Titles', 'Title (English)', 'Author', 'creators', 'Creator(s)', 'Artist', 'People']}
          hitsPerPage={20}
          itemComponent={SimpleGridItem}
          mod="sk-hits-grid"
        />
      )
    }
  }
}
