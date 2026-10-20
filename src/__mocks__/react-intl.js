// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactIntl = require('react-intl');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const React = require('react');

// Real formatting engine so tests exercise the same ICU and rich-text
// behavior as production. Rich values (React elements in `values`) render
// as interleaved nodes instead of "[object Object]".
const { createIntl, createIntlCache } = ReactIntl;
const cache = createIntlCache();
const intl = createIntl(
  {
    locale: 'en',
    onError: () => {
      // Missing translations fall back to defaultMessage; keep test output clean.
    },
  },
  cache,
);

const useIntl = () => intl;

// eslint-disable-next-line react/prop-types
const FormattedMessage = ({ values, children, ...descriptor }) => {
  const nodes = intl.formatMessage(descriptor, values);
  if (typeof children === 'function') {
    return children(Array.isArray(nodes) ? nodes : [nodes]);
  }

  return React.createElement(React.Fragment, null, nodes);
};

module.exports = {
  __esModule: true,
  ...ReactIntl,
  FormattedMessage,
  useIntl,
};
