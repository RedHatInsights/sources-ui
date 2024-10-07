const useChrome = () => {
  return {
    getApp: () => 'sources',
    isBeta: () => true,
    getUserPermissions: () => Promise.resolve([]),
    auth: {
      getToken: () => 'token',
    },
    isProd: () => false,
  };
};

module.exports = useChrome;
