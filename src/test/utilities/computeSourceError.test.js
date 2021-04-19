import computeSourceError from '../../utilities/computeSourceError';

describe('computeSourceError', () => {
  let source;

  const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };
  const errorMessage = 'SOME ERROR MESSAGE';

  it('endpoint has error', () => {
    source = {
      applications: [{}, {}],
      authentications: [{}],
      endpoint: [
        {
          availability_status_error: errorMessage,
        },
      ],
    };

    expect(computeSourceError(source, INTL)).toEqual(errorMessage);
  });

  it('application has error', () => {
    source = {
      applications: [{}, { availability_status_error: errorMessage }],
      authentications: [{}],
      endpoint: [{}],
    };

    expect(computeSourceError(source, INTL)).toEqual(errorMessage);
  });

  it('authentication has error', () => {
    source = {
      applications: [{}, {}],
      authentications: [{ availability_status_error: errorMessage }],
      endpoint: [{}],
    };

    expect(computeSourceError(source, INTL)).toEqual(errorMessage);
  });

  it('default', () => {
    source = {
      applications: [{}, {}],
      authentications: [{}],
      endpoint: [{}],
    };

    expect(computeSourceError(source, INTL)).toEqual('Unknown error');
  });

  it('handle falsy values', () => {
    source = {
      applications: [undefined, {}],
      authentications: [false],
      endpoint: [{}],
    };

    expect(computeSourceError(source, INTL)).toEqual('Unknown error');
  });
});
