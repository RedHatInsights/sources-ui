import { parseSourceToSchema } from '../../../../components/SourceEditForm/parser/parseSourceToSchema';

import * as end from '../../../../components/SourceEditForm/parser/endpoint';
import * as app from '../../../../components/SourceEditForm/parser/application';

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
      endpoints: [{}],
    };
    SOURCE_TYPE = {
      id: '2',
      schema: {
        authentication: [
          {
            type: 'arn',
            name: 'ARN',
            fields: [
              {
                name: 'authentication.authtype',
              },
            ],
          },
        ],
      },
    };
    APP_TYPES = [];
    INTL = { formatMessage: jest.fn() };

    app.applicationsFields = jest.fn().mockImplementation(() => []);
    end.endpointFields = jest.fn().mockImplementation(() => undefined);
  });

  it('calls all subsections', () => {
    parseSourceToSchema(SOURCE, SOURCE_TYPE, APP_TYPES, INTL);

    expect(app.applicationsFields).toHaveBeenCalledWith(SOURCE.applications, SOURCE_TYPE, APP_TYPES);
    expect(end.endpointFields).toHaveBeenCalledWith(SOURCE_TYPE);
  });

  it('calls all subsections with apps', () => {
    SOURCE = {
      ...SOURCE,
      applications: [{ id: '1234' }],
    };

    parseSourceToSchema(SOURCE, SOURCE_TYPE, APP_TYPES, INTL);

    expect(app.applicationsFields).toHaveBeenCalledWith(SOURCE.applications, SOURCE_TYPE, APP_TYPES);
    expect(end.endpointFields).toHaveBeenCalledWith(SOURCE_TYPE);
  });

  it('calls all subsections without endpoint', () => {
    const SOURCE_WITH_NO_ENDPOINT = {
      ...SOURCE,
      endpoints: undefined,
    };

    parseSourceToSchema(SOURCE_WITH_NO_ENDPOINT, SOURCE_TYPE, APP_TYPES, INTL);

    expect(app.applicationsFields).toHaveBeenCalledWith(SOURCE.applications, SOURCE_TYPE, APP_TYPES);
    expect(end.endpointFields).not.toHaveBeenCalled();
  });

  it('calls all subsections without endpoint of empty array', () => {
    const SOURCE_WITH_NO_ENDPOINT = {
      ...SOURCE,
      endpoints: [],
    };

    parseSourceToSchema(SOURCE_WITH_NO_ENDPOINT, SOURCE_TYPE, APP_TYPES, INTL);

    expect(app.applicationsFields).toHaveBeenCalledWith(SOURCE.applications, SOURCE_TYPE, APP_TYPES);
    expect(end.endpointFields).not.toHaveBeenCalled();
  });

  it('returns filtered fields', () => {
    const result = parseSourceToSchema(SOURCE, SOURCE_TYPE, APP_TYPES, INTL);

    expect(result).toEqual({
      fields: [
        {
          name: 'alert',
          component: 'description',
          Content: expect.any(Function),
          condition: {
            when: 'message',
            isNotEmpty: true,
          },
        },
      ],
    });
  });
});
