import { parseSourceToSchema } from '../../../../components/SourceEditForm/parser/parseSourceToSchema';

import * as gen from '../../../../components/SourceEditForm/parser/genericInfo';
import * as end from '../../../../components/SourceEditForm/parser/endpoint';
import * as app from '../../../../components/SourceEditForm/parser/application';
import * as titleField from '../../../../components/SourceEditForm/parser/titleField';

describe('parseSourceToSchema', () => {
    let SOURCE;
    let SOURCE_TYPE;
    let APP_TYPES;
    let INTL;

    beforeEach(() => {
        SOURCE = {
            source: { id: 'adsad' },
            authentications: [{ type: 'arn' }],
            applications: [],
            endpoints: [{}]
        };
        SOURCE_TYPE = {
            id: '2',
            schema: {
                authentication: [
                    {
                        type: 'arn',
                        name: 'ARN',
                        fields: [{
                            name: 'authentication.authtype'
                        }]
                    }
                ]
            }
        };
        APP_TYPES = [];
        INTL = { formatMessage: jest.fn() };

        gen.genericInfo = jest.fn().mockImplementation(() => ([]));
        app.applicationsFields = jest.fn().mockImplementation(() => ([]));
        end.endpointFields = jest.fn().mockImplementation(() => (undefined));
        titleField.default = jest.fn().mockImplementation(() => ([]));
    });

    it('calls all subsections', () => {
        parseSourceToSchema(
            SOURCE,
            SOURCE_TYPE,
            APP_TYPES,
            INTL
        );

        expect(gen.genericInfo).toHaveBeenCalledWith(
            SOURCE.source.id,
            INTL,
            SOURCE_TYPE,
            SOURCE.applications
        );
        expect(app.applicationsFields).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            APP_TYPES,
            SOURCE.authentications
        );
        expect(end.endpointFields).toHaveBeenCalledWith(
            SOURCE_TYPE,
        );
        expect(titleField.default).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            APP_TYPES,
            INTL
        );
    });

    it('calls all subsections with apps', () => {
        SOURCE = {
            ...SOURCE,
            applications: [{ id: '1234' }]
        };

        parseSourceToSchema(
            SOURCE,
            SOURCE_TYPE,
            APP_TYPES,
            INTL
        );

        expect(gen.genericInfo).toHaveBeenCalledWith(
            SOURCE.source.id,
            INTL,
            SOURCE_TYPE,
            SOURCE.applications
        );
        expect(app.applicationsFields).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            APP_TYPES,
            SOURCE.authentications
        );
        expect(end.endpointFields).toHaveBeenCalledWith(
            SOURCE_TYPE,
        );
        expect(titleField.default).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            APP_TYPES,
            INTL
        );
    });

    it('calls all subsections without endpoint', () => {
        const SOURCE_WITH_NO_ENDPOINT = {
            ...SOURCE,
            endpoints: undefined
        };

        parseSourceToSchema(
            SOURCE_WITH_NO_ENDPOINT,
            SOURCE_TYPE,
            APP_TYPES,
            INTL
        );

        expect(gen.genericInfo).toHaveBeenCalledWith(
            SOURCE.source.id,
            INTL,
            SOURCE_TYPE,
            SOURCE.applications
        );
        expect(app.applicationsFields).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            APP_TYPES,
            SOURCE.authentications
        );
        expect(end.endpointFields).not.toHaveBeenCalled();
        expect(titleField.default).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            APP_TYPES,
            INTL
        );
    });

    it('calls all subsections without endpoint of empty array', () => {
        const SOURCE_WITH_NO_ENDPOINT = {
            ...SOURCE,
            endpoints: []
        };

        parseSourceToSchema(
            SOURCE_WITH_NO_ENDPOINT,
            SOURCE_TYPE,
            APP_TYPES,
            INTL
        );

        expect(gen.genericInfo).toHaveBeenCalledWith(
            SOURCE.source.id,
            INTL,
            SOURCE_TYPE,
            SOURCE.applications
        );
        expect(app.applicationsFields).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            APP_TYPES,
            SOURCE.authentications
        );
        expect(end.endpointFields).not.toHaveBeenCalled();
        expect(titleField.default).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            APP_TYPES,
            INTL
        );
    });

    it('returns filtered fields', () => {
        const FIELD1 = { name: 'halo' };

        gen.genericInfo = jest.fn().mockImplementation(() => ([
            FIELD1,
            undefined
        ]));

        const FILTERED_FIELDS = [FIELD1];

        const result = parseSourceToSchema(
            SOURCE,
            SOURCE_TYPE,
            APP_TYPES,
            INTL
        );

        expect(result).toEqual({ fields: [...FILTERED_FIELDS, titleField.default(SOURCE.applications, SOURCE_TYPE, APP_TYPES, INTL)] });
    });
});
