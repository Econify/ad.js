import dispatchEvent from '../utils/dispatchEvent';
import onEvent from '../utils/onEvent';
import GenericPlugin from './GenericPlugin';

const BASE_MESSAGE = '[DEBUG]';

class LoggingPlugin extends GenericPlugin {
  public onCreate() {
    const { ad } = this;

    (window as any)[`ad${ad.id}`] = ad;

    console.log(
      BASE_MESSAGE,
      'Ad Instantiated and assigned as',
      `window.ad${ad.id}`,
    );

    onEvent(ad, (event) => {
      console.log(BASE_MESSAGE, event);
    });
  }

  public beforeRender() {
    dispatchEvent(this.ad, 'logging', 'beforeRender', 'Render has been called on ad.');
  }

  public onRender() {
    dispatchEvent(this.ad, 'logging', 'onRender', 'Ad actively rendering.');
  }

  public afterRender() {
    dispatchEvent(this.ad, 'logging', 'afterRender', 'Ad render has completed.');
  }

  public beforeRefresh() {
    dispatchEvent(this.ad, 'logging', 'beforeRefresh', 'Refresh has been called on ad.');
  }

  public onRefresh() {
    dispatchEvent(this.ad, 'logging', 'onRefresh', 'Ad actively refreshing.');
  }

  public afterRefresh() {
    dispatchEvent(this.ad, 'logging', 'afterRefresh', 'Ad refresh has completed.');
  }

  public beforeClear() {
    dispatchEvent(this.ad, 'logging', 'beforeClear', 'Clear has been called on ad.');
  }

  public onClear() {
    dispatchEvent(this.ad, 'logging', 'onClear', 'Ad actively clearing.');
  }

  public afterClear() {
    dispatchEvent(this.ad, 'logging', 'afterCler', 'Ad clear has completed.');
  }

  public beforeDestroy() {
    dispatchEvent(this.ad, 'logging', 'beforeDestroy', 'Destroy has been called on ad.');
  }

  public onDestroy() {
    dispatchEvent(this.ad, 'logging', 'onDestroy', 'Ad actively destroying.');
  }

  public afterDestroy() {
    dispatchEvent(this.ad, 'logging', 'afterDestroy', 'Ad destroy has completed.');
  }
}

export = LoggingPlugin;
