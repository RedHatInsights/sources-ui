import { routes } from '../../Routes';

export const refreshPage = history => {
    history.push(routes.sources.path);
    history.goBack();
};
