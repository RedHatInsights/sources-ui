import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import render from '../../__mocks__/render';

import * as ProvAzure from '../../../../components/addSourceWizard/hardcodedComponents/azure/provisioning';
import * as useFormApi from '@data-driven-forms/react-form-renderer/use-form-api/use-form-api';

describe('Azure-Provisioning hardcoded schemas', () => {
  describe('LighthouseDescription', () => {
    it('is rendered correctly in prod', async () => {
      render(<ProvAzure.LighthouseDescription />);

      expect(
        screen.getByText(
          "Complete configuration steps in Azure Lighthouse according to Microsoft instructions. When you're finished, return to this wizard to finish creating this Azure source."
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Take me to Lighthouse')).not.toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByText('Take me to Lighthouse')).toHaveAttribute(
        'href',
        expect.stringMatching(
          /https%3A%2F%2Fprovisioning-public-assets.s3.amazonaws.com%2FAzureLighthouse%2Foffering_template.json$/
        )
      );
    });

    it('is rendered correctly in stage', async () => {
      render(<ProvAzure.LighthouseDescription />);

      expect(
        screen.getByText(
          "Complete configuration steps in Azure Lighthouse according to Microsoft instructions. When you're finished, return to this wizard to finish creating this Azure source."
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Take me to Lighthouse')).not.toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByText('Take me to Lighthouse')).toHaveAttribute(
        'href',
        expect.stringMatching(
          /https%3A%2F%2Fprovisioning-public-assets.s3.amazonaws.com%2FAzureLighthouse%2Foffering_template.json$/
        )
      );
    });

    it('button changes the value', async () => {
      const change = jest.fn();

      const mock = jest.spyOn(useFormApi, 'default').mockImplementation(() => ({ change }));

      render(<ProvAzure.LighthouseDescription />);

      const user = userEvent.setup();

      await user.click(screen.getByText('Take me to Lighthouse'));

      expect(change).toHaveBeenCalledWith('lighthouse-clicked', true);

      mock.mockRestore();
    });
  });

  it('SubscriptionID is rendered correctly', () => {
    render(<ProvAzure.SubscriptionID />);

    expect(
      screen.getByText(
        'Log in to your Azure account and navigate to your subscriptions. Copy the subscription ID you have connected through Lighthouse.'
      )
    ).toBeInTheDocument();
  });
});
