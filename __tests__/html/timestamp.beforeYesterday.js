/**
 * @jest-environment ./__tests__/html/__jest__/perTest/WebChatEnvironment.js
 */

describe('timestamp', () => {
  test('showing date before yesterday', () => runHTMLTest('timestamp.beforeYesterday.html'));
});
