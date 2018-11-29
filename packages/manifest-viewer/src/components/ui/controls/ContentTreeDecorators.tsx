import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import React from 'react'
import {VelocityComponent} from 'velocity-react'

const Div = styled('div', {
  shouldForwardProp: (prop) => ['className', 'children'].indexOf(prop) !== -1,
})((({style}) => style))

const Loading = styled(({ className }) => {
  return <div className={className}>loading...</div>;
})(({ style }) => style);

Loading.propTypes = {
  style: PropTypes.object,
}

const Toggle = ({style}) => {
  const {height, width} = style;
  const midHeight = height * 0.5;
  const points = `0,0 0,${height} ${width},${midHeight}`;

  return (
    <Div style={style.base}/>  )
}

const Header = ({node, style}) => {
  return (
    <Div style={style.base}>
      <Div style={style.title}>
        <Div style={style.nodeLink}>{node.name}</Div>
      </Div>
    </Div>
  )
}

class Container extends React.Component<any, any> {

  static propTypes = {
    animations: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]).isRequired,
    decorators: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    terminal: PropTypes.bool.isRequired,
  }

  clickableRef: any
  velocityRef: any
  render() {
    const {style, decorators, terminal, onClick, node} = this.props;
    const {active} = node
    const container = active ? style.container.activeLink : style.container.link
    return (
      <div
        onClick={onClick}
        ref={(ref) => this.clickableRef = ref}
        role='link'
        style={container}
      >
        {!terminal ? this.renderToggle() : null}
        <decorators.Header
          node={node}
          style={style.header}
        />
      </div>
    );
  }

  renderToggle() {
    const {animations} = this.props;

    if (!animations) {
      return this.renderToggleDecorator();
    }

    return (
      <VelocityComponent
        animation={animations.toggle.animation}
        duration={animations.toggle.duration}
        ref={(ref) => this.velocityRef = ref}
      >
        {this.renderToggleDecorator()}
      </VelocityComponent>
    );
  }

  renderToggleDecorator() {
    const {style, decorators} = this.props;

    return <decorators.Toggle style={style.toggle}/>;
  }
}

export default {
  Container,
  Header,
  Loading,
  Toggle,
}
