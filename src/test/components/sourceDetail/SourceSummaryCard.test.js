import React from 'react';
import { act } from 'react-dom/test-utils';

import { Card } from '@patternfly/react-core/dist/esm/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/esm/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/esm/components/Card/CardTitle';
import { DescriptionList } from '@patternfly/react-core/dist/esm/components/DescriptionList/DescriptionList';
import { DescriptionListDescription } from '@patternfly/react-core/dist/esm/components/DescriptionList/DescriptionListDescription';
import { DescriptionListGroup } from '@patternfly/react-core/dist/esm/components/DescriptionList/DescriptionListGroup';
import { DescriptionListTerm } from '@patternfly/react-core/dist/esm/components/DescriptionList/DescriptionListTerm';
import { Button } from '@patternfly/react-core/dist/esm/components/Button/Button';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypesData, { AMAZON_ID } from '../../__mocks__/sourceTypesData';
import SourceSummaryCard from '../../../components/SourceDetail/SourceSummaryCard';
import { MemoryRouter, Route } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../Routes';
import * as formatters from '../../../views/formatters';
import AvailabilityChecker from '../../../components/SourceDetail/AvailabilityChecker';
import mockStore from '../../__mocks__/mockStore';

describe('SourceSummaryCard', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  const getCategories = (wrapper) =>
    wrapper
      .find(DescriptionListGroup)
      .map((group) => [group.find(DescriptionListTerm).text(), group.find(DescriptionListDescription).text()]);

  it('renders correctly', async () => {
    formatters.dateFormatter = jest.fn().mockImplementation(() => 'some date');

    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_ID,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
          },
        ],
        sourceTypes: sourceTypesData.data,
      },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(CardTitle).text()).toEqual('Source summary');
    expect(wrapper.find(CardBody)).toHaveLength(1);
    expect(wrapper.find(DescriptionList)).toHaveLength(1);
    expect(wrapper.find(DescriptionListGroup)).toHaveLength(4);
    expect(wrapper.find(DescriptionListTerm)).toHaveLength(4);
    expect(wrapper.find(DescriptionListDescription)).toHaveLength(4);

    expect(wrapper.find(AvailabilityChecker)).toHaveLength(1);

    const categories = getCategories(wrapper);

    expect(categories).toEqual([
      ['Source type', 'Amazon Web Services'],
      ['Last availability check', 'Not checked yet'],
      ['Date added', 'some date'],
      ['Last modified', 'some date'],
    ]);

    expect(formatters.dateFormatter).toHaveBeenCalled();
  });

  it('renders correctly with super key source - account authorization', async () => {
    formatters.dateFormatter = jest.fn().mockImplementation(() => 'some date');

    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_ID,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
            app_creation_workflow: 'account_authorization',
          },
        ],
        sourceTypes: sourceTypesData.data,
      },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(DescriptionList)).toHaveLength(1);
    expect(wrapper.find(DescriptionListGroup)).toHaveLength(5);
    expect(wrapper.find(DescriptionListTerm)).toHaveLength(5);
    expect(wrapper.find(DescriptionListDescription)).toHaveLength(5);

    const categories = getCategories(wrapper);

    expect(categories).toEqual([
      ['Source type', 'Amazon Web Services'],
      ['Last availability check', 'Not checked yet'],
      ['Date added', 'some date'],
      ['Last modified', 'some date'],
      ['Configuration mode', 'Account authorizationEdit credentials'],
    ]);
  });

  it('routes to credential form', async () => {
    formatters.dateFormatter = jest.fn().mockImplementation(() => 'some date');

    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_ID,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
            app_creation_workflow: 'account_authorization',
          },
        ],
        sourceTypes: sourceTypesData.data,
      },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    await act(async () => {
      wrapper.find(Button).at(1).simulate('click', { button: 0 });
    });

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
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
            source_type_id: AMAZON_ID,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
            app_creation_workflow: 'account-authorization',
          },
        ],
        sourceTypes: sourceTypesData.data,
      },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(DescriptionList)).toHaveLength(1);
    expect(wrapper.find(DescriptionListGroup)).toHaveLength(5);
    expect(wrapper.find(DescriptionListTerm)).toHaveLength(5);
    expect(wrapper.find(DescriptionListDescription)).toHaveLength(5);

    const categories = getCategories(wrapper);

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
            source_type_id: AMAZON_ID,
            created_at: '2020-11-27T15:49:59.640Z',
            updated_at: '2020-11-27T15:49:59.640Z',
            app_creation_workflow: 'account-authorization',
            authentications: [
              { authtype: 'password', username: 'some-password' },
              { authtype: 'cloud-meter-arn', username: 'arn:aws:iam::123456789012:group/*' },
            ],
          },
        ],
        sourceTypes: sourceTypesData.data,
      },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceSummaryCard {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(DescriptionList)).toHaveLength(1);
    expect(wrapper.find(DescriptionListGroup)).toHaveLength(6);
    expect(wrapper.find(DescriptionListTerm)).toHaveLength(6);
    expect(wrapper.find(DescriptionListDescription)).toHaveLength(6);

    const categories = getCategories(wrapper);

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
