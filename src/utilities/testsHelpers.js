import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

export const componentWrapperIntl = (children, store, initialEntries, initialIndex = 0) => {
  if (!store) {
    const mockStore = configureStore([]);

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
