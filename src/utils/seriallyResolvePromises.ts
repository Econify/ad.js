export default (promises: Array<() => Promise<void>>): Promise<void> =>
  promises.reduce(
    (promiseChain: Promise<void>, fn: () => Promise<void>): Promise<void> => (
      promiseChain.then(() => fn())
    ),
    Promise.resolve(),
  );
