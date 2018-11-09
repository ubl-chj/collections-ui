import {AuthProfile, firebase, LogoWrapper, withDynamicLayout} from 'collections-ui-common'
import {UUIDResolver} from 'manifest-uuid'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {CanvasContext, ViewerManager, ViewerProvider} from '../../core'
import {DocumentViewSwitcher, ViewSwitcherToggle} from '../display'
import {ActionBar, Controls, Layout, LayoutBody, ManifestItem, RelatedItems, TopBar} from '../ui'

const qs = require('query-string')
const uuidv4 = require('uuid/v4')
const ManifestViewer = withDynamicLayout(ManifestItem)

export interface IViewerRouteComponentProps {
  key: any,
  bemBlocks?: any
  history: any
  location: any
  match: any
  timestamp: any
  width: number
}

class ViewerRouteComponent extends React.Component<IViewerRouteComponentProps, any> {
  viewer: ViewerManager
  hasUnmounted: boolean

  constructor(props) {
    super(props)
    this.state = {
      currentCanvas: 0,
      view: null,
      width: props.width,
    }
    this.viewer = null
  }

  componentDidMount() {
    this.resolveParams()
  }

  componentWillUnmount() {
    this.hasUnmounted = true
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
    }
    if (this.props.timestamp !== prevProps.timestamp) {
      if (this.props.match.params.uuid !== prevProps.match.params.uuid) {
        this.viewer = null
        this.resolveParams()
      }
    }
  }

  resolveParams() {
    const params = qs.parse(this.props.location.search)
    if (this.props.match.params.uuid) {
      if (!Object.keys(params).length) {
        const uuid = this.props.match.params.uuid
        const currentCanvas = this.props.location.hash.substring(1)
        this.setState({currentCanvas})
        this.resolveManifest(uuid)
      }
    }

    if (Object.keys(params).length) {
      if (params.manifest) {
        const doc = params.manifest
        const currentCanvas = this.props.location.hash.substring(1)
        this.setState({currentCanvas})
        if (!this.hasUnmounted) {
          this.viewer = new ViewerManager(doc)
          this.forceUpdate()
        }
      }
    }
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

  buildViewSwitcherToggle() {
    const {width} = this.state
    const isMobile = width <= 500
    if (isMobile) {
      return null
    } else {
      return (<ViewSwitcherToggle/>)
    }
  }

  render() {
    const {width} = this.state
    if (this.viewer) {
      return (
          <ViewerProvider viewer={this.viewer}>
            <Layout>
              <TopBar>
                <LogoWrapper/>
                <div style={{display: 'flex', flex: '1 1'}}/>
                {this.buildViewSwitcherToggle()}
                <AuthProfile width={width}/>
              </TopBar>
              <ActionBar>
                <Controls {...this.props} uuid={uuidv4()}/>
              </ActionBar>
              <LayoutBody>
                <CanvasContext.Provider value={this.state.currentCanvas}>
                  <DocumentViewSwitcher
                    viewerComponents={[{defaultOption: true, itemComponent: ManifestViewer, key: 'list', title: 'Main',
                    }, {itemComponent: RelatedItems, key: 'grid', title: 'Related'}]}
                  />
                </CanvasContext.Provider>
              </LayoutBody>
            </Layout>
          </ViewerProvider>)
    } else {
      return null
    }
  }
}

export const Viewer = withRouter(withDynamicLayout(ViewerRouteComponent))
