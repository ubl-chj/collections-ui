import * as React from 'react';

export class TitleText extends React.Component<any, any> {
  linkRef: any

  constructor(props) {
    super(props);
    this.linkRef = props.ref
  }
  render() {
    return <div ref={this.linkRef} />;
  }
}
