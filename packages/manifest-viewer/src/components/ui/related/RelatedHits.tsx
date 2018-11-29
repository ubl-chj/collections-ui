import * as React from 'react';
import {ScaleLoader} from 'react-spinners'
import {Hits, SearchkitComponent} from 'searchkit-fork'
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
          hitsPerPage={20}
          highlightFields={['title', 'Title', 'Titles', 'Title (English)', 'Author', 'creators', 'Creator(s)', 'Artist', 'People']}
          mod="sk-hits-grid"
          itemComponent={SimpleGridItem}
        />
      )
    }
  }
}
