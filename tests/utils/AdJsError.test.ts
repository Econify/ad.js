import AdJsError from '../../src/utils/AdJsError';

describe('AdJsError', () => {
  it('assigns code and message properly to instance', () => {
    const instance = new AdJsError('MISCONFIGURATION', 'Something went wrong..');

    expect(instance.code).toEqual('MISCONFIGURATION');
    expect(instance.message).toEqual('Something went wrong..');
  });
});
