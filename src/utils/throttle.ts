/**
 * @param {function} cb Callback to be executed post timed throttle
 * @param {number} customDelay Time in Milliseconds
 */
let previousCall: number = 0;
export = (cb: any, customDelay?: number) => {
  const delay = customDelay || 200;
  const currentTime: number = new Date().getTime();

  if (currentTime - previousCall <= delay) {
    return;
  }

  previousCall = currentTime;
  return cb();
};
