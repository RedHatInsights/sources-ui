const computeSourcesUrl = () => (insights.chrome.isBeta() ? `/preview/settings/sources` : `/settings/sources`);

export default computeSourcesUrl;
