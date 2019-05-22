import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

export const componentWrapperIntl = (children, store, initialEntries, initialIndex = 0) => (
    <IntlProvider locale="en">
        <Provider store={ store }>
            <MemoryRouter initialEntries={ initialEntries } initialIndex={ initialIndex }>
                { children }
            </MemoryRouter>
        </Provider>
    </IntlProvider>
);
