/**
 * @jest-environment ./__tests__/html/__jest__/perTest/WebChatEnvironment.js
 */

describe('timestamp', () => {
  test('change send timeout on-the-fly', () => runHTMLTest('timestamp.changeSendTimeout.html'));
});
