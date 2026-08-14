const lib = jest.requireActual('@unleash/proxy-client-react');

const unleash = {
  ...lib,
  useFlag: jest.fn(() => false),
};

module.exports = unleash;
