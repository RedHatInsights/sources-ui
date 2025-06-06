import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ACCOUNT_AUTHORIZATION } from '../../../components/constants';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypes, { AMAZON_TYPE } from '../../__mocks__/sourceTypes';
import SourceSummaryCard from '../../../components/SourceDetail/SourceSummaryCard';
import { Route, Routes } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../routes';
import * as formatters from '../../../views/formatters';
import mockStore from '../../__mocks__/mockStore';

describe('SourceSummaryCard', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  const getCategories = (container) =>
    [...container.getElementsByClassName('pf-v6-c-description-list__group')].map((e) => [
      e.getElementsByClassName('pf-v6-c-description-list__term')[0].textContent,
      e.getElementsByClassName('pf-v6-c-description-list__description')[0].textContent,
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
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceSummaryCard />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    expect(screen.getByText('Integration summary')).toBeInTheDocument();
    expect(screen.getByLabelText('Check integration availability')).toBeInTheDocument();

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Integration type', 'Amazon Web Services'],
      ['Last availability check', 'Waiting for update'],
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
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceSummaryCard />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Integration type', 'Amazon Web Services'],
      ['Last availability check', 'some date'],
      ['Date added', 'some date'],
      ['Last modified', 'some date'],
    ]);
  });

  it('renders correctly with last_checked_at and isCheckPending flag', async () => {
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
            isCheckPending: true,
          },
        ],
        sourceTypes,
      },
    });

    const { container } = render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceSummaryCard />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Integration type', 'Amazon Web Services'],
      ['Last availability check', 'Waiting for update'],
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
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceSummaryCard />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Integration type', 'Amazon Web Services'],
      ['Last availability check', 'Waiting for update'],
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
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceSummaryCard />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    await waitFor(async () => {
      await user.click(screen.getByText('Edit credentials'));
    });

    expect(screen.getByTestId('location-display').textContent).toEqual(
      replaceRouteId(`/settings/integrations/${routes.sourcesDetailEditCredentials.path}`, sourceId),
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
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceSummaryCard />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Integration type', 'Amazon Web Services'],
      ['Last availability check', 'Waiting for update'],
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
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceSummaryCard />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    const categories = getCategories(container);

    expect(categories).toEqual([
      ['Integration type', 'Amazon Web Services'],
      ['Last availability check', 'Waiting for update'],
      ['Date added', 'some date'],
      ['Last modified', 'some date'],
      ['Configuration mode', 'Manual configuration'],
      ['AWS account number', '123456789012'],
    ]);
  });
});
