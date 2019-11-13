import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import ScrollMonitor from '../utils/scrollMonitor';
import GenericPlugin from './GenericPlugin';

class AutoRender extends GenericPlugin {
  public afterCreate() {
    if (!this.isEnabled('autoRender')) {
      return;
    }

    const {
      container,
      configuration: { renderOffset, offset, enableByScroll, clearOnExitViewport },
      el: { id } } = this.ad;

    const finalOffset = renderOffset || offset || 0;

    ScrollMonitor.subscribe(
      id,
      container,
      finalOffset,
      this.onEnterViewport,
      undefined,
      clearOnExitViewport ? this.onExitViewport : undefined,
      enableByScroll,
    );
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', `Ad's scroll monitor has been created.`);
  }

  private onEnterViewport = () => {
    if (!this.isEnabled('autoRender')) {
      return;
    }

    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', 'Ad has entered the viewport. Calling render().');
    this.ad.render();
  }

  private onExitViewport = () => {
    if (!this.isEnabled('autoRender')) {
      return;
    }

    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'AutoRender Plugin', 'Ad has exited the viewport. Calling clear().');
    this.ad.clear();
  }
}

export default AutoRender;
