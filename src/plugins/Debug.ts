import insertElement from '../utils/insertElement';
import padTime from '../utils/padTime';
import GenericPlugin from './GenericPlugin';

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

class Debug extends GenericPlugin {
  public debugOverlay!: HTMLElement;

  public onCreate() {
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

  public afterCreate() {
    this.insertMessage('created');
  }

  public onRender() {
    this.insertMessage('rendered');
  }

  public onRefresh() {
    this.insertMessage('refreshed');
  }

  public onClear() {
    this.insertMessage('cleared');
  }

  public onDestroy() {
    this.insertMessage('destroyed');
  }

  private insertMessage(baseMessage: string): void {
    const currentDate = new Date();
    const hour = padTime(currentDate.getHours());
    const minutes = padTime(currentDate.getMinutes());
    const milliseconds = padTime(currentDate.getMilliseconds());
    const message = `[EVENT] ${baseMessage} at ${hour}:${minutes}:${milliseconds}`;

    insertElement('p', { style: MESSAGE_STYLE }, this.debugOverlay, message);
  }

  private insertMetadata(metadata: googletag.events.SlotRenderEndedEvent): void {
    const message = Object.entries(metadata)
      .map(([key, value]) => `${key} = ${value}`)
      .join('<br />');

    insertElement('p', { style: MESSAGE_STYLE }, this.debugOverlay, message);
  }
}

export default Debug;
