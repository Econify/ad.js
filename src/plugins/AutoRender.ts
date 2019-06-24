import { LOG_LEVELS } from '../types';
import ScrollMonitor from '../utils/scrollMonitor';
import GenericPlugin from './GenericPlugin';

class AutoRender extends GenericPlugin {
  public afterCreate() {
    const { container, configuration, el } = this.ad;
    const { offset = 0 } = configuration;

    ScrollMonitor.subscribe(el.id, container, offset, this.onEnterViewport);
    this.dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', `Ad's scroll monitor has been created.`);
  }

  private onEnterViewport = () => {
    this.dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', 'Ad entered the viewport. Calling render.');
    this.ad.render();
  }
}

export default AutoRender;
