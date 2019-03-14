import scrollMonitor from 'scrollmonitor';
import { IAd, IPlugin } from '../../';

const AutoRender: IPlugin = {
  name: 'Auto Render',

  onCreate(ad: IAd) {
    const { offset = 0 } = ad.configuration;
    const renderWatcher = scrollMonitor.create(ad.container, offset);

    renderWatcher.enterViewport(() => {
      ad.render();
    });
  },
};

export default AutoRender;
