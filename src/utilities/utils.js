export const linkBasename = '/settings/sources';
export const mergeToBasename = (to, basename) => {
  if (typeof to === 'string') {
    // replace possible "//" after basename
    return `${basename}/${to}`.replaceAll('//', '/');
  }

  return {
    ...to,
    pathname: `${basename}/${to.pathname}`.replaceAll('//', '/'),
  };
};
