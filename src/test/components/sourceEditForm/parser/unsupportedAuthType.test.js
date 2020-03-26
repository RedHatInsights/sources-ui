import { unsupportedAuthTypeField } from '../../../../components/SourceEditForm/parser/unsupportedAuthType';
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
        const unsupportedAuthType = unsupportedAuthTypeField(AUTHTYPE);

        // eslint-disable-next-line new-cap
        const wrapper = mount(componentWrapperIntl(unsupportedAuthType.Content()));

        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(Text).text().includes(AUTHTYPE)).toEqual(true);
    });
});
