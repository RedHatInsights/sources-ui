import { useSelector } from 'react-redux';

export const useIsLoaded = () => {
  const isLoaded = useSelector(({ sources }) => sources.loaded);

  return isLoaded <= 0;
};
