import React from 'react';
import {
  nextStep,
  iconMapper,
  NameDescription,
  SummaryDescription,
  sourceTypeMutator,
  typesStep,
  compileAllSourcesComboOptions,
  appMutatorRedHat,
  applicationStep,
  cloudTypesStep,
} from '../../../components/addSourceWizard/SourceAddSchema';
import sourceTypes, { OPENSHIFT_TYPE } from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';

import { Text, TextContent } from '@patternfly/react-core';

import mount from '../__mocks__/mount';
import { NO_APPLICATION_VALUE } from '../../../components/addSourceWizard/stringConstants';
import SubWatchDescription from '../../../components/addSourceWizard/descriptions/SubWatchDescription';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';

describe('Add source schema', () => {
  const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

  describe('nextStep', () => {
    const OPENSHIFT = 'openshift';
    const APP_ID = '666';
    let formState = {
      values: {
        source_type: OPENSHIFT,
      },
    };

    it('returns nextstep without selected app', () => {
      expect(nextStep()(formState)).toEqual(OPENSHIFT);
    });

    it('returns nextstep with selected app', () => {
      formState = {
        values: {
          ...formState.values,
          application: {
            application_type_id: APP_ID,
          },
        },
      };

      expect(nextStep()(formState)).toEqual(`${OPENSHIFT}-${APP_ID}`);
    });

    it('returns nextstep with empty application', () => {
      formState = {
        values: {
          ...formState.values,
          application: {},
        },
      };

      expect(nextStep()(formState)).toEqual(OPENSHIFT);
    });
  });

  describe('iconMapper', () => {
    let sourceTypes;
    let DefaultIcon = () => <div>Default icon</div>;

    beforeEach(() => {
      sourceTypes = [OPENSHIFT_TYPE];
    });

    it('returns icon', () => {
      const Icon = iconMapper(sourceTypes)(OPENSHIFT_TYPE.name, DefaultIcon);

      const wrapper = mount(<Icon />);

      const imgProps = wrapper.find('img').props();

      expect(imgProps.src).toEqual('/apps/frontend-assets/red-hat-logos/stacked.svg');
      expect(imgProps.alt).toEqual(OPENSHIFT_TYPE.product_name);
    });

    it('returns null when no iconUrl && no short url', () => {
      sourceTypes = [{ ...OPENSHIFT_TYPE, icon_url: undefined, name: 'nonsense' }];

      const Icon = iconMapper(sourceTypes)(OPENSHIFT_TYPE.name, DefaultIcon);

      expect(Icon).toEqual(null);
    });

    it('returns null when no sourceType', () => {
      sourceTypes = [];

      const Icon = iconMapper(sourceTypes)(OPENSHIFT_TYPE.name, DefaultIcon);

      expect(Icon).toEqual(null);
    });
  });

  describe('descriptions', () => {
    it('renders name description', () => {
      const wrapper = mount(
        <SourcesFormRenderer
          onSubmit={jest.fn()}
          initialValues={{ source_type: 'amazon' }}
          schema={{ fields: [{ component: 'description', name: 'desc', Content: NameDescription, sourceTypes }] }}
        />
      );

      expect(wrapper.find(TextContent)).toHaveLength(1);
      expect(wrapper.find(Text)).toHaveLength(1);
      expect(wrapper.find(Text).text()).toEqual('Enter a name for your Amazon Web Services source.');
    });

    it('renders summary description', () => {
      const wrapper = mount(<SummaryDescription />);

      expect(wrapper.find(TextContent)).toHaveLength(1);
      expect(wrapper.find(Text)).toHaveLength(1);
    });
  });

  describe('mutators', () => {
    const sourceTypes = [
      {
        product_name: 'Amazon',
        name: 'amazon',
        id: 'amazon',
      },
      {
        product_name: 'differen type',
        name: 'ops',
        id: 'openshift',
      },
    ];
    const applicationTypes = [
      {
        id: 'selected',
        supported_source_types: ['amazon'],
        display_name: 'catalog',
      },
      {
        id: 'cost',
        supported_source_types: [],
        display_name: 'cost',
      },
    ];

    it('source type mutator limits available source types', () => {
      const formOptions = {
        getState: () => ({
          values: {
            application: {
              application_type_id: 'selected',
            },
          },
        }),
      };

      const mutator = sourceTypeMutator(applicationTypes, sourceTypes);

      expect(mutator({ label: 'differen type', value: 'ops' }, formOptions)).toEqual({
        label: 'differen type',
        value: 'ops',
        isDisabled: true,
      });
      expect(mutator({ label: 'Amazon', value: 'amazon' }, formOptions)).toEqual({
        label: 'Amazon',
        value: 'amazon',
        isDisabled: false,
      });
    });

    it('appMutatorRedHat - undfined when unable', () => {
      const formOptions = {
        getState: () => ({
          values: {
            source_type: 'amazon',
          },
        }),
      };

      const mutator = appMutatorRedHat(applicationTypes);

      expect(mutator({ label: 'catalog', value: 'selected' }, formOptions)).toEqual({ label: 'catalog', value: 'selected' });
      expect(mutator({ label: 'cost this is label', value: 'cost' }, formOptions)).toEqual(undefined);
    });
  });

  describe('typesStep', () => {
    it('cloud type selection', () => {
      const result = cloudTypesStep(sourceTypes, applicationTypes, INTL);

      expect(result.fields).toHaveLength(2);
      expect(result.name).toEqual('types_step');
      expect(result.title).toEqual('Select source type');

      expect(result.fields[0].component).toEqual(componentTypes.PLAIN_TEXT);
      expect(result.fields[0].label).toEqual(
        'To import data for an application, you need to connect to a data source. Start by selecting your source type.'
      );

      expect(result.fields[1].name).toEqual('source_type');
      expect(result.fields[1].label).toEqual('Select a cloud provider');
    });

    it('red hat type selection', () => {
      const result = typesStep(sourceTypes, applicationTypes, false, INTL);

      expect(result.fields[0].component).toEqual(componentTypes.PLAIN_TEXT);
      expect(result.fields[0].label).toEqual(
        'To import data for an application, you need to connect to a data source. Start by selecting your source type and application.'
      );
      expect(result.fields).toHaveLength(3);
      expect(result.fields[1].name).toEqual('source_type');
      expect(result.fields[1].mutator).toEqual(undefined);
      expect(result.fields[2].name).toEqual('application.application_type_id');
      expect(result.fields[2].component).toEqual('enhanced-radio');
      expect(result.fields[2].isRequired).toEqual(true);
      expect(result.fields[2].validate).toEqual([{ type: 'required' }]);
      expect(result.fields[2].placeholder).toEqual(undefined);
      expect(result.fields[2].condition).toEqual({ isNotEmpty: true, when: 'source_type' });
      expect(result.fields[2].mutator.toString()).toEqual(appMutatorRedHat(applicationTypes).toString());
    });
  });

  describe('application step', () => {
    it('generate steps', () => {
      const result = applicationStep(applicationTypes, INTL);

      expect(result.title).toEqual('Select application');
      expect(result.fields.map(({ name }) => name)).toEqual([
        'app-description',
        'application.application_type_id',
        'source_type',
      ]);
      expect(result.fields[1].options).toEqual([
        { label: 'Catalog', value: '1', description: undefined },
        {
          label: 'Cost Management',
          value: '2',
          description: 'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.',
        },
        { label: expect.any(Object), value: '5', description: <SubWatchDescription id="5" /> },
        { label: 'Topological Inventory', value: '3', description: undefined },
        { value: NO_APPLICATION_VALUE, label: 'No application' },
      ]);
    });
  });

  describe('compileAllSourcesComboOptions', () => {
    it('cloud type selection', () => {
      const mockSourceTypes = [
        { name: 'google', product_name: 'Google Cloud Provider', id: '1' },
        { name: 'aws', product_name: 'Amazon Web Services', id: '2' },
      ];

      expect(compileAllSourcesComboOptions(mockSourceTypes)).toEqual([
        { label: 'Amazon Web Services', value: 'aws' },
        { label: 'Google Cloud Provider', value: 'google' },
      ]);
    });

    it('red hat type selection - remove red hat', () => {
      const mockSourceTypes = [
        { name: 'ops', product_name: 'Red Hat Openshift', vendor: 'Red Hat', id: '1' },
        { name: 'sat', product_name: 'Red Hat Satellite', vendor: 'Red Hat', id: '2' },
      ];

      expect(compileAllSourcesComboOptions(mockSourceTypes)).toEqual([
        { label: 'Openshift', value: 'ops' },
        { label: 'Satellite', value: 'sat' },
      ]);
    });
  });
});
