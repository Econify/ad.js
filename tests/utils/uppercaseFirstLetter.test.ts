import uppercaseFirstLetter from '../../src/utils/uppercaseFirstLetter';

describe('uppercaseFirstLetter', () => {
  it('returns same string with proper capitalization', () => {
    expect(uppercaseFirstLetter('banana')).toEqual('Banana');
    expect(uppercaseFirstLetter('BANANA')).toEqual('BANANA');
    expect(uppercaseFirstLetter('b')).toEqual('B');
  });

  it('does not throw an error when empty string is passed', () => {
    expect(uppercaseFirstLetter('')).toEqual('');
  });
});
