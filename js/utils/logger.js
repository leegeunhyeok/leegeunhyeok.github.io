((global) => {
  const TAG = '[APP]';

  global.log = {
    info: (...args) => console.log(TAG, ...args),
    warn: (...args) => console.warn(TAG, ...args),
    error: (...args) => console.error(TAG, ...args),
  };
})(window);
