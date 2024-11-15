export const checkAccountHCS = async (jwtToken, isProd) => {
  return fetch(`https://console.${isProd ? '' : 'stage.'}redhat.com/api/billing/v1/authorization/hcsEnrollment`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  })
    .then((response) => {
      if (response.status !== 200) {
        return { hcsDeal: false };
      }

      return response.json();
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      // eslint-disable-next-line no-console
      console.log('Failed to check HCS enrollment');
      return { hcsDeal: false };
    });
};
