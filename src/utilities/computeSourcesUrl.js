const computeSourcesUrl = (isBeta = false) => (isBeta ? `/preview/settings/sources` : `/settings/sources`);

export default computeSourcesUrl;
