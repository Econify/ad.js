import scrollMonitor from 'scrollmonitor';
import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import GenericPlugin from './GenericPlugin';

class AutoRender extends GenericPlugin {
  public afterCreate() {
    const { configuration, container } = this.ad;
    const { offset = 0 } = configuration;

    const renderWatcher = scrollMonitor.create(container, offset);
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', `Ad's scroll monitor has been created.`);

    renderWatcher.enterViewport(() => {
      dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', 'Ad has entered the viewport. Calling render().');
      this.ad.render();
    });
  }
}

export = AutoRender;
