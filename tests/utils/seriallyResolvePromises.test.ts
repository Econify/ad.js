import seriallyResolvePromises from '../../src/utils/seriallyResolvePromises';

describe('seriallyResolvePromises', async () => {
  it('resolves promises in order', async () => {
    const orderedArray: number[] = [];
    const testPromise1 = () => {
      orderedArray.push(1);
      return Promise.resolve();
    };

    const testPromise2 = () => {
      orderedArray.push(2);
      return Promise.resolve();
    };

    const testPromise3 = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          orderedArray.push(3);
          return resolve(true);
        }, 250);
      });
    };

    const testPromise4 = () => {
      orderedArray.push(0);
      return Promise.resolve();
    };

    // @ts-ignore
    await seriallyResolvePromises([testPromise1, testPromise2, testPromise3, testPromise4]);

    expect(orderedArray[0]).toEqual(1);
    expect(orderedArray[1]).toEqual(2);
    expect(orderedArray[2]).toEqual(3);
    expect(orderedArray[3]).toEqual(0);
  });
});
