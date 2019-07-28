import styled from '@emotion/styled'
import React from 'react'
import {Treebeard} from 'react-treebeard'
import {ViewerComponent} from '../../../core/react'
import ContentTreeDecorators from './ContentTreeDecorators'
import treeStyles from './styles/treeStyles'

const Div: any = styled('div', {
  shouldForwardProp: (prop) => ['className', 'children'].indexOf(prop) !== -1,
})(({ style }): any => style)

export class ContentTree extends ViewerComponent<any, any> {
  state: {
    cursor: any;
    children: any;
    document: any;
    menuOpen: boolean;
  }

  constructor(props) {
    super(props);
    this.state = {
      children: null,
      cursor: null,
      document: null,
      menuOpen: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.menuOpen !== prevProps.menuOpen) {
      const document = this.getDocument()
      this.setState({document})
      const children = this.buildStructures(document)
      this.setState({children})
    }
  }

  onToggle = (node, toggled) => {
    if (this.state.cursor) {
      this.state.cursor.active = false
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled
    }
    this.setState({ cursor: node });
  }

  getCanvasIndex(index) {
    const {document} = this.state
    const sequence = document.getSequences()[0]
    return sequence.getCanvasIndexById(index)
  }

  buildStructures(document) {
    const tree = document.getDefaultTree()
    const children = []
    tree.nodes.forEach((node) => {
      if (node.nodes.length) {
        const subChildren = []
        node.nodes.forEach((childNode) => {
          const subItem = {
            key: childNode.id,
            name: childNode.label,
            startCanvas: childNode.data.__jsonld.canvases[0],
          }
          subChildren.push(subItem)
        })
        const item = {
          children: subChildren,
          key: node.id,
          name: node.label,
          startCanvas: node.data.__jsonld.canvases[0],
          toggled: true,
        }
        children.push(item)
      } else {
        const item = {
          key: node.id,
          name: node.label,
          startCanvas: node.data.__jsonld.canvases[0],
        }
        children.push(item)
      }
    })
    return {
      children: [
        {
          children,
          name: 'Contents',
          toggled: true,
        },
      ],
      toggled: true,
    }
  }

  goToSection = (cursor) => {
    if (this.props.osd) {
      if (cursor) {
        const index = cursor.startCanvas
        const canvasIndex = this.getCanvasIndex(index)
        if (canvasIndex || canvasIndex === 0) {
          this.props.osd.goToPage(canvasIndex)
        }
      }
    }
  }

  render() {
    const styles = treeStyles
    const {children, cursor} = this.state
    if (children) {
      return (
        <Div>
          <Treebeard
            animations={false}
            data={children}
            decorators={ContentTreeDecorators}
            onToggle={this.onToggle}
            style={styles}
          />
          <>{this.goToSection(cursor)}</>
        </Div>
      )
    } else {
      return null
    }
  }
}
