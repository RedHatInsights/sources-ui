import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { routes } from '../Routes';

const NavigationListener = () => {
  const history = useHistory();

  useEffect(() => {
    try {
      insights.chrome.init();
      insights.chrome.identifyApp('sources');
      const unregister = insights.chrome.on(
        'APP_NAVIGATION',
        (event) =>
          (event.navId.split('/').pop() || event.domEvent?.href.split('/').pop()) === 'sources' &&
          history.push(routes.sources.path)
      );

      return () => unregister?.();
    } catch (_exception) {
      // eslint-disable-next-line no-console
      console.warn('Failed to initialize chrome navigation.');
    }
  }, []);

  return null;
};

export default NavigationListener;
