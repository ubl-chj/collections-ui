import {UUIDResolver} from "manifest-uuid";
import {
  ActionBar,
  Controls,
  DocumentViewSwitcher,
  Layout,
  LayoutBody,
  ManifestItem,
  TopBar,
  ViewerContext,
  ViewerManager,
  ViewerProvider,
} from 'manifest-viewer'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {firebase} from '../../firebase'
import '../../styles/index.css'
import {withDynamicLayout} from "../core";
import {AuthProfile, LogoWrapper} from '../ui'

const qs = require('query-string')
const uuidv4 = require('uuid/v4')

class ViewerComponent extends React.Component<any, any> {
  viewer: ViewerManager
  props: any
  hasUnmounted: boolean

  constructor(props) {
    super(props)
    this.props = props
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
      if (firebase) {
        const resolver = new UUIDResolver(uuid, firebase.uuidDb)
        resolver.resolveManifest().then((manifest) => {
          if (!this.hasUnmounted) {
            this.viewer = new ViewerManager(manifest)
            this.forceUpdate()
          }
        })
      }
    } else if (Object.keys(params).length) {
      const doc = params.manifest
      const currentCanvas = this.props.location.hash.substring(1)
      this.setState({currentCanvas})
      // const uuid = uuidv5('url', doc)
      // this.props.history.replace(window.parent.location.pathname + uuid)
      if (!this.hasUnmounted) {
        this.viewer = new ViewerManager(doc)
        this.forceUpdate()
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

  render() {
    const {width} = this.state
    if (this.viewer) {
      return (
          <ViewerProvider viewer={this.viewer}>
            <Layout>
              <TopBar>
                <LogoWrapper/>
                <div className='header__mid'/>
                <AuthProfile width={width}/>
              </TopBar>
              <ActionBar>
                <Controls {...this.props} uuid={uuidv4()}/>
              </ActionBar>
              <LayoutBody>
                <ViewerContext.Provider value={this.state.currentCanvas}>
                  <DocumentViewSwitcher
                    viewerComponents={[{defaultOption: true, itemComponent: withDynamicLayout(ManifestItem), key: 'grid', title: 'Grid',
                    }]}
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
