/**
 * @jest-environment ./__tests__/html/__jest__/perTest/WebChatEnvironment.js
 */

describe('useScrollTo.keepNewMessagesButton', () => {
  test('should scroll and keep "New Messages" button', () =>
    runHTMLTest('hooks.useScrollTo.keepNewMessagesButton.html'));
});
