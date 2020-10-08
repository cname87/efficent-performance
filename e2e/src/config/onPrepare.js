/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import { NGXLogger } from 'ngx-logger';
import { getDashboardPage } from '../pages/dashboard.page';

import { getRootElements } from '../pages/elements/root.elements';
import { getInformationElements } from '../pages/elements/information.elements';

const path = require('path');

const { browser, by, ExpectedConditions } = require('protractor');
const { SpecReporter } = require('jasmine-spec-reporter');
const request = require('request-promise-native');
const fs = require('fs');
const { promisify } = require('util');
const { NgxLoggerLevel } = require('ngx-logger');

/**
 * This module...
 * - sets up a jasmine reporter
 * - tests that the test database is being used (or throws an error if not)
 * - resets the database by clearing and loading mock members
 * - loads the root page
 * - checks that the app has been built with e2e environment so e2eTesting is true as required by the errors spec file
 * - logins the app vai OAuth0
 * - sets the jasmine default timeout
 * - exports various helper functions including an await element visible helper
 */

/* awaits for an element to be visible on the page */
const awaitElementVisible = async (element) =>
  browser.wait(ExpectedConditions.visibilityOf(element), 1200000);

/* awaits for an element to be invisible on the page */
const awaitElementInvisible = async (element) =>
  browser.wait(ExpectedConditions.invisibilityOf(element), 1200000);

/* sends a configured request to the server */
const askServer = async (
  uri,
  method,
  headers = {},
  body = '',
  resolveWithFullResponse = false, // true to get the full response, false to get the body
) => {
  const options = {
    uri,
    method,
    headers,
    resolveWithFullResponse,
    json: true, //  sets body to JSON representation of value and adds Content-type: application/json header. Additionally, parses the response body as JSON
    simple: false, // false => don't reject the promise on non 2xx status codes
  };
  if (body) {
    options.body = body;
  }
  return request(options);
};

/**
 * Loads the root page and awaits either the log in button or the message saying that members have been loaded from the server (or not).
 * @param isLoggedIn: Says whether we expect the log in page or the logged in dashboard page.
 */
const loadRootPage = async (isLoggedIn = true, numberExpected = 4) => {
  console.log('Loading root page');

  await browser.get('/');
  if (!isLoggedIn) {
    /* if not logged in or testing a staged version */
    /* just wait for the login button to show */
    await awaitElementVisible(getRootElements().loginBtn);
  } else {
    /* await the appearance of the progress bar as should be loading from the database server */
    await awaitElementVisible(getRootElements().progressBar);

    /* the dashboard page is now displayed */
    const dashboardPage = getDashboardPage();

    /* await the dashboard */
    await awaitElementVisible(dashboardPage.dashboardElements.tag);

    /* test resolver prevents the page loading until data is available by testing for the members presence without browser.wait */
    expect(await dashboardPage.dashboardElements.topMembers.count()).toEqual(
      numberExpected,
    );

    /* await the disappearance of the progress bar */
    await awaitElementInvisible(getRootElements().progressBar);

    /* await the message denoting the loading of members appears as this is slow to appear */
    await browser.wait(
      async () => (await getRootElements().messages.count()) === 1,
      10000,
    );
  }
  console.log('Root page loaded');
};

/* check that the e2e build environment is in use - this is needed for the error testing spec file */
const checkE2eEnvironment = async () => {
  console.log('Checking if e2e build is in use');

  /* root page loaded - the app-login element is configured with a custom attribute */
  const el = browser.findElement(by.css('app-login'));
  const isE2eTesting = await el.getAttribute('data-isE2eTesting');
  const production = await el.getAttribute('data-production');
  const logLevel = await el.getAttribute('data-logLevel');

  if (isE2eTesting === 'true') {
    console.log('NOTE: E2e build environment in use');
  } else {
    console.warn('*** WARNING: E2e build environment is not in use');
  }
  /* print out other environment properties if not as expected */
  if (production === 'true') {
    console.log('Production optimization is enabled');
  } else {
    console.warn('*** WARNING: Production optimization is not enabled');
  }
  if (+logLevel === NgxLoggerLevel.OFF) {
    console.log('LogLevel is NgxLoggerLevel.OFF');
  } else {
    console.warn('*** WARNING: LogLevel is not NgxLoggerLevel.OFF');
  }
};

/* set long timeout to allow for debug */
const setTimeout = (timeout = 1200000) => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
};

const run = async () => {
  /* set up a jasmine reporter */
  jasmine
    .getEnv()
    .addReporter(new SpecReporter({ spec: { displayStacktrace: 'pretty' } }));
  await loadRootPage(false);
  await checkE2eEnvironment();
  setTimeout(1200000);
};

// export { run as default };

/* export login */
module.exports.run = run;
module.exports.loadRootPage = loadRootPage;
module.exports.setTimeout = setTimeout;
module.exports.awaitElementVisible = awaitElementVisible;
module.exports.awaitElementInvisible = awaitElementInvisible;
