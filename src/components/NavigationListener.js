import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { routes } from '../Routes';

const NavigationListener = () => {
  const history = useHistory();

  useEffect(() => {
    insights.chrome.init();
    try {
      insights.chrome.identifyApp('sources');
      insights.chrome.on('APP_NAVIGATION', (event) => event.navId === 'sources' && history.push(routes.sources.path));
    } catch (_exception) {
      // eslint-disable-next-line no-console
      console.warn('Failed to initialize chrome navigation.');
    }
  }, []);

  return null;
};

export default NavigationListener;
