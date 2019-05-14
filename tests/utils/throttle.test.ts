import throttle from '../../src/utils/throttle';

describe('throttle', async () => {
  it('does not invoke callback for every attempt', async (done) => {
    let callCount: number = 0;

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(() => {
      throttle(() => callCount = callCount += 1, 3);
    });

    setTimeout(() => {
      expect(callCount < 10).toEqual(true);
      done();
    }, 100);
  });
});
