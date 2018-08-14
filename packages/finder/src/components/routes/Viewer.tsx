import React from 'react'
import {Link, withRouter} from 'react-router-dom'
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
const qs = require('query-string')

class ViewerComponent extends React.Component<any, any> {
  viewer: ViewerManager
  manifest: string
  props: any

  constructor(props) {
    super(props)
    this.props = props
  }

  componentDidMount() {
    const manifest = qs.parse(this.props.location.search).manifest
    this.viewer = new ViewerManager(manifest)
    this.forceUpdate()
    console.log(this.props.location.state)
  }

  render() {
    const t = Boolean(true)
    if (this.viewer) {
      return (<ViewerProvider viewer={this.viewer}>
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
    } else {
      return null
    }
  }
}

export const Viewer = withRouter(ViewerComponent)
