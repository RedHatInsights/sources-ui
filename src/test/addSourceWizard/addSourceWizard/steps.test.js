import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import render from '../__mocks__/render';

import FinishedStep from '../../../components/steps/FinishedStep';
import LoadingStep from '../../../components/steps/LoadingStep';
import ErroredStep from '../../../components/steps/ErroredStep';
import TimeoutStep from '../../../components/steps/TimeoutStep';
import AmazonFinishedStep from '../../../components/steps/AmazonFinishedStep';

describe('Steps components', () => {
  let initialProps;
  let spyFunction;
  let spyFunctionSecond;

  beforeEach(() => {
    spyFunction = jest.fn();
    spyFunctionSecond = jest.fn();
  });

  describe('FinishedStep', () => {
    beforeEach(() => {
      initialProps = {
        onClose: spyFunction,
        successfulMessage: 'Here I Am',
        hideSourcesButton: false,
        returnButtonTitle: 'Go back to my application',
      };
    });

    it('renders correctly', () => {
      render(<FinishedStep {...initialProps} />);

      expect(screen.getByText('Configuration successful')).toBeInTheDocument();
      expect(screen.getByText('Go back to my application')).toBeInTheDocument();
      expect(screen.getByText('Here I Am')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(1);
      expect(screen.getByRole('link')).toHaveAttribute('href', '/preview/settings/sources');
    });

    it('renders without takemetosources button', () => {
      render(<FinishedStep {...initialProps} hideSourcesButton={true} />);
      expect(() => screen.getByRole('link')).toThrow();
    });

    it('calls onClose function', async () => {
      const user = userEvent.setup();

      render(<FinishedStep {...initialProps} />);

      await user.click(screen.getByText('Go back to my application'));

      expect(spyFunction).toHaveBeenCalled();
    });
  });

  describe('LoadingStep', () => {
    beforeEach(() => {
      initialProps = {
        onClose: spyFunction,
        customText: 'Here I Am',
      };
    });

    it('renders correctly with custom props', () => {
      render(<LoadingStep {...initialProps} />);

      expect(screen.getByLabelText('Contents')).toBeInTheDocument();
      expect(screen.getByText('Here I Am')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('calls onClose function', async () => {
      const user = userEvent.setup();

      render(<LoadingStep {...initialProps} />);

      await user.click(screen.getByText('Cancel'));

      expect(spyFunction).toHaveBeenCalled();
    });
  });

  describe('ErroredStep', () => {
    beforeEach(() => {
      initialProps = {
        onClose: spyFunction,
        returnButtonTitle: 'Go back to my application',
      };
    });

    it('renders correctly', () => {
      render(<ErroredStep {...initialProps} />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(
          'There was a problem while trying to add your source. Please try again. If the error persists, open a support case.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Go back to my application')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('renders correctly with message', () => {
      const ERROR_MESSAGE = 'I am a little error, nice to meet you';
      render(<ErroredStep {...initialProps} message={ERROR_MESSAGE} />);

      expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
    });

    it('calls onClose function', async () => {
      const user = userEvent.setup();

      render(<ErroredStep {...initialProps} />);

      await user.click(screen.getByText('Go back to my application'));

      expect(spyFunction).toHaveBeenCalled();
    });

    it('calls primaryAction function', async () => {
      const user = userEvent.setup();

      render(<ErroredStep {...initialProps} primaryAction={spyFunctionSecond} />);

      await user.click(screen.getByText('Go back to my application'));

      expect(spyFunctionSecond).toHaveBeenCalled();
    });
  });

  describe('TimeoutStep', () => {
    beforeEach(() => {
      initialProps = {
        onClose: spyFunction,
        returnButtonTitle: 'go back',
      };
    });

    it('renders correctly', () => {
      render(<TimeoutStep {...initialProps} />);

      expect(screen.getByText('Configuration in progress')).toBeInTheDocument();
      expect(
        screen.getByText('We are still working to confirm credentials and app settings.', { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByText('To track progress, check the Status column in the Sources table.', { exact: false })
      ).toBeInTheDocument();
      expect(screen.getByText('go back')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('renders correctly customized', () => {
      render(<TimeoutStep {...initialProps} title="pekny nadpis" secondaryActions={<button>some button here</button>} />);

      expect(screen.getByText('pekny nadpis')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('calls onClose function', async () => {
      const user = userEvent.setup();

      render(<TimeoutStep {...initialProps} />);

      await user.click(screen.getByText('go back'));

      expect(spyFunction).toHaveBeenCalled();
    });
  });

  describe('AmazonFinishedStep', () => {
    beforeEach(() => {
      initialProps = {
        onClose: spyFunction,
      };
    });

    it('renders correctly', () => {
      render(<AmazonFinishedStep {...initialProps} />);

      expect(screen.getByText('Allow 24 hours for full activation')).toBeInTheDocument();
      expect(screen.getByText('Manage connections for this source at any time in Settings > Sources.')).toBeInTheDocument();
      expect(screen.getByText('Amazon Web Services connection established')).toBeInTheDocument();
      expect(screen.getByText('Discover the benefits of your connection or exit to manage your new source.')).toBeInTheDocument();
      expect([...screen.getAllByRole('link')].map((l) => [l.textContent, l.href])).toEqual([
        ['View enabled AWS gold images', 'https://access.redhat.com/management/cloud'],
        ['Subscription Watch usage', 'http://localhost/preview/subscriptions'],
        ['Get started with Red Hat Insights', 'http://localhost/preview/insights'],
        ['Cost Management reporting', 'http://localhost/preview/cost-management'],
        ['Learn more about this Cloud', 'https://access.redhat.com/public-cloud/aws'],
      ]);
    });

    it('calls onClose function', async () => {
      const user = userEvent.setup();

      render(<AmazonFinishedStep {...initialProps} />);

      await user.click(screen.getByText('Exit'));

      expect(spyFunction).toHaveBeenCalled();
    });
  });
});
