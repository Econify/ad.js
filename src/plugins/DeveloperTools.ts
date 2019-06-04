import { LOG_LEVELS } from '../types';
import dispatchEvent from '../utils/dispatchEvent';
import insertElement from '../utils/insertElement';
import onEvent from '../utils/onEvent';
import padTime from '../utils/padTime';
import GenericPlugin from './GenericPlugin';

const BASE_MESSAGE = '[ADJS]';

const COLOR_MAP: { [key: string]: string } = {
  'AutoRefresh Plugin': 'blue',
  'AutoRender Plugin': 'purple',
  'DeveloperTools Plugin': 'red',
  'Responsive Plugin': 'green',
  'Sticky Plugin': 'brown',
  'DFP Network': 'gray',
};

const OVERLAY_STYLE = `
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  padding: 5px;
  text-align: left;
  color: yellow;
  font-size: 12px;
`;

const MESSAGE_STYLE = `
  padding: 5px 0;
  color: white;
  border-bottom: 1px solid grey;
`;

class DeveloperTools extends GenericPlugin {
  public debugOverlay?: HTMLElement;

  public onCreate() {
    const { logging = true, overlay = true } = this.ad.configuration;

    if (logging) {
      this.initLogging();
    }

    if (overlay) {
      this.initOverlay();
    }
  }

  public afterCreate() {
    this.insertMessage('created');
  }

  public beforeRender() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Render has been called on ad.');
  }

  public onRender() {
    this.insertMessage('rendered');
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Ad actively rendering.');
  }

  public afterRender() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Ad render has completed.');
  }

  public beforeRefresh() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Ad render has completed.');
  }

  public onRefresh() {
    this.insertMessage('refreshed');
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Ad actively refreshing.');
  }

  public afterRefresh() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Ad refresh has completed.');
  }

  public beforeClear() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Clear has been called on ad.');
  }

  public onClear() {
    this.insertMessage('cleared');
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Ad actively clearing.');
  }

  public afterClear() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Ad clear has completed.');
  }

  public beforeDestroy() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Destroy has been called on ad.');
  }

  public onDestroy() {
    this.insertMessage('destroyed');
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Ad actively destroying.');
  }

  public afterDestroy() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'DeveloperTools Plugin', 'Ad destroy has completed.');
  }

  private initLogging() {
    const { ad } = this;
    const { id } = ad;

    (window as any)[`ad${id}`] = ad;

    console.log(
      BASE_MESSAGE,
      'Ad Instantiated and assigned as',
      `window.ad${id}`,
    );

    onEvent(id, (event) => {
      const { level, creator, message, data = '' } = event.detail;
      const color = COLOR_MAP[creator] || 'black';
      // @ts-ignore
      console[level](
        `%c${BASE_MESSAGE} [${creator}] id=${id}  ${message} ${data}`,
        `color: ${color}; font-weight: bold;`,
      );
    });
  }

  private initOverlay() {
    const { container, el: { id }, configuration: { path } } = this.ad;

    const title = `slotId: ${id} <br /> path: ${path} <hr />`;

    this.debugOverlay = insertElement('div', { style: OVERLAY_STYLE }, container, title);

    googletag.cmd.push(() => {
      googletag.pubads().addEventListener(
        'slotRenderEnded',
        (event: googletag.events.SlotRenderEndedEvent) => {
          if (event.slot === this.ad.slot) {
            this.insertMetadata(event);
          }
        },
      );
    });
  }

  private insertMessage(baseMessage: string): void {
    if (!this.debugOverlay) {
      return;
    }

    const currentDate = new Date();
    const hour = padTime(currentDate.getHours());
    const minutes = padTime(currentDate.getMinutes());
    const milliseconds = padTime(currentDate.getMilliseconds());
    const message = `[EVENT] ${baseMessage} at ${hour}:${minutes}:${milliseconds}`;

    insertElement('p', { style: MESSAGE_STYLE }, this.debugOverlay, message);
  }

  private insertMetadata(metadata: googletag.events.SlotRenderEndedEvent): void {
    if (!this.debugOverlay) {
      return;
    }

    const message = Object.entries(metadata)
      .map(([key, value]) => `${key} = ${value}`)
      .join('<br />');

    insertElement('p', { style: MESSAGE_STYLE }, this.debugOverlay, message);
  }
}

export default DeveloperTools;