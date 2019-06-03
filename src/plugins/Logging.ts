import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import onEvent from '../utils/onEvent';
import GenericPlugin from './GenericPlugin';

const BASE_MESSAGE = '[ADJS]';

const colorMap: { [key: string]: string } = {
  'AutoRefresh Plugin': 'blue',
  'AutoRender Plugin': 'purple',
  'Logging Plugin': 'red',
  'Responsive Plugin': 'green',
  'Sticky Plugin': 'brown',
  'DFP Network': 'gray',
};

class LoggingPlugin extends GenericPlugin {
  public onCreate() {
    const { ad } = this;
    const { id } = ad;

    (window as any)[`ad${id}`] = ad;
    console.log(
      BASE_MESSAGE,
      'Ad Instantiated and assigned as',
      `window.ad${id}`,
    );

    onEvent(id, (event) => {
      const { level, creator, message, data } = event.detail;
      // @ts-ignore
      console[level](
        `%c${BASE_MESSAGE} [${creator}] ${message} ${data || ''}`,
        `color: ${colorMap[creator] || 'black'}; font-weight: bold`,
      );
    });
  }

  public beforeRender() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Render has been called on ad.');
  }

  public onRender() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Ad actively rendering.');
  }

  public afterRender() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Ad render has completed.');
  }

  public beforeRefresh() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Ad render has completed.');
  }

  public onRefresh() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Ad actively refreshing.');
  }

  public afterRefresh() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Ad refresh has completed.');
  }

  public beforeClear() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Clear has been called on ad.');
  }

  public onClear() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Ad actively clearing.');
  }

  public afterClear() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Ad clear has completed.');
  }

  public beforeDestroy() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Destroy has been called on ad.');
  }

  public onDestroy() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Ad actively destroying.');
  }

  public afterDestroy() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Logging Plugin', 'Ad destroy has completed.');
  }
}

export default LoggingPlugin;
