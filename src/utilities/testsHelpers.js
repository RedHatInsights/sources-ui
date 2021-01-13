import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import mockStore from '../test/__mocks__/mockStore';

export const componentWrapperIntl = (children, store, initialEntries, initialIndex = 0) => {
  if (!store) {
    store = mockStore({});
  }

  return (
    <IntlProvider locale="en">
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
          {children}
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );
};

export default componentWrapperIntl;
