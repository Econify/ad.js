import GenericPlugin from './GenericPlugin';

const BASE_MESSAGE = '[DEBUG]';

let adId = 0;

class LoggingPlugin extends GenericPlugin {
  public onCreate() {
    const id = ++adId;
    (window as any)[`ad${id}`] = this.ad;

    console.log(
      BASE_MESSAGE,
      'Ad Instantiated and assigned as',
      `window.ad${adId}`,
    );
  }

  public beforeRender() {
    console.log(BASE_MESSAGE, 'Render has been called on ad.');
  }

  public onRender() {
    console.log(BASE_MESSAGE, 'Ad actively rendering.');
  }

  public afterRender() {
    console.log(BASE_MESSAGE, 'Ad render has completed.');
  }

  public beforeRefresh() {
    console.log(BASE_MESSAGE, 'Refresh has been called on ad.');
  }

  public onRefresh() {
    console.log(BASE_MESSAGE, 'Ad actively refreshing.');
  }

  public afterRefresh() {
    console.log(BASE_MESSAGE, 'Ad refresh has completed.');
  }

  public beforeClear() {
    console.log(BASE_MESSAGE, 'Clear has been called on ad.');
  }

  public onClear() {
    console.log(BASE_MESSAGE, 'Ad actively clearing.');
  }

  public afterClear() {
    console.log(BASE_MESSAGE, 'Ad clear has completed.');
  }

  public beforeDestroy() {
    console.log(BASE_MESSAGE, 'Destroy has been called on ad.');
  }

  public onDestroy() {
    console.log(BASE_MESSAGE, 'Ad actively destroying.');
  }

  public afterDestroy() {
    console.log(BASE_MESSAGE, 'Ad destroy has completed.');
  }
}

export = LoggingPlugin;
