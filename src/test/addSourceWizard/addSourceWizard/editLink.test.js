import React from 'react';
import { screen } from '@testing-library/react';

import EditLink from '../../../components/addSourceWizard/EditLink';
import render from '../__mocks__/render';

describe('EditLink', () => {
  let id;
  let tmpInsights;

  beforeEach(() => {
    id = 'some-id';
    tmpInsights = insights;
  });

  afterEach(() => {
    insights = tmpInsights;
  });

  it('renders on sources', () => {
    insights = {
      ...insights,
      chrome: {
        ...insights.chrome,
        getApp: () => 'sources',
      },
    };

    render(<EditLink id={id} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/sources/detail/some-id');
  });

  it('renders on other app', () => {
    insights = {
      ...insights,
      chrome: {
        ...insights.chrome,
        getApp: () => 'cost-management',
      },
    };

    render(<EditLink id={id} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/preview/settings/sources/detail/some-id');
  });
});
