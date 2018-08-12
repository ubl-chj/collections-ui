import React from 'react'
import {Link} from 'react-router-dom'
import {
  ActionBar,
  DocumentViewSwitcher,
  Layout,
  LayoutBody,
  ManifestItem,
  Metadata,
  TopBar,
  ViewerManager,
  ViewerProvider
} from 'ubl-viewer'
import {AuthUserProfile, AuthUserTooltip} from '../ui'
import '../../assets/index.css'
import {Domain, Routes} from '../../constants'

const ReactTooltip = require('react-tooltip')
let manifest = null
let image = null
let region = null
let abstractRegion = null
let viewer

if (window.location.search && window.location.search.includes('image')) {
  const params = new URLSearchParams(window.location.search)
  image = params.get('image')
  if (params.get('region')) {
    if (!params.get('region').startsWith('pct:')) {
      region = params.get('region').split(',')
    } else {
      abstractRegion = params.get('region').substring(4).split(',')
    }
  }
  const document = image + '/info.json'
  viewer = new ViewerManager(document)
} else if (window.location.search && window.location.search.includes('manifest')) {
  const params = new URLSearchParams(window.location.search)
  manifest = params.get('manifest')
  viewer = new ViewerManager(manifest)
}

export class Viewer extends React.Component {
  render() {
    const t = Boolean(true)
    return (<ViewerProvider viewer={viewer}>
      <Layout>
        <TopBar>
          <div className='my-logo-thin'>
            <Link className='my-logo' to={Routes.LANDING}>{Domain.LOGO_TEXT}</Link>
          </div>
          <div className='profile' data-tip='authUserProfile' data-for='authUserProfile' data-event='click focus'>
            <AuthUserProfile/>
          </div>
          <ReactTooltip id='authUserProfile' offset={{left: 170}} globalEventOff='click' border={t} place='bottom' type='light'
            effect='solid'>
            <AuthUserTooltip/>
          </ReactTooltip>
        </TopBar>
        <ActionBar>
          <Metadata key='metadata'/>
        </ActionBar>
        <LayoutBody>
          <DocumentViewSwitcher viewerComponents={[{key: 'grid', title: 'Grid', itemComponent: ManifestItem, defaultOption: true}]}/>
        </LayoutBody>
      </Layout>
    </ViewerProvider>)
  }
}

