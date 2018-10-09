import {
  AnnotationDetail,
  AnnotationRepresentation,
  AnnotationSelector,
  CanvasProvider,
  FullPageViewport,
  functionOrMapChildren,
  Manifest,
  OpenSeadragonViewport,
  SingleTileSource,
  SizedViewport,
  Viewport,
} from '@canvas-panel/core';
import 'brace';
import 'brace/mode/json'
import 'brace/theme/tomorrow_night_eighties'
import * as React from 'react'
import AceEditor from 'react-ace'
import {Viewer} from './Viewer'

const defaultAnnotation = `
{
  "type": "Annotation",
  "@context": "http://www.w3.org/ns/anno.jsonld",
  "label": "An 8th Century Buddha",
  "body": {
    "value": "Impressions de figures bouddhiques",
    "type": "TextualBody",
    "purpose": "tagging",
    "format": "text/plain"
  },
  "target": {
    "id": "https://gallica.bnf.fr/iiif/ark:/12148/btv1b83000818/canvas/f1#xywh=770,633,360,548",
    "type": "Canvas",
    "dcterms:isPartOf": {
      "id": "https://gallica.bnf.fr/iiif/ark:/12148/btv1b83000818/manifest.json",
      "type": "Manifest",
      "label": "Pelliot chinois 4514 (17) B"
    }
  },
  "motivation": {
    "id": "http://www.w3.org/ns/oa#tagging",
    "label": "tagging"
  },
  "generator": "/capture-models/generic/describing.json"
}
`;

export class AnnotationPlayground extends React.Component<any, any> {
  state = { currentAnnotation: defaultAnnotation };

  onChange = (value) => {
    this.setState({ currentAnnotation: value });
  };

  getAnnotation() {
    const { currentAnnotation } = this.state;
    try {
      return currentAnnotation ? JSON.parse(currentAnnotation) : null;
    } catch (e) {
      return null;
    }
  }

  render() {
    const { currentAnnotation } = this.state;
    const annotation = this.getAnnotation();

    return (
      <div>
        <main style={{ display: 'flex', minHeight: '100vh' }}>
          <aside style={{ width: 600 }}>
            <AceEditor
              mode="json"
              theme="tomorrow_night_eighties"
              onChange={this.onChange}
              name="annotation-editor"
              value={currentAnnotation}
              editorProps={{ $blockScrolling: true }}
              style={{ width: 600, height: '100vh' }}
            />
          </aside>
          <article
            style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
          >
            {annotation ? (
              <div style={{ flexGrow: 1, maxHeight: 1000, position: 'relative'}}>
                <Viewer annotation={annotation} />
              </div>
            ) : null}
            <div style={{ height: 200, padding: 30 }}>
              {annotation ? (
                <div>
                  <h1>{annotation.label}</h1>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: annotation.body ? annotation.body.value : '',
                    }}
                  />
                </div>
              ) : null}
            </div>
          </article>
        </main>
      </div>
    )
  }
}
