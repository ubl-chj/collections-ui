import {AuthProfile, firebase, LogoWrapper} from 'collections-ui-common'
import {UUIDResolver} from 'manifest-uuid'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {ViewerManager, ViewerProvider} from '../../core'
import {ActionBar, Controls, Layout, LayoutBody, OsdComponent, TopBar} from '../ui'
import {IViewerRouteComponentProps} from './Viewer'
const qs = require('query-string')
const uuidv4 = require('uuid/v4')

class PreviewerComponent extends React.Component<IViewerRouteComponentProps, any> {
  viewer: ViewerManager
  hasUnmounted: boolean
  manifest: string
  region: any
  abstractRegion: any
  image: string
  document: string
  source: object
  state: {
    isMobile: boolean,
  }

  constructor(props) {
    super(props)
    this.state = {
      isMobile: props.isMobile,
    }
  }

  componentDidMount() {
    const params = qs.parse(this.props.location.search)
    const image = params.image
    this.image = image
    if (params.region) {
      if (!params.region.startsWith('pct:')) {
        this.region = params.region.split(',')
      } else {
        this.abstractRegion = params.region.substring(4).split(',')
      }
    }
    const uuid = this.props.match.params.uuid
    this.resolveManifest(uuid)
    this.document = image + '/info.json'
  }

  resolveManifest(uuid) {
    if (firebase) {
      const resolver = new UUIDResolver(uuid, firebase.uuidDb)
      resolver.resolveManifest().then((manifest) => {
        if (!this.hasUnmounted) {
          this.viewer = new ViewerManager(manifest)
          this.forceUpdate()
        }
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isMobile !== prevProps.isMobile) {
      this.setState({isMobile: this.props.isMobile})
    }
  }

  componentWillUnmount() {
    this.hasUnmounted = true
  }

  render() {
    const {isMobile} = this.state
    if (this.viewer) {
      return (
        <ViewerProvider viewer={this.viewer}>
          <Layout>
            <TopBar>
              <LogoWrapper/>
              <div style={{display: 'flex', flex: '1 1'}}/>
              <AuthProfile isMobile={isMobile}/>
            </TopBar>
            <ActionBar>
              <Controls {...this.props} uuid={uuidv4()}/>
            </ActionBar>
            <LayoutBody>
              <OsdComponent canvasLabels={null} images={[this.document]} isMobile={isMobile}/>
            </LayoutBody>
          </Layout>
        </ViewerProvider>)
    } else {
      return null
    }
  }
}

export const Previewer = withRouter(PreviewerComponent)
