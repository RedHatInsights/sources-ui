import { mount } from 'enzyme';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { routes, replaceRouteId } from '../../../Routes';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';

import WrapperModal from '../../../components/SourceEditForm/WrapperModal';
import TimeoutedModal from '../../../components/SourceEditForm/TimeoutedModal';

import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';

import WrenchIcon from '@patternfly/react-icons/dist/js/icons/wrench-icon';
import { Title } from '@patternfly/react-core';

describe('TimeoutedModal', () => {
    let store;
    let mockStore;
    let initialEntry;
    let wrapper;

    const middlewares = [thunk, notificationsMiddleware()];

    beforeEach(async () => {
        initialEntry = [replaceRouteId(routes.sourcesEdit.path, '14')];
        mockStore = configureStore(middlewares);
        store = mockStore({
            sources: {
                entities: sourcesDataGraphQl
            }
        });

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourcesEdit.path} render={ (...args) => <TimeoutedModal {...args} /> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();
    });

    it('renders correctly', async () => {
        expect(wrapper.find(WrapperModal)).toHaveLength(1);

        expect(wrapper.find(Bullseye)).toHaveLength(1);
        expect(wrapper.find(EmptyState)).toHaveLength(1);
        expect(wrapper.find(WrenchIcon)).toHaveLength(1);
        expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);

        expect(wrapper.find(Title).last().text()).toEqual('Edit source not yet complete');
        expect(wrapper.find(EmptyStateBody).text()).toEqual('We are still working to confirm your updated credentials and app settings.To track progress, check the Status column in the Sources table.');
    });
});
