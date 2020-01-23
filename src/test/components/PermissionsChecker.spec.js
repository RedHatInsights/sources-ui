import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../Utilities/testsHelpers';
import PermissionsChecker from '../../components/PermissionsChecker';
import * as actions from '../../redux/sources/actions';

describe('PermissionChecker', () => {
    let Children;
    let wrapper;

    beforeEach(() => {
        // eslint-disable-next-line react/display-name
        Children = () => <h1>App</h1>;
        actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'type' }));
    });

    it('user is org admin - just show children', async () => {
        await act(async () => {
            wrapper = mount(componentWrapperIntl(<PermissionsChecker>
                <Children />
            </PermissionsChecker>));
        });

        expect(wrapper.find(Children)).toHaveLength(1);
        expect(actions.addMessage).not.toHaveBeenCalled();
    });

    it('user is not org admin - show notification', async () => {
        const insightsTmp = global.insights;

        global.insights = {
            chrome: {
                auth: {
                    getUser: () => new Promise(resolve => resolve({
                        identity: {
                            user: {
                                is_org_admin: false
                            }
                        }
                    }))
                }
            }
        };

        await act(async () => {
            wrapper = mount(componentWrapperIntl(<PermissionsChecker>
                <Children />
            </PermissionsChecker>));
        });

        const ERROR_TITLE = expect.any(String);
        const ERROR_DESC = expect.any(String);

        expect(wrapper.find(Children)).toHaveLength(1);
        expect(actions.addMessage).toHaveBeenCalledWith(
            ERROR_TITLE,
            'danger',
            ERROR_DESC,
        );

        global.insights = insightsTmp;
    });
});
