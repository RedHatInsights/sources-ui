import { mount } from 'enzyme';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';
import { Text } from '@patternfly/react-core/dist/js/components/Text/Text';

import titleField, { TitleAndDescription } from '../../../../components/SourceEditForm/parser/titleField';

import { applicationTypesData, COSTMANAGEMENT_APP, CATALOG_APP } from '../../../__mocks__/applicationTypesData';
import { AMAZON } from '../../../__mocks__/sourceTypesData';

describe('titleField', () => {
    let applications;
    const sourceType = AMAZON;
    const appTypes = applicationTypesData.data;
    const intl = {
        formatMessage: ({ defaultMessage }) => defaultMessage
    };

    it('no app, one auth', () => {
        applications = [];
        const auths = [{ id: 'some-id' }];

        expect(titleField(
            applications,
            sourceType,
            appTypes,
            intl,
            auths
        )).toEqual({
            name: 'edit-title',
            Content: expect.any(Function),
            description: undefined,
            component: 'description',
            title: '{type} credentials',
            hideField: false
        });
    });

    it('no app', () => {
        applications = [];
        const emptyAuths = [];

        expect(titleField(
            applications,
            sourceType,
            appTypes,
            intl,
            emptyAuths
        )).toEqual({
            name: 'edit-title',
            Content: expect.any(Function),
            description: undefined,
            component: 'description',
            title: '{type} credentials',
            hideField: true
        });
    });

    it('one app', () => {
        applications = [{ application_type_id: COSTMANAGEMENT_APP.id }];

        expect(titleField(
            applications,
            sourceType,
            appTypes,
            intl
        )).toEqual({
            name: 'edit-title',
            Content: expect.any(Function),
            description: undefined,
            component: 'description',
            title: '{type} & {app} credentials',
            hideField: false
        });
    });

    it('multiple apps', () => {
        applications = [{ application_type_id: COSTMANAGEMENT_APP.id }, { application_type_id: CATALOG_APP.id }];

        expect(titleField(
            applications,
            sourceType,
            appTypes,
            intl
        )).toEqual({
            name: 'edit-title',
            Content: expect.any(Function),
            description: 'Use the tabs below to view and edit credentials for connected applications.',
            component: 'description',
            title: '{type} & application credentials',
            hideField: false
        });
    });

    describe('TitleAndDescription', () => {
        it('renders with title only', () => {
            const wrapper = mount(<TitleAndDescription title="Some TITLE" />);

            expect(wrapper.find(Title).text()).toEqual('Some TITLE');
            expect(wrapper.find(Text)).toHaveLength(0);
        });

        it('rendes with description', () => {
            const wrapper = mount(<TitleAndDescription title="Some TITLE" description="Some DESC" />);

            expect(wrapper.find(Title).text()).toEqual('Some TITLE');
            expect(wrapper.find(Text).text()).toEqual('Some DESC');
        });
    });
});
