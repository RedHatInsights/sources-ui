import { createAdditionalSteps, selectAuthTypeField } from '../../../../components/addSourceWizard/schemaBuilder';

jest.mock('../../../../components/addSourceWizard/hardcodedSchemas', () => ({
  red: {
    authentication: {
      hat: {
        generic: {
          skipEndpoint: true,
        },
      },
    },
  },
}));

describe('createAdditionalStepsSkipEndpoint', () => {
  const ADDITIONAL_STEPS = [
    {
      fields: ['a'],
    },
  ];

  const TYPES_FIELDS = [];

  it('assigns summary as a next step when has endpoint', () => {
    const HAS_ENDPOINT = true;

    const result = createAdditionalSteps(ADDITIONAL_STEPS, 'red', 'hat', HAS_ENDPOINT, TYPES_FIELDS);

    expect(result).toEqual([
      {
        fields: ['a', selectAuthTypeField('hat')],
        name: 'red-hat-generic-additional-step',
        nextStep: 'summary',
      },
    ]);
  });

  it('assigns summary as a next step when has no endpoint', () => {
    const HAS_ENDPOINT = false;

    const result = createAdditionalSteps(ADDITIONAL_STEPS, 'red', 'hat', HAS_ENDPOINT, TYPES_FIELDS);

    expect(result).toEqual([
      {
        fields: ['a', selectAuthTypeField('hat')],
        name: 'red-hat-generic-additional-step',
        nextStep: 'summary',
      },
    ]);
  });
});
