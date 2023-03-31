import { parseSourceToSchema } from '../../../../components/SourceEditForm/parser/parseSourceToSchema';

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
  });

  it('calls all subsections', () => {
    parseSourceToSchema(SOURCE, SOURCE_TYPE, APP_TYPES, INTL, false);

    expect(app.applicationsFields).toHaveBeenCalledWith(SOURCE.applications, SOURCE_TYPE, APP_TYPES, false);
  });
});
