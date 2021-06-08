import { Route } from 'react-router-dom';

import AppListInRemoval from '../../../components/SourceRemoveModal/AppListInRemoval';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { replaceRouteId, routes } from '../../../Routes';
import { applicationTypesData, CATALOG_APP, COSTMANAGEMENT_APP } from '../../__mocks__/applicationTypesData';

import { Text, TextList, TextListItem } from '@patternfly/react-core';

import mockStore from '../../__mocks__/mockStore';

describe('AppListInRemoval', () => {
  let wrapper;
  let initialProps;

  let store;

  beforeEach(() => {
    store = mockStore({
      sources: { appTypes: applicationTypesData.data },
    });
  });

  it('renders with unknow app type', () => {
    initialProps = {
      applications: [{ application_type_id: undefined, id: 1 }],
    };

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <AppListInRemoval {...initialProps} {...args} />} />,
        store,
        [replaceRouteId(routes.sourcesRemove.path, '406')]
      )
    );

    expect(wrapper.find(Text).text()).toEqual('Unknown');
  });

  it('renders with 1 app', () => {
    initialProps = {
      applications: [{ application_type_id: CATALOG_APP.id, id: 1 }],
    };

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <AppListInRemoval {...initialProps} {...args} />} />,
        store,
        [replaceRouteId(routes.sourcesRemove.path, '406')]
      )
    );

    expect(wrapper.find(Text).text()).toEqual(CATALOG_APP.display_name);
    expect(wrapper.find(TextList)).toHaveLength(0);
  });

  it('renders with more apps', () => {
    initialProps = {
      applications: [
        { application_type_id: CATALOG_APP.id, id: 1 },
        { application_type_id: COSTMANAGEMENT_APP.id, id: 2 },
      ],
    };

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <AppListInRemoval {...initialProps} {...args} />} />,
        store,
        [replaceRouteId(routes.sourcesRemove.path, '406')]
      )
    );

    expect(wrapper.find(TextListItem).first().text()).toEqual(CATALOG_APP.display_name);
    expect(wrapper.find(TextListItem).last().text()).toEqual(COSTMANAGEMENT_APP.display_name);
    expect(wrapper.find(Text)).toHaveLength(0);
  });
});
