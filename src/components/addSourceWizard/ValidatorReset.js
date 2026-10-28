import { useEffect } from 'react';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

// see https://github.com/data-driven-forms/react-forms/issues/431
const ValidatorReset = ({ name }) => {
  const formOptions = useFormApi();

  useEffect(() => {
    setTimeout(() => formOptions.change(name, '1'));

    return () => formOptions.change(name, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
  }, []);

  return null;
};

ValidatorReset.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ValidatorReset;
