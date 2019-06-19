import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import ScrollMonitor from '../utils/scrollMonitor';
import GenericPlugin from './GenericPlugin';

class AutoRender extends GenericPlugin {
  public afterCreate() {
    const { container, configuration, el } = this.ad;
    const { offset = 0 } = configuration;

    ScrollMonitor.subscribe(el.id, container, offset, this.onEnterViewport);
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', `Ad's scroll monitor has been created.`);
  }

  private onEnterViewport = () => {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', 'Ad has entered the viewport. Calling render().');
    this.ad.render();
  }
}

export default AutoRender;
