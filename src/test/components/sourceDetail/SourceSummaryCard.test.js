import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ACCOUNT_AUTHORIZATION } from '../../../components/constants';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypes, { AMAZON_TYPE } from '../../__mocks__/sourceTypes';
import SourceSummaryCard from '../../../components/SourceDetail/SourceSummaryCard';
import { Route } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../Routes';
import * as formatters from '../../../views/formatters';
import mockStore from '../../__mocks__/mockStore';

describe('SourceSummaryCard', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  const getCategories = (container) =>
    [...container.getElementsByClassName('pf-c-description-list__group')].map((e) => [
      e.getElementsByClassName('pf-c-description-list__term')[0].textContent,
      e.getElementsByClassName('pf-c-description-list__description')[0].textContent,
    ]);

  it('renders correctly', async () => {
    formatters.dateFormatter = jest.fn().mockImplementation(() => 'some date');

    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_TYPE.id,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
          },
        ],
        sourceTypes,
      },
    });

    const { container } = render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(screen.getByText('Source summary')).toBeInTheDocument();
    expect(screen.getByLabelText('Check source availability')).toBeInTheDocument();

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Source type', 'Amazon Web Services'],
      ['Last availability check', 'Not checked yet'],
      ['Date added', 'some date'],
      ['Last modified', 'some date'],
    ]);

    expect(formatters.dateFormatter).toHaveBeenCalled();
  });

  it('renders correctly with last_checked_at', async () => {
    formatters.dateFormatter = jest.fn().mockImplementation(() => 'some date');

    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_TYPE.id,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
            last_checked_at: '2020-11-27T15:49:59.640Z',
          },
        ],
        sourceTypes,
      },
    });

    const { container } = render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Source type', 'Amazon Web Services'],
      ['Last availability check', 'some date'],
      ['Date added', 'some date'],
      ['Last modified', 'some date'],
    ]);
  });

  it('renders correctly with super key source - account authorization', async () => {
    formatters.dateFormatter = jest.fn().mockImplementation(() => 'some date');

    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_TYPE.id,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
            app_creation_workflow: ACCOUNT_AUTHORIZATION,
          },
        ],
        sourceTypes,
      },
    });

    const { container } = render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Source type', 'Amazon Web Services'],
      ['Last availability check', 'Not checked yet'],
      ['Date added', 'some date'],
      ['Last modified', 'some date'],
      ['Configuration mode', 'Account authorizationEdit credentials'],
    ]);
  });

  it('routes to credential form', async () => {
    const user = userEvent.setup();

    formatters.dateFormatter = jest.fn().mockImplementation(() => 'some date');

    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_TYPE.id,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
            app_creation_workflow: ACCOUNT_AUTHORIZATION,
          },
        ],
        sourceTypes,
      },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    await user.click(screen.getByText('Edit credentials'));

    expect(screen.getByTestId('location-display').textContent).toEqual(
      replaceRouteId(routes.sourcesDetailEditCredentials.path, sourceId)
    );
  });

  it('renders correctly with super key source - manual configuration', async () => {
    formatters.dateFormatter = jest.fn().mockImplementation(() => 'some date');

    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_TYPE.id,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
            app_creation_workflow: 'account-authorization',
          },
        ],
        sourceTypes,
      },
    });

    const { container } = render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Source type', 'Amazon Web Services'],
      ['Last availability check', 'Not checked yet'],
      ['Date added', 'some date'],
      ['Last modified', 'some date'],
      ['Configuration mode', 'Manual configuration'],
    ]);
  });

  it('renders correctly with aws account number', async () => {
    formatters.dateFormatter = jest.fn().mockImplementation(() => 'some date');

    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_TYPE.id,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
            app_creation_workflow: 'account-authorization',
            authentications: [
              { authtype: 'password', username: 'some-password' },
              { authtype: 'cloud-meter-arn', username: 'arn:aws:iam::123456789012:group/*' },
            ],
          },
        ],
        sourceTypes,
      },
    });

    const { container } = render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Source type', 'Amazon Web Services'],
      ['Last availability check', 'Not checked yet'],
      ['Date added', 'some date'],
      ['Last modified', 'some date'],
      ['Configuration mode', 'Manual configuration'],
      ['AWS account number', '123456789012'],
    ]);
  });
});
