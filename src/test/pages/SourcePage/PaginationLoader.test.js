import PaginationLoader from '../../../pages/SourcesPage/PaginationLoader';
import ContentLoader from 'react-content-loader';

describe('PaginationLoader', () => {
    it('renders correctly', () => {
        const wrapper = mount(<PaginationLoader />);

        expect(wrapper.find(ContentLoader)).toHaveLength(1);
        expect(wrapper.find('div')).toHaveLength(1);
    });
});
