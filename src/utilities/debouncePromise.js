import awesomeDebouncePromise from 'awesome-debounce-promise';

const debouncePromise = (asyncFunction, debounceTime = 250, options = { onlyResolvesLast: false }) =>
  awesomeDebouncePromise(asyncFunction, debounceTime, options);

export default debouncePromise;
