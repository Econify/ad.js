import { LOG_LEVELS } from '../../src/types';
import dispatchEvent from '../../src/utils/dispatchEvent';
import onEvent from '../../src/utils/onEvent';

describe('onEvent', () => {
  it('attaches two event listeners under the proper key', () => {
    let detail1: any;
    let detail2: any;

    onEvent(1, (event) => { detail1 = { ...event.detail }; });
    onEvent(2, (event) => { detail2 = { ...event.detail }; });

    dispatchEvent(1, LOG_LEVELS.WARN, 'SOME PLUGIN', 'This is the message', {});
    dispatchEvent(2, LOG_LEVELS.INFO, 'SECOND PLUGIN', 'This is another message', {});

    expect(detail1.level).toEqual('warn');
    expect(detail1.creator).toEqual('SOME PLUGIN');
    expect(detail1.message).toEqual('This is the message');

    expect(detail2.level).toEqual('info');
    expect(detail2.creator).toEqual('SECOND PLUGIN');
    expect(detail2.message).toEqual('This is another message');
    expect(detail2.data).toEqual({});
  });
});
