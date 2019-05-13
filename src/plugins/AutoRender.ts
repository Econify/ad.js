import scrollMonitor from 'scrollmonitor';
import GenericPlugin from './GenericPlugin';

class AutoRender extends GenericPlugin {
  public afterCreate() {
    const { configuration, container } = this.ad;
    const { offset = 0 } = configuration;

    const renderWatcher = scrollMonitor.create(container, offset);

    renderWatcher.enterViewport(() => {
      this.ad.render();
    });
  }
}

export = AutoRender;
