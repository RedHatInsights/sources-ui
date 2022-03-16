import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';

import { render, screen } from '@testing-library/react';

import EditAlert from '../../../../components/SourceEditForm/parser/EditAlert';
import WrenchIcon from '@patternfly/react-icons/dist/js/icons/wrench-icon';

describe('EditAlert', () => {
  it('renders correctly', () => {
    render(
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
            customIcon: <WrenchIcon data-testid="wrench-icon" />,
          },
        }}
      />
    );

    expect(screen.getByText('Alert title')).toBeInTheDocument();
    expect(screen.getByText('Alert description')).toBeInTheDocument();
    expect(screen.getByTestId('wrench-icon')).toBeInTheDocument();
  });
});
