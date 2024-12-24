const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './e2e/liking-restaurants.spec.js',
  output: 'e2e/output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:8080',
      show: true,
      waitForTimeout: 5000,
      waitForNavigation: 'networkidle',
    },
  },
  include: {
    I: './steps_file.js',
  },
  name: 'Proyek Expert Dicoding DBS 3 build',
};
