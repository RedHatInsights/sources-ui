import { Route, MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../Utilities/testsHelpers';
import RedirectNoId from '../../../components/RedirectNoId/RedirectNoId';
import * as actions from '../../../redux/actions/providers';
import * as api from '../../../api/entities';

describe('RedirectNoId', () => {
    let initialStore;
    let initialEntry;
    let mockStore;

    const wasRedirectedToRoot = (wrapper) => wrapper.find(MemoryRouter).instance().history.location.pathname === '/';

    beforeEach(() => {
        initialEntry = ['/remove/1'];

        mockStore = configureStore();

        actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'ADD_MESSAGE' }));
        actions.addHiddenSource = jest.fn().mockImplementation(() => ({ type: 'ADD_HIDDEN_SOURCE' }));
    });

    it('Renders null if not loaded', () => {
        initialStore = mockStore({
            providers: { loaded: false, appTypesLoaded: true, sourceTypesLoaded: true }
        });

        const wrapper = mount(componentWrapperIntl(
            <Route path="/remove/:id" render={ (...args) => <RedirectNoId { ...args } /> } />,
            initialStore,
            initialEntry
        ));

        expect(wrapper.html()).toEqual('');
    });

    it('Renders redirect and creates message if loaded and source was not found', async () => {
        let wrapper;
        api.doLoadSource = jest.fn().mockImplementation(() => Promise.resolve({  sources: [] }));

        initialStore = mockStore({
            providers: { loaded: true, appTypesLoaded: true, sourceTypesLoaded: true }
        });

        await act(async () => {
            wrapper = mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <RedirectNoId { ...args } /> } />,
                initialStore,
                initialEntry
            ));
        });

        expect(actions.addMessage).toHaveBeenCalled();
        expect(actions.addHiddenSource).toHaveBeenCalled();

        expect(wasRedirectedToRoot(wrapper)).toEqual(true);
    });

    it('addHiddenSource is called with found source', async () => {
        const SOURCE = { id: '1', name: 'sdsadda' };

        api.doLoadSource = jest.fn().mockImplementation(() => Promise.resolve({  sources: [SOURCE] }));

        initialStore = mockStore({
            providers: { loaded: true, appTypesLoaded: true, sourceTypesLoaded: true }
        });

        await act(async () => {
            mount(componentWrapperIntl(
                <Route path="/remove/:id" render={ (...args) => <RedirectNoId { ...args } /> } />,
                initialStore,
                initialEntry
            ));
        });

        expect(actions.addHiddenSource).toHaveBeenCalledWith(SOURCE);
    });
});
