import isServer from '../../src/utils/isServer';

describe('isServer', () => {
  it('returns false if window is defined', () => {
    const result = isServer();

    expect(result).toEqual(false);
  });
});
