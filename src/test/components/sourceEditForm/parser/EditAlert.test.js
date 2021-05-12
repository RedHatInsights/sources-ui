import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';
import EditAlert from '../../../../components/SourceEditForm/parser/EditAlert';
import { Alert } from '@patternfly/react-core';
import WrenchIcon from '@patternfly/react-icons/dist/js/icons/wrench-icon';

describe('EditAlert', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <SourcesFormRenderer
        onSubmit={jest.fn()}
        schema={{
          fields: [
            {
              component: 'description',
              name: 'message',
              Content: EditAlert,
            },
          ],
        }}
        initialValues={{
          message: {
            variant: 'danger',
            title: 'Alert title',
            description: 'Alert description',
            customIcon: <WrenchIcon />,
          },
        }}
      />
    );

    expect(wrapper.find(Alert).props().title).toEqual('Alert title');
    expect(wrapper.find(Alert).props().variant).toEqual('danger');
    expect(wrapper.find(Alert).text()).toEqual('Danger alert:Alert titleAlert description');
    expect(wrapper.find(Alert).props().customIcon).toEqual(<WrenchIcon />);
    expect(wrapper.find(WrenchIcon)).toHaveLength(1);
  });
});
