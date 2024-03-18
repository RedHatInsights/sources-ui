import { render, screen } from '@testing-library/react';

import { componentWrapperIntl } from '../../utilities/testsHelpers';
import PermissionsChecker from '../../components/PermissionsChecker';
import * as actions from '../../redux/user/actions';

describe('PermissionChecker', () => {
  it('load write permission on mount', async () => {
    const Children = () => <h1>App</h1>;
    actions.loadWritePermissions = jest.fn().mockImplementation(() => ({ type: 'type' }));
    actions.loadOrgAdmin = jest.fn().mockImplementation(() => ({ type: 'type' }));
    actions.loadIntegrationsEndpointsPermissions = jest.fn().mockImplementation(() => ({ type: 'type' }));

    render(
      componentWrapperIntl(
        <PermissionsChecker>
          <Children />
        </PermissionsChecker>,
      ),
    );

    expect(screen.getByText('App')).toBeInTheDocument();
    expect(actions.loadWritePermissions).toHaveBeenCalled();
    expect(actions.loadOrgAdmin).toHaveBeenCalled();
    expect(actions.loadIntegrationsEndpointsPermissions).toHaveBeenCalled();
  });
});
