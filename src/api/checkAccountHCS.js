export const checkAccountHCS = async (jwtToken, isProd) => {
  return fetch(`https://billing.${isProd ? '' : 'stage.'}api.redhat.com/v1/authorization/hcsEnrollment`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  }).then((response) => {
    if (response.status !== 200) {
      return { hcsDeal: false };
    }

    return response.json();
  });
};
