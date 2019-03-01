import { IAd, IPlugin } from '../../';

const BASE_MESSAGE = '[DEBUG]';

let adId = 0;

const LoggingPlugin: IPlugin = {
  name: 'Advanced Logger',

  onCreate(ad: IAd) {
    const id = ++adId;
    (window as any)[`ad${id}`] = ad;

    console.log(
      BASE_MESSAGE,
      'Ad Instantiated and assigned as',
      `window.ad${adId}`,
    );
  },

  beforeRender() {
    console.log(BASE_MESSAGE, 'Render has been called on ad.');
  },

  onRender() {
    console.log(BASE_MESSAGE, 'Ad actively rendering.');
  },

  afterRender() {
    console.log(BASE_MESSAGE, 'Ad render has completed.');
  },

  beforeRefresh() {
    console.log(BASE_MESSAGE, 'Refresh has been called on ad.');
  },

  onRefresh() {
    console.log(BASE_MESSAGE, 'Ad actively refreshing.');
  },

  afterRefresh() {
    console.log(BASE_MESSAGE, 'Ad refresh has completed.');
  },

  beforeClear() {
    console.log(BASE_MESSAGE, 'Clear has been called on ad.');
  },

  onClear() {
    console.log(BASE_MESSAGE, 'Ad actively clearing.');
  },

  afterClear() {
    console.log(BASE_MESSAGE, 'Ad clear has completed.');
  },

  beforeDestroy() {
    console.log(BASE_MESSAGE, 'Destroy has been called on ad.');
  },

  onDestroy() {
    console.log(BASE_MESSAGE, 'Ad actively destroying.');
  },

  afterDestroy() {
    console.log(BASE_MESSAGE, 'Ad destroy has completed.');
  },
};

export default LoggingPlugin;
