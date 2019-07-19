import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import ScrollMonitor from '../utils/scrollMonitor';
import GenericPlugin from './GenericPlugin';

class AutoRender extends GenericPlugin {
  public afterCreate() {
    if (!this.enabled) {
      return;
    }

    const { container, configuration, el } = this.ad;

    const renderOffset = configuration.renderOffset || configuration.offset || 0;

    ScrollMonitor.subscribe(el.id, container, renderOffset, this.onEnterViewport);
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', `Ad's scroll monitor has been created.`);
  }

  private onEnterViewport = () => {
    if (!this.enabled) {
      return;
    }

    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', 'Ad has entered the viewport. Calling render().');
    this.ad.render();
  }

  private get enabled() {
    const { autoRender = true } = this.ad.configuration;

    return !!autoRender;
  }
}

export default AutoRender;
