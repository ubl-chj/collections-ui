import React, {Component} from 'react'

import {
  Controls,
  OSD,
  Layout,
  TopBar,
  SideBar,
  ActionBar,
  LayoutBody,
  ViewerManager,
  ViewerProvider} from 'viewer'

import '../index.css'

let image = null
let region = null
let abstractRegion = null
const host = "http://localhost"
const viewer = new ViewerManager(host)

if (window.location.search && window.location.search.includes("image")) {
  const params = new URLSearchParams(window.location.search);
  image = params.get('image');
  if (params.get('region')) {
    if (!params.get('region').startsWith('pct:')) {
      region = params.get('region').split(',')
    } else {
      abstractRegion = params.get('region').substring(4).split(',')
    }
  }
}

class Viewer extends Component {
  render () {
    return (
      <ViewerProvider viewer={viewer}>
      <Layout>
        <TopBar>
          <div className="my-logo-sm">UBL</div>
        </TopBar>
        <ActionBar>
          <Controls/>
        </ActionBar>
        <LayoutBody>
          <OSD/>
          <SideBar/>
        </LayoutBody>
      </Layout>
    </ViewerProvider>)
  }
}

export default Viewer

