import React from 'react';
import { IntlProvider } from 'react-intl';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LocationDisplay } from '../../../utilities/testsHelpers';

const render = (children) =>
  rtlRender(
    <MemoryRouter initialEntries={['/']} initialIndex={0} keyLength={0}>
      <IntlProvider locale="en">{children}</IntlProvider>
      <LocationDisplay />
    </MemoryRouter>
  );

export default render;
