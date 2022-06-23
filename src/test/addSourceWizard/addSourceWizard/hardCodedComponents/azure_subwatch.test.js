import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import render from '../../__mocks__/render';

import * as SubAzure from '../../../../components/addSourceWizard/hardcodedComponents/azure/subscriptionWatch';
import * as api from '../../../../api/entities';
import * as useFormApi from '@data-driven-forms/react-form-renderer/use-form-api/use-form-api';

describe('Azure-Subwatch hardcoded schemas', () => {
  describe('LightHouseDescription', () => {
    it('is rendered correctly', async () => {
      const getLighthouseLink = mockApi();

      api.getSourcesApi = () => ({
        getLighthouseLink,
      });

      render(<SubAzure.LightHouseDescription />);

      expect(
        screen.getByText(
          "Complete configuration steps in Azure Lighthouse according to Microsoft instructions. When you're finished, return to this wizard to finish creating this Azure source."
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Take me to Lighthouse')).toHaveAttribute('aria-disabled', 'true');

      getLighthouseLink.resolve({ data: [{ payload: 'href123' }] });

      await waitFor(() => expect(screen.getByText('Take me to Lighthouse')).not.toHaveAttribute('aria-disabled', 'true'));
      expect(screen.getByText('Take me to Lighthouse')).toHaveAttribute('href', 'href123');
    });

    it('is rendered with error', async () => {
      const _cons = console.error;
      console.error = jest.fn();

      const getLighthouseLink = mockApi();

      api.getSourcesApi = () => ({
        getLighthouseLink,
      });

      render(<SubAzure.LightHouseDescription />);

      getLighthouseLink.reject();

      await waitFor(() => expect(screen.getByText('Take me to Lighthouse')).toHaveAttribute('aria-disabled', 'true'));
      expect(
        screen.getByText('There is an error with loading of the configuration. Please go back and return to this step.')
      ).toBeInTheDocument();

      console.error = _cons;
    });

    it('button changes the value', async () => {
      const change = jest.fn();

      const mock = jest.spyOn(useFormApi, 'default').mockImplementation(() => ({ change }));

      api.getSourcesApi = () => ({
        getLighthouseLink: jest.fn().mockResolvedValue({ data: [{ payload: 'href123' }] }),
      });

      render(<SubAzure.LightHouseDescription />);

      const user = userEvent.setup();

      await user.click(screen.getByText('Take me to Lighthouse'));

      expect(change).toHaveBeenCalledWith('lighthouse-clicked', true);

      mock.mockRestore();
    });
  });

  it('SubscriptionID is rendered correctly', () => {
    render(<SubAzure.SubscriptionID />);

    expect(
      screen.getByText(
        'Log in to your Azure account and navigate to your subscriptions. Copy the subscription ID you wish to use and paste it into the field below.'
      )
    ).toBeInTheDocument();
  });
});
