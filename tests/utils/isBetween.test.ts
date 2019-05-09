import isBetween from '../../src/utils/isBetween';

describe('isBetween', () => {
  it('returns correct boolean value', () => {
    expect(isBetween(5, 2, 7)).toEqual(true);
    expect(isBetween(999, 998.79, 1000)).toEqual(true);
    expect(isBetween(.5, 0, 1)).toEqual(true);
    expect(isBetween(2, 3, 4)).toEqual(false);
  });
});
