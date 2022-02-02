import React from 'react';
import { render, screen } from '@testing-library/react';

import Description from '../../../components/FormComponents/Description';

describe('Description component', () => {
  describe('should render correctly', () => {
    const Content = () => <h1>Cosi</h1>;
    let initialProps;
    let getStateSpy;

    beforeEach(() => {
      getStateSpy = jest.fn();
      initialProps = {
        // eslint-disable-next-line react/display-name
        Content,
        className: 'classa',
        name: 'description',
        formOptions: {
          getState: getStateSpy,
        },
      };
    });

    it('content', () => {
      render(<Description {...initialProps} />);

      expect(screen.getByText('Cosi', { selector: 'h1' })).toBeInTheDocument();
    });
  });
});
