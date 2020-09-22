const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { URL } = require('url');
const fetch = require('node-fetch');

const { timeout } = require('../utils/sleep');
const indent = require('../utils/indent');
const mergeCoverageMap = require('../utils/mergeCoverageMap');
const parseURLParams = require('../utils/parseURLParams');
const runPageProcessor = require('./runPageProcessor');

global.runHTMLTest = async (
  url,
  { height = 640, ignoreConsoleError = false, ignorePageError = false, width = 360, zoom = 1 } = {}
) => {
  const builder = new Builder();
  const chromeOptions = (builder.getChromeOptions() || new Options()).windowSize({
    height: height * zoom,
    width: width * zoom
  });

  const driver = global.docker
    ? builder
        .forBrowser('chrome')
        .usingServer('http://localhost:4444/wd/hub')
        .setChromeOptions(chromeOptions.headless())
        .build()
    : builder.forBrowser('chrome').usingServer('http://localhost:9515').setChromeOptions(chromeOptions).build();

  const session = await Promise.race([
    driver.getSession(),
    timeout(
      15000,
      'Timed out while waiting for a Web Driver session. Probably there are more test runners running simultaneously than Web Driver sessions. Or some Web Driver sessions are hung.'
    )
  ]);

  const sessionId = session.getId();

  const params = parseURLParams(new URL(url, 'http://webchat-html/').hash);

  try {
    // We are only parsing the "hash" from "url", the "http://localhost/" is actually ignored.
    let { hash } = new URL(url, 'http://localhost/');

    if (hash) {
      hash += '&wd=1';
    } else {
      hash = '#wd=1';
    }

    // For unknown reason, if we use ?wd=1, it will be removed.
    // But when we use #wd=1, it kept.
    await driver.get(
      global.docker
        ? new URL(hash, new URL(url, 'http://webchat-html/'))
        : new URL(url, `http://localhost:${global.webServerPort}/`)
    );

    await runPageProcessor(driver, { ignoreConsoleError, ignorePageError });

    const { consoleHistory, currentConditionMessage, localCoverage } = await driver.executeScript(() => ({
      consoleHistory: window.WebChatTest.getConsoleHistory(),
      currentConditionMessage: window.WebChatTest.currentCondition && window.WebChatTest.currentCondition.message,
      localCoverage: window.__coverage__
    }));

    const lines = [];

    global.__coverage__ = mergeCoverageMap(global.__coverage__, localCoverage);

    consoleHistory.forEach(({ args, level }) => {
      const message = args.join(' ');

      if (~message.indexOf('in-browser Babel transformer') || (ignoreConsoleError && level === 'error')) {
        return;
      }

      lines.push(`📃 [${level}] ${message}`);
    });

    if (currentConditionMessage) {
      lines.push(`\n❗ Jest timed out while test code is waiting for "${currentConditionMessage}".\n`);
    }

    lines.length && console.log(indent([`💬 Browser`, indent(lines.join('\n'), 2)].join('\n')));
  } finally {
    // Using JSON Wire Protocol to kill Web Driver.
    // This is more reliable because Selenium package queue commands.
    const res = await fetch(`${builder.getServerUrl()}/session/${sessionId}`, { method: 'DELETE' });

    if (!res.ok) {
      const json = await res.json();

      console.warn(`Failed to kill WebDriver session ${sessionId}.\n\n${json && json.value && json.value.message}`);
    }
  }
};