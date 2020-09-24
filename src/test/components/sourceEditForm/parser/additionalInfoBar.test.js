import { mount } from 'enzyme';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';

import { applicationTypesData, CATALOG_APP, COSTMANAGEMENT_APP } from '../../../__mocks__/applicationTypesData';
import { ANSIBLE_TOWER } from '../../../__mocks__/sourceTypesData';
import AdditionalInfoBar from '../../../../components/SourceEditForm/parser/AdditionalInfoBar';
import { componentWrapperIntl } from '../../../../utilities/testsHelpers';

describe('AdditionalInfoBar', () => {
    let store;
    let mockStore;
    let wrapper;
    let initialProps;

    const middlewares = [thunk, notificationsMiddleware()];

    beforeEach(async () => {
        initialProps = {
            sourceType: ANSIBLE_TOWER,
            applications: []
        };
        mockStore = configureStore(middlewares);
        store = mockStore({
            sources: {
                appTypes: applicationTypesData.data,
            }
        });
    });

    it('renders with no app', async () => {
        await act(async() => {
            wrapper = mount(componentWrapperIntl(
                <AdditionalInfoBar { ...initialProps }/>,
                store,
            ));
        });
        wrapper.update();

        expect(wrapper.find('p#source-edit-type').text()).toEqual(ANSIBLE_TOWER.product_name);
        expect(wrapper.find('p#source-edit-apps').text()).toEqual('None');
    });

    it('renders with one app', async () => {
        initialProps = {
            ...initialProps,
            applications: [
                { application_type_id: CATALOG_APP.id }
            ]
        };

        await act(async() => {
            wrapper = mount(componentWrapperIntl(
                <AdditionalInfoBar { ...initialProps }/>,
                store,
            ));
        });
        wrapper.update();

        expect(wrapper.find('p#source-edit-type').text()).toEqual(ANSIBLE_TOWER.product_name);
        expect(wrapper.find('p#source-edit-apps').text()).toEqual(CATALOG_APP.display_name);
    });

    it('renders with multiple apps', async () => {
        initialProps = {
            ...initialProps,
            applications: [
                { application_type_id: CATALOG_APP.id },
                { application_type_id: COSTMANAGEMENT_APP.id }
            ]
        };

        await act(async() => {
            wrapper = mount(componentWrapperIntl(
                <AdditionalInfoBar { ...initialProps }/>,
                store,
            ));
        });
        wrapper.update();

        expect(wrapper.find('p#source-edit-type').text()).toEqual(ANSIBLE_TOWER.product_name);
        expect(wrapper.find('p#source-edit-apps').text()).toEqual(`${CATALOG_APP.display_name}, ${COSTMANAGEMENT_APP.display_name}`);
    });
});
