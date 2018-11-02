import {AuthProfile, firebase, LogoWrapper, withDynamicLayout} from 'collections-ui-common'
import {UUIDResolver} from 'manifest-uuid'
import {
  ActionBar,
  Controls,
  DocumentViewSwitcher,
  Layout,
  LayoutBody,
  ManifestItem,
  RelatedItems,
  TopBar,
  ViewerContext,
  ViewerManager,
  ViewerProvider,
  ViewSwitcherToggle,
} from 'manifest-viewer'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'

const qs = require('query-string')
const uuidv4 = require('uuid/v4')
const ManifestViewer = withDynamicLayout(ManifestItem)

export interface IMetadataProps {
  key: any,
  bemBlocks?: any
  history: any
  location: any
  match: any
  width: number
}

class ViewerComponent extends React.Component<IMetadataProps, any> {
  viewer: ViewerManager
  hasUnmounted: boolean

  constructor(props) {
    super(props)
    this.state = {
      currentCanvas: 0,
      width: props.width,
    }
  }

  componentDidMount() {
    const params = qs.parse(this.props.location.search)
    if (this.props.match.params.uuid && !Object.keys(params).length) {
      const uuid = this.props.match.params.uuid
      const currentCanvas = this.props.location.hash.substring(1)
      this.setState({currentCanvas})
      this.resolveManifest(uuid)
    } else if (Object.keys(params).length) {
        if (params.p) {
          const path = this.props.location.pathname
          const uuid = path.split('/')[2]
          this.resolveManifest(uuid)
          this.props.history.replace(window.parent.location.pathname)
        } else if (params.manifest) {
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

  componentWillUnmount() {
    this.hasUnmounted = true
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.setState({width: this.props.width})
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
                <div className='header__mid'/>
                {this.buildViewSwitcherToggle()}
                <AuthProfile width={width}/>
              </TopBar>
              <ActionBar>
                <Controls {...this.props} uuid={uuidv4()}/>
              </ActionBar>
              <LayoutBody>
                <ViewerContext.Provider value={this.state.currentCanvas}>
                  <DocumentViewSwitcher
                    viewerComponents={[{defaultOption: true, itemComponent: ManifestViewer, key: 'list', title: 'Main',
                    }, {itemComponent: RelatedItems, key: 'grid', title: 'Related'}]}
                  />
                </ViewerContext.Provider>
              </LayoutBody>
            </Layout>
          </ViewerProvider>)
    } else {
      return null
    }
  }
}

export const Viewer = withRouter(ViewerComponent)
