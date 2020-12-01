import React from 'react';
import configureStore from 'redux-mock-store';
import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypesData, { AMAZON_ID } from '../../__mocks__/sourceTypesData';
import SourceSummaryCard from '../../../components/SourceDetail/SourceSummaryCard';
import { Route } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../Routes';
import * as formatters from '../../../views/formatters';

describe('SourceSummaryCard', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders correctly', async () => {
    formatters.dateFormatter = jest.fn().mockImplementation(() => 'some date');

    store = configureStore()({
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

    const categories = wrapper
      .find(DescriptionListGroup)
      .map((group) => [group.find(DescriptionListTerm).text(), group.find(DescriptionListDescription).text()]);

    expect(categories).toEqual([
      ['Source type', 'Amazon Web Services'],
      ['Last availability check', 'Not checked yet'],
      ['Date added', 'some date'],
      ['Last modified', 'some date'],
    ]);

    expect(formatters.dateFormatter).toHaveBeenCalled();
  });
});
