const useChrome = () => {
  return {
    getApp: () => 'sources',
    isBeta: () => true,
    auth: {
      getToken: () => 'token',
    },
    isProd: () => false,
  };
};

module.exports = useChrome;
