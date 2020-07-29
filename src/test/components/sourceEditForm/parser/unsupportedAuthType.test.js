import { unsupportedAuthTypeField, Content } from '../../../../components/SourceEditForm/parser/unsupportedAuthType';
import { componentWrapperIntl } from '../../../../utilities/testsHelpers';
import { Text } from '@patternfly/react-core';

describe('unsupportedAuthTypeField', () => {
    const AUTHTYPE = 'openshift-default';

    it('returns schema field', () => {
        expect(unsupportedAuthTypeField(AUTHTYPE)).toEqual(
            expect.objectContaining({
                component: 'description',
                name: `${AUTHTYPE}-unsupported`
            })
        );
    });

    it('renders content', () => {
        const wrapper = mount(componentWrapperIntl(<Content authtype={AUTHTYPE}/>));

        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(Text).text().includes(AUTHTYPE)).toEqual(true);
    });
});
