module.exports = (config) => {
  require('./karma.config.ci')(config);
  config.set({port: 9890, proxies: {'/trace-query-fixture/': 'http://127.0.0.1:19901/'}});
};
