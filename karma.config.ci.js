/*
 * Copyright (C) 2023 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const configCommon = require('./karma.config.common');

const configCi = (config) => {
  config.set({
    singleRun: true,
    browsers: ['ChromeHeadlessFixedSize'],
    customLaunchers: {
      ChromeHeadlessFixedSize: {
        base: 'ChromeHeadless',
        flags: [
          '--window-size=1280,1024',
          '--enable-unsafe-swiftshader',
          ...(process.env.AOSP_WINSCOPE_NETWORK_SANDBOX === '1'
            ? ['--no-sandbox']
            : []),
        ],
      },
    },
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-spec-reporter',
      'karma-coverage',
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    reporters: ['progress', 'spec', 'coverage'],
    // Hosted Linux runners can briefly starve Chrome's event loop while the
    // instrumented suite is running. Keep the run alive through those stalls,
    // but still fail a browser that remains silent for two minutes.
    pingTimeout: 60000,
    browserDisconnectTimeout: 30000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 120000,
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/winscope'),
      subdir: '.',
      reporters: [{type: 'html'}, {type: 'text-summary'}],
    },
    verbose: true, // output config used by istanbul for debugging
  });
};

module.exports = (config) => {
  configCommon(config);
  configCi(config);
};
