import {
  DocumentViewAccessor,
  IViewerComponentProps,
  renderComponent,
  RenderComponentPropType,
  RenderComponentType,
  ViewerComponent,
} from '../../core'

import {ListProps, Toggle} from 'searchkit-fork'

const defaults = require('lodash/defaults')

export interface IViewSwitcherProps extends IViewerComponentProps {
  listComponent?: RenderComponentType<ListProps>
}

export class ViewSwitcherToggle extends ViewerComponent<IViewSwitcherProps, any> {

  static defaultProps = {
    listComponent: Toggle,
  }

  static propTypes = defaults({
    listComponent: RenderComponentPropType,
  }, ViewerComponent.propTypes)

  getViewOptionsSwitcherAccessor() {
    return this.viewer.getAccessorByType(DocumentViewAccessor)
  }

  setView(view) {
    this.getViewOptionsSwitcherAccessor().setView(view)
  }

  render(): any {
    const viewOptionsAccessor = this.getViewOptionsSwitcherAccessor()
    if (viewOptionsAccessor) {
      const options = viewOptionsAccessor.options
      const selectedOption = viewOptionsAccessor.getSelectedOption().key
      return renderComponent(this.props.listComponent, {
        className: this.props.className,
        items: options,
        mod: this.props.mod,
        selectedItems: [selectedOption],
        setItems: ([item]) => this.setView(item),
        toggleItem: this.setView.bind(this),
      })
    }
    return null
  }
}
