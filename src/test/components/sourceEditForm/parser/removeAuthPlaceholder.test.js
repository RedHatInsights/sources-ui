import RemoveAuthPlaceholder from '../../../../components/SourceEditForm/parser/RemoveAuthPlaceholder';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';
import { Grid, GridItem } from '@patternfly/react-core/dist/js/layouts/Grid';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Text } from '@patternfly/react-core/dist/js/components/Text/Text';

import { componentWrapperIntl } from '../../../../utilities/testsHelpers';

describe('RemoveAuthPlaceholder', () => {
    it('renders correctly', () => {
        const wrapper = mount(componentWrapperIntl(
            <RemoveAuthPlaceholder />
        ));

        expect(wrapper.find(Grid)).toHaveLength(1);
        expect(wrapper.find(GridItem)).toHaveLength(2);
        expect(wrapper.find(Bullseye)).toHaveLength(2);
        expect(wrapper.find(Spinner)).toHaveLength(1);
        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
    });
});
