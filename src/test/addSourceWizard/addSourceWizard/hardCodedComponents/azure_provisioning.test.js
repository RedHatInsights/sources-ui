import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import render from '../../__mocks__/render';

import * as ProvAzure from '../../../../components/addSourceWizard/hardcodedComponents/azure/provisioning';
import * as useFormApi from '@data-driven-forms/react-form-renderer/use-form-api/use-form-api';
import * as useChrome from '@redhat-cloud-services/frontend-components/useChrome';

describe('Azure-Provisioning hardcoded schemas', () => {
  let isProdVal = true;

  beforeEach(() => {
    const isProd = jest.fn(() => isProdVal);
    jest.spyOn(useChrome, 'useChrome').mockImplementation(() => ({ isProd }));
  });

  describe('LighthouseDescription', () => {
    it('is rendered correctly in prod', async () => {
      isProdVal = true;

      render(<ProvAzure.LighthouseDescription />);

      expect(
        screen.getByText(
          "Complete configuration steps in Azure Lighthouse according to Microsoft instructions. When you're finished, return to this wizard to finish creating this Azure source."
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Take me to Lighthouse')).not.toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByText('Take me to Lighthouse')).toHaveAttribute(
        'href',
        expect.stringMatching(/console.redhat.com%2Fapi%2Fprovisioning%2Fv1%2Fazure_lighthouse_template/)
      );
    });

    it('is rendered correctly in stage', async () => {
      isProdVal = false;

      render(<ProvAzure.LighthouseDescription />);

      expect(
        screen.getByText(
          "Complete configuration steps in Azure Lighthouse according to Microsoft instructions. When you're finished, return to this wizard to finish creating this Azure source."
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Take me to Lighthouse')).not.toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByText('Take me to Lighthouse')).toHaveAttribute(
        'href',
        expect.stringMatching(/gist.githubusercontent.com%2Fezr-ondrej%2Feda9ef57c42083cdaaf43e58ae225ed0%2Fraw/)
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
