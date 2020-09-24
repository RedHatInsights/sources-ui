import { mount } from 'enzyme';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Route, MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { routes, replaceRouteId } from '../../../Routes';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';
import { Modal, Button } from '@patternfly/react-core';

import WrapperModal from '../../../components/SourceEditForm/WrapperModal';
import Header from '../../../components/SourceEditForm/Header';

describe('WrapperModal', () => {
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
                <Route path={routes.sourcesEdit.path} render={ (...args) => <WrapperModal {...args}>some children here</WrapperModal> } />,
                store,
                initialEntry
            ));
        });
        wrapper.update();
    });

    it('renders correctly', async () => {
        expect(wrapper.find(Modal).props().isOpen).toEqual(true);
        expect(wrapper.find(Modal).props()['aria-label']).toEqual('Edit source.');
        expect(wrapper.find(Modal).props().variant).toEqual('large');
        expect(wrapper.find(Modal).props().onClose).toEqual(expect.any(Function));
        expect(wrapper.find(Modal).props().children).toEqual('some children here');

        expect(wrapper.find(Header).props().name).toEqual('MPTEST3214411');

        expect(wrapper.find(Button).at(1).props().children).toEqual('Save');
        expect(wrapper.find(Button).at(1).props().isDisabled).toEqual(true);

        expect(wrapper.find(Button).at(2).props().isDisabled).toEqual(true);
        expect(wrapper.find(Button).at(2).props().children).toEqual('Reset');

        expect(wrapper.find(Button).at(3).props().isDisabled).toEqual(undefined);
        expect(wrapper.find(Button).at(3).props().children).toEqual('Cancel');
    });

    it('close on icon', async () => {
        await act (async () => {
            wrapper.find('button').first().simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sources.path);
    });

    it('close on cancel button', async () => {
        await act (async () => {
            wrapper.find('button').last().simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sources.path);
    });
});
