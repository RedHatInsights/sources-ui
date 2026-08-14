import { IntlProvider } from 'react-intl';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import mockStore from '../test/__mocks__/mockStore';

export const LocationDisplay = ({ id }) => {
  const location = useLocation();

  return <div data-testid={id || 'location-display'}>{location.pathname}</div>;
};

LocationDisplay.propTypes = {
  id: PropTypes.string,
};

export const componentWrapperIntl = (children, store, initialEntries = [], initialIndex = 0) => {
  if (!store) {
    store = mockStore({});
  }

  return (
    <IntlProvider locale="en">
      <Provider store={store}>
        <MemoryRouter
          initialEntries={
            initialEntries.length > 0 ? initialEntries.map((entry) => (entry.match(/^\/.+/) ? entry : `/${entry}`)) : undefined
          }
          initialIndex={initialIndex}
        >
          {children}
          <LocationDisplay />
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );
};

export default componentWrapperIntl;
