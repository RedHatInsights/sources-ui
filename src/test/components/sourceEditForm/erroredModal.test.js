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
import ErroredModal from '../../../components/SourceEditForm/ErroredModal';

import { EmptyStateBody, EmptyState } from '@patternfly/react-core/dist/js/components/EmptyState';
import { Title, Button } from '@patternfly/react-core';

import ErroredStep from '@redhat-cloud-services/frontend-components-sources/cjs/ErroredStep';

describe('ErroredModal', () => {
    let store;
    let mockStore;
    let initialEntry;
    let wrapper;
    let onRetry;

    const middlewares = [thunk, notificationsMiddleware()];

    beforeEach(async () => {
        initialEntry = [replaceRouteId(routes.sourcesEdit.path, '14')];
        mockStore = configureStore(middlewares);
        store = mockStore({
            sources: {
                entities: sourcesDataGraphQl
            }
        });
        onRetry = jest.fn();

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path={routes.sourcesEdit.path} render={ (...args) => <ErroredModal {...args} onRetry={onRetry} /> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();
    });

    it('renders correctly', async () => {
        expect(wrapper.find(WrapperModal)).toHaveLength(1);
        expect(wrapper.find(ErroredStep)).toHaveLength(1);

        expect(wrapper.find(Title).last().text()).toEqual('Something went wrong');
        expect(wrapper.find(EmptyStateBody).text()).toEqual('There was a problem while trying to edit your source. Please try again. If the error persists, open a support case.');
    });

    it('calls onRetry', async () => {
        expect(onRetry).not.toHaveBeenCalled();

        await act(async () => {
            wrapper.find(EmptyState).find(Button).simulate('click');
        });

        expect(onRetry).toHaveBeenCalled();
    });
});
