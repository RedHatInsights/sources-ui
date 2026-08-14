import { render, screen } from '@testing-library/react';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import WizardBodyAttach from '../../../components/AddApplication/WizardBody';

const Step = () => <div>Ahoooj</div>;

describe('AddApplication wizard - ErroredStep', () => {
  let initialProps;
  let goToSources;

  beforeEach(() => {
    goToSources = jest.fn();

    initialProps = {
      goToSources,
      step: <Step />,
    };
  });

  it('renders correctly', () => {
    render(componentWrapperIntl(<WizardBodyAttach {...initialProps} />));

    expect(screen.getByText('Ahoooj')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
