const computeSourcesUrl = (isBeta = false) => (isBeta ? `/preview/settings/integrations` : `/settings/integrations`);

export default computeSourcesUrl;
