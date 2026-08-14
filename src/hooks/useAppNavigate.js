import { useNavigate } from 'react-router-dom';
import { linkBasename, mergeToBasename } from '../utilities/utils';

export const useAppNavigate = () => {
  const navigate = useNavigate();

  return (to, options) => {
    return navigate(mergeToBasename(to, linkBasename), options);
  };
};
