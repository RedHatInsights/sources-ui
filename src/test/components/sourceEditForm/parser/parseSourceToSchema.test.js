import { parseSourceToSchema } from '../../../../components/SourceEditForm/parser/parseSourceToSchema';

import * as gen from '../../../../components/SourceEditForm/parser/genericInfo';
import * as auth from '../../../../components/SourceEditForm/parser/authentication';
import * as end from '../../../../components/SourceEditForm/parser/endpoint';
import * as app from '../../../../components/SourceEditForm/parser/application';

describe('parseSourceToSchema', () => {
    let SOURCE;
    let EDITING;
    let SET_EDIT;
    let SOURCE_TYPE;
    let APP_TYPES;

    beforeEach(() => {
        SOURCE = {
            source: { id: 'adsad' },
            authentications: [{ type: 'arn' }],
            applications: [],
            endpoints: [{}]
        };
        EDITING = {};
        SET_EDIT = jest.fn();
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

        gen.genericInfo = jest.fn().mockImplementation(() => ([]));
        auth.authenticationFields = jest.fn().mockImplementation(() => ([]));
        app.applicationsFields = jest.fn().mockImplementation(() => ([]));
        end.endpointFields = jest.fn().mockImplementation(() => (undefined));
    });

    afterEach(() => {
        SET_EDIT.mockReset();
    });

    it('calls all subsections', () => {
        parseSourceToSchema(
            SOURCE,
            EDITING,
            SET_EDIT,
            SOURCE_TYPE,
            APP_TYPES
        );

        expect(gen.genericInfo).toHaveBeenCalledWith(
            EDITING,
            SET_EDIT,
            SOURCE.source.id
        );
        expect(auth.authenticationFields).toHaveBeenCalledWith(
            SOURCE.authentications,
            SOURCE_TYPE,
            EDITING,
            SET_EDIT,
            APP_TYPES
        );
        expect(app.applicationsFields).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            EDITING,
            SET_EDIT,
            APP_TYPES,
            SOURCE,
        );
        expect(end.endpointFields).toHaveBeenCalledWith(
            SOURCE_TYPE,
            EDITING,
            SET_EDIT
        );
    });

    it('calls all subsections without endpoint', () => {
        const SOURCE_WITH_NO_ENDPOINT = {
            ...SOURCE,
            endpoints: undefined
        };

        parseSourceToSchema(
            SOURCE_WITH_NO_ENDPOINT,
            EDITING,
            SET_EDIT,
            SOURCE_TYPE,
            APP_TYPES
        );

        expect(gen.genericInfo).toHaveBeenCalledWith(
            EDITING,
            SET_EDIT,
            SOURCE.source.id
        );
        expect(auth.authenticationFields).toHaveBeenCalledWith(
            SOURCE.authentications,
            SOURCE_TYPE,
            EDITING,
            SET_EDIT,
            APP_TYPES
        );
        expect(app.applicationsFields).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            EDITING,
            SET_EDIT,
            APP_TYPES,
            SOURCE_WITH_NO_ENDPOINT,
        );
        expect(end.endpointFields).not.toHaveBeenCalled();
    });

    it('calls all subsections without endpoint of empty array', () => {
        const SOURCE_WITH_NO_ENDPOINT = {
            ...SOURCE,
            endpoints: []
        };

        parseSourceToSchema(
            SOURCE_WITH_NO_ENDPOINT,
            EDITING,
            SET_EDIT,
            SOURCE_TYPE,
            APP_TYPES
        );

        expect(gen.genericInfo).toHaveBeenCalledWith(
            EDITING,
            SET_EDIT,
            SOURCE.source.id
        );
        expect(auth.authenticationFields).toHaveBeenCalledWith(
            SOURCE.authentications,
            SOURCE_TYPE,
            EDITING,
            SET_EDIT,
            APP_TYPES
        );
        expect(app.applicationsFields).toHaveBeenCalledWith(
            SOURCE.applications,
            SOURCE_TYPE,
            EDITING,
            SET_EDIT,
            APP_TYPES,
            SOURCE_WITH_NO_ENDPOINT,
        );
        expect(end.endpointFields).not.toHaveBeenCalled();
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
            EDITING,
            SET_EDIT,
            SOURCE_TYPE,
            APP_TYPES
        );

        expect(result).toEqual({ fields: FILTERED_FIELDS });
    });
});
