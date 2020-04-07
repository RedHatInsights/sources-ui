import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

const createProgressTextsApp = (
    filteredValues, allFormValues, intl
) => {
    let progressText = [];
    let step = 0;

    if (filteredValues.endpoint && !isEmpty(filteredValues.endpoint) && get(allFormValues, 'endpoint.id', false)) {
        progressText.push(intl.formatMessage({
            id: 'sources.authProgressEndpoint',
            defaultMessage: 'Step { step }: creating endpoint'
        }, { step: ++step }));
    }

    progressText.push(intl.formatMessage({
        id: 'sources.authProgressValues',
        defaultMessage: 'Step { step }: updating values and creating application'
    }, { step: ++step }));

    progressText.push(intl.formatMessage({
        id: 'sources.authConnectingApplication',
        defaultMessage: 'Step { step }: connecting application and authentication'
    }, { step: ++step }));

    progressText.push(intl.formatMessage({
        id: 'sources.authReloadData',
        defaultMessage: 'Step { step }: reloading data'
    }, { step: ++step }));

    progressText.push(intl.formatMessage({
        id: 'sources.authCompleted',
        defaultMessage: 'Completed'
    }));

    return progressText;
};

export default createProgressTextsApp;

