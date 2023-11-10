const tryAgainMessage = (intl, error) =>
  intl.formatMessage(
    {
      id: 'tryAgain.text',
      defaultMessage: '{ error }. Please try again.',
    },
    { error },
  );

export default tryAgainMessage;
