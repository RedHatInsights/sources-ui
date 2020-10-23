import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';
import EditAlert from '../../../../components/SourceEditForm/parser/EditAlert';
import { Alert } from '@patternfly/react-core';

describe('EditAlert', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <SourcesFormRenderer
        onSubmit={jest.fn()}
        schema={{
          fields: [
            {
              component: 'description',
              name: 'alert',
              Content: EditAlert,
            },
          ],
        }}
        initialValues={{
          message: {
            variant: 'danger',
            title: 'Alert title',
            description: 'Alert description',
          },
        }}
      />
    );

    expect(wrapper.find(Alert).props().title).toEqual('Alert title');
    expect(wrapper.find(Alert).props().variant).toEqual('danger');
    expect(wrapper.find(Alert).text()).toEqual('Danger alert:Alert titleAlert description');
  });
});
