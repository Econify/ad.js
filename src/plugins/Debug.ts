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
`;

const MESSAGE_STYLE = `
  color: white;
  text-align: left;
`;

class Debug extends GenericPlugin {
  public debugOverlay!: HTMLElement;

  public onCreate() {
    const { container } = this.ad;

    this.debugOverlay = insertElement('div', { style: OVERLAY_STYLE }, container);
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
}

export = Debug;
