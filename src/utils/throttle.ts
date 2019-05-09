/**
 * @param {number} delay Time in Milliseconds
 * @param {function} cb Callback to be executed post timed throttle
 */
export default (delay: number, cb: any) => {
  let previousCall: number = 0;
  return (...args: any) => {
    const currentTime: number = new Date().getTime();
    if (currentTime - previousCall < delay) {
      return;
    }
    previousCall = currentTime;
    return cb(...args);
  };
};
