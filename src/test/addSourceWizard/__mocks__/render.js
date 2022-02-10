import React from 'react';
import { IntlProvider } from 'react-intl';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const render = (children) =>
  rtlRender(
    <MemoryRouter initialEntries={['/']} initialIndex={0} keyLength={0}>
      <IntlProvider locale="en">{children}</IntlProvider>
    </MemoryRouter>
  );

export default render;
