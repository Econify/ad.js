import padTime from '../../src/utils/padTime';

describe('padTime', () => {
  it('returns padded time as a string', () => {
    expect(padTime(15)).toEqual('15');
    expect(padTime(5)).toEqual('05');
    expect(typeof padTime(12345) === 'string').toBe(true);
  });
});
