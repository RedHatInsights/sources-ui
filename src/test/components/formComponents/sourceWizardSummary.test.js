import React from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Label } from '@patternfly/react-core';

import { ACCOUNT_AUTHORIZATION, MANUAL_CONFIGURATION } from '../../../components/constants';
import applicationTypes, {
  COST_MANAGEMENT_APP,
  SUB_WATCH_APP,
  TOPOLOGY_INV_APP,
} from '../../addSourceWizard/../__mocks__/applicationTypes';
import sourceTypes from '../../addSourceWizard/../__mocks__/sourceTypes';

import RendererContext from '@data-driven-forms/react-form-renderer/renderer-context';

import Summary, { createItem } from '../../../components/FormComponents/SourceWizardSummary';
import { NO_APPLICATION_VALUE } from '../../../components/addSourceWizard/stringConstants';
import emptyAuthType from '../../../components/addSourceWizard/emptyAuthType';
import * as UnleashClient from '@unleash/proxy-client-react';
import componentWrapperIntl from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';
import { COST_MANAGEMENT_APP_ID, HCS_APP_NAME } from '../../../utilities/constants';

jest.mock('@unleash/proxy-client-react', () => ({
  useUnleashContext: () => jest.fn(),
  useFlag: jest.fn(() => true),
}));

