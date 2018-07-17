import React, {Component} from 'react'
import {
  Controls,
  ViewerProvider,
  ViewerManager,
  Layout,
  TopBar,
  ActionBar,
  LayoutBody,
  DocumentViewSwitcher,
  ManifestItem
} from 'ubl-viewer'
import '../index.css'

let manifest = null
let image = null
let region = null
let abstractRegion = null
let viewer;

if (window.location.search && window.location.search.includes("image")) {
  const params = new URLSearchParams(window.location.search)
  image = params.get('image')
  if (params.get('region')) {
    if (!params.get('region').startsWith('pct:')) {
      region = params.get('region').split(',')
    } else {
      abstractRegion = params.get('region').substring(4).split(',')
    }
  }
  const document = image + "/info.json"
  viewer = new ViewerManager(document)
} else if (window.location.search && window.location.search.includes("manifest")) {
  const params = new URLSearchParams(window.location.search)
  manifest = params.get('manifest')
  viewer = new ViewerManager(manifest)
}

class OsdServer extends Component {
  render () {
    return (
      <ViewerProvider viewer={viewer}>
        <Layout>
          <TopBar>
            <div className="my-logo-sm">UBL</div>
          </TopBar>
          <ActionBar>
            <Controls manifest={manifest}/>
          </ActionBar>
          <LayoutBody>
            <DocumentViewSwitcher viewer={viewer} hitComponents={[
                {key: "grid", title: "Grid", itemComponent: ManifestItem, defaultOption: true}]} scrollTo="body"/>,
          </LayoutBody>
        </Layout>
      </ViewerProvider>
    )
  }
}


export default OsdServer
