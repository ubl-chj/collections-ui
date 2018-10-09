import {
  AnnotationDetail,
  AnnotationRepresentation,
  AnnotationSelector,
  CanvasProvider,
  FullPageViewport,
  functionOrMapChildren,
  Manifest,
  OpenSeadragonViewer,
  OpenSeadragonViewport,
  SingleTileSource,
  SizedViewport,
  Viewport,
} from '@canvas-panel/core'
import * as React from 'react'

const Manifesto = require( '@stephenwf-forks/manifesto.js')

export class Viewer extends React.Component<any, any> {

  static defaultOsdProps() {
    return {
      animationTime: 1.2,
      constrainDuringPan: false,
      crossOriginPolicy: 'Anonymous',
      defaultZoomLevel: 0,
      maxZoomLevel: 10,
      minZoomLevel: 0,
      visibilityRatio: 0.5,
    }
  }
  state = { error: null, manifest: null, canvas: null };
  props: any
  viewer: any

  componentDidCatch(error, errorInfo) {
    console.error('error', error, errorInfo);
    this.setState({ error });
  }

  componentDidMount() {
    this.setManifest(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ error: null });
    this.setManifest(newProps);
  }

  setManifest({ annotation }) {
    if (
      !annotation ||
      !annotation.target ||
      !annotation.target['dcterms:isPartOf']
    ) {
      return this.setState({ manifest: null, error: 'Manifest not found' });
    }

    this.setState({ canvas: annotation.target.id.split('#')[0] });

    if (annotation.target['dcterms:isPartOf'].id !== this.state.manifest) {
      this.setState({
        manifest: annotation.target['dcterms:isPartOf'].id,
      });
    }

    const on = AnnotationSelector.parse(annotation.target.id);
    setTimeout(() => {
      this.viewer.goToRect(on.selector, 200, 1.5);
    }, 500);
  }

  render() {
    const { error, manifest, canvas } = this.state;
    const { annotation } = this.props;
    const anno = Manifesto.Utils.createAnnotation(annotation);

    if (error || !manifest || !canvas) {
      return (
        <div>
          <h3>Please check your annotation</h3>
          <code>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </code>
        </div>
      );
    }
    return (
      <Manifest url={manifest}>
        <CanvasProvider startCanvas={canvas} currentCanvas={canvas}>
          <SingleTileSource viewportController={true}>
            <FullPageViewport
              setRef={(viewer) => (this.viewer = viewer)}
              position="relative"
              interactive={true}
            >
              <OpenSeadragonViewport>
                <OpenSeadragonViewer osdOptions={Viewer.defaultOsdProps()}/>
              </OpenSeadragonViewport>
              <AnnotationRepresentation
                annotations={[
                  {
                    annotation: anno,
                    on: AnnotationSelector.parse(annotation.target.id),
                  },
                ]}
              />
            </FullPageViewport>
          </SingleTileSource>
        </CanvasProvider>
      </Manifest>
    );
  }
}
