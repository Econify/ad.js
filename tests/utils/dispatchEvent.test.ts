import { LOG_LEVELS } from '../../src/types';
import dispatchEvent from '../../src/utils/dispatchEvent';

describe('dispatchEvent', () => {
  it('dispatches the event to the window with proper shape', () => {
    let detail: any;

    window.addEventListener('adjs:1:event', (event: any) => {
      detail = event.detail;
    });

    dispatchEvent(1, LOG_LEVELS.INFO, 'SOME PLUGIN', 'This is the message', {});

    expect(detail.level).toEqual('info');
    expect(detail.creator).toEqual('SOME PLUGIN');
    expect(detail.message).toEqual('This is the message');
    expect(detail.data).toEqual({});
  });
});
