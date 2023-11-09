import { removeApplication } from '../../redux/sources/actions';

const removeAppSubmit = (app, intl, onCancel, dispatch, source) => {
  const titleSuccess = intl.formatMessage(
    {
      id: 'sources.removeAppWarning',
      defaultMessage: `{ name } was removed from this source.`,
    },
    {
      name: app.display_name,
    },
  );
  const titleError = intl.formatMessage(
    {
      id: 'sources.removeAppError',
      defaultMessage: `Removing of { name } application from this source was unsuccessful.`,
    },
    {
      name: app.display_name,
    },
  );
  onCancel && onCancel();
  return dispatch(removeApplication(app.id, source.id, titleSuccess, titleError));
};

export default removeAppSubmit;