describe('SourceWizardSummary component', () => {
  describe('should render correctly', () => {
    let formOptions;
    let initialProps;
    let initialState;
    let store;

    const SourceWizardSummary = ({ formOptions, store, ...props }) =>
      componentWrapperIntl(
        <RendererContext.Provider value={{ formOptions }}>
          <Summary {...props} />
        </RendererContext.Provider>,
        store,
      );

    const getListData = (container) =>
      [...container.getElementsByClassName('pf-v6-c-description-list__group')].map((group) => [
        ...[...group.getElementsByClassName('pf-v6-c-description-list__text')].map((el) => el.textContent),
      ]);

    beforeEach(() => {
      formOptions = (source_type, authtype, application_type_id, validate = true) => ({
        getState: () => ({
          values: {
            source: {
              name: 'openshift',
            },
            endpoint: {
              certificate_authority: 'authority',
              verify_ssl: validate,
            },
            authentication: {
              role: 'kubernetes',
              password: '123456',
              username: 'user_name',
              validate,
              extra: {
                tenant: 'tenant1234',
              },
              authtype,
            },
            url: 'neznam.cz',
            source_type,
            application: {
              application_type_id,
            },
          },
        }),
      });

      initialProps = {
        sourceTypes,
        applicationTypes,
      };

      initialState = {
        sources: {
          sourceTypes: [{ name: 'amazon', product_name: 'Amazon Web Services' }],
          hcsEnrolled: false,
          hcsEnrolledLoaded: true,
        },
      };

      store = mockStore(initialState);
    });

    it('openshift', () => {
      const { container } = render(
        <SourceWizardSummary
          {...initialProps}
          formOptions={formOptions('openshift', 'token', NO_APPLICATION_VALUE)}
          store={store}
        />,
      );

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'openshift'],
        ['Integration type', 'OpenShift Container Platform'],
        ['Application', 'Not selected'],
        ['Authentication type', 'Token'],
        ['Token', '●●●●●●●●●●●●'],
        ['URL', 'neznam.cz'],
        ['Verify SSL', 'Enabled'],
        ['SSL Certificate', 'authority'],
      ]);
    });

    it('openshift - NO_APPLICATION_VALUE set, ignore it', () => {
      const { container } = render(
        <SourceWizardSummary {...initialProps} formOptions={formOptions('openshift', 'token')} store={store} />,
      );

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'openshift'],
        ['Integration type', 'OpenShift Container Platform'],
        ['Application', 'Not selected'],
        ['Authentication type', 'Token'],
        ['Token', '●●●●●●●●●●●●'],
        ['URL', 'neznam.cz'],
        ['Verify SSL', 'Enabled'],
        ['SSL Certificate', 'authority'],
      ]);
    });

    it('amazon', () => {
      const { container } = render(
        <SourceWizardSummary {...initialProps} formOptions={formOptions('amazon', 'access_key_secret_key')} store={store} />,
      );

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'openshift'],
        ['Integration type', 'Amazon Web Services'],
        ['Application', 'Not selected'],
        ['Authentication type', 'AWS Secret Key'],
        ['Access key ID', 'user_name'],
        ['Secret access key', '●●●●●●●●●●●●'],
      ]);
    });

    it('amazon - ARN', () => {
      const { container } = render(
        <SourceWizardSummary {...initialProps} formOptions={formOptions('amazon', 'arn')} store={store} />,
      );

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'openshift'],
        ['Integration type', 'Amazon Web Services'],
        ['Application', 'Not selected'],
        ['Authentication type', 'ARN'],
        ['ARN', 'user_name'],
      ]);
    });

    it('amazon - ARN cost management - include appended field from DB, CUR and rbac alert message', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: {
              application_type_id: '2',
              extra: { bucket: 'gfghf', bucket_region: 'test', metered: 'rhel', storage_only: true },
            },
            source_type: 'amazon',
            authentication: { username: 'arn:aws:132', authtype: 'arn' },
            fixasyncvalidation: '',
            endpoint: { role: 'aws' },
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Amazon Web Services'],
        ['Application', 'Cost Management'],
        ['S3 bucket name', 'gfghf'],
        ['AWS region', 'test'],
        ['Include RHEL usage', 'rhel'],
        ['ARN', 'arn:aws:132'],
      ]);

      expect(screen.getByText('Manage permissions in User Access')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Make sure to manage permissions for this integration in custom roles that contain permissions for Cost Management.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Don't forget additional configuration steps!")).toBeInTheDocument();
      expect(screen.getByText('Customizing your Amazon Web Services cost and usage report')).toBeInTheDocument();
      expect(
        screen.getByText(
          'You will need to perform more configuration steps after creating the source. To find more information, click on the link below.',
        ),
      ).toBeInTheDocument();
    });

    it('amazon - ARN cost management - show content rhel usage content if non-manual CUR', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: {
              application_type_id: '2',
              extra: { bucket: 'gfghf', bucket_region: 'test', metered: 'rhel', storage_only: false },
            },
            source_type: 'amazon',
            authentication: { username: 'arn:aws:132', authtype: 'arn' },
            fixasyncvalidation: '',
            endpoint: { role: 'aws' },
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Amazon Web Services'],
        ['Application', 'Cost Management'],
        ['S3 bucket name', 'gfghf'],
        ['AWS region', 'test'],
        ['Include RHEL usage', 'rhel'],
        ['ARN', 'arn:aws:132'],
      ]);

      expect(screen.getByText('Manage permissions in User Access')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Make sure to manage permissions for this integration in custom roles that contain permissions for Cost Management.',
        ),
      ).toBeInTheDocument();
    });

    it('amazon - ARN HCS - should not include rbac alert message', () => {
      store = mockStore({ sources: { ...initialState.sources, hcsEnrolled: true } });
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: {
              application_type_id: COST_MANAGEMENT_APP_ID,
              extra: { bucket: 'gfghf', bucket_region: 'test', metered: 'rhel', storage_only: true },
            },
            source_type: 'amazon',
            authentication: { username: 'arn:aws:132', authtype: 'arn' },
            fixasyncvalidation: '',
            endpoint: { role: 'aws' },
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Amazon Web Services'],
        ['Application', 'Hybrid Committed Spend'],
        ['S3 bucket name', 'gfghf'],
        ['AWS region', 'test'],
        ['Include RHEL usage', 'rhel'],
        ['ARN', 'arn:aws:132'],
      ]);

      expect(screen.queryByText('Manage permissions in User Access')).not.toBeInTheDocument();
      expect(
        screen.getByText(
          'You will need to perform more configuration steps after creating the source. To find more information, click on the link below.',
        ),
      ).toBeInTheDocument();
    });

    it('google - cost management - include google - cost alert', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: { application_type_id: '2', extra: { dataset: 'dataset_id_123' } },
            source_type: 'google',
            authentication: { authtype: 'project_id_service_account_json', username: 'project_id_123' },
            fixasyncvalidation: '',
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Google Cloud'],
        ['Application', 'Cost Management'],
        ['Project ID', 'project_id_123'],
        ['Cloud storage bucket name', '-'],
      ]);
    });

    it('google - cost management - HCS', () => {
      store = mockStore({ sources: { ...initialState.sources, hcsEnrolled: true } });
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: { application_type_id: '2', extra: { dataset: 'dataset_id_123', storage_only: true } },
            source_type: 'google',
            authentication: { authtype: 'project_id_service_account_json', username: 'project_id_123' },
            fixasyncvalidation: '',
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Google Cloud'],
        ['Application', HCS_APP_NAME],
        ['Project ID', 'project_id_123'],
        ['Cloud storage bucket name', '-'],
      ]);
      expect(
        screen.getByText(
          'You will need to perform more configuration steps after creating the source. To find more information, click on the link below.',
        ),
      ).toBeInTheDocument();
    });

    it('openshift cost management - include appended field from DB and rbac alert message', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi', source_ref: 'CLUSTER ID123' },
            application: { application_type_id: COST_MANAGEMENT_APP.id },
            source_type: 'openshift',
            authentication: { authtype: 'token' },
            auth_select: 'token',
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'OpenShift Container Platform'],
        ['Application', 'Cost Management'],
        ['Cluster Identifier', 'CLUSTER ID123'],
      ]);

      expect(screen.getByText('Manage permissions in User Access')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Make sure to manage permissions for this integration in custom roles that contain permissions for Cost Management.',
        ),
      ).toBeInTheDocument();
    });

    it('IBM cost management - include appended field from DB and rbac alert message', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: { application_type_id: '2', extra: { enterprise_id: 'enterprise id' } },
            source_type: 'ibm',
            authentication: { username: 'account id', authtype: 'api_token_account_id', password: 'token1234' },
            auth_select: 'api_token_account_id',
            fixasyncvalidation: '',
          },
        }),
      };

      const { container } = render(
        <IntlProvider locale="en">
          <SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />
        </IntlProvider>,
      );

      const data = [...container.getElementsByClassName('pf-v6-c-description-list__group')].map((group) => [
        ...[...group.getElementsByClassName('pf-v6-c-description-list__text')].map((el) => el.textContent),
      ]);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'IBM Cloud'],
        ['Application', 'Cost Management'],
        ['Enterprise ID', 'enterprise id'],
        ['Account ID', 'account id'],
        ['API Key', '●●●●●●●●●●●●'],
      ]);

      expect(screen.getByText('Manage permissions in User Access')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Make sure to manage permissions for this integration in custom roles that contain permissions for Cost Management.',
        ),
      ).toBeInTheDocument();
    });

    it('azure cost management - HCS and default CUR', () => {
      store = mockStore({ sources: { ...initialState.sources, hcsEnrolled: true } });
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: { application_type_id: COST_MANAGEMENT_APP_ID, extra: { bucket: 'gfghf' } },
            source_type: 'azure',
            authentication: { authtype: 'lighthouse_subscription_id', username: 'some-subscription-id' },
            auth_select: 'lighthouse_subscription_id',
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Microsoft Azure'],
        ['Application', 'Hybrid Committed Spend'],
        ['Subscription ID', 'some-subscription-id'],
      ]);

      expect(screen.queryByText('Manage permissions in User Access')).toBeNull();
      expect(screen.queryByText("Don't forget additional configuration steps!")).toBeNull();
      expect(screen.queryByText('Customizing your Amazon Web Services cost and usage report')).toBeNull();
      expect(
        screen.queryByText(
          'You will need to perform more configuration steps after creating the source. To find more information, click on the link below.',
        ),
      ).toBeNull();
    });

    it('azure rhel management - lighthouse', () => {
      jest.spyOn(UnleashClient, 'useFlag').mockReturnValueOnce(true);
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: { application_type_id: SUB_WATCH_APP.id },
            source_type: 'azure',
            authentication: { authtype: 'lighthouse_subscription_id', username: 'some-subscription-id' },
            auth_select: 'lighthouse_subscription_id',
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Microsoft Azure'],
        ['Application', 'RHEL management'],
        ['Subscription ID', 'some-subscription-id'],
      ]);
    });

    it('azure rhel management - no lighthouse', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: { application_type_id: SUB_WATCH_APP.id },
            source_type: 'azure',
            authentication: { authtype: emptyAuthType.type },
            auth_select: 'token',
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Microsoft Azure'],
        ['Application', 'RHEL management'],
      ]);
    });

    it('google rhel management - include error message', async () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: { application_type_id: SUB_WATCH_APP.id },
            source_type: 'google',
            authentication: { authtype: emptyAuthType.type },
            auth_select: 'token',
          },
        }),
      };

      let container;
      await waitFor(async () => {
        const results = await render(<SourceWizardSummary {...initialProps} app formOptions={formOptions} store={store} />);
        container = results.container;
      });

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Google Cloud'],
        ['Application', 'RHEL management'],
      ]);

      expect(screen.getByText('This integration will not be monitored in Integrations')).toBeInTheDocument();
      expect(
        screen.getByText(
          'This integration will be represented in the Integrations list, but will not reflect true status or resources.',
        ),
      ).toBeInTheDocument();
    });

    it('account authorization', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi', app_creation_workflow: ACCOUNT_AUTHORIZATION },
            applications: [COST_MANAGEMENT_APP.id, TOPOLOGY_INV_APP.id],
            source_type: 'amazon',
            authentication: { username: 'arn:aws:132', authtype: 'access_key_secret_key', password: 'secret_key' },
            fixasyncvalidation: '',
            endpoint: { role: 'aws' },
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Amazon Web Services'],
        ['Configuration mode', 'Account authorization'],
        ['Applications', 'Cost ManagementTopological Inventory'],
        ['Access key ID', 'arn:aws:132'],
        ['Secret access key', '●●●●●●●●●●●●'],
      ]);
    });

    it('account authorization - no apps', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi', app_creation_workflow: ACCOUNT_AUTHORIZATION },
            applications: [],
            source_type: 'amazon',
            authentication: { username: 'arn:aws:132', authtype: 'access_key_secret_key', password: 'secret_key' },
            fixasyncvalidation: '',
            endpoint: { role: 'aws' },
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Amazon Web Services'],
        ['Configuration mode', 'Account authorization'],
        ['Applications', 'None'],
        ['Access key ID', 'arn:aws:132'],
        ['Secret access key', '●●●●●●●●●●●●'],
      ]);
    });

    it('manual authorization - no apps', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi', app_creation_workflow: MANUAL_CONFIGURATION },
            applications: [],
            source_type: 'amazon',
            authentication: { username: 'arn:aws:132', authtype: 'access_key_secret_key', password: 'secret_key' },
            fixasyncvalidation: '',
            endpoint: { role: 'aws' },
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Amazon Web Services'],
        ['Configuration mode', 'Manual configuration'],
        ['Application', 'Not selected'],
        ['Authentication type', 'AWS Secret Key'],
        ['Access key ID', 'arn:aws:132'],
        ['Secret access key', '●●●●●●●●●●●●'],
      ]);
    });

    it('amazon - ARN subwatch - does not include auto registration', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: { name: 'cosi' },
            application: { application_type_id: SUB_WATCH_APP.id, extra: { auto_register: true } },
            source_type: 'amazon',
            authentication: { username: 'arn:aws:132', authtype: 'cloud-meter-arn' },
            fixasyncvalidation: '',
          },
        }),
      };

      const { container } = render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'cosi'],
        ['Integration type', 'Amazon Web Services'],
        ['Application', 'RHEL management'],
        ['ARN', 'arn:aws:132'],
      ]);
    });

    it('ansible-tower', () => {
      const { container } = render(
        <SourceWizardSummary {...initialProps} formOptions={formOptions('ansible-tower', 'username_password')} store={store} />,
      );
      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'openshift'],
        ['Integration type', 'Ansible Tower'],
        ['Application', 'Not selected'],
        ['Authentication type', 'Username and password'],
        ['Username', 'user_name'],
        ['Password', '●●●●●●●●●●●●'],
        ['Hostname', 'neznam.cz'],
        ['Verify SSL', 'Enabled'],
        ['Certificate authority', 'authority'],
        ['Use Platform Receptor and PKI (?)', '-'],
        ['Receptor ID', '-'],
      ]);
    });

    it('selected Catalog application, is second', () => {
      const { container } = render(
        <SourceWizardSummary
          {...initialProps}
          formOptions={formOptions('ansible-tower', 'username_password', '1')}
          store={store}
        />,
      );
      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'openshift'],
        ['Integration type', 'Ansible Tower'],
        ['Application', 'Catalog'],
        ['Hostname', 'neznam.cz'],
        ['Verify SSL', 'Enabled'],
        ['Certificate authority', 'authority'],
        ['Username', 'user_name'],
        ['Password', '●●●●●●●●●●●●'],
      ]);
    });

    it('hide application', () => {
      const { container } = render(
        <SourceWizardSummary
          {...initialProps}
          formOptions={formOptions('ansible-tower', 'username_password', '1')}
          showApp={false}
          store={store}
        />,
      );
      const data = getListData(container);

      expect(data).toEqual([
        ['Name', 'openshift'],
        ['Integration type', 'Ansible Tower'],
        ['Hostname', 'neznam.cz'],
        ['Verify SSL', 'Enabled'],
        ['Certificate authority', 'authority'],
        ['Username', 'user_name'],
        ['Password', '●●●●●●●●●●●●'],
      ]);

      expect(() => screen.getByText('Catalog')).toThrow();
    });

    it('do not contain hidden field', () => {
      render(
        <SourceWizardSummary {...initialProps} formOptions={formOptions('ansible-tower', 'username_password')} store={store} />,
      );
      expect(() => screen.getByText('kubernetes')).toThrow();
    });

    it('do contain endpoint fields when noEndpoint not set', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: {
              name: 'openshift',
            },
            source_type: 'openshift',
            endpoint: {
              verify_ssl: true,
              certificate_authority: 'authority',
            },
            authentication: {
              username: 'user_name',
            },
          },
        }),
      };

      render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);
      expect(screen.getByText('authority')).toBeInTheDocument();
    });

    it('do not contain endpoint fields and authentication when noEndpoint set', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: {
              name: 'openshift',
            },
            source_type: 'openshift',
            application: {
              application_type_id: COST_MANAGEMENT_APP.id,
            },
            endpoint: {
              certificate_authority: 'authority',
            },
            authentication: {
              password: 'token',
              authtype: 'token',
            },
          },
        }),
      };

      render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);
      expect(() => screen.getByText('authority')).toThrow();
      expect(() => screen.getByText('token')).toThrow();
    });

    it('render boolean as Enabled', () => {
      render(<SourceWizardSummary {...initialProps} formOptions={formOptions('openshift', 'token')} store={store} />);
      expect(screen.getByText('Enabled')).toBeInTheDocument();
      expect(() => screen.getByText('Disabled')).toThrow();
    });

    it('render boolean as No', () => {
      render(<SourceWizardSummary {...initialProps} formOptions={formOptions('openshift', 'token', '1', false)} store={store} />);
      expect(() => screen.getByText('Enabled')).toThrow();
      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('render password as dots', () => {
      render(
        <SourceWizardSummary
          {...initialProps}
          formOptions={formOptions('ansible-tower', 'username_password', '1', false)}
          store={store}
        />,
      );
      expect(screen.getByText('●●●●●●●●●●●●')).toBeInTheDocument();
      expect(() => screen.getByText('123456')).toThrow();
    });

    it('use source.source_type_id as a fallback', () => {
      formOptions = {
        getState: () => ({
          values: {
            source: {
              name: 'openshift',
              source_type_id: '1',
            },
          },
        }),
      };

      render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);
      expect(screen.getByText('OpenShift Container Platform')).toBeInTheDocument();
    });

    it('contains too long text', async () => {
      const user = userEvent.setup();

      const randomLongText = new Array(500)
        .fill(1)
        .map(() => String.fromCharCode(Math.random() * (122 - 97) + 97))
        .join('');

      formOptions = {
        getState: () => ({
          values: {
            source: {
              name: 'openshift',
            },
            source_type: 'openshift',
            endpoint: {
              certificate_authority: randomLongText,
              verify_ssl: true,
            },
          },
        }),
      };

      render(<SourceWizardSummary {...initialProps} formOptions={formOptions} store={store} />);

      expect(() => screen.getByText(randomLongText)).toThrow();
      expect(screen.getByText('Show more')).toBeInTheDocument();

      await waitFor(async () => {
        await user.click(screen.getByText('Show more'));
      });

      await waitFor(() => expect(screen.getByText(randomLongText)).toBeInTheDocument());
    });
  });

  describe('createItem', () => {
    let availableStepKeys;
    let field;
    let values;

    beforeEach(() => {
      availableStepKeys = [];
      field = {
        label: 'Label 1',
        name: 'authentication.password',
      };
      values = {
        authentication: {
          password: '123456',
        },
      };
    });

    it('normal value', () => {
      expect(createItem(field, values, availableStepKeys)).toEqual({
        label: 'Label 1',
        value: '123456',
      });
    });

    it('password value', () => {
      field = {
        label: 'Label 1',
        name: 'authentication.password',
        type: 'password',
      };

      expect(createItem(field, values, availableStepKeys)).toEqual({
        label: 'Label 1',
        value: '●●●●●●●●●●●●',
      });
    });

    it('boolean true', () => {
      values = {
        authentication: {
          password: true,
        },
      };

      expect(createItem(field, values, availableStepKeys)).toEqual({
        label: 'Label 1',
        value: (
          <Label color="green">
            <FormattedMessage id="wizard.enabled" defaultMessage="Enabled" />
          </Label>
        ),
      });
    });

    it('boolean false', () => {
      values = {
        authentication: {
          password: false,
        },
      };

      expect(createItem(field, values, availableStepKeys)).toEqual({
        label: 'Label 1',
        value: (
          <Label color="gray">
            <FormattedMessage id="wizard.disabled" defaultMessage="Disabled" />
          </Label>
        ),
      });
    });

    it('hidden field', () => {
      field = {
        label: 'Label 1',
        name: 'authentication.password',
        hideField: true,
      };

      expect(createItem(field, values, availableStepKeys)).toEqual(undefined);
    });

    it('available stepKey', () => {
      field = {
        label: 'Label 1',
        name: 'authentication.password',
        stepKey: 'in',
      };
      availableStepKeys = ['in'];

      expect(createItem(field, values, availableStepKeys)).toEqual({
        label: 'Label 1',
        value: '123456',
      });
    });

    it('unavailableStepKey', () => {
      field = {
        label: 'Label 1',
        name: 'authentication.password',
        stepKey: 'notint',
      };
      availableStepKeys = ['in'];

      expect(createItem(field, values, availableStepKeys)).toEqual(undefined);
    });

    it('empty value', () => {
      values = {};

      expect(createItem(field, values, availableStepKeys)).toEqual({
        label: 'Label 1',
        value: '-',
      });
    });

    it('authentication editing', () => {
      field = {
        label: 'Label 1',
        name: 'authentication.password',
        stepKey: 'in',
      };

      values = {
        authentication: {
          id: 'someid',
        },
      };

      availableStepKeys = ['in'];

      expect(createItem(field, values, availableStepKeys)).toEqual({
        label: 'Label 1',
        value: '●●●●●●●●●●●●',
      });
    });

    it('hidden conditional field', () => {
      field = {
        label: 'Label 1',
        name: 'authentication.password',
        condition: {
          when: 'username.name',
          is: 'lojza',
        },
      };

      values = {
        authentication: {
          password: '123456',
        },
        username: {
          name: 'pepa',
        },
      };

      expect(createItem(field, values, availableStepKeys)).toEqual(undefined);
    });
  });
});
