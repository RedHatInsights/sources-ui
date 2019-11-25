import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import Header from '../../../components/SourceEditForm/Header';
import { Grid } from '@patternfly/react-core';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('Source Edit form header', () => {
    it('renders correctly', () => {
        const middlewares = [thunk, notificationsMiddleware()];
        const mockStore = configureStore(middlewares);

        const wrapper = mount(componentWrapperIntl(
            <Header />,
            mockStore({}),
        ));

        expect(wrapper.find(Grid)).toHaveLength(1);
    });
});
