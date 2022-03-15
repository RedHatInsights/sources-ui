import { Route } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import AppListInRemoval from '../../../components/SourceRemoveModal/AppListInRemoval';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { replaceRouteId, routes } from '../../../Routes';
import { applicationTypesData, CATALOG_APP, COSTMANAGEMENT_APP } from '../../__mocks__/applicationTypesData';

import mockStore from '../../__mocks__/mockStore';

describe('AppListInRemoval', () => {
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

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <AppListInRemoval {...initialProps} {...args} />} />,
        store,
        [replaceRouteId(routes.sourcesRemove.path, '406')]
      )
    );

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('renders with 1 app', () => {
    initialProps = {
      applications: [{ application_type_id: CATALOG_APP.id, id: 1 }],
    };

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <AppListInRemoval {...initialProps} {...args} />} />,
        store,
        [replaceRouteId(routes.sourcesRemove.path, '406')]
      )
    );

    expect(screen.getByText(CATALOG_APP.display_name, { selector: 'p' })).toBeInTheDocument();
  });

  it('renders with more apps', () => {
    initialProps = {
      applications: [
        { application_type_id: CATALOG_APP.id, id: 1 },
        { application_type_id: COSTMANAGEMENT_APP.id, id: 2 },
      ],
    };

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <AppListInRemoval {...initialProps} {...args} />} />,
        store,
        [replaceRouteId(routes.sourcesRemove.path, '406')]
      )
    );

    expect(screen.getByText(CATALOG_APP.display_name, { selector: 'li' })).toBeInTheDocument();
    expect(screen.getByText(COSTMANAGEMENT_APP.display_name, { selector: 'li' })).toBeInTheDocument();
  });
});
