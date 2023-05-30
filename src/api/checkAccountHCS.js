export const checkAccountHCS = async () => {
  const jwtToken = await insights.chrome.auth.getToken();
  return fetch(`https://billing.${insights.chrome.isProd() ? '' : 'stage.'}api.redhat.com/v1/authorization/hcsEnrollment`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  }).then((response) => {
    if (response.status !== 200) {
      return { hcsDeal: false };
    }

    return response.json();
  });
};
