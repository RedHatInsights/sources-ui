import createProgressTextsApp from '../../../../components/AddApplication/steps/createProgressTextsApp';

describe('createProgressTextsApp', () => {
    const intl = {
        formatMessage: ({ defaultMessage }) => defaultMessage
    };

    it('generate with new endpoint', () => {
        const allValues = {
            endpoint: {
                id: 'endpointid'
            }
        };
        const formData = {
            endpoint: {
                port: '232'
            }
        };

        expect(createProgressTextsApp(formData, allValues, intl)).toEqual([
            'Step { step }: creating endpoint',
            'Step { step }: updating values and creating application',
            'Step { step }: connecting application and authentication',
            'Step { step }: reloading data',
            'Completed'
        ]);
    });

    it('no endpoint', () => {
        const allValues = {};
        const formData = {};

        expect(createProgressTextsApp(formData, allValues, intl)).toEqual([
            'Step { step }: updating values and creating application',
            'Step { step }: connecting application and authentication',
            'Step { step }: reloading data',
            'Completed'
        ]);
    });
});
