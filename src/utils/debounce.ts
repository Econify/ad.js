/**
 * @param {function} callback Callback to be executed post timed debounce
 * @param {number} wait Time in Milliseconds
 */
export default function debounce(this: any, callback: any, wait: number) {
  let timeout: any;

  return (...args: any) => {
    const next = () => callback.apply(this, args);

    clearTimeout(timeout);
    timeout = setTimeout(next, wait);

    if (!timeout) {
      next();
    }
  };
}
