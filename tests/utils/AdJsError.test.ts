import AdJsError from '../../src/utils/AdJsError';

describe('AdJsError', () => {
  it('assigns code and message properly to instance', () => {
    const instance = new AdJsError('Misconfiguration', 'Something went wrong..');

    expect(instance.code).toEqual('Misconfiguration');
    expect(instance.message).toEqual('Something went wrong..');
  });
});
