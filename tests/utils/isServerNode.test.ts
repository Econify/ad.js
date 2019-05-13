/**
 * @jest-environment node
 */

import isServer from '../../src/utils/isServer';

describe('isServer', () => {
  it('returns true if window is undefined', () => {
    const result = isServer();

    expect(result).toEqual(true);
  });
});
